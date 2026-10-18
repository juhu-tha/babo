import React, { useState } from 'react';
import { useTabContext } from '@/src/contexts/TabContext';
import { 
  Building2, 
  AlertTriangle, 
  ShieldAlert, 
  Layers, 
  Activity, 
  BookOpen, 
  Search, 
  Scale, 
  FileText, 
  Calendar, 
  MapPin, 
  Flame, 
  Droplets, 
  Info,
  Clock,
  HelpCircle,
  TrendingDown,
  Wrench,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

export interface DamageCaseStudy {
  id: string;
  name: string;
  subTitle: string;
  category: 'bruecken' | 'hallen' | 'infrastruktur' | 'hochbau';
  year: string;
  location: string;
  structureType: string;
  keyMaterialMechanism: string;
  summary: string;
  typischeBauschaedenLink?: {
    subTab: 'feuchtigkeit' | 'risse' | 'korrosion' | 'unvertraeglichkeiten' | 'tief_ingenieurbau' | 'analysator';
    label: string;
    description: string;
  };
  sources: {
    title: string;
    institutionOrAuthor: string;
    details: string;
    url?: string;
  }[];
  projectData: {
    baujahr: string;
    schadensdatum: string;
    ort: string;
    tragwerkstyp: string;
    beteiligteBaustoffe: string[];
    spannweiteAbmessungen: string;
    opferZahlen: string;
    gesamtschaden: string;
  };
  historie: {
    phase: string;
    zeitraum: string;
    details: string;
  }[];
  ursachen: {
    titel: string;
    kategorie: 'Material/Werkstoff' | 'Planung/Statik' | 'Ausführung' | 'Unterhalt/Monitoring' | 'Umwelteinfluss';
    beschreibung: string;
    formelOrMechanismus?: string;
  }[];
  folgen: {
    bereich: string;
    auswirkung: string;
    normativeKonsequenz: string;
  }[];
  lessonsLearned: string[];
}

export const DAMAGE_CASES: DamageCaseStudy[] = [
  {
    id: 'bad_reichenhall',
    name: 'Einsturz der Eishalle Bad Reichenhall',
    subTitle: 'Kollaps unter Schneelast infolge von Harnstoff-Leimversagen und Bauwerksfeuchte',
    category: 'hallen',
    year: '2006',
    location: 'Bad Reichenhall, Bayern, Deutschland',
    structureType: 'Dachtragwerk aus Brettschichtholz-Kastenträgern (Kerven/Kehlbalken)',
    keyMaterialMechanism: 'Urea-Formaldehyd-Leimversagen (UF-Leim Typ Kaurit) unter dauerhaft hoher relativer Luftfeuchte (hydrolytischer Bindungsabbau) + Tauwasserausfall',
    summary: 'Am 2. Januar 2006 stürzte das hölzerne Dachtragwerk der 1971 bis 1973 errichteten Eislaufhalle während des Publikumsbetriebs plötzlich ein. 15 Menschen starben, darunter 12 Kinder, und 34 Personen wurden schwer verletzt. Trotz einer Schneelast, die rechnerisch noch unter der damaligen Bemessungslast lag, versagten die verleimten Hohlkastenträger spröde durch vollständige Delaminierung.',
    projectData: {
      baujahr: '1971–1973',
      schadensdatum: '02. Januar 2006 (ca. 15:54 Uhr)',
      ort: 'Bad Reichenhall (Berchtesgadener Land)',
      tragwerkstyp: 'Dachkonstruktion aus Brettschichtholz-Hauptträgern und Kastenträgern, Spannweite ca. 48 m',
      beteiligteBaustoffe: ['Brettschichtholz (BSH, Fichte)', 'Urea-Formaldehyd-Harzleim (nicht wasserbeständig)', 'Mineralwolle-Dämmung (durchnässt)'],
      spannweiteAbmessungen: 'Hallengröße ca. 75 m × 48 m, Hauptträgerstützweite 48,0 m',
      opferZahlen: '15 Todesopfer, 34 Verletzte',
      gesamtschaden: 'Vollständiger Totalschaden, strafrechtliche und zivilrechtliche Prozesse, Neubauverzicht'
    },
    historie: [
      {
        phase: '1. Planung & Errichtung (1971–1973)',
        zeitraum: '1971–1973',
        details: 'Errichtung der Eishalle. Für die Verleimung der Hohlkasten-Dachträger wurde ein säurehärtender Harnstoff-Formaldehyd-Harzleim (UF-Harz, Kaurit) eingesetzt. Dieser Leim war nach damaliger Normung (DIN 1052 alt) für geschlossene Bauten zwar zugelassen, jedoch absolut ungeeignet für dauerfeuchte Klimaten und Eishallenatmosphäre (ständige Eisbereitung, hohe Luftfeuchte).'
      },
      {
        phase: '2. Betriebsphase & Kondensatakkumulation (1974–2005)',
        zeitraum: '1974–2005',
        details: 'Über Jahrzehnte drang feuchtwarme Innenluft ohne funktionsfähige Dampfbremse in die isolierten Hohlkästen der Dachträger ein. Bei niedrigen Außentemperaturen kondensierte massiv Tauwasser an den kalten Bauteilschichten. Das Holz erreichte kontinuierlich Feuchtegehalte von über 20–25 M-%, wodurch der UF-Leim durch Säurehydrolyse irreversibel zersetzt wurde.'
      },
      {
        phase: '3. Ignorierte Warnsignale & Mängelberichte (2000–2005)',
        zeitraum: '2000–2005',
        details: 'Wiederholt tropfte Kondenswasser von der Decke. Bei Dachöffnungen wurden vermoderte Holzpartien und lose Leimfugen festgestellt. Ein fundiertes Monitoring oder eine Überprüfung durch baustatische Sachverständige (z.B. nach der späteren VDI 6200) unterblieb oder wurde aus Kostengründen vertagt.'
      },
      {
        phase: '4. Katastrophaler Einsturz (02.01.2006)',
        zeitraum: '02.01.2006',
        details: 'Nach starkem Schneefall lag eine Schneelast von ca. 0,7–0,8 kN/m² auf dem Dach (zulässig waren 0,98 kN/m² plus Sicherheitsreserve). Um 15:54 Uhr rissen die versprödeten Leimfugen schlagartig auf. Das Tragsystem verlor seine Biegesteifigkeit und stürzte innerhalb von Sekunden vollständig in sich zusammen.'
      }
    ],
    ursachen: [
      {
        titel: 'Hydrolytischer Zerfall des Harnstoff-Leims (UF-Leim)',
        kategorie: 'Material/Werkstoff',
        beschreibung: 'Harnstoff-Formaldehyd-Polymere (Urea-Formaldehyd) besitzen keine hydrolytische Langzeitstabilität. Unter Anwesenheit von flüssigem Wasser und Luftsäure zerfallen die Methylenether-Brücken. Die Leimfugen verloren bis zu 95 % ihrer Scher- und Zugfestigkeit.',
        formelOrMechanismus: '-\\text{NH}-\\text{CH}_2-\\text{NH}- + \\text{H}_2\\text{O} \\xrightarrow{\\text{pH} < 5, \\, \\text{Feuchte}} -\\text{NH}_2 + \\text{HCHO} + \\text{H}_2\\text{N}-'
      },
      {
        titel: 'Bauphysikalische Fehldimensionierung (Dampfdiffusion)',
        kategorie: 'Planung/Statik',
        beschreibung: 'Fehlende oder durch Perforationen unwirksame Dampfsperre an der Trägerunterseite. Das Mikroklima über der offenen Eisfläche erzeugte einen dauerhaft hohen Wasserdampfteildruck, der direkt in die Hohlträger diffundierte.',
        formelOrMechanismus: 'p_i > p_e \\implies g = -\\delta_0 \\cdot \\frac{\\Delta p}{s_d} \\quad \\text{(permanenter Feuchtestrom in Hohlträger)}'
      },
      {
        titel: 'Querschnitts- und Kervenversagen am Auflager',
        kategorie: 'Ausführung',
        beschreibung: 'Ausführungsmängel bei der Kervenausbildung an den Trägerenden. Durch Schubspannungsspitzen im Zusammenwirken mit delaminierten Gurten trat ein spröder Querkraft- und Längsschubbruch auf.',
        formelOrMechanismus: '\\tau = \\frac{1{,}5 \\cdot V}{b \\cdot h} > f_{v,d} \\quad \\text{bei geschwächtem Verbund}'
      },
      {
        titel: 'Fehlende regelmäßige Bauwerksprüfung (Prüfdefizit)',
        kategorie: 'Unterhalt/Monitoring',
        beschreibung: 'Zum Unglückszeitpunkt gab es keine bundesweit verbindliche Pflicht zur periodischen statischen Überprüfung weitgespannter Dächer kommunaler Sonderbauten.'
      }
    ],
    folgen: [
      {
        bereich: 'Regelwerke & Normung',
        auswirkung: 'Klebstoffe für tragende Holzbauteile müssen nach Nutzungsklasse gewählt werden: UF (Typ II) nur NKL 1; für NKL 2/3 und feuchte Hallenklimate Typ-I-Klebstoffe (MUF, PRF, 1K-PUR).; Novellierung der DIN 1052 und Eurocode 5 (DIN EN 1995-1-1). Nutzungsklassen (NKL 1, 2, 3) definieren heute zwingend wetter- und feuchtebeständige Leime (z.B. Resorcinharz PRF oder Polyurethan 1K-PUR).',
        normativeKonsequenz: 'DIN EN 1995-1-1 & DIN EN 301 / DIN EN 15425 (Klebstoffe für tragende Holzbauteile)'
      },
      {
        bereich: 'Bauwerksinspektion & Standsicherheit',
        auswirkung: 'Einführung der VDI-Richtlinie 6200 ("Standsicherheit von Bauwerken - Regelmäßige Überprüfung"). Kommunen wurden verpflichtet, weitgespannte Tragwerke in Prüfgruppen einzustufen und durch Fachingenieure regelmäßig zu prüfen.',
        normativeKonsequenz: 'VDI 6200 (Einführung von Prüfstufen 1-3 und Prüfbüchern)'
      },
      {
        bereich: 'Rechtsprechung & Justiz',
        auswirkung: 'Strafprozess wegen fahrlässiger Tötung. Verurteilung des planenden Architekten und Statikers wegen grober Unterlassung bzw. Planungs- und Bauüberwachungsfehlern.',
        normativeKonsequenz: 'BGH-Urteile zur Sorgfaltspflicht bei weitgespannten Hallentragwerken'
      }
    ],
    lessonsLearned: [
      'In Dauernassbereichen oder Eishallen dürfen niemals feuchteempfindliche Leime eingesetzt werden (Klebstoffe für tragende Holzbauteile müssen nach Nutzungsklasse gewählt werden: UF (Typ II) nur NKL 1; für NKL 2/3 und feuchte Hallenklimate Typ-I-Klebstoffe (MUF, PRF, 1K-PUR).).',
      'Versteckte Hohlkastenträger ohne Inspektionsöffnungen verhindern die visuelle Kontrolle von Traggliedern und müssen mit Revisionsöffnungen versehen werden.',
      'Sonderbauten mit großen Spannweiten erfordern ein lückenloses Bauwerksbuch und zyklische Bauwerksprüfungen nach VDI 6200.'
    ],
    typischeBauschaedenLink: {
      subTab: 'feuchtigkeit',
      label: 'Feuchtigkeit, Tauwasserausfall & Schimmel',
      description: 'Bauphysikalische Feuchteakkumulation, Taupunktunterschreitung und Zersetzung von Baustoffen unter Dauerfeuchte.'
    },
    sources: [
      {
        title: 'Untersuchungsbericht zum Einsturz der Eissporthalle Bad Reichenhall',
        institutionOrAuthor: 'Prof. Dr.-Ing. Stefan Winter (TU München / Lehrstuhl für Holzbau und Baukonstruktion)',
        details: 'Umfassendes Gutachten zur Ursachenermittlung im Auftrag der Staatsanwaltschaft Traunstein, 2006.',
        url: 'https://de.wikipedia.org/wiki/Eishalle_Bad_Reichenhall'
      },
      {
        title: 'Standsicherheit von Bauwerken – Regelmäßige Überprüfung (VDI-Richtlinie 6200)',
        institutionOrAuthor: 'Verein Deutscher Ingenieure (VDI)',
        details: 'Direkte normative Konsequenz des Unglücks zur periodischen Überprüfung weitgespannter Dachtragwerke.',
        url: 'https://www.vdi.de/richtlinien/details/vdi-6200-standsicherheit-von-bauwerken-regelmaessige-ueberpruefung'
      },
      {
        title: 'Schadensanalyse an weitgespannten Hallendachtragwerken aus Holz',
        institutionOrAuthor: 'Deutsche Gesellschaft für Holzforschung (DGfH) / Fraunhofer IRB',
        details: 'Fachveröffentlichung zu Feuchte- und Klebstoffversagen bei Urea-Formaldehyd-Harzen im Hallenbau.'
      }
    ]
  },
  {
    id: 'polcevera_genua',
    name: 'Einsturz des Polcevera-Viadukts (Ponte Morandi)',
    subTitle: 'Katastrophales Versagen korrodierter Spannstahllitzen in schräg abgespannten Zugbändern',
    category: 'bruecken',
    year: '2018',
    location: 'Genua, Ligurien, Italien',
    structureType: 'Schrägkabelbrücke / Spannbetonbrücke nach dem System Riccardo Morandi',
    keyMaterialMechanism: 'Spannungsrisskorrosion (SpRK) und Chlorid-Lochfraß der Spannstahllitzen in mangelhaft verpressten Hüllrohren der Beton-Zugbänder (Struts)',
    summary: 'Am 14. August 2018 stürzte Pfeiler 9 (Polcevera-Pfeiler 9) des 1967 eröffneten Ponte Morandi während eines schweren Unwetters ein. Ein ca. 200 m langer Überbauabschnitt fiel über 45 Meter in die Tiefe. 43 Menschen starben. Das Bauwerk wies eine weltweit einzigartige Konstruktion mit betonummantelten Spannbeton-Schrägabspannungen auf, in denen der Spannstahl über Jahrzehnte unbemerkt korrodierte.',
    projectData: {
      baujahr: '1963–1967',
      schadensdatum: '14. August 2018 (ca. 11:36 Uhr)',
      ort: 'Genua (Autostrada A10)',
      tragwerkstyp: 'Spannbeton-Schrägseilbrücke mit Dreibein-Pylonen und externen, betonummantelten Zugbändern',
      beteiligteBaustoffe: ['Hochfester Spannstahl (Patentstahldraht)', 'Portlandzementbeton', 'Injektionsmörtel (Zementleim mit Hohlräumen)'],
      spannweiteAbmessungen: 'Gesamtlänge 1.182 m, Pylonhöhe 90 m, Hauptspannweiten bis zu 210 m',
      opferZahlen: '43 Todesopfer, 16 Verletzte',
      gesamtschaden: 'Mehrere hundert Millionen Euro direkter Bauschaden, Verkehrschaos in Norditalien, Abriss der Restpfeiler'
    },
    historie: [
      {
        phase: '1. Innovation & Entwurf Morandi (1963–1967)',
        zeitraum: '1963–1967',
        details: 'Riccardo Morandi entwarf eine kühne Brücke mit sehr wenigen Schrägabspannungen. Besonderheit: Die Zugseile (Spannstahlbündel) wurden mit Beton ummantelt und nachträglich vorgespannt, um Schwingungen zu dämpfen und den Stahl vor Korrosion zu schützen. Allerdings führte dies zu einer extremen Inspektionsunfreundlichkeit.'
      },
      {
        phase: '2. Aggressives Meeres- und Industrie-Klima (1970–1993)',
        zeitraum: '1970–1993',
        details: 'Die Brücke lag direkt im Einflussbereich der marinen Salzgischt des Mittelmeers sowie der Schwefel- und Industrieabgase benachbarter Stahlwerke. Bereits in den 1970er Jahren zeigten sich Risse im Betonmantel. 1993 musste Pfeiler 11 wegen massiver Korrosion aufwändig mit externen Stahlseilen nachgespannt werden; Pfeiler 9 wurde jedoch nicht ertüchtigt.'
      },
      {
        phase: '3. Injektionsdefizite & unvollständiger Verpressmörtel (1995–2018)',
        zeitraum: '1995–2018',
        details: 'Die Hüllrohre der Spannglieder waren werksseitig an den oberen Umlenkpunkten unvollständig mit Zementleim verfüllt (Blutwasserbildung, Hohlraumbildung). Feuchtigkeit und Chloride sammelten sich in den Taschen, wodurch der Spannstahl lokal bis zu 70 % seines Querschnitts durch Lochfraß und Spannungsrisskorrosion einbüßte.'
      },
      {
        phase: '4. Reißender Bruch & Pylonkollaps (14.08.2018)',
        zeitraum: '14.08.2018',
        details: 'Bei Starkregen und Sturmböen riss das südliche Zugband von Pylon 9 schlagartig ab. Durch die asymmetrische Lastumlagerung knickte der Pylon seitlich weg, wodurch die gesamte Brückentafel auf Autobahntrasse, Bahngleise und Industrieanlagen herabstürzte.'
      }
    ],
    ursachen: [
      {
        titel: 'Spannungsrisskorrosion & Chloridfraß der Spannstähle',
        kategorie: 'Material/Werkstoff',
        beschreibung: 'Kombination aus hochfestem, spannungsbelastetem Spannstahl und Chloriden aus Seeluft. Spannungsrisskorrosion führt ohne nennenswerte plastische Dehnung zum schlagartigen Sprödbruch einzelner Drähte (Drahtbruchkette).',
        formelOrMechanismus: '\\text{Fe} \\rightarrow \\text{Fe}^{2+} + 2e^- \\quad \\text{an Rissspitze unter } \\sigma > 0{,}7 \\cdot f_{pk}'
      },
      {
        titel: 'Injektionsfehler & Hohlräume in den Spanngliedern',
        kategorie: 'Ausführung',
        beschreibung: 'Unvollständiges Verpressen der vertikalen und geneigten Spannglieder. Durch Ausbluten des Einpressmörtels entstanden Luft- und Wassertaschen, die den kathodischen Korrosionsschutz des Zementsteins aufhoben.',
        formelOrMechanismus: '\\text{pH-Wert sinkt von } > 12{,}5 \\text{ auf } < 9 \\implies \\text{Depassivierung des Stahls}'
      },
      {
        titel: 'Mangelnde Redundanz des Tragsystems',
        kategorie: 'Planung/Statik',
        beschreibung: 'Die Konstruktion besaß nur ein einziges Zugbandpaar pro Pylonseite. Der Bruch eines einzigen Bauteils führte unweigerlich zum progressiven Einsturz des Gesamtsystems (Single-Point-of-Failure).',
        formelOrMechanismus: '\\text{Redundanzgrad } R = 0 \\implies \\text{Kein alternativer Lastabtragungspfad}'
      },
      {
        titel: 'Verdeckte Spannglieder ohne ZfP-Überwachung',
        kategorie: 'Unterhalt/Monitoring',
        beschreibung: 'Die dicke Betonummantelung verhinderte eine visuelle Inspektion der Spanndrähte. Zerstörungsfreie Prüfmethoden (z.B. Radiographie, Ultraschall-Echo, Remanenzmagnetismus) wurden nicht rechtzeitig oder unzureichend ausgewertet.'
      }
    ],
    folgen: [
      {
        bereich: 'Brückenbau & Konstruktionsprinzipien',
        auswirkung: 'Vollständige Ächtung monolithisch betonummantelter Spannglieder ohne Zugänglichkeit. Moderne Schrägkabelbrücken nutzen heute ausschließlich einzeln austauschbare Litzenbündel in PE-Hüllrohren mit mehrfachem Korrosionsschutz (Galvanisierung, Wachs, PE-Mantel).',
        normativeKonsequenz: 'fib Model Code & DIN EN 1992-2 (Brückenbau)'
      },
      {
        bereich: 'Brückeninspektion & Monitoring',
        auswirkung: 'Verschärfung der Brückenprüfungen in ganz Europa (in Deutschland DIN 1076). Verpflichtendes Structural Health Monitoring (SHM) für kritische Altbrücken mit akustischer Rissdetektion und Dehnungsmessstreifen.',
        normativeKonsequenz: 'DIN 1076 (Ingenieurbauwerke im Zuge von Straßen und Wegen - Überwachung und Prüfung)'
      },
      {
        bereich: 'Infrastrukturpolitik',
        auswirkung: 'Rücknahme von Autobahnkonzessionen, massive Investitionsprogramme zur Ertüchtigung von Spannbetonbrücken der Nachkriegsjahrzehnte.',
        normativeKonsequenz: 'Neubau des Viadotto Genova-San Giorgio (Entwurf Renzo Piano) in Rekordzeit (2020)'
      }
    ],
    lessonsLearned: [
      'Tragwerke müssen redundant ausgelegt sein; der Ausfall eines Einzelelements darf keinen Domino-Einsturz auslösen.',
      'Spannbetonbauteile müssen für zerstörungsfreie Prüfungen (ZfP) zugänglich und inspizierbar sein.',
      'Schrägseile und Spannglieder müssen austauschbar konzipiert werden.'
    ],
    typischeBauschaedenLink: {
      subTab: 'tief_ingenieurbau',
      label: 'Tief- & Ingenieurbau / Brückenschäden',
      description: 'Zerstörungsfreie Prüfverfahren (ZfP), Injektionsdefizite in Hüllrohren und Brückenmonitoring nach DIN 1076.'
    },
    sources: [
      {
        title: 'Relazione Tecnica della Commissione Ispettiva sul Crollo del Viadotto Polcevera',
        institutionOrAuthor: 'Ministero delle Infrastrutture e dei Trasporti (MIT Italia)',
        details: 'Offizieller Untersuchungsbericht der staatlichen Untersuchungskommission zum Einsturz des Ponte Morandi, Rom 2018.',
        url: 'https://de.wikipedia.org/wiki/Polcevera-Viadukt'
      },
      {
        title: 'Forensic Investigation of the Collapse of the Morandi Bridge in Genoa',
        institutionOrAuthor: 'Prof. Gian Michele Calvi et al. (Structural Engineering International, IABSE)',
        details: 'Wissenschaftliche Rekonstruktion des Versagensmechanismus der Schrägabspannungen.',
        url: 'https://www.tandfonline.com/doi/abs/10.1080/10168664.2018.1558033'
      },
      {
        title: 'fib Bulletin 89: Acceptance of stay cable systems using prestressing steels',
        institutionOrAuthor: 'International Federation for Structural Concrete (fib)',
        details: 'Internationale Richtlinie für Schrägkabel und Korrosionsschutzsysteme.'
      }
    ]
  },
  {
    id: 'carolabrücke_dresden',
    name: 'Teileinsturz der Carolabrücke Dresden',
    subTitle: 'Nachträglicher Ermüdungs- und Korrosionsbruch des Spannbetonzugbands C',
    category: 'bruecken',
    year: '2024',
    location: 'Dresden, Sachsen, Deutschland',
    structureType: 'Spannbeton-Hohlkastenbrücke mit Vouten (3 Brückenzüge A, B, C)',
    keyMaterialMechanism: 'Spannungsrisskorrosion an Hennigsdorfer Spannstahl (Stahl 140/160, vergütet) + Chlorideintrag durch undichte Straßenbahn-Fahrbahntrog-Abdichtung',
    summary: 'In der Nacht zum 11. September 2024 stürzte der rund 100 m lange Brückenzug C der Dresdner Carolabrücke (auf dem Straßenbahngleise und ein Fußweg verliefen) plötzlich und ohne Vorankündigung in die Elbe. Wie durch ein Wunder gab es keine Todesopfer. Die Ursachenanalyse belegte ein verhängnisvolles Zusammenwirken aus wasserstoffinduzierter Spannungsrisskorrosion des in der DDR hergestellten Spannstahls und jahrzehntelanger Chloreinwirkung durch Streusalz.',
    projectData: {
      baujahr: '1967–1971',
      schadensdatum: '11. September 2024 (ca. 02:58 Uhr)',
      ort: 'Dresden (Elbeüberquerung B 170)',
      tragwerkstyp: 'Spannbeton-Durchlaufträger mit veränderlicher Bauhöhe (Gerberträger / Hohlkasten)',
      beteiligteBaustoffe: ['DDR-Spannstahl St 140/160 (vergütet in Hennigsdorf)', 'B 450 (Portlandzementbeton)', 'Bitumenabdichtung mit Chloriddurchtritt'],
      spannweiteAbmessungen: 'Hauptöffnung über der Elbe ca. 120 m, Gesamtbrückenlänge ca. 375 m',
      opferZahlen: 'Keine Personenschäden (Einsturz erfolgte nachts kurz nach der letzten Straßenbahn)',
      gesamtschaden: 'Verlust der Brückenhälfte, Schifffahrtssperre der Elbe, Abriss des Einsturzzuges und akute Sanierungspflicht'
    },
    historie: [
      {
        phase: '1. Bauwerkserrichtung mit Hennigsdorfer Spannstahl (1967–1971)',
        zeitraum: '1967–1971',
        details: 'Die Carolabrücke galt als ingenieurtechnische Spitzenleistung der DDR. Als Spannstahl kam der thermisch vergütete Kohlenstoffstahl "St 140/160" aus dem Stahl- und Walzwerk Hennigsdorf zum Einsatz. Dieser Stahl ist heute dafür berüchtigt, unter Feuchte und Zugspannung zu wasserstoffinduzierter Spannungsrisskorrosion ohne Vorankündigung zu neigen.'
      },
      {
        phase: '2. Sanierungsmaßnahmen der Züge A & B (2019–2023)',
        zeitraum: '2019–2023',
        details: 'Die Züge A und B (Straßenverkehr) wurden für Millionenbeträge generalsaniert (inkl. Carbonbeton-Verstärkung an den Gehwegen). Zug C (Straßenbahn) war für die Folgejahre vorgesehen. Bei den Routineprüfungen nach DIN 1076 erhielt Zug C im Jahr 2021 die Zustandsnote 3,0 ("nicht ausreichender Zustand"), eine akute Einsturzgefahr wurde jedoch nicht diagnostiziert.'
      },
      {
        phase: '3. Undichtigkeiten im Gleisbett & Chloridangriff (1980–2024)',
        zeitraum: '1980–2024',
        details: 'Streusalz und Regenwasser drangen über Jahrzehnte durch schadhafte Fugen und Risse in den Hohlkasten ein. Die Feuchtigkeit gelangte direkt an die Spannkanal-Hüllrohre. In den Hüllrohren war der Mörtel teilweise hohlraumbehaftet.'
      },
      {
        phase: '4. Spontanes Scherbruchversagen (11.09.2024)',
        zeitraum: '11.09.2024',
        details: 'Um 02:58 Uhr rissen die letzten tragenden Spanndrähte im Brückenscheitel. Der Spannbetonüberbau knickte mittig durch und stürzte in voller Breite auf die Elbwiesen und in den Fluss.'
      }
    ],
    ursachen: [
      {
        titel: 'Wasserstoffinduzierte Spannungsrisskorrosion (H-SpRK)',
        kategorie: 'Material/Werkstoff',
        beschreibung: 'Der verwendete vergütete Hennigsdorfer Spannstahl St 140/160 besitzt ein martensitisches/bainitisches Gefüge, das extrem empfindlich auf atomaren Wasserstoff reagiert. Korrosionsreaktionen setzen Wasserstoff frei, der in das Kristallgitter diffundiert und Versetzungen blockiert, was zum schlagartigen Sprödbruch führt.',
        formelOrMechanismus: '\\text{H}^+ + e^- \\rightarrow \\text{H}_{\\text{ad}} \\xrightarrow{\\text{Diffusion}} \\text{Gitterversprödung an Korngrenzen}'
      },
      {
        titel: 'Chloridinduzierte Lochfraßkorrosion am Koppelanker',
        kategorie: 'Umwelteinfluss',
        beschreibung: 'Hohe Streusalzkonzentrationen im durchfeuchteten Brückeninneren führten zur Zerstörung der Passivschicht des Stahls.',
        formelOrMechanismus: '\\text{Fe} + 2\\text{Cl}^- \\rightarrow \\text{FeCl}_2 + 2e^-'
      },
      {
        titel: 'Tragwerksgrenzen & Temperaturgradienten',
        kategorie: 'Planung/Statik',
        beschreibung: 'Kombination aus verringerter Restspannkraft und abkühlungsbedingten Zwangspannungen in den Abendstunden beschleunigte das Überschreiten der Bruchzähigkeit KIc.'
      },
      {
        titel: 'Grenzen der visuellen Brückenprüfung (DIN 1076)',
        kategorie: 'Unterhalt/Monitoring',
        beschreibung: 'Die Spannungsrisskorrosion lief unsichtbar im Inneren der Hüllrohre ab. An der Betonoberfläche traten vor dem Kollaps kaum Warnrisse oder Abplatzungen auf (Versagen ohne Ankündigung).'
      }
    ],
    folgen: [
      {
        bereich: 'Bundesweite Brückenüberprüfung',
        auswirkung: 'Sofortige Überprüfung aller Spannbetonbrücken in Deutschland, die mit vergütetem Spannstahl (z.B. Hennigsdorfer Stahl oder westdeutschem Sigma-Stahl der Baujahre vor 1978) errichtet wurden.',
        normativeKonsequenz: 'Handlungsanweisung zur Überprüfung spannungsrisskorrosionsgefährdeter Spannbetonbrücken (BMV)'
      },
      {
        bereich: 'ZfP & Dauermonitoring',
        auswirkung: 'Forderung nach verpflichtendem akustischen Schallemissionsmonitoring (Acoustic Emission Testing) für gefährdete Spannbetonbauwerke zur Registrierung von Drahtbrüchen in Echtzeit.',
        normativeKonsequenz: 'Einsatz von Schallemissionsanalyse (SEA) und magnetischen Streuflussverfahren'
      },
      {
        bereich: 'Verkehrs- & Städtebau',
        auswirkung: 'Vollständiger Abriss von Brückenzug C, Neubauplanung und gravierende Verkehrsbehinderungen im Straßenbahn- und Fernverkehr Dresdens.',
        normativeKonsequenz: 'Neukonzeption der Elbequerung als modernes Verbund- oder Stahltragwerk'
      }
    ],
    lessonsLearned: [
      'Vergütete Spannstähle der Baujahre vor 1980 stellen ein permanentes Risiko dar und müssen engmaschig sensorisch überwacht werden.',
      'Visuelle Brückenprüfungen stoßen bei verdeckten Spannstahlbrüchen an fundamentale physikalische Grenzen; Sensorik ist unverzichtbar.',
      'Entwässerungssysteme und Fahrbahnübergänge sind hochsensible Bauteile: Undichtigkeiten führen zwingend zu statischen Katastrophen.'
    ],
    typischeBauschaedenLink: {
      subTab: 'korrosion',
      label: 'Korrosion & Betonschäden',
      description: 'Spannungsrisskorrosion, Depassivierung des Bewehrungsstahls durch Chlorideintrag und Rissbildung.'
    },
    sources: [
      {
        title: 'Erster Zwischenbericht zum Einsturz des Brückenzugs C der Carolabrücke',
        institutionOrAuthor: 'Landeshauptstadt Dresden / Prof. Dr.-Ing. Steffen Marx (TU Dresden)',
        details: 'Offizieller ingenieurforensischer Zwischenbericht zur Schadensursachenermittlung, Dresden 2024.',
        url: 'https://de.wikipedia.org/wiki/Carolabr%C3%BCcke_(Dresden)'
      },
      {
        title: 'Handlungsanweisung zur Überprüfung spannungsrisskorrosionsgefährdeter Spannbetonbrücken',
        institutionOrAuthor: 'Bundesministerium für Digitales und Verkehr (BMV)',
        details: 'Verbindliche Richtlinie zur Nachrechnung und ZfP-Sonderprüfung von Bauwerken mit Hennigsdorfer und Sigma-Spannstählen.',
        url: 'https://bmdv.bund.de/'
      },
      {
        title: 'Spannbetonbauwerke der DDR: Werkstoffeigenschaften und Schadensmechanismen',
        institutionOrAuthor: 'Bundesanstalt für Materialforschung und -prüfung (BAM)',
        details: 'Werkstofftechnische Expertise zu St 140/160 Vergütungsstählen und Wasserstoffaufnahme.'
      }
    ]
  },
  {
    id: 'silver_bridge',
    name: 'Einsturz der Silver Bridge (Point Pleasant)',
    subTitle: 'Sprödbruch einer einzigen Augenstab-Lasche infolge von Spannungsrisskorrosion',
    category: 'bruecken',
    year: '1967',
    location: 'Point Pleasant (West Virginia) / Gallipolis (Ohio), USA',
    structureType: 'Kettenhängebrücke mit Augenstäben (Eyebar-Chain Suspension Bridge)',
    keyMaterialMechanism: 'Spannungskorrosion und Schwingungsrisskorrosion (Korrosionsermüdung) in hochfestem Mangan-Kohlenstoffstahl',
    summary: 'Am 15. Dezember 1967 stürzte die 1928 erbaute Silver Bridge über den Ohio River während des abendlichen Berufsverkehrs ein. 46 Menschen kamen ums Leben. Der Einsturz gilt als die Geburtsstunde der modernen Bruchmechanik und des systematischen Brückenprüfwesens (National Bridge Inspection Standards). Ursache war ein mikroskopisch kleiner Riss in einer einzigen Augenstablasche, der zum spröden Gewaltbruch der gesamten Tragekette führte.',
    projectData: {
      baujahr: '1928',
      schadensdatum: '15. Dezember 1967 (ca. 17:00 Uhr)',
      ort: 'Point Pleasant, West Virginia, USA',
      tragwerkstyp: 'Augenstab-Kettenhängebrücke mit Versteifungsfachwerk, Spannweite 213 m',
      beteiligteBaustoffe: ['Hochfester wärmebehandelter Stahl (AISI 1060 mit Mangan)', 'Kettenbolzen'],
      spannweiteAbmessungen: 'Hauptstützweite 213 m, Gesamtlänge 680 m',
      opferZahlen: '46 Todesopfer, 9 Schwerverletzte',
      gesamtschaden: 'Vollständiger Brückenverlust, Neuordnung der US-Brückeninfrastruktur'
    },
    historie: [
      {
        phase: '1. Pionierbauwerk mit neuartigem Augenstabstahl (1928)',
        zeitraum: '1928',
        details: 'Die Brücke wurde statt mit gewickelten Drahtseilen mit Ketten aus hochfesten, wärmebehandelten Augenstäben gebaut. Durch die hohe Festigkeit des Stahls konnte Material gespart werden. Die Kette bestand aus jeweils nur zwei parallelen Augenstäben pro Glied.'
      },
      {
        phase: '2. Verkehrszunahme & Lkw-Gewichte (1930–1967)',
        zeitraum: '1930–1967',
        details: 'Das Verkehrsaufkommen und die Einzellasten von Lastkraftwagen stiegen im Laufe der Jahrzehnte um ein Vielfaches über die ursprünglichen Lastannahmen von 1928 an. Es traten kontinuierliche dynamische Wechselbeanspruchungen auf.'
      },
      {
        phase: '3. Mikrorissbildung im Bolzenloch (unbemerkt)',
        zeitraum: 'ca. 1950–1967',
        details: 'Im Inneren des Auges von Stab 330 bildete sich durch Reibkorrosion (Freiting) und Schwefeldioxid-Luftverschmutzung ein kleiner Korrosionsriss von ca. 2,5 mm Tiefe. Da der Bolzen das Loch verdeckte, war der Riss mit bloßem Auge unmöglich zu erkennen.'
      },
      {
        phase: '4. Schlagartiger Sprödbruch (15.12.1967)',
        zeitraum: '15.12.1967',
        details: 'Bei niedrigen Außentemperaturen (-1 °C) erreichte der Werkstoff seine Übergangstemperatur zur Kaltversprödung. Unter Spitzenverkehrslast überschritt der Riss die kritische Risslänge. Die Lasche brach blitzartig, die verbliebene Nachbarlasche wurde überlastet, und die gesamte Brücke stürzte binnen 60 Sekunden in den Ohio River.'
      }
    ],
    ursachen: [
      {
        titel: 'Bruchmechanischer Sprödbruch ($K_I \\ge K_{Ic}$)',
        kategorie: 'Material/Werkstoff',
        beschreibung: 'Der verwendete Stahl besaß eine sehr geringe Bruchzähigkeit KIc bei tiefen Temperaturen. Bereits ein Riss von nur 2,5 mm reichte aus, um die kritische Spannungsintensität zu erreichen.',
        formelOrMechanismus: 'K_I = Y \\cdot \\sigma \\cdot \\sqrt{\\pi a} \\ge K_{Ic} \\implies \\text{katastrophales instabiles Risswachstum}'
      },
      {
        titel: 'Fehlende Redundanz (Bruchkritischer Bauteil / Fracture Critical Member)',
        kategorie: 'Planung/Statik',
        beschreibung: 'Ein Tragsystem aus nur zwei parallelen Augenstäben ist nicht fehlertolerant. Bricht eine Lasche, verdreht sich der Bolzen, wodurch auch die zweite Lasche schlagartig versagt.',
        formelOrMechanismus: '\\text{FCM-Klassifizierung: Kein Sekundärtragpfad vorhanden}'
      },
      {
        titel: 'Unzugängliche Bolzenverbindung',
        kategorie: 'Unterhalt/Monitoring',
        beschreibung: 'Der Riss befand sich auf der Innenseite des Bolzenlochs, vollständig verdeckt durch Laschen und Bolzenköpfe.'
      }
    ],
    folgen: [
      {
        bereich: 'US-Bundesgesetze & Prüfvorschriften',
        auswirkung: 'Verabschiedung des Federal-Aid Highway Act of 1968 und Schaffung der National Bridge Inspection Standards (NBIS). Erstmalige gesetzliche Pflicht zur Brückenprüfung alle 2 Jahre.',
        normativeKonsequenz: 'NBIS (National Bridge Inspection Standards) & FHWA Richtlinien'
      },
      {
        bereich: 'Werkstoffkunde & Bruchmechanik',
        auswirkung: 'Rasanter Aufstieg der linearen elastischen Bruchmechanik (LEBM) nach Griffith und Irwin als verbindliches Ingenieurfach. Einführung von Kerbschlagbiegeversuchen bei tiefen Temperaturen für Brückenstähle (Charpy-V-Notch).',
        normativeKonsequenz: 'ASTM-Normen zur Bruchzähigkeit KIc und Kerbschlagarbeit $A_V$'
      }
    ],
    lessonsLearned: [
      'Hochfeste Stähle dürfen niemals ohne Nachweis ausreichender Bruchzähigkeit KIc bei tiefen Einsatztemperaturen verwendet werden.',
      'Konstruktionen müssen so ausgelegt sein, dass kritische Bereiche visuell oder mit ZfP geprüft werden können.',
      'Brücken ohne Redundanz (Fracture Critical Members) erfordern Sonderprüfungen oder müssen substituiert werden.'
    ],
    typischeBauschaedenLink: {
      subTab: 'risse',
      label: 'Risse, Sprödbruch & Verformungen',
      description: 'Spannungsintensität KI, elastische Bruchmechanik und Rissfortschritt nach Griffith-Irwin.'
    },
    sources: [
      {
        title: 'Highway Accident Report: Collapse of U.S. 35 Highway Bridge, Point Pleasant, West Virginia',
        institutionOrAuthor: 'National Transportation Safety Board (NTSB Report NTSB-HAR-71-1)',
        details: 'Offizieller US-Bundesuntersuchungsbericht zum Einsturz der Silver Bridge, Washington D.C., 1971.',
        url: 'https://de.wikipedia.org/wiki/Silver_Bridge'
      },
      {
        title: 'Analysis of the Eyebar Fracture of the Point Pleasant Bridge',
        institutionOrAuthor: 'National Bureau of Standards (NBS / NIST)',
        details: 'Grundlegende metallurgische und bruchmechanische Werkstoffuntersuchung des gebrochenen Stabs 330.'
      },
      {
        title: 'National Bridge Inspection Standards (NBIS)',
        institutionOrAuthor: 'Federal Highway Administration (FHWA)',
        details: 'Historische Einführung bundesweiter Prüfvorschriften infolge des Silver-Bridge-Kollapses.',
        url: 'https://www.fhwa.dot.gov/bridge/nbis.cfm'
      }
    ]
  },
  {
    id: 'kongresshalle_berlin',
    name: 'Teileinsturz der Kongresshalle Berlin (Haus der Kulturen der Welt)',
    subTitle: 'Bruch des südlichen Dachrandbogens durch Spannungsrisskorrosion am Spannstahl',
    category: 'hallen',
    year: '1980',
    location: 'Berlin (Tiergarten), Deutschland',
    structureType: 'Hängedach-Schalenkonstruktion (Sattelfläche mit Randbögen)',
    keyMaterialMechanism: 'Wasserstoffinduzierte Spannungsrisskorrosion an vergütetem Spannstahl (St 60/90 bzw. St 140/160) + Injektionsmängel in Hüllrohren',
    summary: 'Am 21. Mai 1980 stürzte der weit auskragende südliche Randbogen der Berliner Kongresshalle ("Schwangere Auster") plötzlich ein. Ein Mensch wurde getötet, mehrere Personen verletzt. Die Ursachenuntersuchung durch Prof. Dr. Jörg Schlaich deckte gravierende werkstoffkundliche Defizite des verwendeten vergüteten Spannstahls, unzureichende Injektionsmörtelverfüllung und fatale Zwängungsspannungen auf.',
    projectData: {
      baujahr: '1956–1957',
      schadensdatum: '21. Mai 1980 (ca. 10:15 Uhr)',
      ort: 'Berlin-Tiergarten (John-Foster-Dulles-Allee)',
      tragwerkstyp: 'Sattelförmig gekrümmtes Hängedach (hyperbolisches Paraboloid) mit zwei massiven geneigten Stahlbetonbögen',
      beteiligteBaustoffe: ['Vergüteter Spannstahl', 'B225 / B300 Beton', 'Zementeinpressmörtel'],
      spannweiteAbmessungen: 'Bogenspannweite ca. 60 m, Dachauskragung ca. 20 m',
      opferZahlen: '1 Todesopfer (ein Rundfunkjournalist), mehrere Verletzte',
      gesamtschaden: 'Einsturz des Südbogens, aufwändiger Wiederaufbau 1987 zum 750. Stadtjubiläum'
    },
    historie: [
      {
        phase: '1. Bau als Symbol der Moderne (1956–1957)',
        zeitraum: '1956–1957',
        details: 'US-Beitrag zur internationalen Bauausstellung "Interbau 57". Die kühne Konstruktion nach Entwurf von Hugh Stubbins spannte das Seilnetz zwischen zwei geneigten Stahlbetonbögen auf. Aus baurechtlichen Gründen wurde das Hängedach nachträglich mit einer Betonschale versteift.'
      },
      {
        phase: '2. Zwängungen & unvollständige Fugenabdichtung (1958–1979)',
        zeitraum: '1958–1979',
        details: 'Zwischen der Dachhaut und dem massiven Randbogen kam es infolge von Temperaturunterschieden und Kriechen zu unerwartet hohen Zwangskräften. Wasser drang über undichte Fugen in die Spannkanäle der Bögen ein.'
      },
      {
        phase: '3. Plötzlicher Scherbruch (21.05.1980)',
        zeitraum: '21.05.1980',
        details: 'Ohne jede Vorankündigung riss der Spannstahl im südlichen Widerlagerbereich. Der äußere Bogen knickte schlagartig nach unten weg und stürzte in das Foyer und auf den Vorplatz.'
      }
    ],
    ursachen: [
      {
        titel: 'Wasserstoffinduzierte Spannungsrisskorrosion (SpRK)',
        kategorie: 'Material/Werkstoff',
        beschreibung: 'Der damals neuartige vergütete Spannstahl wies eine unglückliche Gefügestruktur auf, die bei Kontakt mit feuchtem alkalisierungsgeschwächtem Zementstein atomaren Wasserstoff aufnahm und versprödete.',
        formelOrMechanismus: '\\text{Kathodische Wasserstoffentwicklung in Spalten und Hohlräumen}'
      },
      {
        titel: 'Injektionsmängel (Fehlstellen im Verpressmörtel)',
        kategorie: 'Ausführung',
        beschreibung: 'Die Spannstahl-Spannglieder waren abschnittsweise unzureichend mit Zementmörtel verfüllt. Es verblieben Hohlräume, in denen sich Kondenswasser sammeln konnte.'
      },
      {
        titel: 'Nicht berücksichtigte Zwangsbeanspruchungen',
        kategorie: 'Planung/Statik',
        beschreibung: 'Die statische Kopplung zwischen Bogen und Dachfläche erzeugte Biegemomente und Querkräfte an Stellen, die im ursprünglichen Seilnetzmodell nicht vorgesehen waren.'
      }
    ],
    folgen: [
      {
        bereich: 'Spannstahlzulassungen in Deutschland',
        auswirkung: 'Vollständiges Verbot und Zulassungswiderruf für thermisch und chemisch vergütete Spannstähle der betroffenen Festigkeitsklassen durch das Institut für Bautechnik (heute DIBt). Seither dürfen nur noch kaltverformte Spannstähle verwendet werden.',
        normativeKonsequenz: 'DIBt-Richtlinie zu vergüteten Spannstählen & DIN 4227 Novellierung'
      },
      {
        bereich: 'Wiederaufbau & Denkmalpflege',
        auswirkung: 'Wiederaufbau mit modifizierter Konstruktion (echtes, mechanisch entkoppeltes Hängedach ohne Zwangskräfte).',
        normativeKonsequenz: 'Eröffnung als Haus der Kulturen der Welt (HKW) 1987'
      }
    ],
    lessonsLearned: [
      'Vergütete Spannstähle alter Bauart müssen in allen Bestandsbauten kartiert und als akut gefährdet eingestuft werden.',
      'Kombinierte Tragwerke (Hängedach + biegesteifer Betonbogen) erfordern eine präzise Berücksichtigung von Nichtlinearitäten und Zwang.',
      'Sorgfalt beim Verpressen von Spannkanälen entscheidet über Leben und Tod.'
    ],
    typischeBauschaedenLink: {
      subTab: 'korrosion',
      label: 'Korrosion & Betonschäden',
      description: 'Passivierung des Betons, Lochfraß und wasserstoffinduzierte Spannungsrisskorrosion an Vorspannungen.'
    },
    sources: [
      {
        title: 'Gutachten über die Ursachen des Teileinsturzes der Kongresshalle Berlin',
        institutionOrAuthor: 'Prof. Dr.-Ing. Jörg Schlaich (Institut für Massivbau, Universität Stuttgart)',
        details: 'Prägendes bautechnisches Gutachten im Auftrag des Senators für Bau- und Wohnungswesen Berlin, 1980.',
        url: 'https://de.wikipedia.org/wiki/Haus_der_Kulturen_der_Welt'
      },
      {
        title: 'Mitteilungen des Instituts für Bautechnik (DIBt): Zur Beurteilung älterer Spannbetonbauwerke',
        institutionOrAuthor: 'Deutsches Institut für Bautechnik (DIBt)',
        details: 'Erlass zum Verbot und zur Gefährdungsanalyse von vergütetem Spannstahl der Serien vor 1978.',
        url: 'https://www.dibt.de/'
      },
      {
        title: 'Der Einsturz der Kongresshalle Berlin – Ursachen und Lehren für die Baupraxis',
        institutionOrAuthor: 'Beton- und Stahlbetonbau (Ernst & Sohn)',
        details: 'Fachaufsatzreihe zur Werkstoffversprödung und Interaktion Hängeseile/Bogen, Jahrgang 1980/1981.'
      }
    ]
  },
  {
    id: 'sankt_marx_wien',
    name: 'Einsturz der Reichsbrücke Wien (1976)',
    subTitle: 'Schlagartiger Einsturz des Hauptstromfeldes infolge von Pfeilerkernzerfall',
    category: 'bruecken',
    year: '1976',
    location: 'Wien, Österreich',
    structureType: 'Kettenbrücke / Hängebrücke über die Donau',
    keyMaterialMechanism: 'Materialermüdung, unzureichender Pfeilerbeton (Sandstein-Kies-Schüttung) und Frosteinwirkung im Pfeilerkern',
    summary: 'Am Sonntagmorgen des 1. August 1976 stürzte die Wiener Reichsbrücke, eines der bekanntesten Wahrzeichen Wiens, auf voller Strombreite in die Donau. Ein Pkw-Lenker starb. Die Brücke, eine monumentale Kettenbrücke aus dem Jahr 1937, versagte nicht an den Stahlketten, sondern durch das Zerbröseln des unbewehrten Betonkerns von Pfeiler III.',
    projectData: {
      baujahr: '1934–1937',
      schadensdatum: '01. August 1976 (ca. 04:53 Uhr)',
      ort: 'Wien (Donau-Überquerung)',
      tragwerkstyp: 'Kettenhängebrücke mit Versteifungsträger, Hauptspannweite 241 m',
      beteiligteBaustoffe: ['Stampfbeton im Pfeilerkern', 'Granit-Verblendmauerwerk', 'Hochfester Baustahl'],
      spannweiteAbmessungen: 'Hauptspannweite 241,2 m, Gesamtlänge 1.255 m',
      opferZahlen: '1 Todesopfer, mehrere Verletzte',
      gesamtschaden: 'Verlust der wichtigsten Donau-Verkehrsachse, Neubau der heutigen Reichsbrücke'
    },
    historie: [
      {
        phase: '1. Bau in wirtschaftlicher Notzeit (1934–1937)',
        zeitraum: '1934–1937',
        details: 'Errichtung der Brücke während der Weltwirtschaftskrise. Um Zement und Kosten zu sparen, wurden die monumentalen Pfeilerkerne aus minderwertigem Magerbeton (Stampfbeton mit hohem Wasser-Bindemittel-Wert und inhomogenen Zuschlägen) geschüttet und lediglich mit Granitquadern verkleidet.'
      },
      {
        phase: '2. Kriegseinwirkungen & Überflutungen (1945–1975)',
        zeitraum: '1945–1975',
        details: '1945 entging die Brücke knapp der Sprengung, trug jedoch Erschütterungen davon. Über die Granitfugen sickerte kontinuierlich Wasser in den porösen Pfeilerkern ein. Frost-Tau-Zyklen zermürbten den Beton im Inneren über Jahrzehnte unbemerkt.'
      },
      {
        phase: '3. Versagen von Pfeiler III (01.08.1976)',
        zeitraum: '01.08.1976',
        details: 'Durch die fortschreitende Zerrüttung des Betons konnte der Pfeilerkern die Auflagerdrücke der Pylonstiele nicht mehr zentrisch aufnehmen. Der Pfeiler brach unter Scherspannungen auseinander, woraufhin die Kettenführung entglitt und das gesamte Tragwerk in den Fluss stürzte.'
      }
    ],
    ursachen: [
      {
        titel: 'Frost-Tau-Zerrüttung im minderwertigen Pfeilerbeton',
        kategorie: 'Material/Werkstoff',
        beschreibung: 'Der innere Pfeilerbeton wies einen zu geringen Zementgehalt und einen schlechten w/z-Wert auf. Eingedrungenes Wasser erzeugte durch Volumenausdehnung beim Gefrieren Mikro- und Makrorisse, die die Druckfestigkeit auf einen Bruchteil reduzierten.',
        formelOrMechanismus: '\\Delta V_{\\text{Eis}} \\approx +9\\% \\implies \\sigma_{\\text{Spalt}} > f_{ct}'
      },
      {
        titel: 'Täuschung durch intakte Naturstein-Verblendung',
        kategorie: 'Unterhalt/Monitoring',
        beschreibung: 'Von außen wirkte der Pfeiler durch die makellosen Granitquader massiv und unversehrt. Der Verbund zwischen Schale und Kern war jedoch längst verlorengegangen.'
      },
      {
        titel: 'Spannungsumlagerung & Schubbruch',
        kategorie: 'Planung/Statik',
        beschreibung: 'Die Lasten konzentrierten sich auf die äußere Granitschale, die für diese exzentrischen Vertikallasten statisch nicht bemessen war.'
      }
    ],
    folgen: [
      {
        bereich: 'Österreichisches & europäisches Brückenprüfwesen',
        auswirkung: 'Einführung moderner zerstörungsfreier Kernbohr- und Ultraschallverfahren zur Tiefenprüfung von Brückenpfeilern (RVS-Richtlinien).',
        normativeKonsequenz: 'RVS 13.03.11 (Überwachung und Prüfung von Kunstbauten in Österreich)'
      },
      {
        bereich: 'Stadtentwicklung Wien',
        auswirkung: 'Planung und Bau der modernen Spannbetonbrücke mit integrierter U-Bahn-Trasse (U1) und Eröffnung 1980.',
        normativeKonsequenz: 'Parallele Einführung automatisierter Dauer-Dehnungsüberwachungen'
      }
    ],
    lessonsLearned: [
      'Verblendete Bauteile (z.B. Natursteinmauerwerk vor Beton) verschleiern den inneren Zustand und erfordern Kernbohrungen oder ZfP-Sonden.',
      'Sparen an Bindemitteln und Betonqualität rächt sich nach wenigen Jahrzehnten katastrophal.',
      'Wasserzutritt in Pfeilerkerne muss durch einwandfreie Fugenversiegelung und funktionierende Drainagen verhindert werden.'
    ],
    typischeBauschaedenLink: {
      subTab: 'tief_ingenieurbau',
      label: 'Tief- & Ingenieurbau',
      description: 'Pfeilerkerne, Gründungs- und Substruktionsschäden sowie zerstörungsfreie Ultraschallprüfungen.'
    },
    sources: [
      {
        title: 'Bericht der Sachverständigenkommission zur Ermittlung der Einsturzursachen der Wiener Reichsbrücke',
        institutionOrAuthor: 'Magistrat der Stadt Wien / Bundesministerium für Bauten und Technik',
        details: 'Umfassendes Untersuchungsgutachten mit mikroskopischer Analyse des Stampfbetonkerns, Wien 1976/1977.',
        url: 'https://de.wikipedia.org/wiki/Reichsbr%C3%BCcke'
      },
      {
        title: 'Richtlinien und Vorschriften für das Straßenwesen (RVS 13.03.11)',
        institutionOrAuthor: 'Österreichische Forschungsgesellschaft Straße · Schiene · Verkehr (FSV)',
        details: 'Regelwerk zur systematischen Bauwerksprüfung und Klassifizierung von Massivbrücken in Österreich.',
        url: 'https://www.fsv.at/'
      },
      {
        title: 'Betonzerfall und Gefügeauflösung im massigen Tiefbau',
        institutionOrAuthor: 'Institut für Baustofflehre und Materialprüfung, TU Wien',
        details: 'Werkstofftechnische Analyse zur Frost-Tau-Zerrüttung bindemittelarmer Schüttungen.'
      }
    ]
  },
  {
    id: 'akr_bahnschwellen_garmisch',
    name: 'Alkali-Kieselsäure-Reaktion (AKR) an Betonschwellen (Garmisch-Partenkirchen)',
    subTitle: 'Betonkrebs durch alkalireaktive Gesteinskörnung und Zugunglück von Burgrain',
    category: 'infrastruktur',
    year: '2022',
    location: 'Burgrain bei Garmisch-Partenkirchen, Bayern & bundesweites Schienennetz',
    structureType: 'Spannbeton-Gleisschwellen (B70-Schwellen mit Vorspannung im Sofortverbund)',
    keyMaterialMechanism: 'Alkali-Kieselsäure-Reaktion (AKR, "Betonkrebs"): Reaktion von Alkalien des Zementsteins (Na₂O_äq) mit reaktiver opalischer Kieselsäure der Gesteinskörnung zu quellfähigem Alkalisilicat-Gel + innere Treibrisse',
    summary: 'Am 3. Juni 2022 entgleiste ein Regionalzug der Deutschen Bahn bei Burgrain (Garmisch-Partenkirchen). Fünf Menschen starben, fast 70 wurden verletzt. Die forensische Werkstoffuntersuchung durch die Bundesstelle für Eisenbahnunfalluntersuchung (BEU) und die BAM ergab ein materialbedingtes Totalversagen der Spannbetonschwellen: Eine schlummernde Alkali-Kieselsäure-Reaktion (AKR) hatte im Zusammenspiel mit ungünstigen Gesteinsmineralen den Beton von innen zermürbt, sodass die Schienenbefestigungen unter Achslasten herausbrachen. Die Deutsche Bahn musste bundesweit rund 480.000 Betonschwellen eines bestimmten Herstellers überprüfen und austauschen.',
    projectData: {
      baujahr: 'Herstellung der Schwellen ca. 2005–2007 (Einbauzeitraum)',
      schadensdatum: '03. Juni 2022 (ca. 12:15 Uhr) / Folgeuntersuchungen 2022–2024',
      ort: 'Burgrain bei Garmisch-Partenkirchen (Bahnstrecke München–Garmisch)',
      tragwerkstyp: 'Spannbetonschwellen Typ B 70 W 60 mit Spannstahldrähten und Schienenbefestigung W-Oberbau',
      beteiligteBaustoffe: ['Portlandzement mit hohem wirksamen Alkaligehalt', 'Alkalireaktive Kieselsäure-Gesteinskörnung (reaktiver Quarz/Flint/Grauwacke)', 'Spannstahl St 1570/1770'],
      spannweiteAbmessungen: 'Schwellenlänge 2,60 m, Gewicht ca. 280 kg pro Schwelle, betroffene Strecken > 500 km',
      opferZahlen: '5 Todesopfer, 68 Verletzte (davon 16 schwer)',
      gesamtschaden: 'Hunderte Millionen Euro für bundesweiten Schwellenaustausch, Langsamfahrstellen und Streckensperrungen'
    },
    historie: [
      {
        phase: '1. Produktion & Zulassung der B70-Schwellen (2000–2007)',
        zeitraum: '2000–2007',
        details: 'Für die automatisierte Fertigung der Schwellen wurde hochfester Beton mit schneller Festigkeitsentwicklung eingesetzt. In einem Schwellenwerk in Mössingen (Baden-Württemberg) wurde eine Gesteinskörnung verwendet, deren amorpher und mikrokristalliner Kieselsäuregehalt reaktiv war. Die damalige Eignungsprüfung nach der DAfStb-Alkali-Richtlinie erkannte die langsame Spät-Reaktivität der Körnung nicht.'
      },
      {
        phase: '2. Inkubationszeit & Gel-Genese im Schotterbett (2007–2021)',
        zeitraum: '2007–2021',
        details: 'Die Schwellen lagen im ungeschützten Gleisbett direkt Niederschlag, Taumitteln und dynamischen Schwingungen aus. Die Feuchte und Porenlösung mit OH⁻-Ionen drangen in die Gesteinspartikel ein. Es bildete sich quellfähiges Natrium-Kalium-Silicathydrogel in den Mikrohohlräumen.'
      },
      {
        phase: '3. Schwellenversagen & Ausreißkräfte (2021–2022)',
        zeitraum: '2021–2022',
        details: 'Der durch das Gel aufgebaute Quelldruck überschritt die zentrische Betonzugfestigkeit ($> 3{-}4\\text{ MPa}$). In Schwellenlängsrichtung entlang der Spanndrähte entstanden Makrorisse. Der Verbund zwischen Spannstahl, Kunststoffdübeln und Zementmatrix brach zusammen.'
      },
      {
        phase: '4. Entgleisung Burgrain (03.06.2022)',
        zeitraum: '03.06.2022',
        details: 'Unter der Achslast des Doppelstockzuges gaben die geschwächten Schwellen im Kurvenbereich schlagartig nach. Die Schienenbefestigungen kippten nach außen weg, was zur Spurerweiterung und zum katastrophalen Umsturz des Zuges führte.'
      }
    ],
    ursachen: [
      {
        titel: 'Alkali-Kieselsäure-Reaktion (AKR) mit Expansivgel',
        kategorie: 'Material/Werkstoff',
        beschreibung: 'Reaktion der Alkalihydroxide (Na⁺, K⁺, OH⁻) der Zementporenlösung mit amorpher Kieselsäure (SiO₂) der Gesteinskörnung. Das resultierende C-S-H/Alkali-Silicat-Gel nimmt Wasser auf und expandiert massiv.',
        formelOrMechanismus: '\\equiv\\!\\text{Si}-\\text{O}-\\text{Si}\\!\\equiv + 2\\text{OH}^- \\rightarrow 2[\\equiv\\!\\text{Si}-\\text{O}]^- + \\text{H}_2\\text{O} \\xrightarrow{+ \\text{Na}^+/\\text{K}^+} \\text{Expansives Quellgel}'
      },
      {
        titel: 'Überlagerung von Vorspannung und Quelldruck',
        kategorie: 'Planung/Statik',
        beschreibung: 'Die in Längsrichtung wirkende Vorspannkraft lenkte die Rissbildung parallel zu den Spanndrähten ("Spaltungsrisse"). Dadurch ging der mechanische Verbund zwischen Vorspanndraht und Beton exakt in der Dübelzone verloren.',
        formelOrMechanismus: 'p_{\\text{Quellung}} > f_{ctm} \\implies \\text{Längsspaltung entlang der Spanndrahtebene}'
      },
      {
        titel: 'Fehlende Früherkennung bei Routine-Gleisinspektion',
        kategorie: 'Unterhalt/Monitoring',
        beschreibung: 'Messzüge erfassen vorrangig Geometriedaten der Schienenoberkante. Rissbildung an der Schwellenunterseite und im Dübelbereich unter Schotterbedeckung ist optisch von außen extrem schwer feststellbar.'
      },
      {
        titel: 'Mängel in der früheren Gesteinsqualifikation',
        kategorie: 'Ausführung',
        beschreibung: 'Verwendung von Gesteinskörnungen, die im Standard-Mörtelschnelltest (14 Tage) unauffällig blieben, jedoch unter zyklischer dynamischer Belastung nach 10-15 Jahren Spät-AKR entwickelten.'
      }
    ],
    folgen: [
      {
        bereich: 'Bundesweites Notprogramm Deutsche Bahn',
        auswirkung: 'Untersuchung von über 480.000 Betonschwellen baugleicher Serien. Austausch von über 100.000 Schwellen innerhalb von 18 Monaten, massive Streckensperrungen und Geschwindigkeitsbegrenzungen auf Hauptstrecken.',
        normativeKonsequenz: 'DB Richtlinie 820 / Schwellengüteprogramme'
      },
      {
        bereich: 'Regelwerke & Normung Betontechnologie',
        auswirkung: 'Verschärfung der DAfStb-Richtlinie "Vorbeugende Maßnahmen gegen schädigende Alkalireaktion im Beton" (Alkali-Richtlinie). Betonschwellen werden nun ausnahmslos in die Feuchtigkeitsklasse WF (feucht + externe Alkalizufuhr/Taumittel) und strenge Expositionsklassen eingestuft.',
        normativeKonsequenz: 'DAfStb Alkali-Richtlinie (Überarbeitung 2023) & DIN EN 12620'
      },
      {
        bereich: 'ZfP & Inspektionstechnik',
        auswirkung: 'Einsatz neuartiger geophysikalischer Ultraschall- und Georadar-Inspektionszüge zur Detektion von inneren Schwellenrissen im eingebauten Schotterbett.',
        normativeKonsequenz: 'Einführung von zerstörungsfreien Zustandsbewertungen im Gleisoberbau'
      }
    ],
    lessonsLearned: [
      'Die Alkali-Kieselsäure-Reaktion kann auch nach 15 Jahren unauffälligen Betriebs schlagartig zu instabilen Strukturbrüchen führen.',
      'Für hochdynamisch beanspruchte Betonbauteile (Schwellen, Flugplatzpisten, Autobahnen) dürfen nur geprüfte NA-Zemente (Low-Alkali, $Na_2O_{äq} \\le 0{,}60\\%$) und unbedenkliche Gesteinskörnungen (E1) verwendet werden.',
      'Verdeckte Risse im Schotterbett erfordern bildgebende zerstörungsfreie Prüfverfahren.'
    ],
    typischeBauschaedenLink: {
      subTab: 'korrosion',
      label: 'Korrosion & "Betonkrebs" (AKR)',
      description: 'Alkali-Kieselsäure-Reaktion, Kieselsäure-Gelquellung und Sprengdrücke im Festbeton.'
    },
    sources: [
      {
        title: 'Untersuchungsbericht zur Zugentgleisung bei Burgrain / Garmisch-Partenkirchen',
        institutionOrAuthor: 'Bundesstelle für Eisenbahnunfalluntersuchung (BEU)',
        details: 'Offizieller Eisenbahnunfall-Untersuchungsbericht mit metallurgischen und betonpetrographischen Gutachten der BAM, 2023.',
        url: 'https://de.wikipedia.org/wiki/Eisenbahnunfall_von_Burgrain'
      },
      {
        title: 'Gutachten zur Alkalireaktivität der Gesteinskörnung in B70-Betonschwellen',
        institutionOrAuthor: 'Bundesanstalt für Materialforschung und -prüfung (BAM Berlin)',
        details: 'Petrographische Dünnschliffanalysen, Gel-Morphologie und Dehnungsuntersuchungen an Schwellen aus Mössingen.',
        url: 'https://www.bam.de/'
      },
      {
        title: 'DAfStb-Richtlinie: Vorbeugende Maßnahmen gegen schädigende Alkalireaktion im Beton (Alkali-Richtlinie)',
        institutionOrAuthor: 'Deutscher Ausschuss für Stahlbeton (DAfStb)',
        details: 'Klassifizierung der Feuchteklassen (WO, WF, WA, WS) und Eignungsprüfungen von Gesteinskörnungen.',
        url: 'https://www.dafstb.de/'
      }
    ]
  },
  {
    id: 'hyatt_regency_walkway',
    name: 'Einsturz der Hyatt-Regency-Verbindungsgänge (Kansas City)',
    subTitle: 'Schubversagen von Aufhängungsbolzen nach nicht freigegebener Detailänderung',
    category: 'hochbau',
    year: '1981',
    location: 'Kansas City, Missouri, USA',
    structureType: 'Abgehängte Fußgängerbrücken / Stege im Hotel-Atrium',
    keyMaterialMechanism: 'Querzugscherung und Durchstanzversagen der Schweißträger-Profilgurte an Gewindestangen infolge Lastverdopplung durch Umkonstruktion',
    summary: 'Am 17. Juli 1981 stürzten im Atrium des Hyatt Regency Hotels in Kansas City zwei übereinanderliegende Fußgängerbrücken während eines Tanzwettbewerbs ein. 114 Menschen starben, 216 wurden verletzt. Es war der bis dahin schwerste strukturelle Gebäudeeinsturz in der US-Geschichte. Ursache war eine scheinbar geringfügige werkstattseitige Änderung der Bolzenaufhängung, die die statische Scherspannung auf den Doppel-U-Träger verdoppelte.',
    projectData: {
      baujahr: '1978–1980',
      schadensdatum: '17. Juli 1981 (ca. 19:05 Uhr)',
      ort: 'Kansas City, Missouri, USA',
      tragwerkstyp: 'Schwebende Stahlstege (Länge ca. 36 m), abgehängt an Rundstahl-Gewindestangen im Atrium',
      beteiligteBaustoffe: ['Baustahl ASTM A36', 'Doppel-U-Träger MC10x8.4 (zusammengeschweißt)', 'Hochfeste Stahl-Gewindestangen'],
      spannweiteAbmessungen: 'Spannweite 36,5 m, Breite 2,6 m, Eigengewicht ca. 32 Tonnen pro Brücke',
      opferZahlen: '114 Todesopfer, 216 Verletzte',
      gesamtschaden: 'Eines der teuersten Schadensereignisse im US-Hochbau, Entzug der Ingenieurlizenzen der leitenden Statiker'
    },
    historie: [
      {
        phase: '1. Ursprüngliche Planung des Statikers (1978)',
        zeitraum: '1978',
        details: 'Der ursprüngliche Entwurf sah vor, dass durchgehende Gewindestangen von der Decke des Atriums bis zum unteren Gehweg (2. Etage) reichen und dabei den oberen Gehweg (4. Etage) durchdringen. Jede Brücke hätte ihre Last separat in die Stange eingeleitet.'
      },
      {
        phase: '2. Verhängnisvolle Werkstattänderung (1979)',
        zeitraum: '1979',
        details: 'Der Stahlbaufertiger (Havens Steel) wollte keine 14 m langen Gewindestangen mit durchgehendem Gewinde fertigen. Er schlug vor, die Stangen zu teilen: Eine Stange von der Decke zum 4. Stock und eine separate Stange vom 4. zum 2. Stock. Der Prüfingenieur segnete die Skizze ohne statische Nachrechnung telefonisch ab.'
      },
      {
        phase: '3. Verdopplung der Belastung (Wirkung)',
        zeitraum: '1980–1981',
        details: 'Durch die Kopplung musste der Querträger des oberen Gehwegs nun das gesamte Gewicht des unteren Gehwegs zuzüglich der Verkehrslast mittragen. Die Scherspannung am Flansch verdreifachte sich bezogen auf die Materialfestigkeit.'
      },
      {
        phase: '4. Durchstanzversagen beim Teetanz (17.07.1981)',
        zeitraum: '17.07.1981',
        details: 'Rund 1.600 Menschen versammelten sich im Atrium. Als sich Dutzende Personen auf den Stegen rhythmisch bewegten, riss die Mutter der Aufhängung mitsamt einer Schweißnaht durch den unteren Flansch des U-Profils. Beide Stege stürzten übereinander in die voll besetzte Hotellobby.'
      }
    ],
    ursachen: [
      {
        titel: 'Detailänderung verdoppelt lokale Auflagerlast',
        kategorie: 'Planung/Statik',
        beschreibung: 'Im Originalentwurf trug die Verbindung am 4. Stockwerk nur die Last $P_4$. Durch das Einhängen der unteren Stange an denselben Querträger wirkte an der Mutter die kombinierte Last $P_{\\text{gesamt}} = P_4 + P_2$.',
        formelOrMechanismus: 'P_{\\text{original}} = P_4 \\quad \\longrightarrow \\quad P_{\\text{ausgeführt}} = P_4 + P_2 \\approx 2 \\cdot P_4'
      },
      {
        titel: 'Querzugscherung und Flanschdurchstanzen',
        kategorie: 'Material/Werkstoff',
        beschreibung: 'Der dünne Steg der verschweißten U-Profile (MC10x8.4) besaß keine Aussteifungsrippen. Unter der verdoppelten Punktlast knickte der Flansch auf und die Unterlegscheibe wurde mitsamt Mutter durch den Stahlträger gezogen.',
        formelOrMechanismus: '\\tau = \\frac{P_{\\text{komb}}}{A_{\\text{Scher,Flansch}}} > f_u \\quad \\text{(Stanzscherversagen)}'
      },
      {
        titel: 'Verletzung von Prüf- und Freigabepflichten',
        kategorie: 'Ausführung',
        beschreibung: 'Die Werkstattzeichnung wurde weder vom Tragwerksplaner (GCE) noch von der Bauüberwachung rechnerisch überprüft, sondern blind abgestempelt.'
      }
    ],
    folgen: [
      {
        bereich: 'Berufsethik & Ingenieurverantwortung',
        auswirkung: 'Entzug der Berufszulassung für die verantwortlichen Ingenieure durch den Missouri Board of Architects. Der Fall wurde zum weltweiten Standardlehrbeispiel für Ingenieurethik und Qualitätssicherung.',
        normativeKonsequenz: 'ASCE Code of Ethics (Verschärfung der Ingenieurhaftung)'
      },
      {
        bereich: 'Stahlbau-Bemessungsrichtlinien',
        auswirkung: 'Verpflichtende statische Prüfung und Kennzeichnung von "Connections" (Knotenpunktdetails) in Stahlbauplänen; Verbot von Detailänderungen ohne formelle schriftliche Prüfstatik.',
        normativeKonsequenz: 'AISC Steel Construction Manual (Kapitel Connections)'
      }
    ],
    lessonsLearned: [
      'Scheinbar kleine konstruktive Fertigungsänderungen an Knotenpunkten können Lastabtragungspfade komplett verändern und erfordern immer eine vollwertige statische Neuberechnung.',
      'Punktförmige Krafteinleitungen in dünnwandige Trägerflansche erfordern stets Steifen oder Druckverteilungsplatten.',
      'Vier-Augen-Prinzip und formelle Freigabeprozesse dürfen niemals durch informelle Telefonabsprachen ersetzt werden.'
    ],
    typischeBauschaedenLink: {
      subTab: 'risse',
      label: 'Risse & Verformungen / Knotenversagen',
      description: 'Scherspannungen, Stanzscherversagen und Überlastung von Stahlknotenpunkten.'
    },
    sources: [
      {
        title: 'Investigation of the Kansas City Hyatt Regency Walkways Collapse',
        institutionOrAuthor: 'National Bureau of Standards (NBS Building Science Series 143, heute NIST)',
        details: 'Umfassender technischer Untersuchungsbericht des NBS zur rechnerischen und experimentellen Analyse des Trägerversagens, 1982.',
        url: 'https://de.wikipedia.org/wiki/Hyatt-Regency-Einsturz'
      },
      {
        title: 'AISC Code of Standard Practice for Steel Buildings and Bridges',
        institutionOrAuthor: 'American Institute of Steel Construction (AISC)',
        details: 'Festlegung der Verantwortlichkeiten zwischen ausführendem Stahlbauunternehmen und verantwortlichem Tragwerksplaner (EOR).',
        url: 'https://www.aisc.org/'
      },
      {
        title: 'Ethics in Engineering: The Hyatt Regency Walkway Collapse',
        institutionOrAuthor: 'American Society of Civil Engineers (ASCE)',
        details: 'Grundlegende Fallstudie zur Berufsethik und Qualitätssicherung in Ingenieurbüros.'
      }
    ]
  },
  {
    id: 'stava_dammbruch',
    name: 'Katastrophe von Stava (Bruch der Absetzbecken-Dämme)',
    subTitle: 'Verflüssigung von Schlämmen und Böschungsversagen von Flotationsrückständen',
    category: 'infrastruktur',
    year: '1985',
    location: 'Stava (Gemeinde Tesero, Fleimstal), Trentino, Italien',
    structureType: 'Aufgespülte Absetzbecken-Dämme für Fluorit-Flotationsberge (Upstream Tailings Dam)',
    keyMaterialMechanism: 'Bodenmechanische Scherverflüssigung (Static Liquefaction): Zusammenbruch des Porengefüges wassergesättigter, schluffiger Schlämme mit vollständigem Verlust der Scherfestigkeit ($s = c + \\sigma\'\\tan\\varphi \\rightarrow 0$)',
    summary: 'Am 19. Juli 1985 brachen im Val di Stava die zwei kaskadenartig übereinanderliegenden Dämme von Absetzbecken eines Flussspat-Bergwerks. Rund 180.000 m³ toxischer, flüssiger Schlamm rasten mit bis zu 90 km/h talwärts und zerstörten das Dorf Stava sowie Teile von Tesero. 268 Menschen verloren ihr Leben. Die Katastrophe gilt als Paradebeispiel für werkstofflich-bodenmechanisches Versagen bei hydraulischer Schüttung ohne suffiziente Porenwasserdruck-Drainage.',
    projectData: {
      baujahr: '1961 (unteres Becken), 1969 (oberes Becken), ständige Aufhöhung',
      schadensdatum: '19. Juli 1985 (ca. 12:22 Uhr)',
      ort: 'Stava bei Tesero, Trentino, Italien',
      tragwerkstyp: 'Upstream-Tailings-Dämme (Höhe ca. 34 m, Kronenlänge > 200 m)',
      beteiligteBaustoffe: ['Fluorit-Flotationsberge (Schluff- und Feinstsandfraktionen)', 'Porenwasser', 'Drainagerohre (gebrochen)'],
      spannweiteAbmessungen: 'Dammhöhe kombiniert ca. 34 m, Neigung bis zu 80 %, 180.000 m³ Schlammmasse',
      opferZahlen: '268 Todesopfer, hunderte zerstörte Gebäude',
      gesamtschaden: 'Vollständige Auslöschung zweier Talsiedlungen, strafrechtliche Verurteilungen von 10 Verantwortlichen'
    },
    historie: [
      {
        phase: '1. Improvisierter Dammaufbau (1961–1975)',
        zeitraum: '1961–1975',
        details: 'Dämme wurden im sogenannten "Upstream-Verfahren" direkt auf die noch nicht konsolidierten, feinkörnigen Schlämme der Vorperiode aufgespült. Die Dammneigung war mit ca. 80 % (ca. 39 Grad) extrem steil und weit jenseits geotechnischer Sicherheitsmargen.'
      },
      {
        phase: '2. Drainagekollaps & Einstau (1980–1985)',
        zeitraum: '1980–1985',
        details: 'Die inneren Abfluss- und Drainagerohre brachen unter der Auflast des Schlamms zusammen oder verstopften. Das Porenwasser konnte nicht mehr entweichen, sodass der Grundwasserspiegel im Dammkörper bis nahe an die Dammkrone anstieg.'
      },
      {
        phase: '3. Bruch des oberen Damms (19.07.1985)',
        zeitraum: '19.07.1985 (12:22 Uhr)',
        details: 'Infolge des extrem hohen Porenwasserdrucks sank die effektive Spannung im Schlammskelett auf null. Der obere Damm verflüssigte sich schlagartig und stürzte in das untere Becken, das der dynamischen Stoßwelle keine Sekunde standhielt.'
      }
    ],
    ursachen: [
      {
        titel: 'Spontane Scherverflüssigung (Static Liquefaction)',
        kategorie: 'Material/Werkstoff',
        beschreibung: 'Ungesättigte oder weiche Schlufffraktionen mit lockerem Korngefüge neigen bei Schubspannungszunahme zur Kontraktion. Kann das Porenwasser nicht abfließen, steigt der Porenwasserdruck u an, bis die effektive Normalspannung $\\sigma\' = \\sigma - u = 0$ wird. Der Boden verhält sich wie eine Flüssigkeit.',
        formelOrMechanismus: '\\tau_f = c\' + (\\sigma - u) \\cdot \\tan\\varphi\' \\xrightarrow{u \\rightarrow \\sigma} \\tau_f \\approx 0'
      },
      {
        titel: 'Unzulässige Dammneigung & Upstream-Schüttung',
        kategorie: 'Planung/Statik',
        beschreibung: 'Aufbau eines Dammes auf weichem, wassergesättigtem Sediment mit Sicherheitsbeiwerten nahe 1,0. Es existierten keine bodenmechanischen Standsicherheitsnachweise nach heutigen Standards.'
      },
      {
        titel: 'Mangelndes Porenwasserdruck-Monitoring',
        kategorie: 'Unterhalt/Monitoring',
        beschreibung: 'Es gab keine Piezometer (Porenwasserdruckgeber) oder Inklinometer zur Kontrolle des Wasserspiegels im Damm.'
      }
    ],
    folgen: [
      {
        bereich: 'Internationale Talsperren- und Tailings-Normen',
        auswirkung: 'Weltweite Neubewertung von Tailings-Dämmen; in vielen Ländern Verbot des "Upstream-Verfahrens" für Bergbau-Absetzbecken ohne massive mechanische Entwässerung.',
        normativeKonsequenz: 'ICOLD Guidelines on Tailings Dams & Global Industry Standard on Tailings Management (GISTM)'
      },
      {
        bereich: 'Bodenmechanik & Geotechnik',
        auswirkung: 'Forschungsschwerpunkt zu zyklischer und statischer Verflüssigung feinkörniger Sedimente im Erd- und Grundbau.',
        normativeKonsequenz: 'Eurocode 7 (Geotechnische Bemessung)'
      }
    ],
    lessonsLearned: [
      'Wassergesättigte Schluffe und Flotationsberge verlieren bei Porenwasserüberdruck schlagartig jegliche Scherfestigkeit.',
      'Das Upstream-Verfahren für Absetzdämme birgt unkalkulierbare Risiken und erfordert ein lückenloses geotechnisches Monitoring.',
      'Entwässerungsleitungen in Erdbauwerken müssen dimensionsstabil und prüfbar sein.'
    ],
    typischeBauschaedenLink: {
      subTab: 'tief_ingenieurbau',
      label: 'Tief- & Ingenieurbau / Geotechnik',
      description: 'Porenwasserdruck, Scherfestigkeit nach Mohr-Coulomb, hydraulischer Grundbruch und Bodenverflüssigung.'
    },
    sources: [
      {
        title: 'The Stava Tailings Dams Failure, Italy, July 19, 1985',
        institutionOrAuthor: 'Fondazione Stava 1985 onlus / Prof. Giovanni Tosatti (University of Modena)',
        details: 'Offizielle Dokumentation und geotechnische Aufarbeitung des Dammbruchs.',
        url: 'https://www.stava1985.it/'
      },
      {
        title: 'Static Liquefaction of Fine-Grained Sediments in Tailings Dams',
        institutionOrAuthor: 'International Commission on Large Dams (ICOLD)',
        details: 'Bulletin 121: Tailings Dams – Risk of Dangerous Occurrences, Lessons Learnt from Practical Experiences.',
        url: 'https://www.icold-cigb.org/'
      },
      {
        title: 'Bodenmechanische Schadensmechanismen im Erd- und Talsperrenbau',
        institutionOrAuthor: 'Deutsche Gesellschaft für Geotechnik (DGGT)',
        details: 'Fachpublikation zur Verflüssigung und Porenwasserdruckentwicklung in künstlichen Aufschüttungen.'
      }
    ]
  },
  {
    id: 'schiersteiner_bruecke',
    name: 'Havarie der Schiersteiner Brücke (A 643)',
    subTitle: 'Pfeilerschieflage und Biegeknickung des Überbaus infolge von Gründungsschäden',
    category: 'bruecken',
    year: '2015',
    location: 'Wiesbaden / Mainz (Rheinland-Pfalz / Hessen), Deutschland',
    structureType: 'Stahl- und Spannbetonbalkenbrücke über das Mombacher Rheinvorland',
    keyMaterialMechanism: 'Pfeilerabsenkung durch Grundbruch/Scherversagen im Gründungsbereich bei Aushubarbeiten + plastische Torsions- und Beulverformung der Stahl-Hohlkästen',
    summary: 'In der Nacht zum 11. Februar 2015 senkte sich Pfeiler 6 der Schiersteiner Vorlandbrücke (A 643 zwischen Wiesbaden und Mainz) um rund 20 Zentimeter ab und neigte sich zur Seite. Der 53 Jahre alte Stahlüberbau riss an einem Fahrbahnübergang auf und knickte elastoplastisch ab. Die vielbefahrene Rheinbrücke (ca. 90.000 Kfz/Tag) musste für Monate voll gesperrt werden. Ursache war die Einleitung von Bohrpfahlarbeiten für den Brückenneubau direkt am unzureichend dokumentierten Flachgründungsfundament des Altpfeilers.',
    projectData: {
      baujahr: '1959–1962',
      schadensdatum: '10./11. Februar 2015',
      ort: 'Wiesbaden-Schierstein / Mainz-Mombach (Rhein)',
      tragwerkstyp: 'Zweistegiger Stahlplattenbalken mit orthotroper Fahrbahnplatte auf Stahlbetonpfeilern',
      beteiligteBaustoffe: ['Stahl St 52 / St 37', 'Stahlbeton-Pfeiler (B 300)', 'Schotter- und Schwemmsandboden'],
      spannweiteAbmessungen: 'Vorlandbrückenspannweiten ca. 50–60 m, Gesamtlänge 1.280 m',
      opferZahlen: 'Keine Personenschäden (rechtzeitige Vollsperrung durch aufmerksame Autofahrer/Polizei)',
      gesamtschaden: 'Millionenschäden durch Notabstützung, Schwerlastjoche, verkehrliche Totalblockade des Rhein-Main-Gebiets'
    },
    historie: [
      {
        phase: '1. Errichtung in den Wirtschaftswunderjahren (1959–1962)',
        zeitraum: '1959–1962',
        details: 'Die Vorlandbrücke wurde auf Flachgründungen und kurzen Ortbetonpfählen im quartären Rheinsediment errichtet. Die Gründungstiefen und Bewehrungsdetails waren in alten Archivplänen nur lückenhaft dokumentiert.'
      },
      {
        phase: '2. Bauarbeiten für den Ersatzneubau (Februar 2015)',
        zeitraum: 'Februar 2015',
        details: 'Unmittelbar neben Pfeiler 6 wurden Großbohrpfähle für die neue Rheinbrücke niedergebracht. Durch Bohrungen und Grundwasserabsenkungen im nicht bindigen Baugrund verlor der Gründungskörper des Altpfeilers seine seitliche Stützung.'
      },
      {
        phase: '3. Plötzliche Pfeilersetzung & Biegung (10.02.2015)',
        zeitraum: '10.02.2015 (ca. 21:30 Uhr)',
        details: 'Pfeiler 6 sackte ruckartig um ca. 20 cm ein und kippte um fast 1 Grad seitlich weg. Der Stahlüberbau stützte sich nicht mehr voll ab, die Übergangskonstruktion klaffte 20 cm auseinander, und im Stahlhohlkasten entstanden starke Beulfalten.'
      },
      {
        phase: '4. Notoperation mit hydraulischen Litzenhebern',
        zeitraum: 'Februar–März 2015',
        details: 'Unter Hochdruck wurden massive Schwerlast-Stahljoche errichtet, um den Überbau hydraulisch anzuheben und den Pfeiler zu entlasten, bevor der Neubau beschleunigt fertiggestellt werden konnte.'
      }
    ],
    ursachen: [
      {
        titel: 'Bodenmechanischer Grundbruch durch Nachbararbeiten',
        kategorie: 'Umwelteinfluss',
        beschreibung: 'Lokale Ausspülung und Entspannung von Sand-Kies-Schichten direkt unter dem Pfeilerfundament durch Pfahlbohrungen und Wassereintrag.',
        formelOrMechanismus: '\\sigma_0 > \\sigma_{\\text{zul}} \\quad \\text{infolge Verringerung des Erdwiderstands } E_p'
      },
      {
        titel: 'Strukturbeulen der Stahlstege unter Zwang',
        kategorie: 'Material/Werkstoff',
        beschreibung: 'Die plötzliche Schiefstellung erzeugte enorme Torsionsmomente und Schubkräfte in den Stegblechen des Stahlüberbaus, die die elastische Beulgrenze überschritten.',
        formelOrMechanismus: '\\sigma_v = \\sqrt{\\sigma_x^2 + 3\\tau^2} \\ge f_{y,d} \\implies \\text{Plastisches Beulen}'
      },
      {
        titel: 'Lückenhafte Bestandsstatik & Gründungsunterlagen',
        kategorie: 'Planung/Statik',
        beschreibung: 'Unzureichende geotechnische Sicherheitsabstände bei den Bohrplanungen des Ersatzneubaus aufgrund von Planungsannahmen ohne Baugrund-Tiefenaufschluss am Altpfeiler.'
      }
    ],
    folgen: [
      {
        bereich: 'Baugruben & Nachbarbauwerke an Brücken',
        auswirkung: 'Verschärfung der Auflagen bei Tiefbaumaßnahmen im direkten Nahbereich bestandsgefährdeter Großbrücken. Verpflichtendes Erschütterungs- und Setzungsmonitoring in Echtzeit.',
        normativeKonsequenz: 'DIN 4123 (Ausschachtungen, Gründungen und Unterfangungen im Bereich bestehender Gebäude)'
      },
      {
        bereich: 'Infrastruktur-Beschleunigung',
        auswirkung: 'Bundesweite Diskussion über den Sanierungsstau deutscher Autobahnbrücken und Einleitung des Brückenmodernisierungsnetzes.',
        normativeKonsequenz: 'Beschleunigung des Bundesfernstraßen-Brückenmodernisierungsprogramms'
      }
    ],
    lessonsLearned: [
      'Tiefbauarbeiten neben Bestandsgründungen erfordern eine lückenlose geotechnische Bestandsaufnahme und permanente Deformationsmessungen.',
      'Stahl- und Verbundüberbauten besitzen im Vergleich zu unbewehrtem Beton eine bemerkenswerte plastische Verformungsfähigkeit, die hier einen Gesamtabsturz verhinderte.',
      'Verkehrsadern mit hoher Netzbedeutung benötigen standardisierte Havariepläne für Sofortabstützungen.'
    ],
    typischeBauschaedenLink: {
      subTab: 'tief_ingenieurbau',
      label: 'Tief- & Ingenieurbau / Gründungen',
      description: 'Grundbruch, Baugruben, Setzungen und Sicherung von Nachbarfundamenten nach DIN 4123.'
    },
    sources: [
      {
        title: 'Gutachten zur Ursachenermittlung der Pfeilerabsenkung an der Schiersteiner Brücke',
        institutionOrAuthor: 'Hessen Mobil / Landesbetrieb Mobilität Rheinland-Pfalz (LBM)',
        details: 'Geotechnisches und statisches Fachgutachten zum Baugrundversagen bei Pfahlbohrungen, 2015.',
        url: 'https://de.wikipedia.org/wiki/Schiersteiner_Br%C3%BCcke'
      },
      {
        title: 'DIN 4123: Ausschachtungen, Gründungen und Unterfangungen im Bereich bestehender Gebäude',
        institutionOrAuthor: 'Deutsches Institut für Normung (DIN)',
        details: 'Normative Vorgaben zur Sicherung benachbarter Gründungen bei Tief- und Gründungsarbeiten.',
        url: 'https://www.din.de/'
      },
      {
        title: 'Bauwerksüberwachung und Notinstandsetzung an der Schiersteiner Brücke',
        institutionOrAuthor: 'Bautechnik (Ernst & Sohn)',
        details: 'Ingenieurtechnische Dokumentation der hydraulischen Huboperationen und Jochkonstruktionen.'
      }
    ]
  }
];

export default function MaterialSchaedenGross() {
  const { setActiveTab, setTypischeBauschaedenSubTab } = useTabContext();
  const [selectedCaseId, setSelectedCaseId] = useState<string>('bad_reichenhall');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'alle' | 'bruecken' | 'hallen' | 'infrastruktur' | 'hochbau'>('alle');
  const [searchQuery, setSearchQuery] = useState('');

  const currentCase = DAMAGE_CASES.find(c => c.id === selectedCaseId) || DAMAGE_CASES[0];

  const filteredCases = DAMAGE_CASES.filter(c => {
    const matchesCat = activeCategoryFilter === 'alle' || c.category === activeCategoryFilter;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.keyMaterialMechanism.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.structureType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      {/* Header Container */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-home-grau/20 pb-5 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-shiraz/10 text-shiraz rounded-xl">
              <ShieldAlert size={26} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                Große materialbedingte Bauschäden &amp; Einstürze
              </h2>
              <p className="text-xs text-text-main/70">
                Forensische Schadensanalyse historischer Großschadensfälle: Projektdaten, Werkstoffmechanismen, Historie, Ursachen &amp; normative Konsequenzen
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveCategoryFilter('alle')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategoryFilter === 'alle'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-off-white text-text-main/80 hover:bg-home-grau/20 border border-home-grau/30'
              }`}
            >
              Alle ({DAMAGE_CASES.length})
            </button>
            <button
              onClick={() => setActiveCategoryFilter('bruecken')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategoryFilter === 'bruecken'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-off-white text-text-main/80 hover:bg-home-grau/20 border border-home-grau/30'
              }`}
            >
              Brücken ({DAMAGE_CASES.filter(c => c.category === 'bruecken').length})
            </button>
            <button
              onClick={() => setActiveCategoryFilter('infrastruktur')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategoryFilter === 'infrastruktur'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-off-white text-text-main/80 hover:bg-home-grau/20 border border-home-grau/30'
              }`}
            >
              Infrastruktur &amp; Schiene ({DAMAGE_CASES.filter(c => c.category === 'infrastruktur').length})
            </button>
            <button
              onClick={() => setActiveCategoryFilter('hallen')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategoryFilter === 'hallen'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-off-white text-text-main/80 hover:bg-home-grau/20 border border-home-grau/30'
              }`}
            >
              Hallen ({DAMAGE_CASES.filter(c => c.category === 'hallen').length})
            </button>
            <button
              onClick={() => setActiveCategoryFilter('hochbau')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategoryFilter === 'hochbau'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-off-white text-text-main/80 hover:bg-home-grau/20 border border-home-grau/30'
              }`}
            >
              Hochbau ({DAMAGE_CASES.filter(c => c.category === 'hochbau').length})
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-text-main/40" size={16} />
            <input
              type="text"
              placeholder="Fallakte durchsuchen (z.B. Bahnschwellen, AKR, Leim, Spannungsrisskorrosion, Carolabrücke, Stava)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-off-white border border-home-grau/30 rounded-xl text-xs text-text-main placeholder:text-text-main/50 focus:outline-none focus:border-shiraz/50"
            />
          </div>
        </div>

        {/* Introduction Quote / Banner */}
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6 leading-relaxed">
          <p>
            Große Einstürze und Strukturversagen der Bau- und Verkehrsgeschichte sind selten das Resultat eines einzelnen Versehens. Nahezu ausnahmslos handelt es sich um das verhängnisvolle Zusammenspiel von <strong>materialbedingter Degradation</strong> (z.B. Alkali-Kieselsäure-Reaktion im Beton, Spannungsrisskorrosion, Hydrolyse von Leimfugen, Verflüssigung unter Porenwasserdruck), <strong>bauphysikalischer oder statischer Fehlkonzeption</strong>, <strong>fehlender System-Redundanz</strong> und <strong>Lücken in der periodischen Bauwerksüberwachung</strong>.
          </p>
        </div>

        {/* Case Study Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          {filteredCases.map(cs => {
            const isSelected = cs.id === currentCase.id;
            return (
              <div
                key={cs.id}
                onClick={() => setSelectedCaseId(cs.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between text-left ${
                  isSelected 
                    ? 'bg-shiraz text-white border-shiraz shadow-md' 
                    : 'bg-white hover:bg-slate-50 border-home-grau/30 text-text-main hover:border-shiraz/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono opacity-80 mb-1">
                    <span>{cs.year}</span>
                    <span className="uppercase tracking-wider font-bold">{cs.category}</span>
                  </div>
                  <h4 className="font-bold text-xs leading-snug line-clamp-2 mb-1.5">
                    {cs.name}
                  </h4>
                  <p className={`text-[11px] line-clamp-2 ${isSelected ? 'text-white/80' : 'text-text-main/70'}`}>
                    {cs.location}
                  </p>
                </div>
                <div className={`mt-3 pt-2 border-t text-[10px] font-semibold flex items-center justify-between ${
                  isSelected ? 'border-white/20 text-white' : 'border-home-grau/20 text-shiraz'
                }`}>
                  <span>Fallakte öffnen</span>
                  <ChevronRight size={12} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Case Study Detail View */}
        <div className="bg-slate-50/60 rounded-2xl border border-home-grau/30 p-6 flex flex-col gap-6">
          {/* Header of the Active Case */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-home-grau/20">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-shiraz text-white">
                  Jahr {currentCase.year}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white border border-home-grau/30 text-text-main">
                  {currentCase.location}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-shiraz border border-shiraz/20">
                  {currentCase.projectData.opferZahlen}
                </span>
              </div>
              <h3 className="text-2xl font-black text-text-main">
                {currentCase.name}
              </h3>
              <p className="text-sm font-medium text-shiraz mt-0.5">
                {currentCase.subTitle}
              </p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-home-grau/20 shadow-2xs max-w-sm">
              <span className="text-[10px] uppercase font-bold text-text-main/60 block mb-1">
                Kritischer Werkstoffmechanismus
              </span>
              <div className="text-xs font-bold text-text-main leading-snug">
                <FormulaText text={currentCase.keyMaterialMechanism} />
              </div>
            </div>
          </div>

          {/* Summary Box */}
          <div className="p-4 bg-white rounded-xl border border-home-grau/20 text-xs text-text-main/80 leading-relaxed shadow-2xs">
            <FormulaText text={currentCase.summary} />
          </div>

          {/* 1. Projektdaten & Kenngrößen */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-2xs">
            <h4 className="text-sm font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
              <Building2 size={16} className="text-shiraz" /> Projektdaten &amp; Bauwerkskenngrößen
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-off-white/80 rounded-lg border border-home-grau/20">
                <span className="text-[10px] text-text-main/60 font-semibold block uppercase">Baujahr &amp; Schadenszeitpunkt</span>
                <p className="font-bold text-text-main mt-0.5">{currentCase.projectData.baujahr} / {currentCase.projectData.schadensdatum}</p>
              </div>
              <div className="p-3 bg-off-white/80 rounded-lg border border-home-grau/20">
                <span className="text-[10px] text-text-main/60 font-semibold block uppercase">Tragwerkstyp &amp; Abmessungen</span>
                <p className="font-bold text-text-main mt-0.5">{currentCase.projectData.tragwerkstyp}</p>
                <p className="text-[11px] text-text-main/70 mt-1">{currentCase.projectData.spannweiteAbmessungen}</p>
              </div>
              <div className="p-3 bg-off-white/80 rounded-lg border border-home-grau/20">
                <span className="text-[10px] text-text-main/60 font-semibold block uppercase">Beteiligte Werkstoffe</span>
                <ul className="mt-1 space-y-0.5 font-semibold text-text-main list-disc list-inside">
                  {currentCase.projectData.beteiligteBaustoffe.map((m, i) => (
                    <li key={i} className="text-[11px]">{m}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3 bg-off-white/80 rounded-lg border border-home-grau/20">
                <span className="text-[10px] text-text-main/60 font-semibold block uppercase">Schadensausmaß &amp; Verluste</span>
                <p className="font-bold text-shiraz mt-0.5">{currentCase.projectData.opferZahlen}</p>
                <p className="text-[11px] text-text-main/70 mt-1">{currentCase.projectData.gesamtschaden}</p>
              </div>
            </div>
          </div>

          {/* 2. Historie & Schadensverlauf */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-2xs">
            <h4 className="text-sm font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
              <Clock size={16} className="text-shiraz" /> Historie &amp; Schadenschronologie
            </h4>
            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-home-grau/30">
              {currentCase.historie.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-3 pl-7">
                  <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-shiraz border-2 border-white shadow-2xs" />
                  <div className="p-3.5 bg-off-white/60 rounded-xl border border-home-grau/20 w-full text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-text-main text-xs">{step.phase}</span>
                      <span className="font-mono text-[10px] font-bold text-shiraz bg-white px-2 py-0.5 rounded border border-home-grau/20">
                        {step.zeitraum}
                      </span>
                    </div>
                    <div className="text-text-main/80 leading-relaxed">
                      <FormulaText text={step.details} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Physikalische & Materialbedingte Schadensursachen */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-2xs">
            <h4 className="text-sm font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
              <Layers size={16} className="text-shiraz" /> Materialmechanische &amp; Ingenieurtechnische Schadensursachen
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentCase.ursachen.map((u, i) => (
                <div key={i} className="p-4 rounded-xl border border-home-grau/20 bg-slate-50/40 flex flex-col justify-between text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-text-main text-xs">{u.titel}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        u.kategorie === 'Material/Werkstoff' 
                          ? 'bg-rose-100 text-shiraz' 
                          : u.kategorie === 'Planung/Statik'
                          ? 'bg-amber-100 text-amber-900'
                          : u.kategorie === 'Ausführung'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {u.kategorie}
                      </span>
                    </div>
                    <div className="text-text-main/80 leading-relaxed mb-3">
                      <FormulaText text={u.beschreibung} />
                    </div>
                  </div>

                  {u.formelOrMechanismus && (
                    <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 text-center font-serif text-xs">
                      <BlockMath math={u.formelOrMechanismus} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 4. Folgen & Normative Konsequenzen */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-2xs">
            <h4 className="text-sm font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
              <Scale size={16} className="text-shiraz" /> Folgen &amp; Normative Konsequenzen für die Baupraxis
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {currentCase.folgen.map((f, i) => (
                <div key={i} className="p-3.5 bg-off-white/80 rounded-xl border border-home-grau/20 flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-text-main text-xs block mb-1.5">{f.bereich}</span>
                    <p className="text-text-main/80 leading-relaxed mb-3">{f.auswirkung}</p>
                  </div>
                  <div className="pt-2 border-t border-home-grau/20">
                    <span className="text-[10px] text-text-main/60 block font-semibold uppercase">Relevantes Regelwerk</span>
                    <div className="font-mono text-[11px] font-bold text-shiraz mt-0.5">
                      <FormulaText text={f.normativeKonsequenz} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Lessons Learned / Wichtigste Ingenieur-Erkenntnisse */}
          <div className="bg-shiraz/5 p-5 rounded-xl border border-shiraz/20 shadow-2xs">
            <h4 className="text-sm font-bold text-shiraz flex items-center gap-2 mb-2">
              <CheckCircle2 size={16} /> Fundamentale Lehren für Bauingenieure &amp; Werkstoffprüfer
            </h4>
            <ul className="space-y-1.5 text-xs text-text-main/80 list-disc list-inside">
              {currentCase.lessonsLearned.map((ll, i) => (
                <li key={i} className="leading-relaxed">
                  <strong><FormulaText text={ll} /></strong>
                </li>
              ))}
            </ul>
          </div>

          {/* 6. Querverweis & Vertiefung im Fachmodul 'Typische Bauschäden' */}
          {currentCase.typischeBauschaedenLink && (
            <div className="p-4 bg-gradient-to-r from-amber-500/10 via-shiraz/10 to-transparent border border-shiraz/25 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-shiraz text-white">
                    Fachwissen-Verknüpfung
                  </span>
                  <strong className="text-xs text-text-main">
                    Verwandter Schadensmechanismus in: Typische Bauschäden
                  </strong>
                </div>
                <p className="text-xs text-text-main/80 font-medium">
                  {currentCase.typischeBauschaedenLink.description}
                </p>
              </div>
              <button
                onClick={() => {
                  setTypischeBauschaedenSubTab(currentCase.typischeBauschaedenLink!.subTab);
                  setActiveTab('bauschaeden');
                }}
                className="px-4 py-2 bg-shiraz text-white rounded-xl text-xs font-bold hover:bg-shiraz/90 transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap self-start sm:self-auto cursor-pointer"
              >
                <span>Zu &bdquo;{currentCase.typischeBauschaedenLink.label}&ldquo; wechseln</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* 7. Fachquellen, Untersuchungsberichte & Gutachten */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/20 shadow-2xs">
            <h4 className="text-sm font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
              <BookOpen size={16} className="text-shiraz" /> Relevante Fachquellen, Gutachten &amp; Untersuchungsberichte
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentCase.sources.map((s, i) => (
                <div key={i} className="p-3 bg-off-white/80 rounded-xl border border-home-grau/20 flex flex-col justify-between text-xs">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <strong className="text-text-main leading-snug font-semibold">{s.title}</strong>
                      {s.url && (
                        <a 
                          href={s.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-shiraz hover:underline shrink-0 p-0.5"
                          title="Quelle extern öffnen"
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-shiraz block mb-1">
                      {s.institutionOrAuthor}
                    </span>
                    <p className="text-[11px] text-text-main/70 leading-relaxed">
                      {s.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Standardisierter ModuleFooter nach Styleguide */}
      <ModuleFooter
        wikipedia={[
          { title: 'Alkali-Kieselsäure-Reaktion', url: 'https://de.wikipedia.org/wiki/Alkali-Kiesels%C3%A4ure-Reaktion' },
          { title: 'Eisenbahnunfall von Burgrain (Garmisch-Partenkirchen)', url: 'https://de.wikipedia.org/wiki/Eisenbahnunfall_von_Burgrain' },
          { title: 'Hyatt-Regency-Einsturz (Kansas City)', url: 'https://de.wikipedia.org/wiki/Hyatt-Regency-Einsturz' },
          { title: 'Katastrophe von Stava (Dammbruch)', url: 'https://de.wikipedia.org/wiki/Katastrophe_von_Stava' },
          { title: 'Schiersteiner Brücke (Havarie)', url: 'https://de.wikipedia.org/wiki/Schiersteiner_Br%C3%BCcke' },
          { title: 'Einsturz der Eishalle Bad Reichenhall', url: 'https://de.wikipedia.org/wiki/Eishalle_Bad_Reichenhall' },
          { title: 'Polcevera-Viadukt (Ponte Morandi)', url: 'https://de.wikipedia.org/wiki/Polcevera-Viadukt' },
          { title: 'Carolabrücke (Dresden)', url: 'https://de.wikipedia.org/wiki/Carolabr%C3%BCcke_(Dresden)' },
          { title: 'Silver Bridge', url: 'https://de.wikipedia.org/wiki/Silver_Bridge' },
          { title: 'Kongresshalle (Berlin)', url: 'https://de.wikipedia.org/wiki/Haus_der_Kulturen_der_Welt' },
          { title: 'Reichsbrücke', url: 'https://de.wikipedia.org/wiki/Reichsbr%C3%BCcke' }
        ]}
        literatur={[
          'Bundesstelle für Eisenbahnunfalluntersuchung (BEU): Untersuchungsbericht zum Zugunglück bei Burgrain 2022 (AKR an Spannbetonschwellen)',
          'Deutscher Ausschuss für Stahlbeton (DAfStb): Richtlinie Vorbeugende Maßnahmen gegen schädigende Alkalireaktion im Beton (Alkali-Richtlinie 2023)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'National Bureau of Standards (NBS): Investigation of the Kansas City Hyatt Regency Walkways Collapse (1982)',
          'Schlaich, J. et al. (1980): Schadensuntersuchung über den Einsturz des Südbogens der Kongresshalle Berlin (Gutachtenbericht)',
          'Wörner, J.-D. et al. (2006): Gutachten zum Einsturz der Eislaufhalle Bad Reichenhall (TU Darmstadt / LGA Bayern)',
          'Petroski, H. (1994): Design Paradigms: Case Histories of Error and Judgment in Engineering (Cambridge University Press)'
        ]}
        regelwerke={[
          { title: 'DAfStb Alkali-Richtlinie (Alkalireaktion im Beton)', url: 'https://www.dafstb.de/' },
          { title: 'VDI 6200 (Standsicherheit von Bauwerken - Regelmäßige Überprüfung)', url: 'https://www.vdi.de/richtlinien/details/vdi-6200-standsicherheit-von-bauwerken-regelmaessige-ueberpruefung' },
          { title: 'DIN 1076 (Ingenieurbauwerke im Zuge von Straßen und Wegen - Überwachung und Prüfung)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 12620 (Gesteinskörnungen für Beton)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 1995-1-1 / Eurocode 5 (Bemessung und Konstruktion von Holzbauten)', url: 'https://www.dinmedia.de/' },
          { title: 'DIN EN 1992-2 / Eurocode 2 (Betonbrücken - Bemessungs- und Konstruktionsregeln)', url: 'https://www.dinmedia.de/' }
        ]}
        formeln={[
          {
            formel: 'Na_2O_{äq} = \\%Na_2O + 0{,}658 \\cdot \\%K_2O \\le 0{,}60\\% \\quad (\\text{NA-Zement})',
            erklaerung: 'Äquivalenter Natriumoxidgehalt von Zementen nach DIN EN 197 / DAfStb-Alkali-Richtlinie. Niedrigalkalische Zemente (NA-Zemente) begrenzen das Risiko schädigender Alkali-Kieselsäure-Reaktionen (Betonschwellen Garmisch).',
            quelle: 'DAfStb Alkali-Richtlinie & DIN EN 197-1'
          },
          {
            formel: 'K_I = Y \\cdot \\sigma \\cdot \\sqrt{\\pi a} \\ge K_{Ic} \\quad [\\text{MPa}\\sqrt{\\text{m}}]',
            erklaerung: 'Bruchkriterium der linearen elastischen Bruchmechanik (LEBM): Ein instabiler Sprödbruch tritt ein, wenn die Spannungsintensität an der Rissspitze die kritische Bruchzähigkeit KIc des Werkstoffs überschreitet (z.B. Silver Bridge, Carolabrücke).',
            quelle: 'Griffith-Irwin Bruchmechanik'
          },
          {
            formel: '\\tau_f = c\' + (\\sigma - u) \\cdot \\tan\\varphi\' \\xrightarrow{u \\rightarrow \\sigma} \\tau_f \\approx 0',
            erklaerung: 'Mohr-Coulomb-Bruchkriterium unter Porenwasserüberdruck u (Scherverflüssigung / Static Liquefaction): Steigt der Porenwasserdruck bis zur Normalspannung an, fällt die effektive Scherfestigkeit auf null (Dammbruch Stava).',
            quelle: 'Terzaghi / Bodenmechanik'
          },
          {
            formel: '-\\text{NH}-\\text{CH}_2-\\text{NH}- + \\text{H}_2\\text{O} \\xrightarrow{\\text{H}^+, \\, T} -\\text{NH}_2 + \\text{HCHO} + \\text{H}_2\\text{N}-',
            erklaerung: 'Säurekatalysierte Hydrolyse von Harnstoff-Formaldehyd-Harzen (UF-Leimen) unter Einwirkung permanenter Feuchte und Kondenswasserbildung (Bad Reichenhall).',
            quelle: 'Bauchemie der Polymerklebstoffe'
          }
        ]}
      />
    </div>
  );
}
