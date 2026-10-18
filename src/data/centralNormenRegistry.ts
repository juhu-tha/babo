export interface NormRecord {
  id: string;
  code: string;
  title: string;
  category: 'beton' | 'mauerwerk' | 'holz' | 'metall' | 'bauphysik' | 'geotechnik' | 'ausbau' | 'nachhaltigkeit' | 'qualitaet';
  ausgabeStand: string; // e.g. "2023-11"
  status: 'gueltig' | 'in_ueberarbeitung' | 'ersetzt';
  ersetztDurch?: string;
  url: string;
  beschreibung: string;
  relevanteModule: string[];
}

export const CENTRAL_NORMEN_REGISTRY: Record<string, NormRecord> = {
  // -------------------------------------------------------------
  // BETON, ZEMENT, BINDEMITTEL & MÖRTEL
  // -------------------------------------------------------------
  'DIN_EN_206': {
    id: 'DIN_EN_206',
    code: 'DIN EN 206:2021-06 / DIN 1045-2:2023-08',
    title: 'Beton - Festlegung, Eigenschaften, Herstellung und Konformität',
    category: 'beton',
    ausgabeStand: '2023-08',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-1045-2/367623412',
    beschreibung: 'Zentrales Regelwerk für Expositionsklassen (XC, XD, XS, XF, XA, XM), w/z-Werte, Mindestdruckfestigkeiten und Konformitätskriterien im DACH-Raum.',
    relevanteModule: ['beton_a_z', 'mischungsberechnung', 'dauerhaftigkeit', 'labor', 'sonderbetone']
  },
  'DIN_1045_3': {
    id: 'DIN_1045_3',
    code: 'DIN 1045-3:2023-08',
    title: 'Tragwerke aus Beton, Stahlbeton und Spannbeton - Teil 3: Bauausführung',
    category: 'beton',
    ausgabeStand: '2023-08',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-1045-3/367623445',
    beschreibung: 'Regelt Schalung, Bewehrungsverlegung, Betoneinbau, Verdichtung und die maßgebenden Nachbehandlungsfristen.',
    relevanteModule: ['nachbehandlung', 'betonpraxis', 'herstellung_einbau']
  },
  'DIN_EN_13670': {
    id: 'DIN_EN_13670',
    code: 'DIN EN 13670:2010-06',
    title: 'Ausführung von Tragwerken aus Beton',
    category: 'beton',
    ausgabeStand: '2010-06',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-en-13670/125634120',
    beschreibung: 'Die europäische Ausführungsnorm regelt Schalen, Bewehren, den Einbau des Frischbetons sowie die vier Nachbehandlungsklassen (N1 bis N4) zum Schutz vor frühzeitigem Austrocknen des Betons.',
    relevanteModule: ['nachbehandlung', 'betonpraxis', 'herstellung_einbau']
  },
  'DBV_NACHBEHANDLUNG': {
    id: 'DBV_NACHBEHANDLUNG',
    code: 'DBV-Merkblatt Nachbehandlung:2020',
    title: 'Nachbehandlung von Beton (Deutscher Beton- & Bautechnik-Verein)',
    category: 'beton',
    ausgabeStand: '2020-04',
    status: 'gueltig',
    url: 'https://www.betonverein.de/',
    beschreibung: 'Praxisleitfaden zur herstellseitigen und baustellenseitigen Bestimmung der notwendigen Nachbehandlungsfristen in Abhängigkeit von Witterung und Zementhydratation.',
    relevanteModule: ['nachbehandlung', 'betonpraxis']
  },
  'DIN_EN_197_1': {
    id: 'DIN_EN_197_1',
    code: 'DIN EN 197-1:2019-04 & DIN EN 197-5:2021-05',
    title: 'Zement - Zusammensetzung, Anforderungen und Konformitätskriterien',
    category: 'beton',
    ausgabeStand: '2021-05',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-en-197-5/337198524',
    beschreibung: 'Klassifiziert CEM I bis CEM VI sowie moderne klinkerreduzierte CEM II/C-M Kompositzemente zur CO2-Minderung.',
    relevanteModule: ['zementchemie', 'bindemittel', 'hydratation', 'lca']
  },
  'DIN_EN_450_1': {
    id: 'DIN_EN_450_1',
    code: 'DIN EN 450-1:2012-10',
    title: 'Flugasche für Beton - Definition, Anforderungen und Qualitätskontrolle',
    category: 'beton',
    ausgabeStand: '2012-10',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-en-450-1/156743120',
    beschreibung: 'Regelt die Zulassung und Qualität von Steinkohlenflugasche als puzzolanischer Zusatzstoff zur Anrechnung auf den Mindestzementgehalt (k-Wert-Ansatz).',
    relevanteModule: ['bindemittel', 'mischungsberechnung', 'sonderbetone']
  },
  'DIN_EN_12620': {
    id: 'DIN_EN_12620',
    code: 'DIN EN 12620:2008-07',
    title: 'Gesteinskörnungen für Beton',
    category: 'beton',
    ausgabeStand: '2008-07',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-en-12620/109843210',
    beschreibung: 'Anforderungen an Sande, Kiese und Splitte bezüglich Kornform, Sieblinie, Frostbeständigkeit und schädlicher Bestandteile.',
    relevanteModule: ['mischungsberechnung', 'gesteinskoernung', 'labor']
  },
  'DIN_EN_934_2': {
    id: 'DIN_EN_934_2',
    code: 'DIN EN 934-2:2012-11',
    title: 'Betonzusatzmittel - Definitionen, Anforderungen und Konformität',
    category: 'beton',
    ausgabeStand: '2012-11',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-en-934-2/157832100',
    beschreibung: 'Regelt Zusatzmittel wie Fließmittel (FM), Luftporenbildner (LP), Verzögerer (VZ) und Beschleuniger (BE).',
    relevanteModule: ['mischungsberechnung', 'frischbeton', 'betonpraxis']
  },
  'DIN_EN_1992_1_1': {
    id: 'DIN_EN_1992_1_1',
    code: 'DIN EN 1992-1-1 (Eurocode 2)',
    title: 'Bemessung und Konstruktion von Stahlbeton- und Spannbetontragwerken',
    category: 'beton',
    ausgabeStand: '2023-12',
    status: 'in_ueberarbeitung',
    url: 'https://www.dinmedia.de/de/norm/din-en-1992-1-1/361543210',
    beschreibung: 'Tragwerksnorm für Biegung, Querkraft, Durchstanzen und Rissbreitennachweis. Aktuell Übergang zu Eurocode 2 (2. Generation).',
    relevanteModule: ['biegebemessung', 'querkraft', 'durchstanzen', 'rissbreite', 'verankerungslaenge']
  },
  'DIN_EN_459_1': {
    id: 'DIN_EN_459_1',
    code: 'DIN EN 459-1:2015-07',
    title: 'Baukalk - Teil 1: Definitionen, Anforderungen und Konformitätskriterien',
    category: 'ausbau',
    ausgabeStand: '2015-07',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-en-459-1/231268305',
    beschreibung: 'Klassifizierung von Luftkalken (CL) und hydraulischen Kalken (NHL, HL) für historische und denkmalgerechte Mörtel.',
    relevanteModule: ['kalk', 'putze_moertel', 'denkmalpflege']
  },

  // -------------------------------------------------------------
  // MAUERWERKSBAU
  // -------------------------------------------------------------
  'DIN_EN_1996_1_1': {
    id: 'DIN_EN_1996_1_1',
    code: 'DIN EN 1996-1-1:2020-03 (Eurocode 6)',
    title: 'Bemessung und Konstruktion von Mauerwerksbauten',
    category: 'mauerwerk',
    ausgabeStand: '2020-03',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-en-1996-1-1/319451230',
    beschreibung: 'Regelt die Standsicherheit, Knicksicherheit, und konstruktive Ausbildung von tragendem und nichttragendem Mauerwerk.',
    relevanteModule: ['mauerwerk', 'bp_mauerwerk', 'bestand']
  },
  'DIN_EN_771': {
    id: 'DIN_EN_771',
    code: 'DIN EN 771-1 bis -6:2015-11',
    title: 'Festlegungen für Mauersteine (Mauerziegel, Kalksandstein, Porenbeton)',
    category: 'mauerwerk',
    ausgabeStand: '2015-11',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-en-771-1/236712390',
    beschreibung: 'Europaweit harmonisierte Qualitätsanforderungen für Mauerziegel, Kalksandsteine, Betonwerksteine und Porenbetonsteine.',
    relevanteModule: ['mauerwerk', 'kalk', 'bp_mauerwerk']
  },
  'DIN_EN_998': {
    id: 'DIN_EN_998',
    code: 'DIN EN 998-1 / -2:2017-02',
    title: 'Festlegungen für Mörtel im Mauerwerksbau - Putzmörtel & Mauermörtel',
    category: 'mauerwerk',
    ausgabeStand: '2017-02',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-en-998-2/259834120',
    beschreibung: 'Spezifikationen für Mauermörtel (Normal-, Dünnbett-, Leichtmörtel) und Putzmörtel zur Einhaltung der Verbundfestigkeiten.',
    relevanteModule: ['mauerwerk', 'kalk', 'ausbau']
  },

  // -------------------------------------------------------------
  // HOLZ- & HOLZWERKSTOFFBAU
  // -------------------------------------------------------------
  'DIN_EN_1995_1_1': {
    id: 'DIN_EN_1995_1_1',
    code: 'DIN EN 1995-1-1:2010-12 (Eurocode 5)',
    title: 'Bemessung und Konstruktion von Holzbauten - Allgemeine Regeln',
    category: 'holz',
    ausgabeStand: '2010-12',
    status: 'in_ueberarbeitung',
    url: 'https://www.dinmedia.de/de/norm/din-en-1995-1-1/133649520',
    beschreibung: 'Planung, Bemessung und Detailkonstruktionen von Holzkonstruktionen und Ingenieurholzbau-Systemen.',
    relevanteModule: ['holz', 'holzwerkstoffe', 'holzbau_beta', 'knicken']
  },
  'DIN_1052': {
    id: 'DIN_1052',
    code: 'DIN 1052:2008-12',
    title: 'Herstellung und Ausführung von Holzbauwerken',
    category: 'holz',
    ausgabeStand: '2008-12',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-1052/112349120',
    beschreibung: 'Nationale Ergänzungsregeln für tragende Holzbauteile und Anschlüsse zur Einhaltung statischer Standards.',
    relevanteModule: ['holz', 'holzwerkstoffe']
  },
  'DIN_EN_338': {
    id: 'DIN_EN_338',
    code: 'DIN EN 338:2016-07',
    title: 'Bauholz für tragende Zwecke - Festigkeitsklassen',
    category: 'holz',
    ausgabeStand: '2016-07',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-en-338/246871230',
    beschreibung: 'Klassifiziert Nadelholz (C14-C50) und Laubholz (D18-D70) nach charakteristischen Biege-, Zug-, Druckfestigkeiten und E-Modul.',
    relevanteModule: ['holz', 'materialkennwerte']
  },
  'DIN_EN_300': {
    id: 'DIN_EN_300',
    code: 'DIN EN 300:2006-07 / DIN EN 310',
    title: 'Platten aus langen, flachen, ausgerichteten Spänen (OSB)',
    category: 'holz',
    ausgabeStand: '2006-07',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-en-300/89345210',
    beschreibung: 'Anforderungen an OSB/1 bis OSB/4 bezüglich Tragfähigkeit und Feuchtebeständigkeit.',
    relevanteModule: ['holzwerkstoffe', 'holz']
  },
  'DIN_EN_636': {
    id: 'DIN_EN_636',
    code: 'DIN EN 636:2015-05',
    title: 'Sperrholz - Anforderungen',
    category: 'holz',
    ausgabeStand: '2015-05',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-en-636/228741230',
    beschreibung: 'Regelt Sperrholzqualitäten für tragende und nichttragende Zwecke im Trocken-, Feucht- oder Außenbereich.',
    relevanteModule: ['holzwerkstoffe']
  },

  // -------------------------------------------------------------
  // STAHL-, METALL- & GLASBAU
  // -------------------------------------------------------------
  'DIN_EN_1993_1_1': {
    id: 'DIN_EN_1993_1_1',
    code: 'DIN EN 1993-1-1:2022-12 (Eurocode 3)',
    title: 'Bemessung und Konstruktion von Stahlbauten - Allgemeine Bemessungsregeln',
    category: 'metall',
    ausgabeStand: '2022-12',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-en-1993-1-1/357984120',
    beschreibung: 'Globale Bemessungsnorm für Stahltragwerke (Hallen, Brücken, Hochhäuser) im Grenzzustand der Tragfähigkeit.',
    relevanteModule: ['stahl', 'metalle', 'metallkorrosion', 'bp_stahlbauprofile']
  },
  'DIN_EN_10025': {
    id: 'DIN_EN_10025',
    code: 'DIN EN 10025-1 bis -6:2019-10',
    title: 'Warmgewalzte Erzeugnisse aus Baustählen',
    category: 'metall',
    ausgabeStand: '2019-10',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-en-10025-1/309871230',
    beschreibung: 'Materialspezifikation für Baustähle wie S235, S355 inklusive Schweißeignung und Kerbschlagarbeit.',
    relevanteModule: ['metalle', 'stahl', 'bp_stahlbauprofile']
  },
  'DIN_EN_ISO_12944': {
    id: 'DIN_EN_ISO_12944',
    code: 'DIN EN ISO 12944-1 bis -9:2018-06',
    title: 'Korrosionsschutz von Stahlbauten durch Beschichtungssysteme',
    category: 'metall',
    ausgabeStand: '2018-06',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-en-iso-12944-1/282341200',
    beschreibung: 'Definiert die Korrosivitätskategorien (C1 bis C5-M) und beschreibt geeignete Beschichtungen zum langfristigen Stahlschutz.',
    relevanteModule: ['metallkorrosion', 'korrosion', 'instandsetzung_materialien']
  },
  'DIN_18008': {
    id: 'DIN_18008',
    code: 'DIN 18008-1 bis -6:2020-05',
    title: 'Glas im Bauwesen - Bemessungs- und Konstruktionsregeln',
    category: 'ausbau',
    ausgabeStand: '2020-05',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-18008-1/321456780',
    beschreibung: 'Die maßgebende deutsche Norm für tragendes Glas, absturzsichernde Verglasung, begehbares Glas und Linienlagerungen.',
    relevanteModule: ['glas_fenster', 'bauphysik']
  },
  'DIN_EN_572': {
    id: 'DIN_EN_572',
    code: 'DIN EN 572-1 bis -9:2016-06',
    title: 'Glas im Bauwesen - Erzeugnisse aus Kalk-Natronsilicatglas',
    category: 'ausbau',
    ausgabeStand: '2016-06',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-en-572-1/245671230',
    beschreibung: 'Definiert Basiserzeugnisse wie Floatglas, poliertes Drahtglas und Ornamentglas.',
    relevanteModule: ['glas_fenster']
  },

  // -------------------------------------------------------------
  // BAUPHYSIK, WÄRME, SCHALL, BRAND & FEUCHTE
  // -------------------------------------------------------------
  'DIN_4108_2': {
    id: 'DIN_4108_2',
    code: 'DIN 4108-2:2013-02 / DIN 4108-3:2018-10',
    title: 'Wärmeschutz und Energie-Einsparung in Gebäuden - Mindestwärmeschutz & Klimabedingter Feuchteschutz',
    category: 'bauphysik',
    ausgabeStand: '2018-10',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-4108-2/171542100',
    beschreibung: 'Regelt Mindest-Wärmedurchlasswiderstände, f_Rsi-Faktor (>=0,70 Schimmelschutz) und das Glaser-Verfahren nach DIN 4108-3.',
    relevanteModule: ['bauphysik', 'daemmstoffe', 'feuchteschutz', 'rechnung_u_wert']
  },
  'DIN_4109_1': {
    id: 'DIN_4109_1',
    code: 'DIN 4109-1:2018-01',
    title: 'Schallschutz im Hochbau - Teil 1: Mindestanforderungen',
    category: 'bauphysik',
    ausgabeStand: '2018-01',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-4109-1/276541290',
    beschreibung: 'Bauordnungsrechtlich geschuldete Mindestanforderungen an Luft- und Trittschalldämmung (R\'w, L\'n,w).',
    relevanteModule: ['schallschutz', 'bauphysik', 'ausbau']
  },
  'DIN_4102_1': {
    id: 'DIN_4102_1',
    code: 'DIN 4102-1 bis -22',
    title: 'Brandverhalten von Baustoffen und Bauteilen',
    category: 'bauphysik',
    ausgabeStand: '2016-05',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-4102-1/65432100',
    beschreibung: 'Nationale Baustoffklassen (A1, A2, B1, B2, B3) und Feuerwiderstandsklassen (F30 bis F120) von Bauteilen im Hochbau.',
    relevanteModule: ['brandschutz', 'daemmstoffe']
  },
  'DIN_EN_13501_1': {
    id: 'DIN_EN_13501_1',
    code: 'DIN EN 13501-1:2019-05',
    title: 'Klassifizierung von Bauprodukten und Bauarten zu ihrem Brandverhalten',
    category: 'bauphysik',
    ausgabeStand: '2019-05',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-en-13501-1/304598120',
    beschreibung: 'Euroklassen A1 bis F, Rauchentwicklungsklassen (s1, s2, s3) und brennendes Abtropfen (d0, d1, d2).',
    relevanteModule: ['brandschutz', 'daemmstoffe', 'kunststoffe', 'holz']
  },
  'DIN_18531': {
    id: 'DIN_18531',
    code: 'DIN 18531:2017-07',
    title: 'Abdichtung von Dächern sowie von Balkonen, Loggien und Laubengängen',
    category: 'bauphysik',
    ausgabeStand: '2017-07',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-18531/269871100',
    beschreibung: 'Regelt Planung, Stoffauswahl, Bemessung und Ausführung von flachen und geneigten Dach- sowie Balkonabdichtungen.',
    relevanteModule: ['feuchteschutz', 'bauphysik', 'ausbau']
  },
  'DIN_18533': {
    id: 'DIN_18533',
    code: 'DIN 18533-1 bis -3:2017-07',
    title: 'Abdichtung von erdberührten Bauteilen',
    category: 'bauphysik',
    ausgabeStand: '2017-07',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-18533-1/269871200',
    beschreibung: 'Wassereinwirkungsklassen W1.1-E bis W4-E, Rissüberbrückungsklassen und Abdichtungsstoffe für Keller und Bodenplatten.',
    relevanteModule: ['feuchteschutz', 'bauphysik', 'wu_bauwerke', 'instandsetzung_materialien']
  },
  'DIN_18534': {
    id: 'DIN_18534',
    code: 'DIN 18534-1 bis -6:2017-07',
    title: 'Abdichtung von Innenräumen',
    category: 'bauphysik',
    ausgabeStand: '2017-07',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-18534-1/269871300',
    beschreibung: 'Regelt Abdichtungskonzepte für Nassbereiche im Hochbau wie gewerbliche Küchen, Schwimmbeckenränder und häusliche Badezimmer.',
    relevanteModule: ['feuchteschutz', 'ausbau']
  },
  'DIN_18535': {
    id: 'DIN_18535',
    code: 'DIN 18535:2017-07',
    title: 'Abdichtung von Behältern und Becken',
    category: 'bauphysik',
    ausgabeStand: '2017-07',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-18535/269871400',
    beschreibung: 'Normierung der Abdichtung für flüssigkeitsbeaufschlagte Bauteile und Tanks im Bauwesen.',
    relevanteModule: ['feuchteschutz', 'wu_bauwerke']
  },
  'DIN_18195': {
    id: 'DIN_18195',
    code: 'DIN 18195:2017-07',
    title: 'Bauwerksabdichtung - Begriffe',
    category: 'bauphysik',
    ausgabeStand: '2017-07',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-18195/269871500',
    beschreibung: 'Die traditionsreiche Grundlagennorm zur Definition aller zentralen Abkürzungen und verfahrenstechnischen Begriffe im Feuchteschutz.',
    relevanteModule: ['feuchteschutz', 'bauphysik']
  },

  // -------------------------------------------------------------
  // ERDBAU, GEOTECHNIK & STRASSENBAU
  // -------------------------------------------------------------
  'DIN_EN_1997_1': {
    id: 'DIN_EN_1997_1',
    code: 'DIN EN 1997-1:2014-03 (Eurocode 7)',
    title: 'Entwurf, Berechnung und Bemessung in der Geotechnik',
    category: 'geotechnik',
    ausgabeStand: '2014-03',
    status: 'in_ueberarbeitung',
    url: 'https://www.dinmedia.de/de/norm/din-en-1997-1/201234560',
    beschreibung: 'Regelt statische Erddruckberechnungen, Fundamentbemessungen, Böschungsstabilitäten und Baugrunduntersuchungen.',
    relevanteModule: ['geotechnik', 'bodenmechanik', 'grundbau']
  },
  'DIN_18196': {
    id: 'DIN_18196',
    code: 'DIN 18196:2011-05',
    title: 'Erd- und Grundbau - Bodenklassifikation für bautechnische Zwecke',
    category: 'geotechnik',
    ausgabeStand: '2011-05',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-18196/143567890',
    beschreibung: 'Einteilung von Böden in Bodengruppen (GE, GW, TL, UA etc.) zur Bewertung der Frostempfindlichkeit, Tragfähigkeit und Verdichtbarkeit.',
    relevanteModule: ['geotechnik', 'bodenmechanik']
  },
  'DIN_18300': {
    id: 'DIN_18300',
    code: 'DIN 18300:2019-09 (VOB/C)',
    title: 'ATV Erdarbeiten - Abrechnung und Technische Bedingungen',
    category: 'geotechnik',
    ausgabeStand: '2019-09',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-18300/307891230',
    beschreibung: 'Verbindliche Ausführungsregeln für das Lösen, Laden, Fördern und Einbauen von Erdmassen inklusive Homogenklassen-Einteilung.',
    relevanteModule: ['geotechnik', 'vob', 'bauleitung']
  },
  'DIN_EN_13108': {
    id: 'DIN_EN_13108',
    code: 'DIN EN 13108-1 bis -21:2016-12',
    title: 'Asphaltmischgut - Mischgutspezifikationen',
    category: 'geotechnik',
    ausgabeStand: '2016-12',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-en-13108-1/256789120',
    beschreibung: 'Eigenschaften für Asphaltbeton (AC), Gussasphalt (MA) und Offenporigen Asphalt (PA) im Verkehrswegebau.',
    relevanteModule: ['strassenbau', 'bitumen']
  },

  // -------------------------------------------------------------
  // TROCKENBAU, PUTZE, ESTRICHE & AUSBAU
  // -------------------------------------------------------------
  'DIN_18181': {
    id: 'DIN_18181',
    code: 'DIN 18181:2019-09',
    title: 'Gipsplatten im Hochbau - Verarbeitung',
    category: 'ausbau',
    ausgabeStand: '2019-09',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-18181/308971230',
    beschreibung: 'Spezifiziert Montage, Schraubenabstände, Achsabstände der Unterkonstruktion, Fugenversatz und Spachtelbedingungen.',
    relevanteModule: ['trockenbau', 'ausbau']
  },
  'DIN_18180': {
    id: 'DIN_18180',
    code: 'DIN 18180:2014-09',
    title: 'Gipsplatten - Arten und Anforderungen',
    category: 'ausbau',
    ausgabeStand: '2014-09',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-18180/209871230',
    beschreibung: 'Besondere Anforderungen an Gipskarton- und Feuerschutzbauplatten im Hochbau.',
    relevanteModule: ['trockenbau', 'ausbau']
  },
  'DIN_EN_520': {
    id: 'DIN_EN_520',
    code: 'DIN EN 520:2009-12',
    title: 'Gipsplatten - Definitionen, Anforderungen und Prüfverfahren',
    category: 'ausbau',
    ausgabeStand: '2009-12',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-en-520/123456780',
    beschreibung: 'Europäische Produktnorm mit Typenklassifizierung (Typ A, H, F, D etc.) bezogen auf Schall- und Feuchteeigenschaften.',
    relevanteModule: ['trockenbau']
  },
  'DIN_EN_13914': {
    id: 'DIN_EN_13914',
    code: 'DIN EN 13914-1 / -2:2016-09',
    title: 'Planung, Zubereitung und Ausführung von Außen- und Innenputzen',
    category: 'ausbau',
    ausgabeStand: '2016-09',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-en-13914-1/251234560',
    beschreibung: 'Regelt Mörtelgruppenauswahl, Verputzregeln bei mineralischen Untergründen und Mindestschichtdicken.',
    relevanteModule: ['putze_moertel', 'kalk', 'ausbau']
  },
  'DIN_18560': {
    id: 'DIN_18560',
    code: 'DIN 18560-1 bis -7:2021-02',
    title: 'Estriche im Bauwesen',
    category: 'ausbau',
    ausgabeStand: '2021-02',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-18560-1/334567890',
    beschreibung: 'Technische Spezifikationen für schwimmende Estriche, Verbundestriche, Heizestriche, Einbaudicken und Formänderungsverhalten.',
    relevanteModule: ['estriche', 'ausbau']
  },

  // -------------------------------------------------------------
  // NACHHALTIGKEIT, LEHMBAU & ÖKOBILANZEN
  // -------------------------------------------------------------
  'DIN_EN_15804': {
    id: 'DIN_EN_15804',
    code: 'DIN EN 15804:2022-03+A2:2019',
    title: 'Nachhaltigkeit von Bauwerken - Umweltproduktdeklarationen (EPD) - Grundregeln',
    category: 'nachhaltigkeit',
    ausgabeStand: '2022-03',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-en-15804/348712390',
    beschreibung: 'Standard für Ökobilanzen von Bauprodukten, GWP-total, Module A1-A3, B1-B7, C1-C4 und D.',
    relevanteModule: ['nachhaltigkeit', 'dpp_epd', 'lca', 'interactive_lca']
  },
  'DIN_EN_15978': {
    id: 'DIN_EN_15978',
    code: 'DIN EN 15978:2012-10',
    title: 'Nachhaltigkeit von Bauwerken - Bewertung der umweltbezogenen Qualität von Gebäuden - Berechnungsmethode',
    category: 'nachhaltigkeit',
    ausgabeStand: '2012-10',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-en-15978/154789120',
    beschreibung: 'Berechnungsmethode zur Bewertung der Ökobilanz von Gebäuden über alle Lebenszyklusphasen (A1-D) und 50 Jahre Betrachtungszeitraum.',
    relevanteModule: ['nachhaltigkeit', 'lca', 'interactive_lca']
  },
  'DIN_EN_17472': {
    id: 'DIN_EN_17472',
    code: 'DIN EN 17472:2022-09',
    title: 'Nachhaltigkeit von Bauwerken - Bewertung der Nachhaltigkeit von Ingenieurbauwerken - Berechnungsmethoden',
    category: 'nachhaltigkeit',
    ausgabeStand: '2022-09',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-en-17472/356123890',
    beschreibung: 'Europäische Norm zur Nachhaltigkeits- und Ökobilanzierung von Ingenieurbauwerken (Brücken, Tunnel, Straßen, Bahntrassen) über 80-100 Jahre Betrachtungszeitraum inkl. Baustellen-Stauemissionen (Modul B8).',
    relevanteModule: ['nachhaltigkeit', 'lca', 'interactive_lca']
  },
  'DIN_18945': {
    id: 'DIN_18945',
    code: 'DIN 18945 / 18946 / 18947:2024-03',
    title: 'Lehmbaustoffe - Lehmsteine, Putzmörtel, Mauermörtel (Anforderungen, Prüfung, Kennzeichnung)',
    category: 'nachhaltigkeit',
    ausgabeStand: '2024-03',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-18945/298765430',
    beschreibung: 'Die weltweit ersten Produktnormen für industrielle Lehmprodukte im Hochbau.',
    relevanteModule: ['nachhaltigkeit', 'kalk', 'ausbau']
  },

  // -------------------------------------------------------------
  // MASSBALTIGKEIT, TOLERANZEN & QUALITÄT
  // -------------------------------------------------------------
  'DIN_18202': {
    id: 'DIN_18202',
    code: 'DIN 18202:2019-07',
    title: 'Toleranzen im Hochbau - Bauwerke',
    category: 'qualitaet',
    ausgabeStand: '2019-07',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-18202/306781290',
    beschreibung: 'Grenzabweichungen, Winkel- und Ebenheitstoleranzen für alle Rohbau- und Ausbaugewerke.',
    relevanteModule: ['regularien', 'qualitaetssicherung', 'betonpraxis', 'ausbau']
  },
  'DIN_18203': {
    id: 'DIN_18203',
    code: 'DIN 18203-1 bis -3:2014-08',
    title: 'Toleranzen im Hochbau - Vorgefertigte Bauteile',
    category: 'qualitaet',
    ausgabeStand: '2014-08',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-18203-1/208765430',
    beschreibung: 'Regelt Detailtoleranzen für Beton- (Teil 1), Stahl- (Teil 2) und Holzkonstruktionen (Teil 3) zur montagegerechten Passbarkeit.',
    relevanteModule: ['qualitaetssicherung', 'betonpraxis']
  },
  'DIN_18040': {
    id: 'DIN_18040',
    code: 'DIN 18040-1 bis -3:2015-02',
    title: 'Barrierefreies Bauen - Planungsgrundlagen',
    category: 'ausbau',
    ausgabeStand: '2015-02',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-18040-1/219876540',
    beschreibung: 'Regelt bauaufsichtliche Anforderungen an schwellenfreie, rollstuhlgerechte Erschließung von Wegen, öffentlichen Räumen und Wohnungen.',
    relevanteModule: ['regularien', 'ausbau']
  },
  'DIN_18015': {
    id: 'DIN_18015',
    code: 'DIN 18015-1 bis -4:2020-05',
    title: 'Elektrische Anlagen in Wohngebäuden',
    category: 'ausbau',
    ausgabeStand: '2020-05',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-18015-1/320987650',
    beschreibung: 'Definiert Installationszonen an Decken/Wänden (Schutzbereiche für Bohrarbeiten) sowie die Mindestausstattung der Stromkreise.',
    relevanteModule: ['regularien', 'ausbau']
  },
  'DIN_1946_6': {
    id: 'DIN_1946_6',
    code: 'DIN 1946-6:2019-12',
    title: 'Lüftung von Wohnungen - Lüftungskonzept',
    category: 'bauphysik',
    ausgabeStand: '2019-12',
    status: 'gueltig',
    url: 'https://www.dinmedia.de/de/norm/din-1946-6/312345670',
    beschreibung: 'Verpflichtet Planer bei Neubauten und größeren energetischen Sanierungen, den Außenluftwechsel zur Vermeidung von Feuchteschäden rein physikalisch nachzuweisen.',
    relevanteModule: ['bauphysik', 'feuchteschutz']
  },
  'GEG_2024': {
    id: 'GEG_2024',
    code: 'Gebäudemodernisierungsgesetz (GModG, in Kraft seit 29.07.2026, vormals GEG)',
    title: 'Gesetz zur Einsparung von Energie und zur Nutzung erneuerbarer Energien in Gebäuden',
    category: 'bauphysik',
    ausgabeStand: '2024-01',
    status: 'gueltig',
    url: 'https://www.gesetze-im-internet.de/geg/',
    beschreibung: 'Bundesdeutsches Ordnungsrecht für Primärenergiebedarf, 65%-EE-Vorgabe bei Heizungstausch und U-Wert-Höchstwerte.',
    relevanteModule: ['bauphysik', 'energieausweis', 'daemmung_vergleich', 'rechnung_u_wert']
  }
};

