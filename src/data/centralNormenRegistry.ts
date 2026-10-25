export interface NormRecord {
  id: string;
  code: string;
  title: string;
  category: 'beton' | 'mauerwerk' | 'holz' | 'metall' | 'bauphysik' | 'geotechnik' | 'ausbau' | 'nachhaltigkeit' | 'qualitaet';
  ausgabeStand: string; // e.g. "2023-11"
  status: 'gueltig' | 'in_ueberarbeitung' | 'ersetzt';
  ersetztDurch?: string;
  url?: string;
  beschreibung: string;
  relevanteModule: string[];
}

export const CENTRAL_NORMEN_REGISTRY: Record<string, NormRecord> = {
  // -------------------------------------------------------------
  // BETON, ZEMENT, BINDEMITTEL & MÖRTEL
  // -------------------------------------------------------------
  'DIN_EN_206': {
    id: 'DIN_EN_206',
    code: 'DIN EN 206:2021-06 / DIN 1045-2:2023-08 (maßgebend) / DIN EN 206-1:2026-07 / DIN EN 206-2:2026-07 (Neuausgabe)',
    title: 'Beton - Festlegung, Eigenschaften, Herstellung und Konformität',
    category: 'beton',
    ausgabeStand: '2023-08',
    status: 'gueltig',
    beschreibung: 'Zentrales Regelwerk für Expositionsklassen (XC, XD, XS, XF, XA, XM), w/z-Werte, Mindestdruckfestigkeiten und Konformitätskriterien im DACH-Raum. Maßgebend bleibt die aufeinander abgestimmte Kombination DIN EN 206:2021-06 mit DIN 1045-2:2023-08. Neue Ausgabe 2026-07 erschienen (EN 206 in Teile 1 bis 3 aufgeteilt; DIN EN 206-1 und -2 ersetzen DIN EN 206:2021-06 teilweise; u. a. neue Bindemittel-Terminologie und CO2-Klassen); die passende Neufassung von DIN 1045-2 und die bauaufsichtliche Einführung stehen noch aus.',
    relevanteModule: ['beton_a_z', 'mischungsberechnung', 'dauerhaftigkeit', 'labor', 'sonderbetone']
  },
  'DIN_1045_3': {
    id: 'DIN_1045_3',
    code: 'DIN 1045-3:2023-08',
    title: 'Tragwerke aus Beton, Stahlbeton und Spannbeton - Teil 3: Bauausführung',
    category: 'beton',
    ausgabeStand: '2023-08',
    status: 'gueltig',
    beschreibung: 'Regelt Schalung, Bewehrungsverlegung, Betoneinbau, Verdichtung und die maßgebenden Nachbehandlungsfristen.',
    relevanteModule: ['nachbehandlung', 'betonpraxis', 'herstellung_einbau']
  },
  'DIN_EN_13670': {
    id: 'DIN_EN_13670',
    code: 'DIN EN 13670:2011-03',
    title: 'Ausführung von Tragwerken aus Beton',
    category: 'beton',
    ausgabeStand: '2011-03',
    status: 'gueltig',
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
    code: 'DIN EN 197-1:2011-11 & DIN EN 197-5:2021-07',
    title: 'Zement - Zusammensetzung, Anforderungen und Konformitätskriterien',
    category: 'beton',
    ausgabeStand: '2021-07',
    status: 'gueltig',
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
    beschreibung: 'Anforderungen an Sande, Kiese und Splitte bezüglich Kornform, Sieblinie, Frostbeständigkeit und schädlicher Bestandteile.',
    relevanteModule: ['mischungsberechnung', 'gesteinskoernung', 'labor']
  },
  'DIN_EN_934_2': {
    id: 'DIN_EN_934_2',
    code: 'DIN EN 934-2:2012-08',
    title: 'Betonzusatzmittel - Definitionen, Anforderungen und Konformität',
    category: 'beton',
    ausgabeStand: '2012-08',
    status: 'gueltig',
    beschreibung: 'Regelt Zusatzmittel wie Fließmittel (FM), Luftporenbildner (LP), Verzögerer (VZ) und Beschleuniger (BE).',
    relevanteModule: ['mischungsberechnung', 'frischbeton', 'betonpraxis']
  },
  'DIN_EN_1992_1_1': {
    id: 'DIN_EN_1992_1_1',
    code: 'DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA (eingeführt) / DIN EN 1992-1-1:2025-09 (2. Generation)',
    title: 'Bemessung und Konstruktion von Stahlbeton- und Spannbetontragwerken',
    category: 'beton',
    ausgabeStand: '2025-09',
    status: 'in_ueberarbeitung',
    beschreibung: 'Tragwerksnorm für Biegung, Querkraft, Durchstanzen und Rissbreitennachweis. Die deutsche Fassung der 2. Generation (DIN EN 1992-1-1:2025-09, EN 1992-1-1:2023) ist erschienen; bauaufsichtlich maßgebend bleibt bis zur Einführung in die MVV TB die Fassung 2011-01 + A1:2015-03 mit Nationalem Anhang.',
    relevanteModule: ['biegebemessung', 'querkraft', 'durchstanzen', 'rissbreite', 'verankerungslaenge']
  },
  'DIN_EN_459_1': {
    id: 'DIN_EN_459_1',
    code: 'DIN EN 459-1:2015-07',
    title: 'Baukalk - Teil 1: Definitionen, Anforderungen und Konformitätskriterien',
    category: 'ausbau',
    ausgabeStand: '2015-07',
    status: 'gueltig',
    beschreibung: 'Klassifizierung von Luftkalken (CL) und hydraulischen Kalken (NHL, HL) für historische und denkmalgerechte Mörtel.',
    relevanteModule: ['kalk', 'putze_moertel', 'denkmalpflege']
  },

  // -------------------------------------------------------------
  // PRÜFNORMEN BETON, ZEMENT & KORROSION (Versuchs-Handouts, AP 6.4; Ausgaben geprüft 10/2026)
  // -------------------------------------------------------------
  'DIN_EN_12350_1': {
    id: 'DIN_EN_12350_1',
    code: 'DIN EN 12350-1:2019-09',
    title: 'Prüfung von Frischbeton - Teil 1: Probenahme und Prüfgeräte',
    category: 'beton',
    ausgabeStand: '2019-09',
    status: 'gueltig',
    beschreibung: 'Probenahme von Frischbeton (Stichprobe, Sammelprobe) und gemeinsame Anforderungen an die Prüfgeräte der Normenreihe.',
    relevanteModule: ['labor_frischbeton', 'frischbeton']
  },
  'DIN_EN_12350_5': {
    id: 'DIN_EN_12350_5',
    code: 'DIN EN 12350-5:2019-09',
    title: 'Prüfung von Frischbeton - Teil 5: Ausbreitmaß',
    category: 'beton',
    ausgabeStand: '2019-09',
    status: 'gueltig',
    beschreibung: 'Ausbreitversuch auf dem Ausbreittisch (15 Hübe) zur Bestimmung der Konsistenz; Ergebnis als Mittel zweier Durchmesser auf 10 mm.',
    relevanteModule: ['labor_frischbeton', 'frischbeton']
  },
  'DIN_EN_12350_6': {
    id: 'DIN_EN_12350_6',
    code: 'DIN EN 12350-6:2019-09',
    title: 'Prüfung von Frischbeton - Teil 6: Frischbetonrohdichte',
    category: 'beton',
    ausgabeStand: '2019-09',
    status: 'gueltig',
    beschreibung: 'Bestimmung der Rohdichte von verdichtetem Frischbeton in einem kalibrierten Behälter.',
    relevanteModule: ['labor_frischbeton', 'frischbeton']
  },
  'DIN_EN_12350_7': {
    id: 'DIN_EN_12350_7',
    code: 'DIN EN 12350-7:2022-05',
    title: 'Prüfung von Frischbeton - Teil 7: Luftgehalt - Druckverfahren (EN 12350-7:2019 + AC:2022)',
    category: 'beton',
    ausgabeStand: '2022-05',
    status: 'gueltig',
    beschreibung: 'Luftgehalt von verdichtetem Frischbeton mit Normal- oder Schwerzuschlag nach dem Wassersäulen- bzw. Druckausgleichsverfahren.',
    relevanteModule: ['labor_frischbeton', 'frischbeton']
  },
  'DIN_EN_12390_2': {
    id: 'DIN_EN_12390_2',
    code: 'DIN EN 12390-2:2019-10',
    title: 'Prüfung von Festbeton - Teil 2: Herstellung und Lagerung von Probekörpern für Festigkeitsprüfungen',
    category: 'beton',
    ausgabeStand: '2019-10',
    status: 'gueltig',
    beschreibung: 'Herstellung, Verdichtung und Lagerung von Probekörpern; nationaler Anhang zur Trockenlagerung (f_c,dry) und deren Umrechnung.',
    relevanteModule: ['labor_druckfestigkeit', 'festbeton']
  },
  'DIN_EN_12390_3': {
    id: 'DIN_EN_12390_3',
    code: 'DIN EN 12390-3:2019-10',
    title: 'Prüfung von Festbeton - Teil 3: Druckfestigkeit von Probekörpern',
    category: 'beton',
    ausgabeStand: '2019-10',
    status: 'gueltig',
    beschreibung: 'Druckprüfung an Würfeln und Zylindern mit Belastungsrate (0,6 ± 0,2) MPa/s, Beurteilung der Bruchbilder.',
    relevanteModule: ['labor_druckfestigkeit', 'festbeton', 'mechanische_pruefungen']
  },
  'DIN_EN_196_1': {
    id: 'DIN_EN_196_1',
    code: 'DIN EN 196-1:2016-11',
    title: 'Prüfverfahren für Zement - Teil 1: Bestimmung der Festigkeit',
    category: 'beton',
    ausgabeStand: '2016-11',
    status: 'gueltig',
    beschreibung: 'Normmörtel (450 g Zement, 1350 g CEN-Normsand, 225 g Wasser), Prismen 40 × 40 × 160 mm, Biegezug- und Druckfestigkeit; Entwurf prEN 196-1:2026 liegt vor.',
    relevanteModule: ['labor_moertelprismen', 'bindemittel']
  },
  'DIN_EN_ISO_8407': {
    id: 'DIN_EN_ISO_8407',
    code: 'DIN EN ISO 8407:2025-08',
    title: 'Korrosion von Metallen und Legierungen - Entfernen von Korrosionsprodukten von Korrosionsprüfkörpern (ISO 8407:2021 + Amd 1:2025)',
    category: 'metall',
    ausgabeStand: '2025-08',
    status: 'gueltig',
    beschreibung: 'Chemische, elektrolytische und mechanische Verfahren zum Entfernen von Korrosionsprodukten vor der gravimetrischen Auswertung, mit Blindwertkorrektur.',
    relevanteModule: ['labor_auslagerung', 'metallkorrosion']
  },

  // -------------------------------------------------------------
  // MAUERWERKSBAU
  // -------------------------------------------------------------
  'DIN_EN_1996_1_1': {
    id: 'DIN_EN_1996_1_1',
    code: 'DIN EN 1996-1-1:2013-02 (Eurocode 6)',
    title: 'Bemessung und Konstruktion von Mauerwerksbauten',
    category: 'mauerwerk',
    ausgabeStand: '2013-02',
    status: 'gueltig',
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
    beschreibung: 'Spezifikationen für Mauermörtel (Normal-, Dünnbett-, Leichtmörtel) und Putzmörtel zur Einhaltung der Verbundfestigkeiten.',
    relevanteModule: ['mauerwerk', 'kalk', 'ausbau']
  },

  // -------------------------------------------------------------
  // HOLZ- & HOLZWERKSTOFFBAU
  // -------------------------------------------------------------
  'DIN_EN_1995_1_1': {
    id: 'DIN_EN_1995_1_1',
    code: 'DIN EN 1995-1-1:2010-12 + A2:2014-07 mit NA (eingeführt) / DIN EN 1995-1-1:2026-09 (2. Generation)',
    title: 'Bemessung und Konstruktion von Holzbauten - Allgemeine Regeln',
    category: 'holz',
    ausgabeStand: '2026-09',
    status: 'gueltig',
    beschreibung: 'Planung, Bemessung und Detailkonstruktionen von Holzkonstruktionen und Ingenieurholzbau-Systemen. Bauaufsichtlich eingeführt (MVV TB 2025/1) ist DIN EN 1995-1-1:2010-12 + A2:2014-07 mit DIN EN 1995-1-1/NA:2013-08. Neue Ausgabe 2026-09 erschienen (2. Generation, Deutsche Fassung EN 1995-1-1:2025, u. a. Brettsperrholz, Ermüdung, Holzpfähle); bauaufsichtlich noch nicht eingeführt, NA ausstehend.',
    relevanteModule: ['holz', 'holzwerkstoffe', 'holzbau_beta', 'knicken']
  },
  'DIN_1052': {
    id: 'DIN_1052',
    code: 'DIN 1052:2008-12 (zurückgezogen)',
    title: 'Entwurf, Berechnung und Bemessung von Holzbauwerken',
    category: 'holz',
    ausgabeStand: '2008-12',
    status: 'ersetzt',
    ersetztDurch: 'DIN EN 1995-1-1:2010-12 mit NA und DIN 1052-10:2012-05',
    url: 'https://www.dinmedia.de/de/norm/din-1052/112565498',
    beschreibung: 'Frühere nationale Holzbau-Bemessungsnorm (zurückgezogen); seit Einführung von Eurocode 5 nur noch für die Beurteilung von Bestandsstatiken relevant. Ausführungsregeln: DIN 1052-10.',
    relevanteModule: ['holz', 'holzwerkstoffe']
  },
  'DIN_EN_338': {
    id: 'DIN_EN_338',
    code: 'DIN EN 338:2016-07',
    title: 'Bauholz für tragende Zwecke - Festigkeitsklassen',
    category: 'holz',
    ausgabeStand: '2016-07',
    status: 'gueltig',
    beschreibung: 'Klassifiziert Nadelholz (C14-C50) und Laubholz (D18-D70) nach charakteristischen Biege-, Zug-, Druckfestigkeiten und E-Modul.',
    relevanteModule: ['holz', 'materialkennwerte']
  },
  'DIN_EN_300': {
    id: 'DIN_EN_300',
    code: 'DIN EN 300:2006-09 / DIN EN 310:1993-08',
    title: 'Platten aus langen, flachen, ausgerichteten Spänen (OSB)',
    category: 'holz',
    ausgabeStand: '2006-09',
    status: 'gueltig',
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
    beschreibung: 'Regelt Sperrholzqualitäten für tragende und nichttragende Zwecke im Trocken-, Feucht- oder Außenbereich.',
    relevanteModule: ['holzwerkstoffe']
  },

  // -------------------------------------------------------------
  // STAHL-, METALL- & GLASBAU
  // -------------------------------------------------------------
  'DIN_EN_1993_1_1': {
    id: 'DIN_EN_1993_1_1',
    code: 'DIN EN 1993-1-1:2010-12 + A1:2014-07 mit NA (eingeführt) / DIN EN 1993-1-1:2025-04 (2. Generation)',
    title: 'Bemessung und Konstruktion von Stahlbauten - Allgemeine Bemessungsregeln',
    category: 'metall',
    ausgabeStand: '2025-04',
    status: 'gueltig',
    beschreibung: 'Globale Bemessungsnorm für Stahltragwerke (Hallen, Brücken, Hochhäuser) im Grenzzustand der Tragfähigkeit.',
    relevanteModule: ['stahl', 'metalle', 'metallkorrosion', 'bp_stahlbauprofile']
  },
  'DIN_EN_10025': {
    id: 'DIN_EN_10025',
    code: 'DIN EN 10025-1:2005-02, -2:2019-10, -3:2019-10, -4:2023-02, -5:2019-10, -6:2023-06',
    title: 'Warmgewalzte Erzeugnisse aus Baustählen',
    category: 'metall',
    ausgabeStand: '2023-06',
    status: 'gueltig',
    beschreibung: 'Materialspezifikation für Baustähle wie S235, S355 inklusive Schweißeignung und Kerbschlagarbeit.',
    relevanteModule: ['metalle', 'stahl', 'bp_stahlbauprofile']
  },
  'DIN_EN_ISO_12944': {
    id: 'DIN_EN_ISO_12944',
    code: 'DIN EN ISO 12944-1:2019-01 (Teil 1; Reihe Teile 1 bis 9)',
    title: 'Korrosionsschutz von Stahlbauten durch Beschichtungssysteme',
    category: 'metall',
    ausgabeStand: '2019-01',
    status: 'gueltig',
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
    beschreibung: 'Definiert Basiserzeugnisse wie Floatglas, poliertes Drahtglas und Ornamentglas.',
    relevanteModule: ['glas_fenster']
  },

  // -------------------------------------------------------------
  // BAUPHYSIK, WÄRME, SCHALL, BRAND & FEUCHTE
  // -------------------------------------------------------------
  'DIN_4108_2': {
    id: 'DIN_4108_2',
    code: 'DIN 4108-2:2026-05 / DIN 4108-3:2024-03',
    title: 'Wärmeschutz und Energie-Einsparung in Gebäuden - Mindestwärmeschutz & Klimabedingter Feuchteschutz',
    category: 'bauphysik',
    ausgabeStand: '2026-05',
    status: 'gueltig',
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
    beschreibung: 'Bauordnungsrechtlich geschuldete Mindestanforderungen an Luft- und Trittschalldämmung (R\'w, L\'n,w).',
    relevanteModule: ['schallschutz', 'bauphysik', 'ausbau']
  },
  'DIN_4102_1': {
    id: 'DIN_4102_1',
    code: 'DIN 4102-1:1998-05 (Teil 1; Reihe Teile 1 bis 22)',
    title: 'Brandverhalten von Baustoffen und Bauteilen',
    category: 'bauphysik',
    ausgabeStand: '1998-05',
    status: 'gueltig',
    beschreibung: 'Nationale Baustoffklassen (A1, A2, B1, B2, B3) nach Teil 1 und Feuerwiderstandsklassen (F30 bis F120) von Bauteilen im Hochbau. DIN 4102-1:1998-05 ist aktuell, aber teilweise durch DIN EN 13238:2001-12 ersetzt (Konditionierung und Trägerplatten für Prüfungen).',
    relevanteModule: ['brandschutz', 'daemmstoffe']
  },
  'DIN_EN_13501_1': {
    id: 'DIN_EN_13501_1',
    code: 'DIN EN 13501-1:2019-05',
    title: 'Klassifizierung von Bauprodukten und Bauarten zu ihrem Brandverhalten',
    category: 'bauphysik',
    ausgabeStand: '2019-05',
    status: 'gueltig',
    beschreibung: 'Euroklassen A1 bis F, Rauchentwicklungsklassen (s1, s2, s3) und brennendes Abtropfen (d0, d1, d2).',
    relevanteModule: ['brandschutz', 'daemmstoffe', 'kunststoffe', 'holz']
  },
  'DIN_18531': {
    id: 'DIN_18531',
    code: 'DIN 18531-1:2025-08 (Reihe Teile 1 bis 5)',
    title: 'Abdichtung von Dächern sowie von Balkonen, Loggien und Laubengängen',
    category: 'bauphysik',
    ausgabeStand: '2025-08',
    status: 'gueltig',
    beschreibung: 'Regelt Planung, Stoffauswahl, Bemessung und Ausführung von flachen und geneigten Dach- sowie Balkonabdichtungen. Neuausgabe 2025 als Normenreihe DIN 18531-1 bis -5 (Teil 1: nicht genutzte und genutzte Dächer; Teil 5: Balkone, Loggien, Laubengänge); gegenüber 2017-07 entfallen Beanspruchungsstufen, Beanspruchungsklassen und die Anwendungsklassen K1/K2, die Gefälleregeln wurden überarbeitet.',
    relevanteModule: ['feuchteschutz', 'bauphysik', 'ausbau']
  },
  'DIN_18533': {
    id: 'DIN_18533',
    code: 'DIN 18533-1 bis -3:2026-06',
    title: 'Abdichtung von erdberührten Bauteilen',
    category: 'bauphysik',
    ausgabeStand: '2026-06',
    status: 'gueltig',
    beschreibung: 'Wasserbeanspruchungsklassen W1-E bis W4-E (bis 2017-07: „Wassereinwirkungsklassen“), Rissklassen und Abdichtungsstoffe für Keller und Bodenplatten. Ausgabe 2026-06 ersetzt DIN 18533-1:2017-07 und A1:2018-09: Riss- und Rissüberbrückungsklassen zusammengeführt, Wasser aus dem Baugrund aus DIN 4095-1 übernommen, Tür- und Fensteranschlüsse mit DIN 18531/18532 abgestimmt.',
    relevanteModule: ['feuchteschutz', 'bauphysik', 'wu_bauwerke', 'instandsetzung_materialien']
  },
  'DIN_18534': {
    id: 'DIN_18534',
    code: 'DIN 18534-1 bis -6:2025-10',
    title: 'Abdichtung von Innenräumen',
    category: 'bauphysik',
    ausgabeStand: '2025-10',
    status: 'gueltig',
    beschreibung: 'Regelt Abdichtungskonzepte für Nassbereiche im Hochbau wie gewerbliche Küchen, Schwimmbeckenränder und häusliche Badezimmer (Wassereinwirkungsklassen W0-I bis W3-I). Ausgabe 2025-10 ersetzt 2017-07; u. a. präzisierte Regeln für W1-I-Wände im Trockenbau, Untergründe in W2-I, nachträgliche Durchdringungen und Schnittschutz unter Wartungsfugen.',
    relevanteModule: ['feuchteschutz', 'ausbau']
  },
  'DIN_18535': {
    id: 'DIN_18535',
    code: 'DIN 18535-1 bis -3:2017-07',
    title: 'Abdichtung von Behältern und Becken',
    category: 'bauphysik',
    ausgabeStand: '2017-07',
    status: 'gueltig',
    beschreibung: 'Normierung der Abdichtung für flüssigkeitsbeaufschlagte Bauteile und Tanks im Bauwesen.',
    relevanteModule: ['feuchteschutz', 'wu_bauwerke']
  },
  'DIN_18195': {
    id: 'DIN_18195',
    code: 'DIN 18195:2025-12',
    title: 'Abdichtung von Bauwerken - Begriffe',
    category: 'bauphysik',
    ausgabeStand: '2025-12',
    status: 'gueltig',
    beschreibung: 'Die traditionsreiche Grundlagennorm zur Definition aller zentralen Abkürzungen und verfahrenstechnischen Begriffe im Feuchteschutz. Ausgabe 2025-12 ersetzt 2017-07, ergänzt u. a. Bemessungswasserstand, Kapillarsperre, Retention und Schutzabdeckung sowie einen Anhang A mit Erläuterungen zu den Hauptbegriffen.',
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
    beschreibung: 'Regelt statische Erddruckberechnungen, Fundamentbemessungen, Böschungsstabilitäten und Baugrunduntersuchungen.',
    relevanteModule: ['geotechnik', 'bodenmechanik', 'grundbau']
  },
  'DIN_18196': {
    id: 'DIN_18196',
    code: 'DIN 18196:2023-02',
    title: 'Erd- und Grundbau - Bodenklassifikation für bautechnische Zwecke',
    category: 'geotechnik',
    ausgabeStand: '2023-02',
    status: 'gueltig',
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
    beschreibung: 'Eigenschaften für Asphaltbeton (AC), Gussasphalt (MA) und Offenporigen Asphalt (PA) im Verkehrswegebau.',
    relevanteModule: ['strassenbau', 'bitumen']
  },

  // -------------------------------------------------------------
  // TROCKENBAU, PUTZE, ESTRICHE & AUSBAU
  // -------------------------------------------------------------
  'DIN_18181': {
    id: 'DIN_18181',
    code: 'DIN 18181:2019-04',
    title: 'Gipsplatten im Hochbau - Verarbeitung',
    category: 'ausbau',
    ausgabeStand: '2019-04',
    status: 'gueltig',
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
    beschreibung: 'Standard für Ökobilanzen von Bauprodukten, GWP-total, Module A1-A3, B1-B7, C1-C4 und D.',
    relevanteModule: ['nachhaltigkeit', 'dpp_epd', 'lca', 'interactive_lca']
  },
  'DIN_EN_15978': {
    id: 'DIN_EN_15978',
    code: 'DIN EN 15978:2026-09',
    title: 'Nachhaltigkeit von Bauwerken - Bewertung der Umweltqualität von Gebäuden - Methodik (EN 15978:2026; ersetzt Ausgabe 2012-10)',
    category: 'nachhaltigkeit',
    ausgabeStand: '2026-09',
    status: 'gueltig',
    beschreibung: 'Methodik zur Bewertung der Umweltqualität von Gebäuden über alle Lebenszyklusphasen (A1–C4, Modul D getrennt); der Betrachtungszeitraum wird vom Bewertungssystem festgelegt (QNG/BNB/DGNB: 50 Jahre). Übergangsregeln in den Bewertungssystemen manuell prüfen.',
    relevanteModule: ['nachhaltigkeit', 'lca', 'interactive_lca']
  },
  'DIN_EN_17472': {
    id: 'DIN_EN_17472',
    code: 'DIN EN 17472:2024-06 (berichtigte Fassung von 2022-09)',
    title: 'Nachhaltigkeit von Bauwerken - Bewertung der Nachhaltigkeit von Ingenieurbauwerken - Berechnungsmethoden',
    category: 'nachhaltigkeit',
    ausgabeStand: '2024-06',
    status: 'gueltig',
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
    beschreibung: 'Grenzabweichungen, Winkel- und Ebenheitstoleranzen für alle Rohbau- und Ausbaugewerke.',
    relevanteModule: ['regularien', 'qualitaetssicherung', 'betonpraxis', 'ausbau']
  },
  'DIN_18203': {
    id: 'DIN_18203',
    code: 'DIN 18203-3:2008-08 (Teile 1 und 2 zurückgezogen)',
    title: 'Toleranzen im Hochbau - Vorgefertigte Bauteile',
    category: 'qualitaet',
    ausgabeStand: '2008-08',
    status: 'gueltig',
    beschreibung: 'Regelt Detailtoleranzen für Bauteile aus Holz und Holzwerkstoffen (Teil 3:2008-08, aktuell). Teil 1 (Beton, 1997-04) und Teil 2 (Stahl, 2006-08) sind zurückgezogen; DIN Media verweist für Betonfertigteile auf DIN EN 13369 und DIN V 20000-120, für Stahlbauteile auf DIN EN ISO 13920.',
    relevanteModule: ['qualitaetssicherung', 'betonpraxis']
  },
  'DIN_18040': {
    id: 'DIN_18040',
    code: 'DIN 18040-1:2010-10, -2:2011-09, -3:2014-12',
    title: 'Barrierefreies Bauen - Planungsgrundlagen',
    category: 'ausbau',
    ausgabeStand: '2014-12',
    status: 'gueltig',
    beschreibung: 'Regelt bauaufsichtliche Anforderungen an schwellenfreie, rollstuhlgerechte Erschließung von Wegen, öffentlichen Räumen und Wohnungen. Alle drei Teile sind aktuell; Teil 1 ist teilweise durch DIN EN 17210:2021-08 ersetzt, zu Teil 2 liegt der Entwurf E DIN 18040-2:2023-02 vor.',
    relevanteModule: ['regularien', 'ausbau']
  },
  'DIN_18015': {
    id: 'DIN_18015',
    code: 'DIN 18015-1 bis -4:2020-05',
    title: 'Elektrische Anlagen in Wohngebäuden',
    category: 'ausbau',
    ausgabeStand: '2020-05',
    status: 'gueltig',
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
    beschreibung: 'Verpflichtet Planer bei Neubauten und größeren energetischen Sanierungen, den Außenluftwechsel zur Vermeidung von Feuchteschäden rein physikalisch nachzuweisen.',
    relevanteModule: ['bauphysik', 'feuchteschutz']
  },
  'GEG_2024': {
    id: 'GEG_2024',
    code: 'Gebäudemodernisierungsgesetz (GModG, in Kraft seit 29.07.2026, vormals GEG)',
    title: 'Gebäudemodernisierungsgesetz (bis 28.07.2026: Gebäudeenergiegesetz)',
    category: 'bauphysik',
    ausgabeStand: '2026-07',
    status: 'gueltig',
    url: 'https://www.gmodg.bund.de/',
    beschreibung: 'Bundesrecht für Primärenergiebedarf, baulichen Wärmeschutz und Anlagentechnik. Mit der Umbenennung (in Kraft seit 29.07.2026) entfiel u. a. die 65-%-EE-Vorgabe beim Heizungstausch; EPBD-Anforderungen folgen ab 2027.',
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
