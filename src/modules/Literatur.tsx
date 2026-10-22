import React, { useState, useMemo } from 'react';
import { 
  Book, 
  BookOpen, 
  Library, 
  FileText, 
  ExternalLink, 
  Search, 
  Tag, 
  Filter, 
  Sparkles, 
  GraduationCap, 
  Bookmark, 
  CheckCircle2, 
  Layers, 
  Globe 
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

interface LiteratureEntry {
  id: string;
  title: string;
  subtitle?: string;
  authors: string;
  yearOrEdition: string;
  publisher: string;
  category: 'allgemein' | 'beton' | 'stahl' | 'holz' | 'mauerwerk' | 'bauphysik' | 'nachhaltigkeit' | 'journale';
  categoryLabel: string;
  badge: 'Standardwerk' | 'Grundlagenlehrbuch' | 'Bemessungspraxis' | 'Forschung & Vertiefung' | 'Fachjournal';
  isbnOrDoi?: string;
  url?: string;
  description: string;
  coreTopics: string[];
}

const LITERATURE_DATABASE: LiteratureEntry[] = [
  // 1. Allgemeine Baustoffkunde & Werkstoffwissenschaften
  {
    id: 'wendehorst_baustoffkunde',
    title: 'Wendehorst Baustoffkunde',
    subtitle: 'Grundlagen, Baustoffe, Oberflächenschutz und Werkstoffprüfung',
    authors: 'Neroth, G.; Vollenschaar, D. (Hrsg.); begründet von R. Wendehorst',
    yearOrEdition: '27. Auflage 2011',
    publisher: 'Vieweg+Teubner, Wiesbaden',
    category: 'allgemein',
    categoryLabel: 'Allgemeine Baustoffkunde',
    badge: 'Standardwerk',
    isbnOrDoi: 'ISBN 978-3-8351-0225-5',
    url: 'https://link.springer.com/book/10.1007/978-3-8348-9919-4',
    description: 'Das unangefochtene Grundlagen- und Nachschlagewerk im deutschsprachigen Bauingenieur- und Architekturstudium. Behandelt systematisch chemisch-physikalische Grundlagen, Strukturprüfungen, Rohstoffe, Herstellungsverfahren sowie das Verformungs- und Alterungsverhalten aller gebräuchlichen Baumaterialien.',
    coreTopics: ['Bindemittel', 'Beton', 'Metalle', 'Kunststoffe', 'Holzwerkstoffe', 'Prüfverfahren', 'Dauerhaftigkeit']
  },
  {
    id: 'scholz_baustoffkenntnis',
    title: 'Baustoffkenntnis',
    subtitle: 'Eigenschaften, Herstellung, Normung und Einsatzgebiete im Hoch- und Tiefbau',
    authors: 'Scholz, W. (Begr.); fortgeführt von Knoblauch, H. u. a.',
    yearOrEdition: '18. Auflage 2016',
    publisher: 'Bundesanzeiger Verlag (Werner), Köln',
    category: 'allgemein',
    categoryLabel: 'Allgemeine Baustoffkunde',
    badge: 'Standardwerk',
    isbnOrDoi: 'ISBN 978-3-8462-0538-9',
    description: 'Enzyklopädisches Lehr- und Nachschlagewerk mit stark analytischem Fokus. Herausragende Detailtiefe bei der Gefügecharakterisierung mineralischer und metallischer Werkstoffe, normativen Prüfzeugnissen und bauaufsichtlichen Zulassungen.',
    coreTopics: ['Natursteine', 'Gesteinskörnungen', 'Kalk & Gips', 'Bitumen & Asphalt', 'Gefügekunde', 'Werkstoffprüfung']
  },
  {
    id: 'bendix_baustoffkunde',
    title: 'Physik im Bauwesen',
    subtitle: 'Ein einführendes Lehrbuch mit Beispielen',
    authors: 'Krawietz, R.; Heimke, W.',
    yearOrEdition: '2021',
    publisher: 'Carl Hanser Verlag, München',
    category: 'allgemein',
    categoryLabel: 'Allgemeine Baustoffkunde',
    badge: 'Grundlagenlehrbuch',
    isbnOrDoi: 'ISBN 978-3-446-46487-2',
    description: 'Einführendes Lehrbuch zu den physikalischen Grundlagen des Bauwesens mit Rechenbeispielen – geeignet als Brücke zwischen Physik-Grundlagen und Baustoffkunde/Bauphysik.',
    coreTopics: ['Mechanik', 'Wärme', 'Feuchte', 'Akustik', 'Rechenbeispiele']
  },
  {
    id: 'bargel_werkstoffkunde',
    title: 'Werkstoffkunde',
    subtitle: 'Metalle, Keramiken, Polymere und Verbundwerkstoffe',
    authors: 'Bargel, H. J., Schulze, G. (Hrsg.)',
    yearOrEdition: '12. Auflage 2018',
    publisher: 'Springer Vieweg, Berlin/Heidelberg',
    category: 'allgemein',
    categoryLabel: 'Allgemeine Baustoffkunde',
    badge: 'Forschung & Vertiefung',
    isbnOrDoi: 'ISBN 978-3-662-48628-3',
    url: 'https://link.springer.com/book/10.1007/978-3-662-48629-0',
    description: 'Das klassische werkstoffwissenschaftliche Standardwerk der Ingenieurwissenschaften. Liefert das atomare und kristallographische Tiefenverständnis (Gitterfehler, Versetzungsmechanismen, Phasendiagramme, Diffusionsvorgänge).',
    coreTopics: ['Kristallographie', 'Eisen-Kohlenstoff-Diagramm', 'Bruchmechanik', 'Gefügelehre', 'Wärmebehandlung']
  },

  // 2. Betontechnologie, Zement & Bindemittel
  {
    id: 'locher_zement',
    title: 'Zement – Grundlagen der Herstellung und Verwendung',
    subtitle: 'Chemische Reaktionen, Klinkermineralogie und Erhärtungskinetik',
    authors: 'Locher, F. W.',
    yearOrEdition: '2000',
    publisher: 'Verlag Bau+Technik, Düsseldorf',
    category: 'beton',
    categoryLabel: 'Beton, Zement & Bindemittel',
    badge: 'Standardwerk',
    isbnOrDoi: 'ISBN 978-3-7640-0400-2',
    description: 'Das Referenzwerk schlechthin zur Zementchemie im deutschsprachigen Raum. Erläutert detailliert den Brennprozess, die Entstehung der Klinkerphasen (Alit, Belit, Aluminat, Ferrit), thermodynamische Reaktionsgleichungen und Sulfatträgersteuerungen.',
    coreTopics: ['Klinkerphasen C3S/C2S', 'Hydratation', 'Erhärtungskinetik', 'Sulfatwiderstand', 'Zementchemie']
  },
  {
    id: 'stark_dauerhaftigkeit_beton',
    title: 'Dauerhaftigkeit von Beton',
    subtitle: 'Umweltbeanspruchungen, Schadensmechanismen und Schutzkonzepte',
    authors: 'Stark, J., Wicht, B.',
    yearOrEdition: '2. Auflage 2013',
    publisher: 'Springer Vieweg, Berlin/Heidelberg',
    category: 'beton',
    categoryLabel: 'Beton, Zement & Bindemittel',
    badge: 'Standardwerk',
    isbnOrDoi: 'ISBN 978-3-642-35277-5',
    url: 'https://link.springer.com/book/10.1007/978-3-642-35298-0',
    description: 'Tiefgründige wissenschaftliche Analyse aller schädigenden Transport- und Korrosionsprozesse im Zementstein und an der Bewehrung: Carbonatisierung, Chlorideindringung, Frost-Tausalz-Angriff, Alkali-Kieselsäure-Reaktion (AKR) und Säurekorrosion.',
    coreTopics: ['Karbonatisierung', 'Chloridkorrosion', 'AKR', 'Frost-Tau-Widerstand', 'Instandsetzung']
  },
  {
    id: 'beton_kalender',
    title: 'Beton-Kalender (Jahresreihen)',
    subtitle: 'Schwerpunkte: Dauerhaftigkeit, Hochleistungsbetone, Bemessung nach Eurocode 2',
    authors: 'Bergmeister, K., Fingerloos, F., Wörner, J.-D. (Hrsg.)',
    yearOrEdition: 'Jährlich neu erscheinende Ausgabe (Ernst & Sohn)',
    publisher: 'Wilhelm Ernst & Sohn, Berlin',
    category: 'beton',
    categoryLabel: 'Beton, Zement & Bindemittel',
    badge: 'Bemessungspraxis',
    url: 'https://www.ernst-und-sohn.de/beton-kalender',
    description: 'Das unverzichtbare zweibändige Handbuch für jeden im Massivbau tätigen Tragwerksplaner und Materialprüfer. Führt neueste Normentwicklungen, Zulassungen und Bemessungshilfsmittel für Stahlbeton, Spannbeton und Faserbeton praxisnah zusammen.',
    coreTopics: ['Eurocode 2', 'Expositionsklassen', 'Rissbreitenbeschränkung', 'UHPC', 'Fertigteile']
  },
  {
    id: 'vdz_zement_taschenbuch',
    title: 'Zement-Taschenbuch',
    subtitle: 'Praxiswissen Zement und Beton',
    authors: 'Verein Deutscher Zementwerke (VDZ e.V.)',
    yearOrEdition: 'Erscheinungsverlauf 1949–2008 (letzte Ausgabe 2008; manuell prüfen)',
    publisher: 'Verlag Bau+Technik, Düsseldorf',
    category: 'beton',
    categoryLabel: 'Beton, Zement & Bindemittel',
    badge: 'Standardwerk',
    description: 'Das kompakte Taschenbuch der deutschen Zementindustrie für Ingenieurbüro und Baustelle. Enthält Tabellen zu Zementarten (CEM I bis CEM VI), Klinkereffizienz, Frischbetoneigenschaften, Sieblinienberechnungen und Nachbehandlungsmethoden.',
    coreTopics: ['CEM-Klassifikation', 'Wasserzementwert', 'Sieblinien', 'Konsistenzprüfung', 'Nachbehandlung']
  },

  // 3. Metallbau, Stahl & Korrosionsschutz
  {
    id: 'stahlbau_kalender',
    title: 'Stahlbau-Kalender (Jahresreihen)',
    subtitle: 'Schwerpunkte: Eurocode 3, Werkstoffauswahl, Schweißverbindungen und Korrosionsschutz',
    authors: 'Kuhlmann, U. (Hrsg.)',
    yearOrEdition: 'Jährliche Ausgabe (Ernst & Sohn)',
    publisher: 'Wilhelm Ernst & Sohn, Berlin',
    category: 'stahl',
    categoryLabel: 'Stahl, Metalle & Korrosionsschutz',
    badge: 'Bemessungspraxis',
    url: 'https://www.ernst-und-sohn.de/stahlbau-kalender',
    description: 'Das zentrale Standardnachschlagewerk für den Stahlbau. Behandelt neben Stabilitätstheorie und Verbindungen die metallurgischen Eigenschaften hochfester Stähle, Schweißzusatzwerkstoffe, Ermüdungsfestigkeiten und Schichtdicken nach DIN EN ISO 12944.',
    coreTopics: ['DIN EN 1993', 'DIN EN 10025', 'Wetterfeste Stähle', 'Feuerverzinken', 'Ermüdung']
  },
  {
    id: 'iser_merkblaetter',
    title: 'Dokumentationen & Merkblätter Nichtrostender Stahl',
    subtitle: 'Korrosionsverhalten, Werkstoffwahl und Verarbeitung von Edelstahl Rostfrei',
    authors: 'Informationsstelle Edelstahl Rostfrei (ISER)',
    yearOrEdition: 'Aktuelle Fachpublikationen (ISER Düsseldorf)',
    publisher: 'ISER, Düsseldorf',
    category: 'stahl',
    categoryLabel: 'Stahl, Metalle & Korrosionsschutz',
    badge: 'Standardwerk',
    url: 'https://www.edelstahl-rostfrei.de/',
    description: 'Umfassende wissenschaftlich fundierte Richtlinien und Merkblätter zur Vermeidung von Bimetall- und Lochfraßkorrosion, Auswahl der Korrosionswiderstandsklassen (CRC I bis V nach DIN EN 1993-1-4) und sachgerechten Oberflächenpassivierung.',
    coreTopics: ['Edelstahl A2 / A4', 'CRC-Klassen', 'Lochfraßindex PREN', 'Spannungsrisskorrosion', 'Fließregel']
  },

  // 4. Holzbau & Nachwachsende Baustoffe
  {
    id: 'neuhaus_holzbau',
    title: 'Ingenieurholzbau – Grundlagen, Bemessung nach Eurocode 5',
    subtitle: 'Holzwerkstoffe, Holzschutz, Verbindungen und Tragsysteme',
    authors: 'Neuhaus, H.',
    yearOrEdition: 'Neuauflage 2026 (Vorauflage 4. Aufl. 2017)',
    publisher: 'Springer Vieweg, Wiesbaden',
    category: 'holz',
    categoryLabel: 'Holzbau & Biogene Werkstoffe',
    badge: 'Standardwerk',
    isbnOrDoi: 'ISBN 978-3-658-44966-7',
    description: 'Umfassendes Lehrbuch über das anisotrope Trag- und Verformungsverhalten von Vollholz, Brettschichtholz (BSH) und Brettsperrholz (CLT). Behandelt Feuchtequellung, Kriechverformungen (k_def), Modifikationsbeiwerte (k_mod) und baulichen Holzschutz nach DIN 68800.',
    coreTopics: ['Anisotropie', 'Eurocode 5 (DIN EN 1995)', 'Holzschutz DIN 68800', 'Brettsperrholz CLT', 'Kriechen']
  },
  {
    id: 'infodienst_holz_schriften',
    title: 'Informationsdienst Holz – Schriftenreihe',
    subtitle: 'Konstruktionsdetails, Brand- und Schallschutz, Hybride Bauweisen',
    authors: 'Informationsverein Holz e. V. / Holzbau Deutschland Institut',
    yearOrEdition: 'Umfangreiche Fachschriftenreihe (Laufend aktualisiert)',
    publisher: 'Informationsdienst Holz, Berlin',
    category: 'holz',
    categoryLabel: 'Holzbau & Biogene Werkstoffe',
    badge: 'Bemessungspraxis',
    url: 'https://informationsdienst-holz.de/',
    description: 'Die bedeutendste deutschsprachige Schriftenreihe für Architekten und Holzbauingenieure. Bietet geprüfte Schall- und Brandschutzaufbauten (REI 30–90), Holz-Beton-Verbunddecken und mehrgeschossige Holzbau-Details.',
    coreTopics: ['Brandschutz im Holzbau', 'Schallschutz', 'Mehrgeschossiger Holzbau', 'Holz-Beton-Verbund']
  },

  // 5. Mauerwerksbau, Mörtel & mineralische Bindemittel
  {
    id: 'mauerwerk_kalender',
    title: 'Mauerwerk-Kalender (Jahresreihen)',
    subtitle: 'Schwerpunkte: Eurocode 6, Steine, Mörtel, Befestigungstechnik und Bauwerkserhaltung',
    authors: 'Jäger, W. (Hrsg.)',
    yearOrEdition: 'Jährliche Ausgabe (Ernst & Sohn)',
    publisher: 'Wilhelm Ernst & Sohn, Berlin',
    category: 'mauerwerk',
    categoryLabel: 'Mauerwerk, Steine & Mörtel',
    badge: 'Bemessungspraxis',
    url: 'https://www.ernst-und-sohn.de/mauerwerk-kalender',
    description: 'Das maßgebliche Nachschlagewerk für den Mauerwerksbau. Behandelt Mauerziegel, Kalksandsteine, Porenbeton und Leichtbetonsteine sowie Dünnbett-, Normal- und Kalkmörtel inklusive seismischer Nachweise nach DIN EN 1996.',
    coreTopics: ['Eurocode 6', 'Mauerziegel', 'Kalksandstein', 'Porenbeton', 'Dünnbettmörtel', 'Schubfestigkeit']
  },

  // 6. Bauphysik, Energieeffizienz & Bauwerkserhaltung
  {
    id: 'wendehorst_bauphysik',
    title: 'Lohmeyer Praktische Bauphysik',
    subtitle: 'Eine Einführung mit Berechnungsbeispielen',
    authors: 'Willems, W. M. u. a.',
    yearOrEdition: 'Auflage 2024',
    publisher: 'Springer Vieweg, Wiesbaden',
    category: 'bauphysik',
    categoryLabel: 'Bauphysik & Energieeffizienz',
    badge: 'Standardwerk',
    isbnOrDoi: 'ISBN 978-3-658-42603-3',
    url: 'https://link.springer.com/book/10.1007/978-3-658-42604-0',
    description: 'Etabliertes Lehrbuch der Bauphysik mit Berechnungsbeispielen zu Wärme-, Feuchte-, Schall- und Brandschutz.',
    coreTopics: ['U-Wert-Berechnung', 'DIN 4108', 'Glaser-Diagramm', 'GEG', 'Schallschutz DIN 4109', 'Wärmebrücken']
  },

  // 7. Nachhaltigkeit, Ökobilanzierung & Zirkuläres Bauen
  {
    id: 'hillebrandt_kreislauf',
    title: 'Atlas Recycling – Gebäude als Materialressource',
    subtitle: 'Manuale zur zirkulären Architektur, Fügetechnik und Demontierbarkeit',
    authors: 'Hillebrandt, A., Riegler-Floors, P., Rosen, A., Seggewies, J.-K.',
    yearOrEdition: '2018',
    publisher: 'Edition Detail, München',
    category: 'nachhaltigkeit',
    categoryLabel: 'Nachhaltigkeit & Zirkuläres Bauen',
    badge: 'Standardwerk',
    isbnOrDoi: 'ISBN 978-3-95553-415-8',
    description: 'Das wegweisende Fachbuch zum kreislaufgerechten Konstruieren. Liefert konkrete Konstruktionsdetails für sortenrein trennbare, trockene Fügungen, Materialpässe, Urban-Mining-Strategien und quantitative Recyclingpotenziale im Hochbau.',
    coreTopics: ['Urban Mining', 'Design for Deconstruction', 'Sortenreinheit', 'Materialpass', 'Graue Energie']
  },
  {
    id: 'essig_oekologische_baustoffkunde',
    title: 'Zertifizierungssysteme für Gebäude',
    subtitle: 'Nachhaltigkeit bewerten – internationaler Systemvergleich – Zertifizierung und Ökonomie',
    authors: 'Ebert, T.; Eßig, N.; Hauser, G.',
    yearOrEdition: '2010',
    publisher: 'Edition Detail, München',
    category: 'nachhaltigkeit',
    categoryLabel: 'Nachhaltigkeit & Zirkuläres Bauen',
    badge: 'Standardwerk',
    isbnOrDoi: 'ISBN 978-3-920034-46-1',
    description: 'Vergleich internationaler Zertifizierungssysteme für nachhaltige Gebäude (u. a. DGNB, BNB, LEED, BREEAM) mit Bewertungsmethodik und ökonomischen Aspekten; Stand 2010, aktuelle Systemversionen gesondert prüfen.',
    coreTopics: ['DGNB', 'BNB', 'LEED', 'BREEAM', 'Systemvergleich']
  },

  // 8. Glasbau, Fenstertechnik & Fassaden (Neu)
  {
    id: 'feldmann_kasper_glasbau',
    title: 'Glas für tragende Bauteile',
    authors: 'Feldmann, M., Kasper, R., Langosch, K.',
    yearOrEdition: '2012',
    publisher: 'Werner Verlag, Köln',
    category: 'allgemein',
    categoryLabel: 'Glas- & Fenstertechnik',
    badge: 'Bemessungspraxis',
    isbnOrDoi: 'ISBN 978-3-8041-1626-9',
    description: 'Das massgebliche Praxishandbuch für konstruktiven Glasbau in Deutschland. Erläutert das Teilsicherheitskonzept der DIN 18008, Bemessungsregeln für Floatglas, ESG und VSG, Pendelschlagprüfungen nach DIN EN 12600 sowie Klimalasten bei Isoliergläsern.',
    coreTopics: ['DIN 18008', 'ESG / VSG / TVG', 'Pendelschlagprüfung', 'Klimalasten', 'Absturzsicherung']
  },
  {
    id: 'wurm_glass_structures',
    title: 'Glass Structures – Design and Construction of Self-Supporting Skins',
    subtitle: 'Konstruktive Glasarchitektur, Punkthalterungen und Schalenstrukturen',
    authors: 'Wurm, J.',
    yearOrEdition: '2007',
    publisher: 'Birkhäuser, Basel',
    category: 'allgemein',
    categoryLabel: 'Glas- & Fenstertechnik',
    badge: 'Standardwerk',
    isbnOrDoi: 'ISBN 978-3-7643-7608-6',
    description: 'Internationales Grundlagenwerk zur Konstruktionslehre von Ganzglaskonstruktionen, Punkthaltern, Glasrippen und strukturell verklebten Structural-Glazing-Fassaden (SSGS).',
    coreTopics: ['Structural Glazing', 'Glasfassaden', 'Schalenstrukturen', 'Punkthalterungen']
  },

  // 9. Straßen- & Verkehrswegebau (Neu)
  {
    id: 'wendehorst_strassenbau',
    title: 'Straßenbau, Straßenbautechnik',
    authors: 'Velske, S.; Mentlein, H.; Eymann, P.',
    yearOrEdition: '2009',
    publisher: 'Werner Verlag, Köln',
    category: 'allgemein',
    categoryLabel: 'Verkehrswegebau & Infrastruktur',
    badge: 'Standardwerk',
    isbnOrDoi: 'ISBN 978-3-8041-3879-7',
    description: 'Lehrbuch zu Straßenbau und Straßenbautechnik (Oberbau, Bauweisen, Baustoffe); Stand 2009 – für die Dimensionierung ist die aktuelle Fassung der RStO maßgebend.',
    coreTopics: ['Oberbau', 'Asphaltbauweisen', 'Betonbauweisen', 'Baustoffe', 'RStO']
  },

  // 10. Fachzeitschriften & Internationale Journale
  {
    id: 'journal_beton_stahlbetonbau',
    title: 'Beton- und Stahlbetonbau',
    subtitle: 'Internationale Fachzeitschrift für Massivbau, Werkstoffe und Instandsetzung',
    authors: 'Wissenschaftlicher Beirat (Herausgeber)',
    yearOrEdition: 'Monatlich erscheinende Zeitschrift (Ernst & Sohn)',
    publisher: 'Wilhelm Ernst & Sohn, Berlin',
    category: 'journale',
    categoryLabel: 'Fachzeitschriften & Journale',
    badge: 'Fachjournal',
    isbnOrDoi: 'ISSN 0005-9900',
    url: 'https://onlinelibrary.wiley.com/journal/14371006',
    description: 'Führendes deutschsprachiges Fachorgan für den gesamten Betonbau. Veröffentlicht peer-reviewte wissenschaftliche Artikel zu Carbonbeton, rezyklierten Gesteinskörnungen, CO₂-reduzierten Zementen und monumentalen Brückenprojekten.',
    coreTopics: ['Peer-Reviewed', 'Massivbauforschung', 'CO2-armer Beton', 'Zustandsanalyse', 'Monitoring']
  },
  {
    id: 'journal_nbau',
    title: 'nbau. Nachhaltig Bauen',
    subtitle: 'Fachzeitschrift für zirkuläres Planen, Ökobilanzen und Dekarbonisierung',
    authors: 'Redaktion & Expertenbeirat nbau',
    yearOrEdition: 'Zweimonatlich (Ernst & Sohn / Wiley)',
    publisher: 'Ernst & Sohn / Wiley, Berlin',
    category: 'journale',
    categoryLabel: 'Fachzeitschriften & Journale',
    badge: 'Fachjournal',
    url: 'https://www.nbau.org/',
    description: 'Zukunftsweisende Fachzeitschrift für den Wandel zur Kreislaufwirtschaft im Bausektor. Diskutiert Re-Use-Projekte, ESG-Kriterien, Gebäuderessourcenpässe und politische Normenrahmen.',
    coreTopics: ['Zirkularität', 'ESG-Reporting', 'Sekundärrohstoffe', 'Taxonomie', 'Klimaneutralität']
  },
  {
    id: 'journal_ccr',
    title: 'Cement and Concrete Research',
    subtitle: 'The Premier International Journal on Cementitious Materials',
    authors: 'Scrivener, K. et al. (Editors-in-Chief)',
    yearOrEdition: 'Monatlich peer-reviewed (Elsevier)',
    publisher: 'Elsevier Science, Oxford',
    category: 'journale',
    categoryLabel: 'Fachzeitschriften & Journale',
    badge: 'Fachjournal',
    isbnOrDoi: 'ISSN 0008-8846',
    url: 'https://www.sciencedirect.com/journal/cement-and-concrete-research',
    description: 'Das international einflussreichste wissenschaftliche Journal der Zement- und Betonforschung (Impact Factor > 10). Schwerpunkte: Klinkerreduzierte Bindemittel (LC3-Zemente), atomare Simulation von C-S-H-Phasen und chemomechanische Schädigung.',
    coreTopics: ['Global Impact', 'LC3-Zemente', 'C-S-H-Nanostruktur', 'Alkali-Activated Materials', 'Microscopy']
  },
  {
    id: 'journal_materials_and_structures',
    title: 'Materials and Structures (RILEM)',
    subtitle: 'International Union of Laboratories and Experts in Construction Materials',
    authors: 'RILEM International',
    yearOrEdition: 'Erscheint kontinuierlich (Springer Nature)',
    publisher: 'Springer, Dordrecht',
    category: 'journale',
    categoryLabel: 'Fachzeitschriften & Journale',
    badge: 'Fachjournal',
    isbnOrDoi: 'ISSN 1359-5997',
    url: 'https://link.springer.com/journal/11527',
    description: 'Offizielles Journal des internationalen Baustoffprüfverbandes RILEM. Setzt globale Maßstäbe bei standardisierten Prüfverfahren, rheologischen Messungen und Zerstörungsfreier Prüfung (ZfP) an Bauwerken.',
    coreTopics: ['RILEM Recommendations', 'ZfP-Prüfmethoden', 'Rheologie', 'Langzeitbeständigkeit']
  }
];

export default function Literatur() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('alle');

  const categories = [
    { key: 'alle', label: 'Alle Werke' },
    { key: 'allgemein', label: 'Allg. Baustoffkunde' },
    { key: 'beton', label: 'Beton & Zement' },
    { key: 'stahl', label: 'Stahl & Metalle' },
    { key: 'holz', label: 'Holz & Biogen' },
    { key: 'mauerwerk', label: 'Mauerwerk' },
    { key: 'bauphysik', label: 'Bauphysik' },
    { key: 'nachhaltigkeit', label: 'Nachhaltigkeit & LCA' },
    { key: 'journale', label: 'Fachzeitschriften' }
  ];

  const filteredLiterature = useMemo(() => {
    return LITERATURE_DATABASE.filter(item => {
      const matchesCategory = selectedCategory === 'alle' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.authors.toLowerCase().includes(q) ||
        item.publisher.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.coreTopics.some(t => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="flex flex-col gap-8" id="literatur-standardwerke-modul">
      {/* Header Container */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-home-grau/20 pb-4">
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Library className="text-shiraz" size={24} /> Literatur & Standardwerke der Baustofflehre
            </h2>
            <p className="text-xs text-home-grau mt-1">
              Kuratierte wissenschaftliche Fachbibliothek, Standardlehrbücher, Normenkommentare und internationale Peer-Reviewed Journale
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-shiraz/10 text-shiraz rounded-full text-xs font-bold border border-shiraz/20">
              {filteredLiterature.length} von {LITERATURE_DATABASE.length} Werken
            </span>
          </div>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
          <p>
            Fundierte Ingenieurentscheidungen und wissenschaftliche Studienleistungen basieren auf verifizierten Quellen. 
            Diese kuratierte Fachliteraturübersicht deckt die fundamentalen Lehr- und Nachschlagewerke der 
            deutschsprachigen Baustoffkunde ab – vom universitären Grundlagenklassiker <em>Wendehorst</em> über 
            monografische Zementchemie bis hin zu internationalen High-Impact-Fachjournalen für Masterstudium und Promotion.
          </p>
        </div>

        {/* Suchfeld und Kategoriefilter */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-home-grau" size={18} />
            <input 
              type="text"
              placeholder="Suchen Sie nach Titel, Autor (z. B. Vollenschaar, Locher), Verlag, Stichwort (z. B. C-S-H, Eurocode, EPD)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-off-white border border-home-grau/30 rounded-xl text-sm text-text-main placeholder-home-grau focus:outline-none focus:ring-2 focus:ring-shiraz/40 focus:border-shiraz transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-home-grau hover:text-text-main font-semibold px-2 py-0.5 rounded"
              >
                Zurücksetzen
              </button>
            )}
          </div>

          {/* Kategorien-Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  selectedCategory === cat.key
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ergebnis-Raster */}
      {filteredLiterature.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-home-grau/30 text-center">
          <BookOpen className="text-home-grau mx-auto mb-3 opacity-50" size={40} />
          <h3 className="text-base font-bold text-text-main">Keine Literaturtreffer gefunden</h3>
          <p className="text-sm text-home-grau mt-1">
            Versuchen Sie einen allgemeineren Suchbegriff oder wählen Sie &quot;Alle Werke&quot; als Kategorie.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLiterature.map((item) => (
            <div 
              key={item.id} 
              className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 hover:border-shiraz/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header Tag / Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-off-white border border-home-grau/25 text-text-main/80">
                    {item.categoryLabel}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    item.badge === 'Standardwerk' 
                      ? 'bg-shiraz/10 text-shiraz border border-shiraz/30' 
                      : item.badge === 'Bemessungspraxis' 
                        ? 'bg-blue-50 text-blue-800 border border-blue-200' 
                        : item.badge === 'Fachjournal'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-800 border border-slate-200'
                  }`}>
                    {item.badge}
                  </span>
                </div>

                {/* Titel & Autoren */}
                <h3 className="text-base font-bold text-text-main leading-snug">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-xs text-text-main/70 mt-0.5 leading-snug">
                    {item.subtitle}
                  </p>
                )}

                <div className="mt-2.5 text-xs text-shiraz font-semibold flex items-center gap-1.5">
                  <GraduationCap size={14} className="shrink-0" />
                  <span>{item.authors}</span>
                </div>

                <div className="text-[11px] text-home-grau mt-1">
                  {item.yearOrEdition} • {item.publisher}
                </div>

                {/* Beschreibung */}
                <p className="text-xs text-text-main/80 mt-3 leading-relaxed">
                  {item.description}
                </p>

                {/* Themen-Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-home-grau/15">
                  {item.coreTopics.map((topic, tIdx) => (
                    <span 
                      key={tIdx} 
                      className="text-[10px] px-2 py-0.5 bg-off-white text-text-main/70 rounded-md border border-home-grau/20"
                    >
                      #{topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fußleiste mit ISBN und externem Link */}
              <div className="mt-4 pt-3 border-t border-home-grau/20 flex items-center justify-between text-xs">
                <span className="text-[11px] text-home-grau font-mono">
                  {item.isbnOrDoi || 'Peer-Reviewed'}
                </span>
                {item.url && (
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-shiraz hover:underline font-bold flex items-center gap-1"
                  >
                    Verlag / Quelle <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Zitier- & Recherchehinweise für wissenschaftliche Arbeiten */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
        <h3 className="text-base font-bold text-text-main flex items-center gap-2">
          <Sparkles className="text-shiraz" size={18} />
          Leitfaden zum wissenschaftlichen Zitieren in Bauingenieur- und Architekturarbeiten
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-text-main/80">
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-shiraz" /> 1. Primärquellen & DIN-Normen
            </h4>
            <p className="leading-relaxed">
              Zitieren Sie bautechnische Kenndaten (z. B. Festigkeitsklassen, Teilsicherheitsbeiwerte) bevorzugt direkt aus den aktuellen Grundnormen (Eurocodes 0 bis 9) oder den jeweiligen Produktnormen über das Portal <em>DIN Media</em>.
            </p>
          </div>

          <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Layers size={14} className="text-shiraz" /> 2. EPDs & Ökobilanzdaten
            </h4>
            <p className="leading-relaxed">
              Für Lebenszyklusanalysen und Ökobilanzierungsnachweise (QNG, BNB, DGNB) sind Datensätze zwingend unter Angabe der Deklarationsnummer und des Gültigkeitszeitraums aus der amtlichen Datenbank <em>ÖKOBAUDAT</em> oder <em>WECOBIS</em> zu referenzieren.
            </p>
          </div>

          <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <BookOpen size={14} className="text-shiraz" /> 3. Zitierstandard nach DIN ISO 690
            </h4>
            <p className="leading-relaxed">
              Verwenden Sie für Abschlussarbeiten ein einheitliches Zitierschema (Autor-Jahr oder numerischer Harvard-Stil) mit Angabe von Autor, Erscheinungsjahr, Buchtitel, Auflage, Verlag und Seitenzahl bei konkreten Zahlenwerten.
            </p>
          </div>
        </div>
      </div>

      {/* Standardisierter Modul-Footer */}
      <ModuleFooter
        wikipedia={[
          { title: 'Fachliteratur', url: 'https://de.wikipedia.org/wiki/Fachliteratur' },
          { title: 'Baustoff', url: 'https://de.wikipedia.org/wiki/Baustoff' },
          { title: 'Wendehorst Bautechnische Zahlentafeln', url: 'https://de.wikipedia.org/wiki/Wendehorst_Bautechnische_Zahlentafeln' }
        ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Bergmeister, K.; Fingerloos, F.; Wörner, J.-D. (Hrsg.): Beton-Kalender (Ernst & Sohn, aktuelle Jahresausgaben)',
          'Locher, F. W.: Zement - Grundlagen der Herstellung und Verwendung (Verlag Bau+Technik)',
          'Verein Deutscher Zementwerke (VDZ): Zement-Taschenbuch (52. Ausgabe, Verlag Bau+Technik)',
          'Kuhlmann, U. (Hrsg.): Stahlbau-Kalender (Wilhelm Ernst & Sohn, Berlin)',
          'Hillebrandt, A. et al.: Atlas Recycling – Gebäude als Materialressource (Edition Detail)'
        ]}
        regelwerke={[
          { title: 'DIN EN ISO 690: Richtlinien für Titelangaben und Zitate von Informationsressourcen' },
          { title: 'DIN 1505-2: Zitierregeln für wissenschaftliche Veröffentlichungen' },
          { title: 'DIN EN 1990: Eurocode: Grundlagen der Tragwerksplanung (Statistische Auswertung von Werkstoffkennwerten)' }
        ]}
        weblinks={[
          { title: 'DIN Media (ehemals Beuth Verlag) – Zentrales Normenportal' },
          { title: 'SpringerLink – Bautechnische Fachbücher & Journale', url: 'https://link.springer.com/' },
          { title: 'Wiley Online Library – Beton- und Stahlbetonbau', url: 'https://onlinelibrary.wiley.com/' },
          { title: 'ScienceDirect – Cement and Concrete Research', url: 'https://www.sciencedirect.com/journal/cement-and-concrete-research' },
          { title: 'ÖKOBAUDAT – BMWSB Ökobilanzierungsdatenbank', url: 'https://www.oekobaudat.de/' },
          { title: 'WECOBIS – Ökologisches Baustoffinformationssystem', url: 'https://www.wecobis.de/' },
          { title: 'ift Rosenheim – Fachpublikationen, Richtlinien & Forschungsberichte', url: 'https://www.ift-rosenheim.de/' },
          { title: 'FGSV Verlag – Regelwerke & Tagungsbände für Straßen- und Verkehrswesen', url: 'https://www.fgsv-verlag.de/' }
        ]}
        formeln={[
          {
            formel: 'X_d = \\eta \\cdot \\frac{X_k}{\\gamma_M}',
            erklaerung: 'Allgemeine Bemessungsgleichung nach Eurocode (DIN EN 1990): Überführung tabellierter charakteristischer Materialkennwerte X_k (5%-Fraktilwerte aus der bautechnischen Fachliteratur) in rechnerische Bemessungswerte X_d mittels Teilsicherheitsbeiwert γ_M und Umrechnungsbeiwert η.',
            quelle: 'DIN EN 1990'
          },
          {
            formel: 'X_k = \\bar{x} \\cdot (1 - k_n \\cdot v_x)',
            erklaerung: 'Statistische Ermittlung charakteristischer Werkstoffkennwerte nach DIN EN 1990 Anhang D: Mittelwert bar{x} mit Variationskoeffizient v_x und statistischem Fraktilbeiwert k_n bei unbekannter Varianz.',
            quelle: 'DIN EN 1990 Anhang D'
          },
          {
            formel: 'f_{ck} = f_{cm} - 1{,}64 \\cdot s \\quad [\\text{N/mm}^2]',
            erklaerung: 'Berechnung der charakteristischen Zylinderdruckfestigkeit von Beton (f_ck als 5%-Fraktil) aus dem Mittelwert der Druckfestigkeit (f_cm) und der Standardabweichung s der Prüfserie.',
            quelle: 'DIN EN 206 / DIN EN 1992-1-1'
          }
        ]}
      />
    </div>
  );
}