/**
 * Returns a standardized norm record by its unique registry ID or normalized code.
 */
export function getNormById(id: string): NormRecord | undefined {
  if (CENTRAL_NORMEN_REGISTRY[id]) {
    return CENTRAL_NORMEN_REGISTRY[id];
  }
  // Fallback search across codes
  const normalized = id.toLowerCase().replace(/[^a-z0-9]/g, '');
  return Object.values(CENTRAL_NORMEN_REGISTRY).find(r => 
    r.id.toLowerCase().replace(/[^a-z0-9]/g, '') === normalized ||
    r.code.toLowerCase().replace(/[^a-z0-9]/g, '').includes(normalized)
  );
}

/**
 * Helper to get an aggregated list of norms grouped by category
 */
export function getNormsByCategory(): { category: string; norms: NormRecord[] }[] {
  const categoryNames: Record<NormRecord['category'], string> = {
    beton: 'Beton-, Zement- & Mörtelbau',
    mauerwerk: 'Mauerwerksbau',
    holz: 'Holz- & Holzwerkstoffbau',
    metall: 'Stahl-, Metall- & Glasbau',
    bauphysik: 'Bauphysik (Wärme, Schall, Brand & Feuchtigkeit)',
    geotechnik: 'Erdbau, Geotechnik & Straßenbau',
    ausbau: 'Trockenbau, Putze, Estrich & Ausbau',
    nachhaltigkeit: 'Nachhaltigkeit & Lehmbau',
    qualitaet: 'Maßhaltigkeit, Toleranzen & Weitere Normen'
  };

  const map = new Map<NormRecord['category'], NormRecord[]>();
  Object.values(CENTRAL_NORMEN_REGISTRY).forEach(norm => {
    if (!map.has(norm.category)) {
      map.set(norm.category, []);
    }
    map.get(norm.category)!.push(norm);
  });

  return (Object.keys(categoryNames) as NormRecord['category'][]).map(catKey => ({
    category: categoryNames[catKey],
    norms: map.get(catKey) || []
  })).filter(group => group.norms.length > 0);
}
