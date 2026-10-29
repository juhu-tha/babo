import { ALTBETON_ZUORDNUNG, ALTBETON_1972_2001, KP_CM2_IN_N_MM2, type AltbetonKlasse } from './kennwerte';
import { formatDeZahl } from '../utils/numberFormat';

export type MaterialCategory = 'beton' | 'betonstahl' | 'baustahl' | 'holz' | 'mauerwerk';

export interface HistoricalRecord {
  old: string;
  new: string;
  f_old: number | string;
  f_new: number | string;
  explanation: string;
}

export interface HistoricalCategoryData {
  title: string;
  description: string;
  normOld: string;
  normNew: string;
  data: HistoricalRecord[];
}

/**
 * Zeilen B 120 … B 600 aus der gemeinsamen Zuordnungstabelle ALTBETON_ZUORDNUNG (src/data/kennwerte.ts; Entscheidung 29.10.2026,
 * T15-BS-3/-4; Quelle Schnell/Fischer/Loch 2008, Tab. 2.1). Vorher u. a. „B 225 → C 20/25 (nicht konservativ – prüfen)“.
 */
const ALTBETON_ERKLAERUNG: Readonly<Record<AltbetonKlasse, string>> = {
  B120: 'Früheres zulässiges Mindestglied für bewehrte Bauteile. Meistens sehr weiche Konsistenz und mangelnder Verdichtungsschutz.',
  B160: 'Sehr häufiger Tragwerksbeton der Wiederaufbaujahre nach dem 2. Weltkrieg.',
  B225: 'Standardbeton für mittelschwer beanspruchte Hochbauteile der 1950er und 1960er Jahre.',
  B300: 'Sonderbeton für stark belastete Hallenbinder, weitgespannte Rippendecken oder Pfeiler.',
  B450: 'Spannbetongüte nach DIN 4227; in der Zuordnungstabelle nicht enthalten – Festigkeit über Bohrkerne (DIN EN 13791) ermitteln.',
  B600: 'Spannbetongüte nach DIN 4227; in der Zuordnungstabelle nicht enthalten – Festigkeit über Bohrkerne (DIN EN 13791) ermitteln.',
};
const klasseOderStrich = (k: string | null) => k ?? 'unter C8/10';
const klassenSpanne = (u: string | null, o: string | null) => (klasseOderStrich(u) === klasseOderStrich(o) ? klasseOderStrich(u) : `${klasseOderStrich(u)} bis ${klasseOderStrich(o)}`);
const altbetonZeilen: HistoricalRecord[] = (Object.keys(ALTBETON_ZUORDNUNG) as AltbetonKlasse[]).map(k => {
  const z = ALTBETON_ZUORDNUNG[k];
  return z.spannbeton
    ? { old: `${z.label} (DIN 1045 vor 1972, Spannbeton)`, new: '– (nicht tabelliert)', f_old: formatDeZahl(z.kpCm2 * KP_CM2_IN_N_MM2, 1), f_new: '–', explanation: ALTBETON_ERKLAERUNG[k] }
    : { old: `${z.label} (DIN 1045 vor 1972)`, new: `${klassenSpanne(z.klasseUnten, z.klasseOben)} (nur Vorbemessung)`, f_old: formatDeZahl(z.kpCm2 * KP_CM2_IN_N_MM2, 1),
        f_new: `${formatDeZahl(z.fckUnten, 1)} – ${formatDeZahl(z.fckOben, 1)}`, explanation: ALTBETON_ERKLAERUNG[k] };
});

/**
 * Zeilen Bn/B (DIN 1045:1972/1988) und Bk (DDR 1981–1990) aus dem zweiten Teil der gemeinsamen Tabelle
 * (ALTBETON_1972_2001; Schnell/Fischer/Loch 2008, Tab. 2.2; Entscheidung 29.10.2026, Nachtrag). Vorher Orientierungswerte
 * u. a. „Bn 250 / B 25 → C 20/25“ und die nicht belegten DDR-Klassen BK 12.5 … BK 37.5.
 */
const ALTBETON_1972_ERKLAERUNG: Readonly<Record<string, string>> = {
  'Bn 50 / B 5': 'Magerbeton für Sauberkeitsschichten und Füllbeton; keiner Festigkeitsklasse zugeordnet.',
  'Bn 100 / B 10': 'Unbewehrter Beton geringer Festigkeit, z. B. für Streifenfundamente.',
  'Bn 150 / B 15': 'Unterste Klasse für bewehrte Bauteile (Beton B I).',
  'Bn 250 / B 25': 'Sehr verbreiteter Konstruktionsbeton für Decken, Wände und Stützen zwischen 1972 und 2001.',
  'Bn 350 / B 35': 'Beton B II für höher beanspruchte Bauteile, z. B. Stützen und wasserundurchlässige Bauteile.',
  'Bn 450 / B 45': 'Beton B II für hoch beanspruchte Bauteile und Fertigteile.',
  'Bn 550 / B 55': 'Höchste Klasse der DIN 1045:1972/1988, vor allem für hoch beanspruchte Fertigteile.',
  'Bk 5': 'DDR-Betonklasse für Sauberkeitsschichten und Füllbeton; keiner Festigkeitsklasse zugeordnet.',
  'Bk 7,5': 'DDR-Betonklasse für unbewehrte, gering beanspruchte Bauteile; keiner Festigkeitsklasse zugeordnet.',
  'Bk 10': 'DDR-Betonklasse für unbewehrte Fundamente und Massenbeton.',
  'Bk 15': 'DDR-Betonklasse für gering beanspruchte bewehrte Bauteile.',
  'Bk 20': 'DDR-Betonklasse für bewehrte Bauteile des Hochbaus.',
  'Bk 25': 'DDR-Konstruktionsbeton für Decken, Wände und Fertigteile.',
  'Bk 35': 'DDR-Betonklasse für höher beanspruchte Fertigteile, Stützen und Binder.',
  'Bk 45': 'DDR-Betonklasse für hoch beanspruchte Fertigteile.',
  'Bk 55': 'Höchste DDR-Betonklasse der Zuordnungstabelle, für hoch beanspruchte Fertigteile.',
};
const altbeton1972Zeilen: HistoricalRecord[] = ALTBETON_1972_2001.map(z => ({
  old: `${z.label} (${z.regelwerk})`,
  new: z.klasse ?? '– (keine Klasse)',
  f_old: formatDeZahl(z.nennfestigkeit, Number.isInteger(z.nennfestigkeit) ? 0 : 1),
  f_new: formatDeZahl(z.fck, 1),
  explanation: ALTBETON_1972_ERKLAERUNG[z.label],
}));

export const historicalData: Record<MaterialCategory, HistoricalCategoryData> = {
  beton: {
    title: 'Beton (Druckfestigkeiten)',
    description: 'Vergleich alter Betonfestigkeitsklassen (Bn / B) nach DIN 1045 (1972/1988) sowie DDR-Klassen (BK) nach TGL mit aktuellen Klassen (C) nach Eurocode 2 (DIN EN 1992-1-1). Ältere Klassen bezogen sich auf die 28-Tage-Würfeldruckfestigkeit (200-mm-Würfel; bis 1943 Serienmittelwerte, ab 1972 Nennfestigkeit als 5-%-Fraktile), die heutigen C-Klassen auf f_ck (Zylinder) und f_ck,cube (150-mm-Würfel). Für die Güten vor 1972 (B 120 bis B 600) gilt die gemeinsame Zuordnungstabelle wie in der Beispielrechnung „Bauen im Bestand“: charakteristische Festigkeit f_ck (Spalte „Neu“, MPa) und Klasse für die untere bis obere Grenze der damaligen Ausführungsqualität nach Schnell/Fischer/Loch (Kurzbericht BBR 2008, Tab. 2.1), nur für die Vorbemessung; B 450 und B 600 (Spannbeton) sind dort nicht enthalten. Für die Klassen 1972–2001 (Bn nach DIN 1045:1972, B nach DIN 1045:1978/1988) und die DDR-Klassen Bk (1981–1990) gilt Tab. 2.2 derselben Quelle: Da die Nennfestigkeit β_WN ab 1972 bereits ein 5-%-Quantil ist, rechnet sie nur Probeform und Lagerung um (f_ck rund 0,77·β_WN, Bk rund 0,74·Klassenwert); Spalte „Neu“ ist der Rechenwert f_ck, die Klasse ist teils nur näherungsweise („≈“). Alle Zuordnungen dienen der Vorbemessung; maßgebend ist eine Bauwerksuntersuchung mit Bohrkernprüfung (DIN EN 13791).',
    normOld: 'Bestimmungen des Deutschen Ausschusses für Eisenbeton (ab 1916), DIN 1045 (1932 / 1943 / 1972 / 1988), TGL (DDR)',
    normNew: 'DIN EN 1992-1-1 (Eurocode 2)',
    data: [
      { old: 'Stampfbeton (vor 1900)', new: '-', f_old: 'ca. 5 - 10', f_new: '-', explanation: 'Hauptsächlich für unbewehrte Gründungen, Widerlager und Kellerwände genutzt. Handgemischt, oft stark streuende Qualität.' },
      { old: 'Kiesbeton (ca. 1916)', new: '-', f_old: '11 - 14', f_new: '-', explanation: 'Erste bewehrte Platten und Balken. Verbundversagen durch mangelhafte Kornzusammensetzung war damals ein Risiko.' },
      ...altbetonZeilen,
      ...altbeton1972Zeilen
    ]
  },
  betonstahl: {
    title: 'Betonstahl (Bewehrung)',
    description: 'Entwicklung der Bewehrungsstähle in Deutschland ab 1937. Früher wurden glatte, ungeprägte Stähle (Gruppe I) verwendet, was zwingende Endhaken zur Verankerung erforderte (reiner Haftverbund). 1936 erfand R. Schmidt in Österreich den Torstahl (Gruppe IIIb) durch Kaltverdrillung mit verdrillter Längsrippe für mechanischen Scherverbund. Moderne Stähle weisen Schrägrippen nach DIN 488 auf.',
    normOld: 'DIN 1045 (1937 / 1943 / 1972 / 1988), TGL 22424 (DDR)',
    normNew: 'DIN EN 1992-1-1 / DIN 488',
    data: [
      { old: 'Schmiedeeisen (vor 1890)', new: '-', f_old: 'ca. 200', f_new: '-', explanation: 'Keinerlei ausgeprägte elastische Grenzen. Flachstahl oder ungerippte Schmiedestäbe. Verbundwirkung beruht rein auf Haftung im Zementstein.' },
      { old: 'Flusseisen (1890 - 1930)', new: '-', f_old: 'ca. 220 - 240', f_new: '-', explanation: 'Vollkommen glatte Rundstähle mit mäßiger Zähigkeit. Hakenbildung an den Stabenden unumgänglich, da sonst akute Verbundspaltung droht.' },
      { old: 'BSt 22/34 (Gruppe I, DIN 1045:1937)', new: '-', f_old: 220, f_new: 220, explanation: 'Glatter Weichstahl. Kraftübertragung fast nur über Adhäsion und obligatorische Endhaken. Extrem hohe Duktilität. Zugfestigkeit fu = 340 N/mm².' },
      { old: 'BSt 34/50 (Gruppe IIa, DIN 1045:1937)', new: '-', f_old: 340, f_new: 340, explanation: 'Profilstahl mit erhöhter Festigkeit, fu = 500 N/mm². Übergangsform zu gerippten Stählen.' },
      { old: 'BSt 42/50 (Gruppe IIIb) Torstahl', new: 'B500A / B500B', f_old: 420, f_new: 500, explanation: '1936 von R. Schmidt in Österreich erfunden. Durch Kaltverdrillung (Torsion) kaltverfestigt. Verdrillte Längsrippe erzeugt hervorragenden mechanischen Scherverbund (fu = 500 N/mm²).' },
      { old: 'St II-T / Torstahl (DDR TGL)', new: '-', f_old: 300, f_new: '-', explanation: 'Kaltverdrehter DDR-Torstahl mit zwei durchlaufenden Längskantenrippen. Festigkeitsgrenze f_yk = 300 MPa.' },
      { old: 'Betonstahl II (BSt 300/420)', new: '-', f_old: 300, f_new: '-', explanation: 'Glatte Konturen mit querstehenden Schweißpunkten oder Halbrippen. Eher seltene Übergangssorte.' },
      { old: 'St I-G (DDR TGL 22424)', new: '-', f_old: 220, f_new: '-', explanation: 'Glatter DDR-Rundstahl für unbedeutende Bauteile, konstruktive Querbewehrung oder Ringbalken.' },
      { old: 'St III-T / Torstahl (DDR TGL)', new: '-', f_old: 400, f_new: '-', explanation: 'DDR-Tragstahl durch Kaltverdrehung veredelt, f_yk = 400 MPa. Sehr gute Festigkeitswerte für Deckenplatten.' },
      { old: 'St III-U (DDR TGL 22424)', new: '-', f_old: 420, f_new: '-', explanation: 'Naturharter, warmgewalzter schräggerippter Stahl, f_yk = 420 MPa. Sehr häufig in Plattenbaufugen und Skelettstützen anzutreffen.' },
      { old: 'Betonstahl III (BSt 420/500 RU/RK)', new: '-', f_old: 420, f_new: '-', explanation: 'Klassischer Schrägrippenstahl der Bundesrepublik im mittleren 20. Jahrhundert. Warmgewalzt naturhart (RU) oder kaltverformt (RK).' },
      { old: 'St IV-T / Torstahl (DDR TGL)', new: 'B500A / B500B', f_old: 500, f_new: 500, explanation: 'Höchstverdrehter kaltverformter Stahl der DDR für hoch beanspruchte Decken und Fundamente.' },
      { old: 'Betonstahl IV (BSt 500S / 500M)', new: 'B500A / B500B / B500C', f_old: 500, f_new: 500, explanation: 'Aktueller Standard-Bewehrungsstahl mit entgegengesetzt schrägen Rippenreihen zur Erhöhung des Verbundbeiwertes (f_yk = 500 MPa).' }
    ]
  },
  baustahl: {
    title: 'Baustahl & Eisenwerkstoffe (Gusseisen / Schmiedeeisen / Flussstahl)',
    description: 'Im historischen Eisen- und Stahlbau muss strikt zwischen Gusseisen (hoher C-Gehalt, spröde, reduzierter E-Modul von 80–140 GPa), Schmiedeeisen (Puddelstahl mit Schlackezeilen und Anisotropie) und frühem Flussstahl (ab DIN 1050 von 1934 mit St 37 und St 52) differenziert werden. Bei fehlender Fließgrenze dient die 0,2 %-Dehngrenze (R_p0,2) als Ersatzwert.',
    normOld: 'DIN 1050 (1934) / DIN 17100 / DIN 1611',
    normNew: 'DIN EN 10025-2',
    data: [
      { old: 'Gusseisen (Grauguss, vor 1900)', new: '-', f_old: 'Zug: 100 - 200, Druck: 500 - 800', f_new: '-', explanation: 'Hoher C-Gehalt. Sehr gute Druckfestigkeit, versagt unter Zug jedoch schlagartig spröde. Brinellhärte HB 150–250. WICHTIG: E-Modul nur 80–140 GPa (reduziert Euler-Knicklast massiv!).' },
      { old: 'Schmiedeeisen / Puddelstahl', new: '-', f_old: 'ca. 180 - 220', f_new: '-', explanation: 'Duktiles Schweißeisen aus dem Puddelverfahren. Feine Schlackezeilen führen zu ausgeprägter Anisotropie (Querfestigkeit stark vermindert). Kaum schweißbar.' },
      { old: 'Flusseisen (ab ca. 1890)', new: 'S185', f_old: 'ca. 220', f_new: 185, explanation: 'Der erste Stahl des modernen Industriezeitalters. Homogenes elastisches Gefüge, E-Modul ca. 210 GPa.' },
      { old: 'St 33 (DIN 17100)', new: 'S185', f_old: 185, f_new: 185, explanation: 'Unlegierter Baustahl für untergeordnete Schlosserarbeiten ohne Schweißanforderungen.' },
      { old: 'St 37-2 (DIN 1050:1934 / DIN 17100)', new: 'S235JR', f_old: 235, f_new: 235, explanation: 'Der universelle Klassiker des deutschen Stahlbaus. Streckgrenze 235 MPa, Zugfestigkeit 370–450 MPa. Hervorragende Duktilität.' },
      { old: 'St 44-2 (DIN 17100)', new: 'S275JR', f_old: 275, f_new: 275, explanation: 'Mittelfester Profilstahl für anspruchsvollere Pfosten-Riegel-Fassaden oder Schweißrahmenträger.' },
      { old: 'St 52-3 (DIN 1050:1934 / DIN 17100)', new: 'S355J2', f_old: 355, f_new: 355, explanation: 'Feinkornbaustahl mit hoher Streckgrenze (355 MPa, Zugfestigkeit 520–620 MPa). Weit verbreitet im Skelett- und Industriebau.' },
      { old: 'St 50-2 (DIN 17100)', new: 'E295', f_old: 295, f_new: 295, explanation: 'Maschinenbaustahl, nicht primär schweißbar. f_yd = 295 MPa. Im Hochbau meist als Bolzen oder Schwellplatten genutzt.' },
      { old: 'St 60-2 (DIN 17100)', new: 'E335', f_old: 335, f_new: 335, explanation: 'Zäher und fester Schienenstahl (entspricht heute E335). Rechnerischer Nachweis benötigt genaue Werkstoffproben!' },
      { old: 'St 70-2 (DIN 17100)', new: 'E360', f_old: 360, f_new: 360, explanation: 'Höchstzäher Vergütungsstahl des klassischen Industrieparks. Entspricht heute E360.' }
    ]
  },
  holz: {
    title: 'Holz (Nadelholz)',
    description: 'Balken- und Tragkonstruktionen im Bestand wurden früher rein visuell nach Güteklassen (I, II, III) sortiert. Heute erfolgt die Einordnung in normierte Festigkeitsklassen (z. B. C24 für Standard-Fichte/Kiefer) nach DIN EN 338. Beachten Sie, dass die zulässigen Biegespannungen früherer Normen nicht direkt mit den heutigen charakteristischen Festigkeitswerten f_m,k gleichzusetzen sind, da das moderne Teilsicherheitskonzept Minderungswerte wie k_mod hinzuzieht.',
    normOld: 'DIN 1052 (1940 / 1988), DIN 4074',
    normNew: 'DIN EN 1995-1-1 (Eurocode 5) / DIN EN 338',
    data: [
      { old: 'Güteklasse I (vor 1940)', new: '-', f_old: 'ca. 10,0 MPa (Zulässige Biegung)', f_new: '-', explanation: 'Uralte, handverlesene Dachstuhlhölzer mit extrem engen Jahresringbreiten. Hohe Harzdurchdringung schützt vor Schädlingsbefall.' },
      { old: 'Güteklasse II (vor 1940)', new: '-', f_old: 'ca. 7,0 MPa', f_new: '-', explanation: 'Das klassische ländliche Tragholz für Deckenbalkenlagen alter Wohnwirtschaftsgebäude.' },
      { old: 'S 13 / Güteklasse I (DIN 4074)', new: 'C30', f_old: '13,0 MPa (Zulässige Biegung)', f_new: 30, explanation: 'Hochwertiges astfreies Nadelholz für weitgespannte Pfettendächer oder Kehlbalkenlagen.' },
      { old: 'S 10 / Güteklasse II (DIN 4074)', new: 'C24', f_old: '10,0 MPa (Zulässige Biegung)', f_new: 24, explanation: 'Der unangefochtene Standard-Balkenwert. Fast 85% aller historischen Sparren und Rähme wurden als Güteklasse II ausgeführt.' },
      { old: 'S 7 / Güteklasse III (DIN 4074)', new: 'C16', f_old: '7,0 MPa (Zulässige Biegung)', f_new: 16, explanation: 'Holz mit vermehrtem Astanteil oder leichtem Faserverlauf. Nur für untergeordnete Nebentragwerke wie Schalungen zulässig.' },
      { old: 'BS 11 (Brettschichtholz)', new: 'GL24c', f_old: '11,0 MPa (Zulässige Biegung)', f_new: 24, explanation: 'Frühes kombiniertes Leimholzteil aus Lamellen geringerer Güte. Festigkeit im Kern f_m,g,k = 24 MPa.' },
      { old: 'BS 14 (Brettschichtholz)', new: 'GL28c', f_old: '14,0 MPa (Zulässige Biegung)', f_new: 28, explanation: 'Hochbelastbares Schichtholzelement für offene Hallendachstühle mit f_m,g,k = 28 MPa.' }
    ]
  },
  mauerwerk: {
    title: 'Mauerwerk & Steine',
    description: 'Historisches Mauerwerk unterliegt hohen Streuungen (Variationskoeffizient V_x = 20–30 %). Vor dem 2. Weltkrieg (DIN 105 ab 1936) galt Mindestdruckfestigkeit 100 kg/cm² (10 MPa). 1952 folgten Normalformat NF (240x115x71), DF und Lochziegel (HLz). Ein diagnostischer Meilenstein ist die DIN 105 von 1957 mit Farbkennzeichnungen auf der Sichtfläche: Grüner Balken (150/HLz 12) vs. Weißer Balken (250/HLz 20 Hartbrandziegel) mit signifikant höheren zulässigen Druckspannungen.',
    normOld: 'DIN 105 (1936 / 1952 / 1957), DIN 1053-1 (1996)',
    normNew: 'DIN EN 1996-1-1 (Eurocode 6)',
    data: [
      { old: 'DIN 105 (1957) - Weißer Balken (Festigkeit 250)', new: 'Mz 20 / HLz 20 (SFK 20)', f_old: 'Zul. σ = 2,4 MPa', f_new: 20, explanation: 'Farbkennzeichnung DIN 105 (1957): Weißer Balken auf Sichtfläche kennzeichnet Hartbrandziegel der Güte 250. Ermöglicht zulässige Mauerwerksspannung von 2,4 MPa (NM II) – enorme statische Reserve!' },
      { old: 'DIN 105 (1957) - Grüner Balken (Festigkeit 150)', new: 'Mz 12 / HLz 12 (SFK 12)', f_old: 'Zul. σ = 1,4 MPa', f_new: 12, explanation: 'Farbkennzeichnung DIN 105 (1957): 15 mm breiter grüner Balken markiert Festigkeit 150 (entspricht etwa HLz 12). Zulässige Druckspannung ca. 1,4 MPa.' },
      { old: 'Mauerziegel 2. Klasse (DIN 105:1936)', new: 'SFK 10', f_old: '100 kg/cm² (10 MPa)', f_new: 10, explanation: 'Vorkriegsnormung: Garantierte Mindestdruckfestigkeit 100 kg/cm² für gebrannte Ziegel der 2. Klasse.' },
      { old: 'Klosterformat (KF, vor 1850)', new: '-', f_old: 'ca. 8 - 12 (Stein)', f_new: '-', explanation: 'Mittelalterliche Ziegelsteine mit den Prachtmaßen 280 x 140 x 85 mm. Weich im Kern gebrannt. Hohe Saugfähigkeit.' },
      { old: 'Reichsformat (RF, ab 1872)', new: '-', f_old: 'ca. 10 - 15 (Stein)', f_new: '-', explanation: 'Standardisiertes Gründerzeit-Format (250 x 120 x 65 mm). Maschinelle Herstellung, solide Tonqualität.' },
      { old: 'Kalksandstein (alt, vor 1930)', new: '-', f_old: 'ca. 10 - 20 (Stein)', f_new: '-', explanation: 'Erste weisse, dichte Presssandsteine. Extrem schalldämmend, anfällig für sauren Regen.' },
      { old: 'MZ / KSV / HLZ - SFK 4', new: 'Mauersteingruppe 1 (SFK 4)', f_old: 4, f_new: 4, explanation: 'Vollziegel geringer Dichte für einfache Trennwände.' },
      { old: 'MZ / KSV / HLZ - SFK 12', new: 'Mauersteingruppe 1 (SFK 12)', f_old: 12, f_new: 12, explanation: 'Der weitverbreitete Standardvollziegel im zwei- und dreigeschossigen Altbau-Mauerwerk.' },
      { old: 'MZ / KSV / HLZ - SFK 20', new: 'Mauersteingruppe 1 (SFK 20)', f_old: 20, f_new: 20, explanation: 'Hochfester Klinker oder Kalksandstein für Kellermauern oder stark beanspruchte Pfeilerbögen.' },
      { old: 'PB - SFK 2 (Porenbeton)', new: 'Porenbeton (SFK 2)', f_old: 2, f_new: 2, explanation: 'Wärmedämmende Gasbetonsteine der 1970er Jahre. Geringe statische Reserve.' },
      { old: 'PB - SFK 4 (Porenbeton)', new: 'Porenbeton (SFK 4)', f_old: 4, f_new: 4, explanation: 'Tragende Gasbetonscheiben zur statischen Lastübertragung.' }
    ]
  }
};
