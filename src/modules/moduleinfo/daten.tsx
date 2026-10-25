// Ausgelagert aus src/modules/ModuleInfo.tsx (AP 5.2)
import type React from 'react';
import {
  Layers,
  ClipboardCheck,
  BookOpen,
  FileText,
  Globe,
  Scale,
  FlaskConical,
  ShieldAlert,
  FileSearch,
  Microscope,
  Beaker,
  BarChart3,
  Mountain,
  LayoutGrid,
  Trees,
  Flame,
  Maximize,
  Award,
  TrendingUp,
  Monitor,
  Search,
  RefreshCw,
  Landmark,
  Compass,
  History,
  Trash2,
  Recycle,
  AlertTriangle,
  Volume2,
  Thermometer,
  Activity,
  Box,
  GitCommit,
  Droplets,
  FileCheck,
  Factory,
  FileWarning,
  TrendingDown,
  Wrench,
  GraduationCap,
  Sparkles,
  Terminal,
  Calculator,
  Waves,
  Network
} from 'lucide-react';

// Inline Custom SVG Helper Icons
export interface HilfsIconProps { size?: number | string; className?: string }
/** Lucide-Icon oder eines der Hilfs-Icons unten */
export type ModulInfoIcon = React.ComponentType<HilfsIconProps>;

export const TableIcon = (props: HilfsIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M12 3v18" />
    <path d="M3 12h18" />
    <rect width="18" height="18" x="3" y="3" rx="2" />
  </svg>
);

export const LeafIcon = (props: HilfsIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2Z" />
    <path d="M9 22v-4" />
  </svg>
);

export const CircleDashedIcon = (props: HilfsIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M10.1 2.18a10 10 0 0 0-4.82 2.72" />
    <path d="M2.5 11a10 10 0 0 0 .68 4.2" />
    <path d="M5.14 19.5a10 10 0 0 0 4.18 2.62" />
    <path d="M14 21.8a10 10 0 0 0 4.3-1.6" />
    <path d="M20.2 16.2c.4-.7.8-1.5 1-2.3" />
    <path d="M21.8 10a10 10 0 0 0-1.6-4.3" />
    <path d="M17.3 3.1a10 10 0 0 0-3.3-1" />
  </svg>
);

export const QrCodeIcon = (props: HilfsIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <rect width="5" height="5" x="3" y="3" rx="1" />
    <rect width="5" height="5" x="16" y="3" rx="1" />
    <rect width="5" height="5" x="3" y="16" rx="1" />
    <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
    <path d="M21 21v.01" />
    <path d="M12 7v3a2 2 0 0 1-2 2H7" />
    <path d="M3 12h.01" />
    <path d="M12 3h.01" />
    <path d="M12 12h.01" />
    <path d="M16 12h.01" />
    <path d="M21 12h.01" />
    <path d="M12 16v.01" />
    <path d="M12 21v.01" />
  </svg>
);

export const Building2Icon = (props: HilfsIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
    <path d="M18 22H4" />
    <path d="M20 22h-2" />
    <path d="M14 6h2" />
    <path d="M14 10h2" />
    <path d="M14 14h2" />
    <path d="M14 18h2" />
    <path d="M8 6h2" />
    <path d="M8 10h2" />
    <path d="M8 14h2" />
    <path d="M8 18h2" />
  </svg>
);

export interface SubmoduleItem {
  title: string;
  icon: ModulInfoIcon;
  purpose: string;
  standards: string;
  useCase: string;
}

export interface GroupData {
  title: string;
  tagline: string;
  icon: ModulInfoIcon;
  basicsTitle: string;
  basicsDesc1: string;
  basicsDesc2: string;
  basicsCards: { title: string; desc: string }[];
  submodules: SubmoduleItem[];
  didacticCards: { title: string; desc: string }[];
  appStudents: string;
  appProfessionals: string;
  wikipedia: { title: string; url?: string }[];
  literatur: string[];
  regelwerke: { title: string; url?: string }[];
  formeln: { formel: string; erklaerung: string; quelle: string }[];
}

export const MODULES_DATA: Record<string, GroupData> = {
  grundlagen: {
    title: 'Bauingenieur-Grundlagen',
    tagline: 'Mathematische, physikalische und chemische Basiskonzepte für Tragwerk und Baustoffkunde',
    icon: Scale,
    basicsTitle: 'Wissenschaftliche Säulen des Bauingenieurwesens',
    basicsDesc1: 'Jedes Bauwerk basiert auf Naturgesetzen und deren strukturierter Anwendung. Die Grundlagen verbinden formale Maßeinheiten, materialübergreifende Kennwerte sowie mechanische Beanspruchungsmodelle zu einem einheitlichen Tragsicherheits- und Bemessungsrahmen.',
    basicsDesc2: 'Durch das Erfassen elementarer physikalisch-chemischer Vorgänge wie Hydratationswärme, Säurebelastung und Teilsicherheitsfaktoren wird das Fundament für alle vertiefenden Disziplinen wie Massivbau, Geotechnik und Bauphysik gelegt.',
    basicsCards: [
      { title: 'Dimensionsanalyse', desc: 'Sichere Handhabung physikalischer Größen (Spannungen, Festigkeiten, Schwingungen) im SI-Einheitensystem.' },
      { title: 'Materialkenndaten', desc: 'Umfassendes tabellarisches Zahlenwerk für Rohdichten, Bruchspannungen, Dehnungen und thermische Ausdehnungen.' }
    ],
    submodules: [
      { title: 'Einheiten', icon: Scale, purpose: 'Umrechner und Erklärungen für Spannungen, Kräfte, Drücke, Momente, Energie und Temperatur.', standards: 'DIN 1301-1, DIN EN ISO 80000-1', useCase: 'Umrechnen von Pascal, bar und Newton je Quadratmillimeter; Momente von kNm in Nmm.' },
      { title: 'Kennwerte', icon: TableIcon, purpose: 'Schnellübersicht charakteristischer Baustoffparameter verschiedenster Materialklassen.', standards: 'Albert, A. (Hrsg.): Schneider – Bautabellen für Ingenieure. 26. Aufl., Köln: Reguvis 2024', useCase: 'Ablesen des Elastizitätsmoduls von Buchenholz oder Baustahl S235.' },
      { title: 'Baustoffkenngrößen', icon: Layers, purpose: 'Physikalische Kennziffern wie Porosität, Dichtegrade, Feuchtegehalt und Wasseraufnahme.', standards: 'DIN EN ISO 10456, DIN 4108-3/-4, DIN EN ISO 12570/15148', useCase: 'Bestimmung der Porosität aus Rein- und Rohdichte; s_d- und w-Wert einer Putzschicht.' },
      { title: 'Bauchemie', icon: FlaskConical, purpose: 'Hydratation, Zusatzmittel, chemische Angriffe, Salze, Korrosion sowie Kleb- und Dichtstoffe.', standards: 'DIN EN 206/DIN 1045-2, DIN EN 934-2, DIN EN 1504, DIN EN 15651', useCase: 'Berechnung des korrosionskritischen Carbonatisierungsfortschritts.' },
      { title: 'Eurocode', icon: ShieldAlert, purpose: 'Einführung in das semiprobabilistische Sicherheitskonzept mit Teilsicherheitsbeiwerten.', standards: 'DIN EN 1990 (Eurocode 0)', useCase: 'Ermittlung der maßgebenden Einwirkungskombination für Grundkombinationen nach Gl. 6.10.' },
      { title: 'Baustoffkunde', icon: Layers, purpose: 'Systematische Klassifikation aller Werkstoffklassen (mineralisch, metallisch, organisch, Verbundstoffe) und Gefügearten.', standards: 'DIN EN-Normengruppen / Wendehorst', useCase: 'Grundlagenorientierte Werkstoffauswahl nach Festigkeits-, Dauerhaftigkeits- und Umweltkriterien.' },
      { title: 'Regulatives', icon: Scale, purpose: 'Übersicht über baurechtliche Regelungen, Baugesetzbuch, Landesbauordnungen und harmonisierte europäische Normen.', standards: 'BauPVO (EU) 2024/3110, MBO/LBO, MVV TB, BGB/VOB', useCase: 'Prüfen der Notwendigkeit einer allgemeinen bauaufsichtlichen Zulassung (abZ).' }
    ],
    didacticCards: [
      { title: 'Theoretische Herleitung', desc: 'Kompakte physikalische Gesetzmäßigkeiten verständlich auf den Punkt gebracht.' },
      { title: 'Mathematische Strenge', desc: 'Verwendung normkonformer LaTeX-Formelsätze und eindeutiger Variablenbezeichnungen.' },
      { title: 'Regulativer Abgleich', desc: 'Einordnung nationaler (DIN) und europäischer (EN) Normungsstrategien im Wandel des Baurechts.' }
    ],
    appStudents: 'Zur Vorbereitung auf Klausuren in Baustoffkunde, Statik und Technischer Mechanik.',
    appProfessionals: 'Schnelles Nachschlagen von Sicherheitsbeiwerten und Materialkennwerten; maßgebend bleiben die aktuellen Regelwerke.',
    wikipedia: [
      { title: 'Internationales Einheitensystem', url: 'https://de.wikipedia.org/wiki/Internationales_Einheitensystem' },
      { title: 'Eurocode', url: 'https://de.wikipedia.org/wiki/Eurocode' }
    ],
    literatur: [
      'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
      'Albert, A. (Hrsg.): Schneider – Bautabellen für Ingenieure. 26. Aufl., Köln: Reguvis 2024'
    ],
    regelwerke: [
      { title: 'DIN EN 1990: Eurocode 0 - Grundlagen der Tragwerksplanung' },
      { title: 'DIN 1301-1:2010-10: Einheiten – Einheitennamen, Einheitenzeichen' },
      { title: 'DIN EN ISO 10456: Wärme- und feuchtetechnische Eigenschaften – Tabellierte Bemessungswerte' },
      { title: 'Bauproduktenverordnung (EU) 2024/3110', url: 'https://eur-lex.europa.eu/eli/reg/2024/3110/oj' }
    ],
    formeln: [
      { formel: 'E_d \\leq R_d', erklaerung: 'Grundformel des semiprobabilistischen Sicherheitskonzepts. Die Bemessungswerte der Beanspruchungen E_d müssen kleiner/gleich den Bemessungswerten der Tragwiderstände R_d sein.', quelle: 'DIN EN 1990' }
    ]
  },
  labor: {
    title: 'Labor, Sensorik & Analytik',
    tagline: 'Praxisnahe Prüfverfahren, moderne Bauwerksdiagnostik und statistische Versuchsplanung',
    icon: Microscope,
    basicsTitle: 'Qualitätssicherung durch messtechnische Verifikation',
    basicsDesc1: 'Ingenieurbaustoffe und Bauwerke unterliegen Alterungsprozessen und Fertigungsschwankungen. Dieses Modul bündelt das Wissen über physikalische Versuche im Labor, zerstörungsfreie Prüfverfahren (ZfP) vor Ort sowie die fundierte mathematische Analyse.',
    basicsDesc2: 'Durch kontrollierte Zerstörung (Biegezug, Druckversuche) und moderne Diagnostik (Mikroskopie, XRD, Ultraschall) ermitteln wir die tatsächlichen Ist-Zustände, um Tragreserven zu bewerten und Schäden einzugrenzen.',
    basicsCards: [
      { title: 'Laborversuche', desc: 'Virtuelle Labore zur zerstörenden und zerstörungsfreien Werkstoffprüfung (Haftzugprüfung nach DIN EN 1542, Biege- & Spaltzug, E-Modul, Schmidt-Hammer).' },
      { title: 'Statistische Absicherung', desc: 'Beurteilung von Prozessdaten, Standardabweichung, Signifikanztests und Konformitätsnachweisen.' }
    ],
    submodules: [
      { title: 'Probenahme & Erkundung', icon: FileSearch, purpose: 'Repräsentative Beprobung von Haufwerken sowie Entnahme von Bohrkernen, Bohrmehl und Rückprallmessungen am Bauwerk.', standards: 'LAGA PN 98, DIN 19698-1, DIN EN 12504-1/-2, DIN EN 13791', useCase: 'Planung von Bohrkern- und Bohrmehlentnahmen an einer Parkdeckstütze.' },
      { title: 'Messen & Prüfen', icon: Scale, purpose: 'Messtechnische Begriffe (Kalibrieren, Justieren, Eichen), Richtigkeit und Präzision, Messunsicherheit nach GUM und Eignungsprüfungen.', standards: 'JCGM 100 (GUM), ISO 5725-1, DIN ISO 13528, DIN EN ISO 7500-1', useCase: 'Unsicherheitsbudget einer Druckprüfung und Bewertung eines Ringversuchs (z-Score, En-Zahl).' },
      { title: 'Analytik & Diagnostik', icon: Microscope, purpose: 'Chemische und mineralogische Laborverfahren wie TGA, Röntgendiffraktometrie, RFA, Porosimetrie und Rasterelektronenmikroskopie.', standards: 'DIN EN 14629, DIN ISO 15901-1, DIN EN 13925-1', useCase: 'Nachweis von Ettringit-Nadeln im rasterelektronenmikroskopischen Bild.' },
      { title: 'Mechanische Prüfungen', icon: ClipboardCheck, purpose: 'Durchführung zerstörender Festigkeitsprüfungen im Labor, Druckprüfmaschinen, Biegezugvorrichtungen.', standards: 'DIN EN 12390-3', useCase: 'Ermittlung der 28-Tage-Zylinderdruckfestigkeit.' },
      { title: 'Virtuelle Versuche', icon: Beaker, purpose: 'Lehrsimulationen von Standardversuchen mit Messreihen, Lastkurven und Rissbildung.', standards: 'DIN EN 12390, DIN EN 1542, DIN EN 12350, DIN EN 12504-2', useCase: 'Ermittlung der Spannungs-Dehnungs-Linie im interaktiven Zugversuch.' },
      { title: 'Statistik & Auswertung', icon: BarChart3, purpose: 'Berechnung von Vertrauensbereichen, Quantilwerten und Gauß\'schen Normalverteilungen.', standards: 'DIN EN 1990, Anhang D; ISO 12491', useCase: 'Berechnung der charakteristischen 5%-Quantil-Festigkeit aus 10 Probekörpern.' },
      { title: 'Festbeton (Statistik)', icon: BarChart3, purpose: 'Interaktive Konformitätskontrolle und statistische Festigkeitsauswertung von Beton-Güteserien.', standards: 'DIN EN 206, Tab. 14', useCase: 'Prüfung der Konformitätskriterien für Normal- oder Leichtbeton-Druckfestigkeit im Werk.' }
    ],
    didacticCards: [
      { title: 'Praxisnahes Labordesign', desc: 'Verbindung von haptischer Werkstoffprüfung mit numerischer Rechenpräzision.' },
      { title: 'Nachvollziehbare Auswertungen', desc: 'Ausreißertests nach etablierten Verfahren – Werte werden nur mit technischer Begründung ausgeschlossen.' },
      { title: 'Validierung der Sensorik', desc: 'Verstehen von Messabweichungen, Fehlergrenzen und Genauigkeitsklassen von Prüfmaschinen.' }
    ],
    appStudents: 'Hilft Studierenden, Laborpraktika virtuell vorzubereiten, Versuche nachzuvollziehen und wissenschaftlich saubere Laborberichte zu schreiben.',
    appProfessionals: 'Unterstützt Prüfingenieure und Betonprüfer bei der statistischen Bewertung von Baustellen-Würfelserien und Abnahmeentscheidungen.',
    wikipedia: [
      { title: 'Zerstörungsfreie Prüfung', url: 'https://de.wikipedia.org/wiki/Zerst%C3%B6rungsfreie_Pr%C3%BCfung' },
      { title: 'Normalverteilung', url: 'https://de.wikipedia.org/wiki/Normalverteilung' }
    ],
    literatur: [
      'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
      'Hedderich, J.; Sachs, L.: Angewandte Statistik – Methodensammlung mit R. 16. Aufl., Berlin: Springer Spektrum 2018',
      'Scrivener, K.; Snellings, R.; Lothenbach, B. (Hrsg.): A Practical Guide to Microstructural Analysis of Cementitious Materials. Boca Raton: CRC Press 2016'
    ],
    regelwerke: [
      { title: 'DIN EN 12504-1: Prüfung von Beton im Bauwerk - Teil 1: Bohrkernproben' },
      { title: 'ISO 12491:1997-05: Statistische Verfahren für die Güteüberwachung von Bauprodukten und Bauteilen' },
      { title: 'DIN EN 206:2021-06: Beton – Festlegung, Eigenschaften, Herstellung und Konformität' },
      { title: 'DIN EN 13791:2020-02: Bewertung der Druckfestigkeit von Beton in Bauwerken' }
    ],
    formeln: [
      { formel: 'f_{ck} = f_{m} - 1{,}64 \\cdot s', erklaerung: 'Charakteristischer Festigkeitswert (5-%-Quantil) bei bekannter Standardabweichung und Normalverteilung; bei aus wenigen Proben geschätzter Streuung ist 1,64 durch k_n nach DIN EN 1990, Anhang D zu ersetzen.', quelle: 'DIN EN 1990, Anhang D; ISO 12491' },
      { formel: 's = \\sqrt{\\frac{\\sum (x_i - \\bar{x})^2}{n - 1}}', erklaerung: 'Empirische Standardabweichung s einer Stichprobe der Größe n.', quelle: 'Standardstatistik' }
    ]
  },
  baustoffe: {
    title: 'Baustoffkunde im Detail',
    tagline: 'Das gesamte Spektrum klassischer und zukunftsweisender Strukturmaterialien',
    icon: Mountain,
    basicsTitle: 'Vom Naturstein bis zum biologischen Funktionswerkstoff',
    basicsDesc1: 'Die Baustoffkunde vermittelt ein tiefes Verständnis für den Zusammenhang zwischen atomarem Aufbau, stofflicher Zusammensetzung, Fertigungstechnologie und den makroskopischen Baustoffeigenschaften aller Bauwerksteile.',
    basicsDesc2: 'Wir gliedern den Stoffraum didaktisch in mineralische, metallische, organische sowie Verbund- und Dämmstoffe. Jedes Material besitzt ein individuelles Anforderungsprofil bezüglich Tragfähigkeit, Formbeständigkeit und Dauerhaftigkeit.',
    basicsCards: [
      { title: 'Materialdiversität', desc: 'Exploration von über 20 Einzelmaterialien aus Mauerwerk, Glas, Metallen, Hölzern und Asphalt.' },
      { title: 'Kennwertvergleich', desc: 'Detaillierter tabellarischer und interaktiver Abgleich spezifischer Dichten, Festigkeiten und E-Moduln.' }
    ],
    submodules: [
      { title: 'Gesteine', icon: Mountain, purpose: 'Eigenschaften und Herkunft natürlicher Gesteinskörnungen, Magmatite, Sedimentite, Metamorphite.', standards: 'DIN EN 12620, DIN EN 771-6', useCase: 'Bestimmung der Frostbeständigkeit von Granitschotter.' },
      { title: 'Mauerwerk', icon: LayoutGrid, purpose: 'Zusammenwirken von Mauersteinen (Kalksandstein, Hochlochziegel) und Mauermörtel.', standards: 'DIN EN 1996 (Eurocode 6)', useCase: 'Berechnung der Tragfähigkeit von Mauerwerkswänden.' },
      { title: 'Putze & Mörtel', icon: Layers, purpose: 'Unterscheidung von Baugipsen, Luftkalk, hydraulischem Kalk und Zementmörteln.', standards: 'DIN EN 998-1/2', useCase: 'Auswahl des richtigen Außenputzes bei hoher Schlagregenbeanspruchung.' },
      { title: 'Gips', icon: Box, purpose: 'Calciumsulfat-Bindemittel (Halbhydrat, Anhydrit), Brennstufen, Abbindemechanismen und Stuckarbeiten.', standards: 'DIN EN 13279', useCase: 'Gipsputz- und Estrichauslegung mit Feuchteschutz-Randbedingungen.' },
      { title: 'Kalk', icon: Box, purpose: 'Kalkkreislauf vom Kalkstein über Branntkalk zum Löschkalk, Luftkalke vs. hydraulische Kalke.', standards: 'DIN EN 459', useCase: 'Einsatz hochdiffusionsoffener Kalkmörtel im Denkmalschutz und ökologischen Wohnungsbau.' },
      { title: 'Lehmbau', icon: Box, purpose: 'Heutige Renaissance ökologischer Lehmsteine, Stampflehmwände und Lehmputze.', standards: 'DIN 18945 - DIN 18948 (Lehmbaunormen)', useCase: 'Sicherer Entwurf von Stampflehmbauteilen mit konstruktivem Feuchteschutz.' },
      { title: 'Erdbau & Böden', icon: Mountain, purpose: 'Bodenmechanische Klassifikation, Verdichtungskriterien, Proctordichte und bodenphysikalische Kennwerte.', standards: 'DIN 18196 / DIN 18127', useCase: 'Festlegung des optimalen Wassergehalts für Tragschichten im Erdbau.' },
      { title: 'Glas im Bauwesen', icon: Maximize, purpose: 'Floatglas, thermisch vorgespanntes Glas (ESG, TVG), Verbund-Sicherheitsglas (VSG) und Isolierglas.', standards: 'DIN 18008 (Glas im Bauwesen)', useCase: 'Tragfähigkeitsnachweis absturzsichernder Scheiben.' },
      { title: 'Stahl- & Metallbau', icon: Flame, purpose: 'Eisen-Kohlenstoff-Diagramm, Gefügebeeinflussung und Eigenschaftsprofil von Baustählen.', standards: 'DIN EN 10025, Eurocode 3', useCase: 'Plastische Momenttragfähigkeit von S355 Profilen.' },
      { title: 'Metalle & NE-Metalle', icon: Flame, purpose: 'Aluminium, Kupfer, Zink, Blei und korrosionsbeständige Edelstähle für Fassaden und Dachdeckungen.', standards: 'DIN EN 485 / DIN EN 1172', useCase: 'Vermeidung von Kontaktkorrosion zwischen Aluminium-Unterkonstruktionen und Edelstahl-Befestigern.' },
      { title: 'Holz & Holzwerkstoffe', icon: Trees, purpose: 'Anisotropie, Holzfeuchte, Quellen und Schwinden, Festigkeitsklassen und Holzwerkstoffe wie BSH und Brettsperrholz.', standards: 'DIN EN 1995 (Eurocode 5)', useCase: 'Bemessung von Brettschichtholzträgern.' },
      { title: 'Biogene Baustoffe (NaWaRo)', icon: LeafIcon, purpose: 'Nachwachsende Rohstoffe: Strohballenbau, Hanffasern, Flachs, Schafwolle und zellulosebasierte Dämmstoffe.', standards: 'ÖKOBAUDAT / DIBt-Zulassungen', useCase: 'Ökobilanziell optimierte Holzrahmenbauwand mit Stroheinblasdämmung.' },
      { title: 'Asphalt & Bitumen', icon: Layers, purpose: 'Viskoelastisches Verhalten, Bitumenprüfungen (Erweichungspunkt RuK, Nadelpenetration) und Mischungsentwürfe.', standards: 'ZTV Asphalt-StB / DIN EN 13108', useCase: 'Optimierung von Deckschichten mit polymermodifiziertem Bitumen.' },
      { title: 'Kunststoffe im Bauwesen', icon: Box, purpose: 'Thermoplaste, Duroplaste, Elastomere für Rohre, Fensterprofile, Folien und Geotextilien.', standards: 'DIN EN ISO 1043 / DVS Richtlinien', useCase: 'Wahl des geeigneten Rohrwerkstoffs (PE-HD vs. PVC-U) für grabenlose Rohrverlegung.' },
      { title: 'Dämmstoffe', icon: Box, purpose: 'Vergleich organischer, anorganischer und synthetischer Dämmstoffe bzgl. Wärmeleitfähigkeit, Brandverhalten und Feuchte.', standards: 'DIN 4108-10 / GModG (vormals GEG)', useCase: 'Dämmdicke für einen Ziel-U-Wert abschätzen.' },
      { title: 'Ausbau & Abdichtung', icon: Layers, purpose: 'Bauwerksabdichtungen gegen Bodenfeuchte und drückendes Wasser, Trockenbausysteme und Fugenabdichtungen.', standards: 'DIN 18533 / DIN 18181', useCase: 'Auslegung einer zweilagigen Bitumenbahnenabdichtung nach Wassereinwirkungsklasse W2.1-E.' },
      { title: 'Werkstoff-Kombinationen & Faserverbund', icon: Layers, purpose: 'Schichtenaufbauten (Tragen, Dämmen, Schützen), Faserverbunde (CFK/GFK, Voigt/Reuss), Verbundwerkstoffe (Stahlbeton, Sandwich, VSG) und Schutzschichtsysteme.', standards: 'DIN EN 1504-2, DIN EN ISO 12944, DIN 4108-3, DIN EN ISO 6946, VDI 2014', useCase: 'Auslegung und bauphysikalische Prüfung von Schichtenwänden sowie Mikromechanik und Tragwerksverstärkung mit CFK/GFK.' },
      { title: 'Sonstige & Innovationen', icon: Sparkles, purpose: 'Phasenwechselmaterialien, Leichtzuschläge, Aerogele, selbstheilender Beton, Photokatalyse, Vakuumisolationspaneele und Myzelwerkstoffe.', standards: 'DIN EN 13055, DIN EN 17140, abZ/ETA', useCase: 'Vakuumisolationspaneele bei begrenzter Aufbauhöhe (z. B. Terrassenanschluss).' }
    ],
    didacticCards: [
      { title: 'Werkstoffübergreifende Logik', desc: 'Gegenüberstellung von Verformungsverhalten (elastisch, plastisch, viskose Fließprozesse).' },
      { title: 'Ressourcenschonung', desc: 'Fokus auf regenerative Rohstoffe (Holz, Lehm) im direkten Vergleich zu energieintensiven Stählen.' },
      { title: 'Grenzbereiche im Spannungs-Dehnungs-Bild', desc: 'Detailliertes Verstehen spröder versus zäher Bruchmechanismen.' }
    ],
    appStudents: 'Begleitung von Baustoffvorlesungen vom ersten Semester bis zur Abschlussarbeit.',
    appProfessionals: 'Nachschlagewerk für Tragwerksplanung und Architektur bei Materialwahl und -substitution.',
    wikipedia: [
      { title: 'Baustoff', url: 'https://de.wikipedia.org/wiki/Baustoff' },
      { title: 'Werkstoffkunde', url: 'https://de.wikipedia.org/wiki/Werkstoffwissenschaft' }
    ],
    literatur: [
      'Scholz, W. (begr.); Möhring, R. (Hrsg.): Baustoffkenntnis. 19. Aufl., Köln: Bundesanzeiger Verlag 2016',
      'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
    ],
    regelwerke: [
      { title: 'DIN EN 1996: Eurocode 6 - Bemessung und Konstruktion von Mauerwerksbauten' },
      { title: 'DIN 18008: Glas im Bauwesen - Bemessungs- und Konstruktionsregeln' }
    ],
    formeln: [
      { formel: '\\sigma = E \\cdot \\epsilon', erklaerung: 'Hookesches Gesetz für linear-elastisches Werkstoffverhalten. Bestimmt die proportionale Verknüpfung von Normalspannung und elastischer Dehnung.', quelle: 'Physikalische Grundlagen' },
      { formel: 'f_d = k_{mod} \\cdot \\frac{f_k}{\\gamma_M}', erklaerung: 'Bemessungswert der Festigkeit im Holzbau: charakteristischer Wert f_k, Modifikationsbeiwert k_mod (Lasteinwirkungsdauer, Nutzungsklasse), Teilsicherheitsbeiwert γ_M = 1,3 (NA).', quelle: 'DIN EN 1995-1-1 mit NA' }
    ]
  },
  bauprodukte: {
    title: 'Bauproduktrecht & Spezifikation',
    tagline: 'Zulassungssysteme, Konformitätsbewertungen und baurechtliche Pflichten',
    icon: Award,
    basicsTitle: 'Sicherheit im harmonisierten europäischen Bauproduktrecht',
    basicsDesc1: 'Bauprodukte dürfen nur verwendet werden, wenn ihre Leistung nachgewiesen ist und das Bauwerk damit die bauordnungsrechtlichen Anforderungen erfüllt. Das Modul erläutert die Bauproduktenverordnung (BauPVO) und die ergänzenden nationalen Regelungen.',
    basicsDesc2: 'Behandelt werden CE-Kennzeichnung, Europäische Bewertungsdokumente (EAD) und Technische Bewertungen (ETA) sowie MVV TB, nationale Verwendbarkeitsnachweise und Ü-Zeichen.',
    basicsCards: [
      { title: 'AVCP-Systeme inkl. System 3+', desc: 'Prüfumfang von System 1+ bis System 4 sowie das neue System 3+ (Validierung der Umweltleistungsbewertung / LCA nach DIN EN 15804+A2 durch notifizierte Stellen nach VO (EU) 2024/3110).' },
      { title: 'DoPC & Digitaler Produktpass (DPP)', desc: 'Kombinierte Leistungs- und Konformitätserklärung (Declaration of Performance and Conformity, DoPC) mit je Produktfamilie verpflichtend werdenden Umweltangaben (zunächst GWP, ab Geltung der neuen harmonisierten technischen Spezifikation) und digitalem Produktpass über einen Datenträger (z. B. QR-Code; verpflichtend 18 Monate nach dem delegierten Rechtsakt nach Art. 75 VO (EU) 2024/3110).' }
    ],
    submodules: [
      { title: 'Baustoffindustrie', icon: Factory, purpose: 'Wertschöpfungsketten, Rohstoffgewinnung, Energieeinsatz und Zukunftsstrategien der deutschen und europäischen Baustoffindustrie.', standards: 'bbs (Bundesverband Baustoffe – Steine und Erden)', useCase: 'Analyse von CO2-Minderungskostenpfaden in der Zement- und Ziegelherstellung.' },
      { title: 'CE vs. Ü & MVV TB', icon: Scale, purpose: 'Abgrenzung zwischen europäischer BauPVO und nationalen Regelungen (MBO, MVV TB).', standards: 'Musterbauordnung (MBO) §§ 16b–25', useCase: 'Klären, ob für ein CE-gekennzeichnetes Produkt zusätzliche nationale Nachweise nötig sind.' },
      { title: 'AVCP-Systeme', icon: ShieldAlert, purpose: 'Aufschlüsselung der Systeme zur Bewertung und Überprüfung der Leistungsbeständigkeit (System 1+, 1, 2+, 3, 3+, 4).', standards: 'BauPVO (EU) 2024/3110 Anhang IX / VO (EU) 305/2011 Anhang V', useCase: 'Prüfablauf für tragenden Baustahl im Vergleich zu Estrichmörtel.' },
      { title: 'Konformität & Auditierung', icon: Award, purpose: 'Ablauf von Audits durch notifizierte Stellen, werkseigene Produktionskontrolle (WPK) und Zertifizierung.', standards: 'DIN EN ISO/IEC 17065', useCase: 'Vorbereitung einer Fertigteilwerksprüfung zur CE-Zertifizierung.' },
      { title: 'Normenarbeit im Bauwesen', icon: BookOpen, purpose: 'Prozess der Normenentwicklung (CEN, DIN, NA), Einspruchsverfahren und Veröffentlichung.', standards: 'DIN 820 (Normungsarbeit)', useCase: 'Klärung des Unterschieds zwischen Weißdruck, Entwurf und harmonisierter Norm.' },
      { title: 'Beton (Frisch/Fest) & Betonwaren', icon: Layers, purpose: 'Spezifikationen von Transportbeton, Pflastersteinen, Bordsteinen und Rohren.', standards: 'DIN EN 206 / DIN EN 1338', useCase: 'Ausschreibung frost-tausalzbeständiger Betonpflastersteine mit Güteüberwachung.' },
      { title: 'Betonfertigteile', icon: Box, purpose: 'Spannbeton-Hohldielen, Elementdecken, Doppelwandelemente und Fertigteilstützen mit Transportankern.', standards: 'DIN EN 1168 / DIN EN 13747 / DIN EN 13225', useCase: 'Bemessung und Montagekontrolle von Elementdecken im Geschosswohnungsbau.' },
      { title: 'Mauerwerk, Dach & Fassade', icon: LayoutGrid, purpose: 'Mauersteine, Dachziegel, Betondachsteine, vorgehängte hinterlüftete Fassaden (VHF) und Wärmedämm-Verbundsysteme.', standards: 'DIN EN 771 / DIN EN 490 / DIN 18516', useCase: 'Auswahl windlastbeständiger Fassadenbekleidungen und Unterkonstruktionen.' },
      { title: 'Verkehrswegebau & RStO 12/24', icon: Layers, purpose: 'Asphalttragschichten, Asphaltbinder, Deckschichten, Bitumen und Gesteinskörnungen nach den Richtlinien für die Standardisierung des Oberbaus (RStO).', standards: 'RStO 12/24 / ZTV Asphalt-StB', useCase: 'Dimensionierung des Straßenoberbaus nach Belastungsklassen Bk100 bis Bk0,3.' },
      { title: 'Tiefbau, Bahnbau & Tunnel', icon: Mountain, purpose: 'Kanalrohre, Schachtbauwerke, Gleisschotter (DBS 918 061), Tübbinge und Spritzbeton im bergmännischen Vortrieb.', standards: 'DIN EN 1610 / ZTV-ING / DIN EN 14487', useCase: 'Festlegung der Betonzusammensetzung für wasserdichte Tunneltübbinge.' },
      { title: 'Trockenbau, Putz & Estrich', icon: Layers, purpose: 'Gipsplatten, Metallständerwände, Zement-, Calciumsulfat- und Gussasphaltestriche sowie Innen- und Außenputze.', standards: 'DIN 18180 / DIN 18560 / DIN EN 13813', useCase: 'Prüfung der Belegreife von Heizestrichen mittels CM-Feuchtemessung.' },
      { title: 'Abdichtungen & Dämmstoffe', icon: ShieldAlert, purpose: 'Bitumen- und Kunststoffbahnen, mineralische Dichtungsschlämmen (MDS), EPS-, XPS-, Mineralwolle- und PU-Dämmstoffe.', standards: 'DIN 18531 - DIN 18535 / DIN 4108-10', useCase: 'Auswahl des Abdichtungsaufbaus für erdberührte Kellerwände nach DIN 18533.' },
      { title: 'Befestigungstechnik & Bauchemie', icon: Wrench, purpose: 'Mechanische und chemische Dübelsysteme (ETA-Bemessung), Kleb- und Dichtstoffe, Farben, Lacke und Betonzusatzmittel.', standards: 'EOTA EAD 330232 / DIN EN 934', useCase: 'Bemessung von Schwerlast-Verbundankern in gerissenem Beton nach Eurocode 2 Teil 4.' },
      { title: 'Gläser & Fenstertechnik', icon: Maximize, purpose: 'Float-, ESG-, TVG- und VSG-Verbundgläser, Mehrscheiben-Isoliergläser mit Low-E-Bedampfung, Edelgasfüllungen (Argon/Krypton), Rahmenwerkstoffe und Uw-Berechnung.', standards: 'DIN EN 1279 / DIN 18008 / DIN EN 14351-1 / DIN EN ISO 10077', useCase: 'Wärmeschutz und Absturzsicherung bei Dreifach-Isolierglasfenstern.' },
      { title: 'Werkstoffspezifische Produkte', icon: Trees, purpose: 'Spezifikationen für Vollholz/BSH/CLT, Kunststoffe, mineralische Werkstoffe, Lehmbausteine und Walzstahlprofile.', standards: 'DIN EN 14080 / DIN EN 10025 / DIN 18945', useCase: 'Überprüfung der Konformitätsnachweise für tragende Brettschichtholzbinder im Hallenbau.' }
    ],
    didacticCards: [
      { title: 'Rechtliche Einordnung', desc: 'Europäische und nationale Regelungen werden getrennt dargestellt; Vereinfachungen sind gekennzeichnet.' },
      { title: 'Entscheidungshilfen', desc: 'Schrittweise Klärung, welcher Verwendbarkeitsnachweis für ein Bauprodukt erforderlich ist.' },
      { title: 'Marktüberwachung & Haftung', desc: 'Grundzüge der Marktüberwachung und der zivilrechtlichen Haftung bei mangelhaften Bauprodukten (keine Rechtsberatung).' }
    ],
    appStudents: 'Einführung in das Bauproduktenrecht für Lehrveranstaltungen in Baubetrieb, Projektmanagement und Baustoffkunde.',
    appProfessionals: 'Überblick für Planende, Herstellende und Bauherren zur Prüfung von Verwendbarkeitsnachweisen; ersetzt keine Rechtsberatung.',
    wikipedia: [
      { title: 'Bauproduktenverordnung', url: 'https://de.wikipedia.org/wiki/Bauproduktenverordnung' },
      { title: 'Musterbauordnung', url: 'https://de.wikipedia.org/wiki/Musterbauordnung' }
    ],
    literatur: [
      'Gerhold, P.: Bauproduktenrecht in der Praxis – Von der Bauproduktleistung bis zur Baudokumentation. 2. Aufl., Köln: Rudolf Müller 2021',
      'Gerhold, P.: Neues Bauproduktenrecht in der Praxis – Bauordnung und MVV TB verstehen und anwenden. Köln: Rudolf Müller 2019'
    ],
    regelwerke: [
      { title: 'Muster-Verwaltungsvorschrift Technische Baubestimmungen (MVV TB)', url: 'https://www.dibt.de/' },
      { title: 'Verordnung (EU) 2024/3110 (BauPVO, seit 08.01.2026; übergangsweise VO (EU) 305/2011)', url: 'https://eur-lex.europa.eu/' }
    ],
    formeln: [
      { formel: 'f_{cm} \\ge f_{ck} + 1{,}48 \\cdot \\sigma', erklaerung: 'Konformitätskriterium der Druckfestigkeit bei stetiger Herstellung (Mittelwert aus mindestens 15 Ergebnissen, σ = Standardabweichung); Beispiel für eine statistische Konformitätsbewertung in der WPK.', quelle: 'DIN EN 206, Abschn. 8.2.1' }
    ]
  },
  beton: {
    title: 'Betontechnologie',
    tagline: 'Wissenschaftliche Leitgrundlage, Gefügechemie und Anwendungsbereiche des Baustoffs der Moderne',
    icon: Box,
    basicsTitle: 'Wissenschaftliche Grundlagen der Betontechnologie',
    basicsDesc1: 'Betontechnologie befasst sich mit der materialwissenschaftlichen Erforschung, Zusammensetzung und baupraktischen Herstellung des Drei-Komponenten-Systems aus Bindemitteln, Gesteinskörnungen und Anmachwasser unter gezieltem Einsatz von Betonzusatzmitteln und Zusatzstoffen.',
    basicsDesc2: 'Ziel ist es, den Beton im frischen Zustand für den Einbau optimal einzustellen (Verarbeitbarkeit) und im festen Zustand die geforderten mechanischen Parameter sowie Schutzfunktionen (Dauerhaftigkeit gegenüber Frost, chemischen Angriffen und Bewehrungskorrosion) nachzuweisen.',
    basicsCards: [
      { title: 'Hydratations- und Gefügechemie', desc: 'Erhärtungsreaktionen (C-S-H-Phasensynthese), Steuerung der Hydratationsgeschwindigkeit und Optimierung der Mikroporosität.' },
      { title: 'Normatives Regelwert-Konzept', desc: 'Entwurf nach DIN EN 206 und DIN 1045-2 über Expositionsklassen (XC, XD, XS, XF, XA, XM).' }
    ],
    submodules: [
      { title: 'Beton A-Z', icon: BookOpen, purpose: 'Integriertes Nachschlagewerk für Fachbegriffe, Abkürzungen und Definitionen.', standards: 'DIN EN 206', useCase: 'Schnelles Klären von Begriffen wie Mehlkorngehalt oder k-Wert.' },
      { title: 'Grundlagen', icon: Layers, purpose: 'Tabellarische Übersichten aller normativen Grenzwerte nach DIN EN 206 / DIN 1045-2.', standards: 'DIN EN 206, DIN 1045-2', useCase: 'Bestimmung von max. w/z-Wert und Mindestzementgehalt.' },
      { title: 'Bindemittel', icon: Factory, purpose: 'Chemischer Aufbau, Kinetik und Wirkungsweise von Zementen (CEM I bis CEM VI) und Puzzolanen.', standards: 'DIN EN 197-1 / EN 197-5', useCase: 'Bewertung der puzzolanischen Reaktion von Flugasche und Silikastaub.' },
      { title: 'Mischungsberechnung', icon: Calculator, purpose: 'Interaktiver Entwurfs- und Optimierungsrechner auf Basis der Stoffraumrechnung.', standards: 'DIN 1045-2', useCase: 'Berechnung von Zementbedarf, Wasserverbrauch und Sieblinien.' },
      { title: 'Herstellung & Einbau', icon: Factory, purpose: 'Transportbeton, logistische Steuerung, Verdichtungsdauer und Schalungsfristen.', standards: 'DIN EN 13670 / ZTV-ING', useCase: 'Festlegung von Einbau- und Verdichtungsschritten.' },
      { title: 'Frischbeton', icon: Waves, purpose: 'Prüfverfahren zur Frischbetoncharakterisierung (Konsistenz, Luftgehalt, Temperatur, Rohdichte).', standards: 'DIN EN 12350', useCase: 'Qualitätskontrolle auf der Baustelle beim Wareneingang.' },
      { title: 'Hydratation & Folgen', icon: Network, purpose: 'Exotherme Hydratationswärmeentwicklung, Eigenspannungsentstehung und Schwindphasen.', standards: 'DAfStb-Richtlinien', useCase: 'Ermittlung des Rissrisikos in massigen Bauteilen.' },
      { title: 'Nachbehandlung', icon: Droplets, purpose: 'Auswahl der Nachbehandlungsmethoden und Berechnung der Mindestdauer.', standards: 'DIN 1045-3', useCase: 'Ermittlung notwendiger Tage für Schalungs- und Nachbehandlungsfristen.' },
      { title: 'Festbeton', icon: Box, purpose: 'Physikalisch-mechanische Eigenschaften des erhärteten Gefüges (Druckfestigkeit, E-Modul, Schwinden).', standards: 'DIN EN 12390', useCase: 'Nachweis der 28-Tage-Druckfestigkeit.' }
    ],
    didacticCards: [
      { title: 'Stoffraumrechnung', desc: 'Verständnis der absoluten Volumina aller Komponenten für 1000 dm³ verdichteten Beton.' },
      { title: 'Expositionsklassensystem', desc: 'Sichere Zuordnung von Umweltbeanspruchungen und Ableitung von Betonzusammensetzungen.' },
      { title: 'Dekarbonisierung', desc: 'Klinkereffiziente Mehrstoffzemente und zukunftsfähige CO2-neutrale Bindemittel.' }
    ],
    appStudents: 'Vorbereitung auf Vorlesungen, Klausuren und Laborübungen der Betontechnologie.',
    appProfessionals: 'Praxisleitfaden für Mischungsentwürfe, E-Schein-Inhaber, Transportbetonwerke und bauleitende Ingenieure.',
    wikipedia: [
      { title: 'Beton', url: 'https://de.wikipedia.org/wiki/Beton' },
      { title: 'Zement', url: 'https://de.wikipedia.org/wiki/Zement' }
    ],
    literatur: [
      'Grübl, P.; Weigler, H.; Karl, S.: Beton – Arten, Herstellung und Eigenschaften. 2. Aufl., Berlin: Ernst & Sohn 2001',
      'Verein Deutscher Zementwerke (Hrsg.): Zement-Taschenbuch. 51. Ausgabe, Düsseldorf: Verlag Bau+Technik 2008'
    ],
    regelwerke: [
      { title: 'DIN EN 206 (Beton - Festlegung, Eigenschaften, Herstellung und Konformität)' },
      { title: 'DIN 1045-2 (Nationale Anwendungsregeln zur DIN EN 206)' }
    ],
    formeln: [
      { formel: 'V = \\frac{m_z}{\\rho_z} + \\frac{m_w}{\\rho_w} + \\sum \\frac{m_{g,i}}{\\rho_{g,i}} + V_l = 1000\\,\\text{dm}^3', erklaerung: 'Stoffraumgleichung für 1 m³ verdichteten Frischbeton.', quelle: 'DIN EN 206 / DIN 1045-2' }
    ]
  },
  holzbau: {
    title: 'Holzbau (Ingenieurholzbau)',
    tagline: 'Konstruktiver Ingenieurholzbau, Werkstoffkennwerte, Stabilitätsnachweise und Brandschutz',
    icon: Trees,
    basicsTitle: 'Wissenschaftliche Säulen des Ingenieurholzbaus',
    basicsDesc1: 'Holz ist ein nachwachsender, anisotroper Werkstoff mit hoher Festigkeit im Verhältnis zur Dichte; er speichert biogenen Kohlenstoff, solange er genutzt wird.',
    basicsDesc2: 'Moderne Holzwerkstoffe wie Brettschichtholz (BSH) und Brettsperrholz (BSP / CLT) ermöglichen weitgespannte Hallentragwerke und mehrgeschossige Gebäude; bemessen wird nach Eurocode 5.',
    basicsCards: [
      { title: 'Anisotropie & Nutzungsklassen', desc: 'Faserrichtungsabhängige Kennwerte (parallel vs. rechtwinklig zur Faser) und feuchteabhängige Nutzungsklassen (NKL 1 bis 3).' },
      { title: 'Stabilität & Verbindungsmittel', desc: 'Knick- und Biegedrillknicknachweise sowie stiftförmige Verbindungsmittel mit Seilwirkung.' }
    ],
    submodules: [
      { title: 'Werkstoffe & dataholz', icon: Trees, purpose: 'Charakteristische Festigkeiten von Vollholz (C24), BSH (GL24h–GL30h) und dataholz-Aufbauten.', standards: 'DIN EN 338 / EN 14080', useCase: 'Auswahl von Lamellen und Bauteilschichten.' },
      { title: 'Konstruktionsweisen', icon: LayoutGrid, purpose: 'Holzrahmenbau, Massivholzbau (CLT) und Holz-Hybridbau.', standards: 'MHolzBauRL / Informationsdienst Holz', useCase: 'Systementscheidung für Geschossdecken und tragende Wandscheiben.' },
      { title: 'Bemessung (EC5)', icon: Calculator, purpose: 'Stabilitätsnachweise für Druckstäbe und Biegeträger mit k_mod und gamma_M.', standards: 'DIN EN 1995-1-1', useCase: 'Ermittlung von Knickbeiwert k_c und Querschnittsausnutzung.' },
      { title: 'Verbindungen & Anschlüsse', icon: GitCommit, purpose: 'Johansen-Theorie für Stabdübel, Passbolzen und Holzschrauben (Vollgewinde nach ETA).', standards: 'DIN EN 1995-1-1 Kap. 8', useCase: 'Berechnung von Abscher- und Ausziehtragfähigkeiten.' },
      { title: 'Bauphysik & Brandschutz', icon: Flame, purpose: 'Bemessung im Brandfall mit der Methode des reduzierten Querschnitts (d_ef).', standards: 'DIN EN 1995-1-2', useCase: 'Nachweis der Tragfähigkeit im Brandfall für R 30 bis R 90.' }
    ],
    didacticCards: [
      { title: 'KLED & Feuchteeinfluss', desc: 'Verknüpfung von Lasteinwirkungsdauer (KLED) und Nutzungsklasse über k_mod.' },
      { title: 'Restquerschnitts-Verfahren', desc: 'Brandbemessung über die ideelle Abbrandrate β_n und die Schicht ohne Festigkeit d₀ = 7 mm.' },
      { title: 'Vorfertigung & Taktung', desc: 'Werkseitige Vorfertigung verkürzt die Montage und verringert Baufeuchte.' }
    ],
    appStudents: 'Begleitung von Holzbauvorlesungen im Bachelor- und Masterstudium Bauingenieurwesen.',
    appProfessionals: 'Überblick und Rechenbeispiele für den Holz- und Holz-Hybridbau; ersetzt keine Tragwerksplanung.',
    wikipedia: [
      { title: 'Holzbau', url: 'https://de.wikipedia.org/wiki/Holzbau' },
      { title: 'Brettschichtholz', url: 'https://de.wikipedia.org/wiki/Brettschichtholz' }
    ],
    literatur: [
      'Informationsverein Holz (Hrsg.): holzbau handbuch, Reihen 1–5',
      'Blaß, H. J.; Sandhaas, C.: Ingenieurholzbau – Grundlagen der Bemessung. Karlsruhe: KIT Scientific Publishing 2016',
      'Kaufmann, H.; Krötsch, S.; Winter, S.: Atlas Mehrgeschossiger Holzbau. München: Detail 2017'
    ],
    regelwerke: [
      { title: 'DIN EN 1995-1-1:2010-12 + A2:2014-07 mit NA:2013-08 (Eurocode 5)' },
      { title: 'DIN EN 1995-1-2:2010-12 mit NA (Eurocode 5, Brandfall)' },
      { title: 'Muster-Holzbaurichtlinie (MHolzBauRL), DIBt' }
    ],
    formeln: [
      { formel: 'f_d = k_{mod} \\cdot \\frac{f_k}{\\gamma_M}', erklaerung: 'Bemessungswert einer Festigkeit: k_mod erfasst Nutzungsklasse und Lasteinwirkungsdauer, γ_M = 1,3 für Vollholz und BSH (NA).', quelle: 'DIN EN 1995-1-1, Gl. (2.14)' }
    ]
  },
  stahlbeton: {
    title: 'Tragwerksplanung im Massivbau',
    tagline: 'Grenzzustände der Tragfähigkeit und Gebrauchstauglichkeit nach Eurocode 2',
    icon: GitCommit,
    basicsTitle: 'Das Verbundverhalten im Massivbau',
    basicsDesc1: 'Der Massivbau (Stahlbeton, Spannbeton, Carbonbeton) verbindet die hohe Druckfestigkeit des Betons mit der Zugfestigkeit der Bewehrung (Betonstahl, Carbon). Voraussetzung sind ein ausreichender Verbund und bei Stahl eine ähnliche Wärmedehnung.',
    basicsDesc2: 'In diesem Berechnungs- und Konstruktionsmodul analysieren wir die Rissbreitenbegrenzung, Biegung mit und ohne Längskraft, ermitteln Schubbemessungen (Querkraft), dimensionieren druckbelastete Stützen nach Theorie II. Ordnung und erfassen Durchstanzrisiken im Stützenbereich.',
    basicsCards: [
      { title: 'Interaktive Bemessung', desc: 'Echtzeitrechner für Biegezug, Rissbreitenverteilung und erforderliche Bewehrungsflächen.' },
      { title: 'Gebrauchstauglichkeit (SLS)', desc: 'Begrenzung der charakteristischen Rissbreiten (w_max = 0,3 mm) zum Schutz vor karbonatisierungsinduzierter Korrosion.' }
    ],
    submodules: [
      { title: 'Rissbreite', icon: GitCommit, purpose: 'Kontrolle der rechnerischen Rissbreiten w_k im Grenzzustand der Gebrauchstauglichkeit.', standards: 'DIN EN 1992-1-1 (EC2) Kap. 7.3', useCase: 'Auslegung einer Deckenplatte bzgl. Mindestbewehrung zur Begrenzung von Rissen infolge abfließender Hydratationswärme.' },
      { title: 'Spannung-Dehnung', icon: Activity, purpose: 'Gegenüberstellung der Parabel-Rechteck-Diagramme für Beton und der elastisch-plastischen Bewehrungsstahllinien.', standards: 'DIN EN 1992-1-1 Kap. 3', useCase: 'Bestimmung der Betondehnung an der Querschnittsoberseite im Bruchzustand.' },
      { title: 'Biegebemessung', icon: Box, purpose: 'Querschnittsbemessung von Rechteckquerschnitten mit dem μ-Verfahren (auch mit Druckbewehrung).', standards: 'DIN EN 1992-1-1 Kap. 6.1', useCase: 'Schnittgrößenbasierte Berechnung der Tragbewehrung eines Einfeldbalkens.' },
      { title: 'Querkraftbemessung', icon: Box, purpose: 'Tragfähigkeitsnachweis für Querkräfte, Berechnung der Bügelbewehrung (Druckstrebenwinkel theta).', standards: 'DIN EN 1992-1-1 Kap. 6.2', useCase: 'Nachweis der Druckstrebenfestigkeit VRd,max zur Vermeidung von Stegbruch.' },
      { title: 'Stützenbemessung', icon: Box, purpose: 'Interaktionsdiagramm für Biegung mit Längskraft, Mindestausmitte und Prüfung der Grenzschlankheit (Theorie II. Ordnung nur als Hinweis).', standards: 'DIN EN 1992-1-1 Kap. 5.8', useCase: 'Tragfähigkeitsnachweis einer schlanken Pendelstütze mit Imperfektionen.' },
      { title: 'Durchstanzen', icon: CircleDashedIcon, purpose: 'Abschätzung des Durchstanzkriteriums an Flachdecken im kritischen Rundschnitt.', standards: 'DIN EN 1992-1-1 Kap. 6.4', useCase: 'Dimensionierung einer Durchstanzbewehrung (z.B. Dübelleisten) zur Stützenauflagerung.' },
      { title: 'Verankerungslänge', icon: GitCommit, purpose: 'Berechnung des Grundwertes der Verankerungslänge von Betonstahl im Verbund.', standards: 'DIN EN 1992-1-1 Kap. 8.4', useCase: 'Ermittlung des notwendigen Übergreifungsstoßes zweier Bewehrungslagen.' },
      { title: 'Spannbeton', icon: GitCommit, purpose: 'Prinzipien des vorgespannten Betons, sofortiger und nachträglicher Verbund, Spannkraftverluste.', standards: 'DIN EN 1992-1-1 Kap. 5.10', useCase: 'Tragfähigkeitssteigerung schlanker Brückenträger.' },
      { title: 'WU-Bauwerke', icon: Droplets, purpose: 'Wasserundurchlässige Betonbauteile ("Weiße Wannen"), Mindestbauteildicken, Fugenplanung.', standards: 'DAfStb WU-Richtlinie', useCase: 'Rissbreitennachweis zur Erzielung von Wasserdichtigkeit bei drückendem Wasser.' },
      { title: 'Carbonbeton', icon: Layers, purpose: 'Hochfeste textile Hochleistungsbewehrungen zur Konstruktion ultradünner Schalen.', standards: 'DAfStb-Richtlinie nichtmetallische Bewehrung (2024); Zulassungen', useCase: 'Instandstellung einer schadhaften Fußgängerbrücke mit Carbon-Spritzmörtel.' }
    ],
    didacticCards: [
      { title: 'Spannungsintegration', desc: 'Verständnis des Kräftepaars (Betondruckkraft und Stahldruck-/Zugkraft) am verbogenen Querschnitt.' },
      { title: 'Normkonformes Bemessungsziel', desc: 'Erzielung eines duktilen, rechtzeitig ankündigenden Biegebruchs im Gegensatz zu spröden Bauteilversagen.' },
      { title: 'Konstruktive Details', desc: 'Verständnis für Betondeckung, Randeinfassungen und Schalungsabgrenzung.' }
    ],
    appStudents: 'Begleitet Vorlesungen im Massivbau und schult das Gefühl für Bewehrungsmengen.',
    appProfessionals: 'Plausibilitätsprüfung und Vordimensionierung; ersetzt keine Tragwerksplanung.',
    wikipedia: [
      { title: 'Stahlbeton', url: 'https://de.wikipedia.org/wiki/Stahlbeton' },
      { title: 'Spannbeton', url: 'https://de.wikipedia.org/wiki/Spannbeton' }
    ],
    literatur: [
      'Zilch, K.; Zehetmaier, G.: Bemessung im konstruktiven Betonbau. 2. Aufl., Berlin, Heidelberg: Springer 2010',
      'Goris, A. (Hrsg.): Stahlbetonbau-Praxis nach Eurocode 2. Band 1: Grundlagen, Bemessung, Beispiele; Band 2: Schnittgrößen, Gesamtstabilität, Bewehrung und Konstruktion, Beispiele. 7., überarb. u. erw. Aufl., Berlin: Beuth 2023'
    ],
    regelwerke: [
      { title: 'DIN EN 1992-1-1: Eurocode 2 - Bemessung und Konstruktion von Stahlbeton- und Spannbetontragwerken' },
      { title: 'DAfStb-Richtlinie: Wasserundurchlässige Bauwerke aus Beton (WU-Richtlinie)' }
    ],
    formeln: [
      { formel: 'a_s = \\frac{M_{Ed}}{z \\cdot f_{yd}}', erklaerung: 'Näherungsweise Berechnung der erforderlichen Zugbewehrungsfläche a_s eines biegebeanspruchten Querschnitts bei geschätztem inneren Hebelarm z (ca. 0.9·d).', quelle: 'DIN EN 1992-1-1' },
      { formel: 'w_k = s_{r,max} \\cdot (\\epsilon_{sm} - \\epsilon_{cm})', erklaerung: 'Berechnung der charakteristischen Rissbreite w_k aus dem maximalen Rissabstand s_{r,max} multipliziert mit der mittleren Dehnungsdifferenz zwischen Stahl und Beton.', quelle: 'DIN EN 1992-1-1 Kap. 7.3.4' }
    ]
  },
  mechanik: {
    title: 'Werkstoffmechanik & Festigkeitslehre',
    tagline: 'Deformationen, Fließkriterien, Finite Ansätze, Stabilität und Bruchmechanik',
    icon: Activity,
    basicsTitle: 'Mechanisches Verhalten unter Belastung',
    basicsDesc1: 'Das Modul behandelt die werkstoffübergreifende Strukturmechanik. Es untersucht, wie Kräfte in Bauteilen Spannungen hervorrufen und zu makroskopischen Verformungen (Verschiebungen, Krümmungen) führen.',
    basicsDesc2: 'Wir betrachten elastische Verformung nach Hooke, plastische Fließgesetze (von Mises), statisch unbestimmte Kraft- und Weggrößenverfahren sowie Stabilitätsphänomene (Knickgefahr nach Euler) und die Ausbreitungsenergetik mikroskopischer Risse.',
    basicsCards: [
      { title: 'Verformungsintegration', desc: 'Berechnung von Durchbiegungen mittels Doppelintegration der Momentenlinie oder virtuellen Kräften.' },
      { title: 'Plastische Reserven', desc: 'Ausnutzung überelastischer Werkstoffkapazitäten bei duktilen Stählen zur Gewichtsoptimierung.' }
    ],
    submodules: [
      { title: 'Mechanische Kenngrößen', icon: Activity, purpose: 'Spannung, Dehnung, Querdehnzahl, Dehn- und Biegesteifigkeit sowie Kriechen und Relaxation mit gerechneten Beispielen.', standards: 'DIN EN ISO 6892-1; DIN EN 1992-1-1, 3.1.4 / 3.3.2', useCase: 'Verlängerung eines Zugstabs und Endstauchung einer Betonstütze unter Dauerlast.' },
      { title: 'Formänderungen', icon: Activity, purpose: 'Lastunabhängige und zeitabhängige Verformungen: Temperaturdehnung, Schwinden und Kriechen der Baustoffe.', standards: 'DIN EN 1992-1-1, 3.1.4; DIN EN 12390-16', useCase: 'Bemessung von Dehnfugen und Abschätzung der Kriechverformung einer Stütze.' },
      { title: 'Materialmodelle', icon: Activity, purpose: 'Mathematische Modellierung von Elastoplastizität, Viskoplastizität und Kriechansätzen der Baustoffe.', standards: 'DIN EN 1992-1-1 (Arbeitslinien 3.1.5, 3.1.7, Bild 3.8); DIN 1342', useCase: 'Einstellung elastisch-plastischer Verfestigungsparameter im FE-Programm.' },
      { title: 'E-Modul & Mikromechanik', icon: Activity, purpose: 'Ermittlung des Elastizitätsmoduls aus Spannungs-Dehnungs-Messkurven und mikromechanischen Mischungsregeln.', standards: 'DIN EN ISO 527-1', useCase: 'Bestimmung des homogenisierten Quer-E-Moduls eines Faserverbundes.' },
      { title: 'Festigkeit', icon: TrendingUp, purpose: 'Festigkeitskennwerte im Vergleich, spezifische Festigkeit und Reißlänge (Grenzlänge unter Eigengewicht).', standards: 'DIN EN 1992-1-1 / DIN EN 1993-1-1 (charakteristische Festigkeiten)', useCase: 'Materialvergleich über die Reißlänge und Grenzhöhe unter Eigengewicht.' },
      { title: 'Baustatik', icon: Activity, purpose: 'Auflagerkräfte und Schnittgrößen (N, V, M) von Einfeldträger, Kragarm und Dreigelenkrahmen sowie des einfach statisch unbestimmten Zweifeldträgers (Dreimomentengleichung).', standards: 'Technische Mechanik; Einwirkungen nach DIN EN 1990 / DIN EN 1991-1-1', useCase: 'Momentenmaximum unter Einzellast und Stützmoment eines Durchlaufträgers.' },
      { title: 'Knicken (Euler)', icon: TrendingUp, purpose: 'Stabilitätsversagen schlanker Stäbe unter Druckbelastung, Knickfälle 1 bis 4 nach Euler und Vergrößerung von Vorkrümmungen nach Theorie II. Ordnung.', standards: 'DIN EN 1993-1-1 (EC3), 6.3', useCase: 'Ermittlung der kritischen Euler-Knicklast für ein beidseitig gelenkig gelagertes Stützenprofil.' },
      { title: 'Bruchmechanik', icon: ShieldAlert, purpose: 'Spannungsintensitätsfaktoren (K-Konzept), Energiefreisetzungsrate G und Rissausbreitungskriterien von Griffith.', standards: 'ISO 12737 (Metalle); fib Model Code 2010 (Beton)', useCase: 'Abschätzung der kritischen Risslänge bzw. Bruchspannung bei spröden Glas- und Keramikbauteilen.' },
      { title: 'Bodenmechanik', icon: Mountain, purpose: 'Konsistenzgrenzen und Bodengruppen, Scherfestigkeit nach Mohr-Coulomb, Erddruck nach Rankine sowie Setzung und Konsolidation nach Terzaghi.', standards: 'DIN EN 1997-1 / DIN 1054; DIN 4085; DIN 18196; DIN 4019', useCase: 'Berechnung des aktiven Erddrucks auf eine Stützmauer.' }
    ],
    didacticCards: [
      { title: 'Werkstoffübergreifende Abstraktion', desc: 'Dieselben mathematischen Bewegungsgleichungen steuern das Verhalten von Holz, Stahl und Felsen.' },
      { title: 'Analytische Lösungen', desc: 'Fokus auf geschlossene analytische Auswertungsmethoden anstelle intransparenter "Black-Box"-FEM.' },
      { title: 'Stabilität vs. Festigkeit', desc: 'Frühzeitiges Begreifen, dass geometrische Bauteilschlankheit oft vor dem Werkstoffversagen die Tragfähigkeit limitiert.' }
    ],
    appStudents: 'Interaktives Repetitorium für Technische Mechanik, Baustatik und Werkstoffmechanik.',
    appProfessionals: 'Hilfe bei Plausibilitätsprüfungen von Programmergebnissen und bei der Vordimensionierung.',
    wikipedia: [
      { title: 'Festigkeitslehre', url: 'https://de.wikipedia.org/wiki/Festigkeitslehre' },
      { title: 'Baustatik', url: 'https://de.wikipedia.org/wiki/Baustatik' }
    ],
    literatur: [
      'Gross, D.; Hauger, W.; Schröder, J.; Wall, W. A.: Technische Mechanik 2 – Elastostatik. Berlin: Springer Vieweg (aktuelle Auflage)',
      'Meschede, D. (2015): Gerthsen Physik (Springer)'
    ],
    regelwerke: [
      { title: 'DIN EN 1993-1-1:2010-12 + A1:2014-07 mit NA (Eurocode 3 – Bemessung und Konstruktion von Stahlbauten); neue Generation DIN EN 1993-1-1:2025-04' },
      { title: 'DIN EN 1997-1:2014-03 mit NA und DIN 1054 (Eurocode 7 – Entwurf, Berechnung und Bemessung in der Geotechnik)' }
    ],
    formeln: [
      { formel: 'w\'\'(x) = -\\frac{M(x)}{E \\cdot I}', erklaerung: 'Differentialgleichung der elastischen Biegelinie. Verknüpft die Krümmung w\'\'(x) des Balkens mit dem Biegemoment M(x), dem Elastizitätsmodul E und dem Flächenträgheitsmoment I.', quelle: 'Technische Mechanik / Elastostatik' },
      { formel: 'F_{ki} = \\frac{\\pi^2 \\cdot E \\cdot I}{s_k^2}', erklaerung: 'Eulersche Knicklast (Kritische Kraft). Bestimmt die Grenze der elastischen Stabilität einer ideal geraden Stütze bei Knicklänge s_k.', quelle: 'Euler (1744); als N_cr in DIN EN 1993-1-1, 6.3.1.2' }
    ]
  },
  bauphysik: {
    title: 'Gebäude-Bauphysik & Brandschutz',
    tagline: 'Stationärer und instationärer Wärme- und Feuchtetransport, Akustik und Brandschutz bemessen',
    icon: Thermometer,
    basicsTitle: 'Behaglichkeit, Dauerhaftigkeit & Funktionsschutz',
    basicsDesc1: 'Die Bauphysik gestaltet das Innenklima von Gebäuden und schützt das Tragwerk vor vorzeitiger Zerstörung durch Feuchtigkeits- und Temperatureinflüsse. Die Kerndisziplinen sind Wärmeschutz, Feuchteschutz, Bauakustik (Schall) und Brandschutz.',
    basicsDesc2: 'Die interaktiven Module optimieren Schichtenfolgen, lokalisieren Tauwasserebenen nach dem Glaser-Verfahren, berechnen das Schalldämm-Maß massiver Bauteile und die Nachhallzeit von Räumen und zeigen Brandverhalten, Feuerwiderstand und Holzabbrand.',
    basicsCards: [
      { title: 'Wärmespeicherung', desc: 'Wärmespeicherfähigkeit, Temperaturleitfähigkeit und Wärmeeindringfähigkeit als Grundlage für sommerlichen Wärmeschutz und Behaglichkeit.' },
      { title: 'Taupunkt-Lokalisator', desc: 'Berechnung des Wasserdampfdruckverlaufs zur Verhinderung schädlichen Schimmelpilzwachstums.' }
    ],
    submodules: [
      { title: 'Bauphysik (Grundlagen)', icon: Thermometer, purpose: 'U-Wert, Temperaturverlauf, Temperaturfaktor f_Rsi, sommerlicher Wärmeschutz sowie Nachhallzeit von Räumen.', standards: 'DIN EN ISO 6946; DIN 4108-2; DIN 18041', useCase: 'Nachweis einer gedämmten Außenwand und akustische Ertüchtigung eines Klassenraums.' },
      { title: 'Thermische Eigenschaften', icon: Flame, purpose: 'Wärmeleitfähigkeiten, Dämmdicken, spezifische Wärmekapazitäten gängiger Baustoffe.', standards: 'DIN 4108-4; DIN EN ISO 10456', useCase: 'Erforderliche Dämmdicke für die nachträgliche Außendämmung einer Bestandswand.' },
      { title: 'Feuchteschutz & Tauwasser', icon: Droplets, purpose: 'Stationäre Transportrechnung von Wasserdampf (Glaser-Verfahren), relative Luftfeuchten berechnen.', standards: 'DIN 4108-3:2024-03; DIN EN ISO 13788', useCase: 'Nachweis der Tauwasserfreiheit im Bauteilinneren einer Holzständerwand.' },
      { title: 'Dämmung im Vergleich', icon: Thermometer, purpose: 'Vor- und Nachteile von Innendämmung (Taupunkt verlagert sich) versus Außendämmung (WDVS).', standards: 'DIN 4108-3; WTA-Merkblätter 6-4 / 6-5', useCase: 'Sanierungskonzept für eine erhaltenswerte Ziegelfassade.' },
      { title: 'Schallschutz', icon: Volume2, purpose: 'Luftschalldämmung einschaliger Massivbauteile über die flächenbezogene Masse (Massekurve).', standards: 'DIN 4109-1/-2:2018-01; DIN 4109-32:2016-07', useCase: 'Dimensionierung einer massiven Wohnungstrennwand für R′w ≥ 53 dB.' },
      { title: 'Brandschutz', icon: Flame, purpose: 'Brandverhalten (A1 bis B3 bzw. Euroklassen A1 bis F), Feuerwiderstand (F 30 bis F 90 bzw. REI 30 bis REI 90), Einheitstemperaturzeitkurve und Holzabbrand.', standards: 'DIN 4102; DIN EN 13501-1/-2; DIN EN 1995-1-2', useCase: 'Einordnung eines Dämmstoffs als nichtbrennbar (Steinwolle, A1) oder normalentflammbar (EPS, meist Euroklasse E).' },
      { title: 'Energieausweis', icon: FileCheck, purpose: 'Ermittlung von End- und Primärenergiebedarf, Referenzgebäudeverfahren und Effizienzklassen.', standards: 'GModG (vormals GEG); DIN V 18599:2018-09', useCase: 'Erstellung des Energiebedarfsausweises für ein neu geplantes Mehrfamilienhaus.' }
    ],
    didacticCards: [
      { title: 'Transportphänomene verstehen', desc: 'Gegenüberstellung von Wärmeleitung (Fourier) und Dampfdiffusion (Fick) als analoge Transportvorgänge; Konvektion und Luftundichtheiten als zusätzliche Risiken.' },
      { title: 'Schnittstellenschäden meiden', desc: 'Sicheres Aufzeigen konstruktiver Wärmebrücken (Geometrie vs. Werkstoffwechsel).' },
      { title: 'Ganzheitlicher Ansatz', desc: 'Verbindung bauphysikalischer Qualität mit ökologischer Bewertung und gesundem Raumkomfort.' }
    ],
    appStudents: 'Unterstützung bei bauphysikalischen Übungen und Entwurfsarbeiten im Bachelor und Master.',
    appProfessionals: 'Orientierung für Energieberatung, Architektur und Bauphysik; Nachweise erfolgen mit geeigneter Software und aktuellen Normen.',
    wikipedia: [
      { title: 'Bauphysik', url: 'https://de.wikipedia.org/wiki/Bauphysik' },
      { title: 'Wärmedurchgangskoeffizient', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmedurchgangskoeffizient' }
    ],
    literatur: [
      'Willems, W. (Hrsg.): Lehrbuch der Bauphysik. 8. Aufl., Wiesbaden: Springer Vieweg 2017',
      'Lohmeyer, G.; Post, M.: Praktische Bauphysik – Eine Einführung mit Berechnungsbeispielen. Wiesbaden: Springer Vieweg (aktuelle Auflage)'
    ],
    regelwerke: [
      { title: 'DIN 4108 (Wärmeschutz und Energie-Einsparung in Gebäuden): Teil 2 2026-05, Teil 3 2024-03, Teil 4 2020-11' },
      { title: 'DIN 4109-1/-2:2018-01 (Schallschutz im Hochbau – Mindestanforderungen und rechnerische Nachweise)' },
      { title: 'DIN 18041:2016-03 (Hörsamkeit in Räumen)' },
      { title: 'Gebäudemodernisierungsgesetz (GModG, seit 29.07.2026; vormals GEG)', url: 'https://www.gesetze-im-internet.de/geg/' }
    ],
    formeln: [
      { formel: 'q = -\\lambda \\cdot \\frac{\\Delta T}{\\Delta x}', erklaerung: 'Fouriersches Gesetz der eindimensionalen stationären Wärmeleitung. Der Wärmestrom q ist proportional zum Temperaturgradienten.', quelle: 'Physikalische Grundlagen' },
      { formel: 'g = -D_p \\cdot \\frac{\\partial p}{\\partial x}', erklaerung: 'Ficksches Diffusionsgesetz für Wasserdampfstrom g unter dem Einfluss eines Partialdruckgefälles \\partial p.', quelle: 'DIN 4108-3' }
    ]
  },
  nachhaltigkeit: {
    title: 'Ökologie & Gebäudezertifizierung',
    tagline: 'Lebenszyklusanalysen (LCA), CO2-Äquivalente, DGNB, BNB und QNG-Kriterien absichern',
    icon: Globe,
    basicsTitle: 'Nachhaltiges Bauen als Kernkompetenz moderner Tragwerksschaffung',
    basicsDesc1: 'Die Materialwahl beeinflusst die Treibhausgasbilanz eines Gebäudes wesentlich. Nachhaltiges Bauen blickt über den Moment des Einbaus hinaus und bewertet den gesamten energetischen Aufwand von der Wiege bis zur Bahre (Cradle-to-Grave).',
    basicsDesc2: 'Wir analysieren Treibhausgaspotenziale (GWP), erfassen Primärenergiebedarfe (PERT/PENRT), bilanzieren Umweltwirkungen über EPDs und vergleichen Nachhaltigkeitssiegel (DGNB, BNB, QNG) als Voraussetzung staatlicher Förderprogramme.',
    basicsCards: [
      { title: 'Ökobilanzierung (LCA)', desc: 'Interaktive Modellierung des CO2-Fußabdrucks für Bauteile durch direkten Komponentenvergleich.' },
      { title: 'Zertifizierungssysteme', desc: 'Bedeutung der Nachhaltigkeitssysteme DGNB, BNB und QNG zur Absicherung zukunftssicherer Investitionen.' }
    ],
    submodules: [
      { title: 'Daten & Regeln', icon: Globe, purpose: 'Globale Kennzahlen, Rechtsrahmen (EPBD, EU-Taxonomie, GModG, EBV, QNG) und Dekarbonisierungspfade (CRREM).', standards: 'EPBD (EU) 2024/1275; VO (EU) 2020/852; GModG', useCase: 'Prüfung, ob ein Neubau die Taxonomie-Kriterien für Klimaschutz erfüllt.' },
      { title: 'Materialoptimierung', icon: LeafIcon, purpose: 'Wege zur CO2-Reduzierung im Hochbau, klinkereffiziente Betone, rezyklierte Komponenten.', standards: 'DIN EN 15804+A2; DIN EN 206 / DIN 1045-2', useCase: 'Reduzierung des Carbon-Fußabdrucks durch Substitution von Portlandzement durch Hüttensand.' },
      { title: 'Ökobilanzierung (LCA)', icon: LeafIcon, purpose: 'Berechnung des Treibhausgaspotenzials GWP in kg CO2-Äq sowie Versauerungspotenzial (AP).', standards: 'DIN EN ISO 14040/14044; DIN EN 15804+A2; DIN EN 15978:2026-09; DIN EN 17472', useCase: 'Erstellung einer Ökobilanz für eine Geschossdecke und QNG-Nachweis eines Wohngebäudes.' },
      { title: 'Zertifizierung & Deklarationen', icon: Award, purpose: 'Aufbau von Umweltproduktdeklarationen (EPDs) für Herstellerbaustoffe und Gebäudezertifizierungen.', standards: 'ISO 14024/14025; DGNB, BNB, QNG', useCase: 'Heraussuchen der Primärenergie-Zahlen aus einer typischen Gipskartonplatten-EPD.' },
      { title: 'Kreislaufwirtschaft', icon: RefreshCw, purpose: 'Zirkuläres Bauen, Langlebigkeit, sortenreiner Rückbau und rezyklierbare Werkstoffe im Hochbau.', standards: 'KrWG; EBV; ESPR (EU) 2024/1781', useCase: 'Entwurf einer schraubbaren, demontierbaren Fassade.' },
      { title: 'Ressourcen & Umwelt', icon: Factory, purpose: 'Analyse stofflicher globaler Ressourcenentscheidungen, NaWaRo (Holz, Hanf, Schafwolle).', standards: 'ÖKOBAUDAT; DIN EN 16449', useCase: 'Erfassung des PENRT-Verbrauchs von Steinwolle im Vergleich zu Holzfaserplatten.' },
      { title: 'Lebenszyklus & Kosten', icon: TrendingUp, purpose: 'Barwertmethode (LCC), künftige Ersatzinvestitionen und Instandhaltungskosten über 50 Jahre simulieren.', standards: 'ISO 15686-5:2017; DIN EN 16627; DIN 18960', useCase: 'Berechnung des Lebenszyklus-Barwertvorteils eines Schieferdachs gegenüber Ziegeldeckung.' },
      { title: 'Nachhaltigkeits-Checklisten', icon: ClipboardCheck, purpose: 'Strukturierte Prüffragen zu DGNB-, BNB- und QNG-Kriterien, Baustoffauswahl und Zirkularitätsnachweisen.', standards: 'DGNB / QNG Handbücher', useCase: 'Audit-Vorbereitung für die Zertifizierung eines nachhaltigen Bürogebäudes.' }
    ],
    didacticCards: [
      { title: 'Lebenszyklusphasen verstehen', desc: 'Sichere Differenzierung der Module A1-A3 (Herstellung), B1-B7 (Nutzung), C1-C4 (Entsorgung) und D (Gutschriften).' },
      { title: 'Transparente Bewertung', desc: 'Nutzung realer ÖKOBAUDAT-Referenzdaten als wissenschaftliche Berechnungsgrundlage.' },
      { title: 'Ökologie und Ökonomie verbinden', desc: 'Gemeinsame Betrachtung von Ökobilanz (LCA) und Lebenszykluskosten (LCC) über denselben Betrachtungszeitraum.' }
    ],
    appStudents: 'Orientierung für integrierte Entwurfskonzepte und bauökologische Abschlussarbeiten.',
    appProfessionals: 'Überblick für Auditoren und Planende zu Bilanzierungsregeln und Zertifizierungssystemen (DGNB, BNB, QNG).',
    wikipedia: [
      { title: 'Nachhaltiges Bauen', url: 'https://de.wikipedia.org/wiki/Nachhaltiges_Bauen' },
      { title: 'Ökobilanz', url: 'https://de.wikipedia.org/wiki/%C3%96kobilanz' }
    ],
    literatur: [
      'König, H.; Kohler, N.; Kreißig, J.; Lützkendorf, T.: Lebenszyklusanalyse in der Gebäudeplanung. München: Edition Detail 2009',
      'Bauer, M.; Mösle, P.; Schwarz, M.: Green Building – Leitfaden für nachhaltiges Bauen. 2. Aufl., Berlin: Springer Vieweg 2013'
    ],
    regelwerke: [
      { title: 'DIN EN 15804:2022-03 (Umweltproduktdeklarationen; EN 15804+A2)' },
      { title: 'DIN EN 15978:2026-09 (Bewertung der Umweltqualität von Gebäuden)' },
      { title: 'QNG-Handbuch, Anlage 3 (v1.4, 19.07.2024): WG23 PLUS ≤ 24, PREMIUM ≤ 20 kg CO₂-Äq./(m² NRF·a)', url: 'https://www.qng.info/' }
    ],
    formeln: [
      { formel: '\\text{GWP}_{\\text{Gesamt}} = \\sum a_i \\cdot GWP_{\\text{Ref},i}', erklaerung: 'Ökologische Bilanzierungsformel. Das Gesamt-Treibhausgaspotenzial errechnet sich aus den Massen/Volumina a_i der Baustoffe multipliziert mit den spezifischen GWP-Emissionswerten laut EPD / ÖKOBAUDAT.', quelle: 'DIN EN 15978' },
      { formel: 'NPV = C_0 + \\sum_{t=1}^{N} \\frac{C_t}{(1 + d)^t}', erklaerung: 'Nettobarwert-Formel (Net Present Value, NPV) zur Berechnung der gesamten Lebenszykluskosten unter Abzinsung künftiger Ausgaben mit Diskontsatz d.', quelle: 'ISO 15686-5' }
    ]
  },
  digitales: {
    title: 'Digitalisierung im Bauwesen',
    tagline: 'Building Information Modeling (BIM), automatisierte Baustoffpässe und strukturierte Datenbanken',
    icon: Monitor,
    basicsTitle: 'Der Digitale Zwilling als Datenrückgrat',
    basicsDesc1: 'Digitale Methoden helfen, Informationen im Bauwesen zu strukturieren. Im Zentrum steht der Digitale Zwilling (Digital Twin) - ein geometrisches und semantisches Datenmodell, das den gesamten Lebenszyklus eines Bauwerks digital begleitet.',
    basicsDesc2: 'Wir erfassen BIM-Klassen (IFC), binden Materialdatenbanken automatisch an CAD-Systeme an und behandeln Material- und Ressourcenpässe sowie den Digitalen Produktpass (DPP), um die Wiederverwertbarkeit von Sekundärbaustoffen abzusichern.',
    basicsCards: [
      { title: 'BIM-Eigenschaften', desc: 'Ausstattung dreidimensionaler CAD-Objekte mit baustofflichen Attributen (Dichte, Brandschutz, GWP-Werte).' },
      { title: 'Digitale Baustoffpässe', desc: 'Transparenter Nachweis aller verbauten Inhalts- und Schadstoffe zur sortenreinen Trennung beim späteren Rückbau.' }
    ],
    submodules: [
      { title: 'BIM für Baustoffe', icon: Monitor, purpose: 'Semantische Datenanreicherung in CAD-Modellen, IFC-Klassen (IfcMaterial), Schnittstellen.', standards: 'ISO 16739-1:2024 (IFC 4.3) / DIN EN ISO 19650 / bSDD', useCase: 'Zuweisung einer brandschutzrelevanten Rohdichte an eine IFC-Stahlbetonwand.' },
      { title: 'Materialdatenbanken', icon: Search, purpose: 'Anbindung externer Stoffdatenquellen wie ÖKOBAUDAT, MAWEG, WECOBIS in den BIM-Prozess.', standards: 'ÖKOBAUDAT (EN 15804+A2), WECOBIS, Datenbankschnittstellen (API)', useCase: 'Automatischer Import der Wärmeleitfähigkeit aus einer Weblink-Stoffdatenbank.' },
      { title: 'Materialpässe', icon: FileText, purpose: 'Material- und Gebäuderessourcenpässe (z. B. Madaster, DGNB-Gebäuderessourcenpass) zur Quantifizierung der Kreislauffähigkeit; derzeit keine gesetzliche Pflicht.', standards: 'MCI (Ellen MacArthur Foundation) / DGNB TEC 1.6 / ISO 20887', useCase: 'Berechnung des Zirkularitäts-Index für ein neu geplantes Parkhaus.' },
      { title: 'Digitaler Produktpass (DPP)', icon: QrCodeIcon, purpose: 'Digitaler Produktpass, der schrittweise per delegierten Rechtsakten für einzelne Produktgruppen verpflichtend wird.', standards: 'Verordnung (EU) 2024/1781 (ESPR) / Verordnung (EU) 2024/3110 (BauPVO)', useCase: 'Scannen eines Baustoff-QR-Codes auf der Baustelle zum lückenlosen Abruf der Leistungserklärung.' },
      { title: 'LLM-Praxis (Claude & ChatGPT)', icon: Terminal, purpose: 'Effizienter Einsatz von Claude & ChatGPT: Skills, MCP-Konnektoren, Markdown-Standardisierung, kuratierte Projektordner (CLAUDE.md) und quellenbasiertes Web-Grounding.', standards: 'Model Context Protocol (MCP), KI-VO (EU) 2024/1689, DSGVO', useCase: 'Vorstrukturierung von VOB-Bedenkenhinweisen und Prüfprotokollen aus Projektunterlagen – mit fachlicher Endprüfung durch den Ingenieur.' }
    ],
    didacticCards: [
      { title: 'Fehlerfreie Interoperabilität', desc: 'Vermeidung proprietärer Dateninseln durch konsequente Förderung des offenen openBIM-Ansatzes.' },
      { title: 'Präzise Datenqualität', desc: 'Sensibilisierung für die Unterscheidung zwischen groben Schätzwerten (LOD 100) und ausführungsreifen Modelldaten (LOD 400).' },
      { title: 'Zukunftssichere Nachverfolgung', desc: 'Nutzung standardisierter Ontologien und semantischer Netze.' }
    ],
    appStudents: 'Vermittelt Grundlagen der digitalen Ingenieurpraxis, des IFC-Datenmodells und der Schnittstellen.',
    appProfessionals: 'Nachschlagewerk für BIM-Management, Koordination und Nachhaltigkeitsbewertung.',
    wikipedia: [
      { title: 'Building Information Modeling', url: 'https://de.wikipedia.org/wiki/Building_Information_Modeling' },
      { title: 'Industrie Foundation Classes', url: 'https://de.wikipedia.org/wiki/Industry_Foundation_Classes' }
    ],
    literatur: [
      'Borrmann, A.; König, M.; Koch, C.; Beetz, J. (Hrsg.): Building Information Modeling – Technologische Grundlagen und industrielle Praxis. 2. Aufl., Wiesbaden: Springer Vieweg 2021',
      'Hausknecht, K.; Liebich, T.: BIM-Kompendium – Building Information Modeling als neue Planungsmethode. Stuttgart: Fraunhofer IRB 2016'
    ],
    regelwerke: [
      { title: 'DIN EN ISO 19650-1/-2:2019-08 (Organisation und Digitalisierung von Informationen über Bauwerke – BIM)' },
      { title: 'VDI 2552 (BIM-Richtlinienreihe)' }
    ],
    formeln: [
      { formel: 'MCI = \\max\\left(0;\\; 1 - LFI \\cdot F(X)\\right), \\quad F(X) = \\frac{0{,}9}{X}', erklaerung: 'Material Circularity Indicator mit linearer Flussrate LFI und Nutzungsfaktor F(X); Grundlage u. a. der Zirkularitätsbewertung in Madaster.', quelle: 'Ellen MacArthur Foundation: Circularity Indicators (2015/2019)' }
    ]
  },
  bestand: {
    title: 'Bauen im Bestand & Denkmalpflege',
    tagline: 'Altbausanierung, Denkmalpflegepraxis, GModG-Anforderungen und historische Werkstoffkennwerte',
    icon: Building2Icon,
    basicsTitle: 'Erhalt grauer Energie durch nachhaltiges Sanieren',
    basicsDesc1: 'Rund zwei Drittel des Wohnungsbauvolumens in Deutschland entfallen auf Bestandsmaßnahmen (DIW-Bauvolumenrechnung). Die historische Bausubstanz enthält viel graue Energie. Ihr Erhalt erfordert tiefgreifendes Wissen über historische Herstellungsverfahren und Tragwerkseigenschaften.',
    basicsDesc2: 'Wir stellen den Altbauatlas vor, erarbeiten Erfassungsmethoden vom Handaufmaß bis zum 3D-Laserscan, diskutieren Vorgaben des Gebäudemodernisierungsgesetzes (GModG, vormals GEG) für Sanierungen und greifen auf authentische Festigkeiten historischer Ziegel, Gusseisen und Trassmörtel zurück.',
    basicsCards: [
      { title: 'Historische Kennwerte', desc: 'Verlässliches Datenarchiv für Ziegelmauerwerk, Naturstein, frühe Betone und Profile aus der Zeit von 1850 bis 1960.' },
      { title: 'Bauwerksdiagnostik', desc: 'Verwendung moderner zerstörungsfreier Prüfverfahren (ZfP) zur Aufspürung innerer Fehlstellen.' }
    ],
    submodules: [
      { title: 'Altbauatlas', icon: Building2Icon, purpose: 'Klassifizierung typischer Schadensmechanismen in Abhängigkeit von Gebäudeepoche und Bauweise.', standards: 'Bekanntmachung der Regeln zur Datenaufnahme im Wohngebäudebestand (2020); WTA', useCase: 'Sanierung feuchter Kellerdecken aus der Gründerzeit (Kappendecken).' },
      { title: 'Bauwerkserfassung', icon: Compass, purpose: 'Zusammenstellung von Handaufmaß, 3D-Verformungsaufmaß, Photogrammetrie und TLS (Laserscan).', standards: 'Eckstein: Empfehlungen für Baudokumentationen (LDA Baden-Württemberg)', useCase: 'Erstellung einer zentimetergenauen Punktwolke einer Kirchdachstruktur.' },
      { title: 'Denkmalpflege', icon: Landmark, purpose: 'Denkmalschutzgesetzliche Vorgaben, reversible Sanierungsverfahren, historische Putze und Baustoffe.', standards: 'Charta von Venedig / WTA', useCase: 'Rekonstruktion eines barocken Luftkalk-Außenputzes.' },
      { title: 'Modernisierung & GModG', icon: RefreshCw, purpose: 'Vorgaben des Gebäudemodernisierungsgesetzes (vormals GEG) bei Nachrüstung und Änderung der Gebäudehülle, Bio-Treppe beim Heizungstausch, Erleichterungen für Baudenkmäler.', standards: 'GModG §§ 35–37, Anlage 7, § 105', useCase: 'Nachweis der Wirtschaftlichkeit von dämmenden Maßnahmen im denkmalgeschützten Einzelhof.' },
      { title: 'Bauwerksdiagnose & ZfP-Katalog', icon: Search, purpose: 'Systematische Vor-Ort-Zustandserfassung im Bestand: 4-Phasen-Diagnostik (Vorerkundung, ZfP, Labor, Tragfähigkeitsnachweis) und konsolidierter Katalog aller 14 Prüfverfahren (Rückprallhammer, Ultraschall, Potentialfeld, Georadar, Karsten, Karbonatisierung, Bohrkern etc.) mit interaktiven Rechnern.', standards: 'DGZfP-Merkblätter (Reihe B), DBV-Merkblätter, DIN EN 12504, DIN EN 13791', useCase: 'Zustandserfassung einer Tiefgarage und Brückenkappe: Betondeckungs-Konformität (DBV), Karbonatisierungsfortschritt und Rissweitenbestimmung.' },
      { title: 'Historische Kennwerte', icon: History, purpose: 'Materialkennwerte alter Baustoffe wie Schweißeisen, Gussstahl und historisches Ziegelmauerwerk.', standards: 'DBV-Merkblätter Bauen im Bestand, historische Normen (DIN 1045, DIN 1050, DIN 4074)', useCase: 'Tragfähigkeitsnachweis einer Industriehalle von 1910.' },
      { title: 'Historische Bauweisen', icon: BookOpen, purpose: 'Epochenspezifische Tragsysteme wie Holzbalkendecken, Kappendecken, Monier-Gewölbe, Rabitzwände und Fachwerk.', standards: 'WTA-Merkblätter / Denkmalbau-Archive', useCase: 'Ertüchtigung und statische Begutachtung einer preußischen Kappendecke.' },
      { title: 'Historische Bauprodukte', icon: Layers, purpose: 'Rezepturen, Brandgrade und Schadensanfälligkeiten historischer Bindemittel, Ziegel, Zemente und Schmiedemetalle.', standards: 'Historische DIN-Normenarchive', useCase: 'Identifikation von Romanzement und hydraulischen Kalken in Gründerzeitfassaden.' },
      { title: 'Bestand-Checklisten', icon: ClipboardCheck, purpose: 'Systematische Begehungsbögen zur Zustandserfassung, Holzschadensanalyse, Feuchtemessung und Denkmalschutzauflagen.', standards: 'WTA / VDI 6200', useCase: 'Strukturierte Vor-Ort-Begehung eines denkmalgeschützten Speichergebäudes.' }
    ],
    didacticCards: [
      { title: 'Blick für die Historie', desc: 'Sensibilisierung für stoffliche Unverträglichkeiten bei moderner Zementsubstitution auf historischem Mörtel.' },
      { title: 'Geringster Eingriff (Minimaler Eingriff)', desc: 'Förderung reversibler und zerstörungsarmer statischer Reparaturmaßnahmen.' },
      { title: 'Lebensdauerverlängerung', desc: 'Umdeutung alternder Bausubstanz zur wertvollen Zukunftsquelle (Urban Mining).' }
    ],
    appStudents: 'Begleitung von Projektarbeiten in Denkmalpflege und Bauforschung.',
    appProfessionals: 'Orientierung für Tragwerksplanung und Sanierung bei Erfassung und Ertüchtigung historischer Bauteile.',
    wikipedia: [
      { title: 'Bauen im Bestand', url: 'https://de.wikipedia.org/wiki/Bauen_im_Bestand' },
      { title: 'Denkmalschutz', url: 'https://de.wikipedia.org/wiki/Denkmalschutz' }
    ],
    literatur: [
      'WTA-Merkblattreihe (Wissenschaftlich-Technische Arbeitsgemeinschaft für Bauwerkserhaltung und Denkmalpflege e.V.)'
    ],
    regelwerke: [
      { title: 'Gebäudemodernisierungsgesetz (GModG, vormals GEG) – § 35 Nachrüstung, § 36 Änderung, § 37 U-Wert, Anlage 7, § 105 Baudenkmäler', url: 'https://www.gesetze-im-internet.de/geg/' },
      { title: 'EN 1990-2:2026 (Bewertung bestehender Tragwerke; ersetzt CEN/TS 17440:2020) – nationale Fassung/NA prüfen' },
      { title: 'DIN EN 13791:2020-02 + DIN EN 13791/A20 (Bewertung der Druckfestigkeit von Beton im Bauwerk)' }
    ],
    formeln: [
      { formel: 'X_k = \\exp\\left(m_y - k_n \\cdot s_y\\right)', erklaerung: 'Charakteristischer Wert (5-%-Fraktile) aus n Prüfwerten bei log-normaler Verteilung; m_y, s_y = Mittelwert und Standardabweichung der logarithmierten Werte, k_n nach Tab. D.1.', quelle: 'DIN EN 1990, Anhang D.7.2' }
    ]
  },
  rueckbau: {
    title: 'Rückbau, Abfälle & Schadstoffe',
    tagline: 'Gefahrstoffdetektion, Entsorgungswege, Urban Mining und Schadstoffsanierung',
    icon: Trash2,
    basicsTitle: 'Schadstofffreie Kreislaufwirtschaft im Tief- und Hochbau',
    basicsDesc1: 'Der geordnete Rückbau hat den klassischen Abbruch abgelöst. Ziel ist es, Schadstoffe frühzeitig zu detektieren, auszuschleusen und die mineralischen Massen möglichst hochwertig zu verwerten.',
    basicsDesc2: 'Dieses Modul deckt das gesamte schadstoffliche Spektrum ab (Asbest, KMF, PCB, PAK, Schwermetalle), zeigt Entsorgungswege (u. a. Deponieverordnung, Ersatzbaustoffverordnung) und Sortierkonzepte.',
    basicsCards: [
      { title: 'Gefahrstoffanalyse', desc: 'Sichere Identifikation gesundheitsgefährdender Altlasten in Estrichen, Klebern, Dichtstoffen und Isolierungen.' },
      { title: 'Deponieklassierung', desc: 'Einstufungsrichtwerte von unbelastetem Erdaushub (DK 0) bis zu gefährlichen Sonderabfällen (DK III).' }
    ],
    submodules: [
      { title: 'Rückbau & Material', icon: Recycle, purpose: 'Rückbaukonzepte, Vorerkundung der Abbruchsubstanz, selektiver Rückbau als Voraussetzung für hochwertigen RC-Beton.', standards: 'DIN SPEC 91484:2023-09 / DIN SPEC 91525:2026-02 / VDI 6210 Blatt 1:2025-10 / DIN 18007:2022-09', useCase: 'Ausarbeitung eines Rückbau- und Verwertungskonzepts einer Industrieanlage.' },
      { title: 'Boden- & Materialaufbereitung', icon: Recycle, purpose: 'Bodenwaschanlagen, Brecher- und Siebtechnik, Bauschuttaufbereitung und Sekundärbaustoffe.', standards: 'ErsatzbaustoffV / LAGA PN 98 / DIN 19698-1 / DIN 18196', useCase: 'Konzeption einer mobilen Brecheranlage auf einer Großbaustelle zur Kantenbruch-Erzeugung.' },
      { title: 'Abfälle & Altlasten', icon: Trash2, purpose: 'Zuordnung nach Abfallverzeichnis-Verordnung (AVV), Bestimmung der Deponieklassen DK 0 bis DK III.', standards: 'Ersatzbaustoffverordnung (EBV) / Deponieverordnung (DepV) / AVV (LAGA M20 nur noch historisch)', useCase: 'Klassifizierung teerhaltigen Straßenaufbruchs zur schadstofffreien Entsorgung.' },
      { title: 'Schad- und Gefahrstoffe', icon: AlertTriangle, purpose: 'Erkennung und Sanierungswege von Asbest, KMF (künstliche Mineralfasern), PCB, Holzschutzmittel-Altlasten.', standards: 'GefStoffV §§ 5a, 11a / TRGS 519 (Asbest) / TRGS 521 (KMF, Neufassung 2026) / TRGS 524 (2026) / VDI 6202', useCase: 'Planung von Schutzmaßnahmen beim Absaugen asbesthaltiger Spachtelmassen.' },
      { title: 'Ressourceneffizienz', icon: LeafIcon, purpose: 'Urban Mining, Materialkataster, Zirkularitätsnachweise und Recyclingquoten im Hoch- und Tiefbau.', standards: 'Kreislaufwirtschaftsgesetz (KrWG § 14) / VDI 4800 Blatt 1', useCase: 'Berechnung der Massenbilanz und Recyclingquote eines rückzubauenden Gewerbekomplexes.' },
      { title: 'Rückbau-Checklisten', icon: ClipboardCheck, purpose: 'Prüflisten für Schadstofferkundung, Entsorgungsnachweise, Abbruchanträge und Arbeitssicherheit.', standards: 'GewAbfV § 8 / TRGS 519 / VDI 6210 Blatt 1 / LAGA PN 98', useCase: 'Freigabeprotokoll vor Abbruchbeginn mit Schwarz-Weiß-Bereichskontrolle.' }
    ],
    didacticCards: [
      { title: 'Lückenlose Dokumentation', desc: 'Die Wichtigkeit schadstofffreier "Zutatenlisten" für das Gebäude der Zukunft.' },
      { title: 'Schutz vor Kontamination', desc: 'Verhindern der Verschleppung von Gefahrenstoffen in den Recyclingkreislauf.' },
      { title: 'Gesundheitsschutz', desc: 'Rechtlich belastbare Umsetzung strenger Arbeitsschutzregeln beim Hantieren mit Staub- und Schadstoffquellen.' }
    ],
    appStudents: 'Einführung in Rückbau, Schadstoffsanierung und Abfallrecht für angehende Bauleitung und Umweltkoordination.',
    appProfessionals: 'Arbeitshilfe für Rückbauplanung, Entsorgungskoordination, Bauleitung und SiGeKo; ersetzt keine Fachkunde nach TRGS 519/524.',
    wikipedia: [
      { title: 'Kreislaufwirtschaftsgesetz', url: 'https://de.wikipedia.org/wiki/Kreislaufwirtschaftsgesetz' },
      { title: 'Asbestsanierung', url: 'https://de.wikipedia.org/wiki/Asbestsanierung' }
    ],
    literatur: [
      'Müller, A.: Baustoffrecycling – Entstehung, Aufbereitung, Verwertung. Wiesbaden: Springer Vieweg 2018',
      'Kranert, M. (Hrsg.): Einführung in die Kreislaufwirtschaft. 5. Aufl., Wiesbaden: Springer Vieweg 2017'
    ],
    regelwerke: [
      { title: 'Ersatzbaustoffverordnung (EBV), Art. 1 der Mantelverordnung vom 9.7.2021 (BGBl. I S. 2598), in Kraft seit 01.08.2023', url: 'https://www.gesetze-im-internet.de/ersatzbaustoffv/' },
      { title: 'Gefahrstoffverordnung (GefStoffV) – § 5a Veranlasser, § 11a Asbest (Fassung seit 05.12.2024)', url: 'https://www.gesetze-im-internet.de/gefstoffv_2010/' },
      { title: 'Gewerbeabfallverordnung (GewAbfV) – §§ 8, 9 Bau- und Abbruchabfälle', url: 'https://www.gesetze-im-internet.de/gewabfv_2017/' },
      { title: 'TRGS 519: Asbest – Abbruch-, Sanierungs- oder Instandhaltungsarbeiten (Fassung 2014, zuletzt geändert 28.01.2025)', url: 'https://www.baua.de/DE/Angebote/Regelwerk/TRGS/TRGS-519' },
      { title: 'Deponieverordnung (DepV) – Anhang 3 Zuordnungswerte', url: 'https://www.gesetze-im-internet.de/depv_2009/' }
    ],
    formeln: [
      { formel: '\\max_i \\frac{c_i}{MW_{i,k}} \\le 1 \\Rightarrow \\text{Materialklasse } k', erklaerung: 'Einstufung in eine Materialklasse: Jeder Parameter i muss den Materialwert MW der Klasse k einhalten; maßgebend ist der ungünstigste Quotient (keine Summenbildung).', quelle: 'Ersatzbaustoffverordnung (EBV), Anlage 1' }
    ]
  },
  dauerhaftigkeit: {
    title: 'Dauerhaftigkeit & Korrosionschemie',
    tagline: 'Vermeidung von Frost-Tau-Schäden, physikalisch-chemische Transportprozesse, Baustahl- und Holzzerstörung sowie Polymeralterung und mineralische Gipssprengungen',
    icon: ShieldAlert,
    basicsTitle: 'Lebensdauerbegrenzende Schädigungsprozesse im Ingenieurbau',
    basicsDesc1: 'Jedes Bauwerk altert unter wechselnden klimatischen, biologischen, elektrochemischen und chemischen Einflüssen. Ein Bauwerk gilt als dauerhaft, wenn es seine standsichere und gebrauchstaugliche Funktion über die geplante Nutzungsdauer (nach DIN EN 1990 z. B. 50 Jahre für übliche Hochbauten, 100 Jahre für Brücken) bei planmäßiger Instandhaltung erfüllt. Leistungsbezogene Nachweise über Expositionswiderstandsklassen (ERK) sollen künftig mit der DAfStb-ERK-Richtlinie (Entwurf 2026) als Alternative zu den deskriptiven Regeln der DIN-1045-Reihe 2023 möglich werden.',
    basicsDesc2: 'Das Modul behandelt werkstoffübergreifende Alterungsprozesse: von Transportprozessen im zementgebundenen Porensystem (Karbonatisierung, Chlorideindringen, Frost-Tausalz-Angriff, treibende Reaktionen wie AKR und Sulfatangriff) über das temperaturabhängige Verhalten viskoelastischer Asphalte, elektrochemische Redoxreaktionen metallischer Korrosionszellen (DIN EN ISO 12944), biologischen Holzabbau (DIN 68800) und physiko-chemische Alterung von Kunststoffen bis hin zur Natursteinverwitterung (WTA) und Spontanbrüchen von ESG durch Nickelsulfid-Einschlüsse (Heißlagerungstest, HST).',
    basicsCards: [
      { title: 'Porentransport-Phänomene', desc: 'Wasser, Sulfat und Chloride penetrieren Baustoffe gerichtet über Kapillarporen (Saugwirkung) oder Konzentrationsgradienten (Ficksche Gesetze). Der w/z-Wert steuert hierbei direkt die porensegmentierende Hydratation.' },
      { title: 'Bewehrungspassivierung', desc: 'Das alkalische Porenmilieu (pH-Wert ≈ 12,5–13,5) erzeugt auf dem Stahl eine hauchdünne Passivschicht aus Fe-Oxiden. Diese wird durch Absäuerung (CO₂-Eintrag) oder punktuellen Chloriddurchbruch aufgelöst.' },
      { title: 'Material-Inkompatibilität', desc: 'Direkte stoffliche Kontakte können zerstörend wirken: Galvanische Bimetallkorrosion an Fassadenschrauben, Weichmacherwanderung aus PVC in EPS-Schäume, oder die alkalische Zersetzung unedler Metalle im Frischbeton.' },
      { title: 'Konstruktiver Wetterschutz', desc: 'Das oberste Dogma zur Minimierung von Instandhaltungskosten lautet: Wasserableitung, Tropfkanten, Fugenvermeidung und Lüftungsebenen schlagen chemisch-toxische Barriere- und Imprägnierungssysteme.' }
    ],
    submodules: [
      { title: 'Prinzipien & Konzepte', icon: ShieldAlert, purpose: 'Werkstoffübergreifende Säulen (Konstruktiver Schutz, Materialanpassung, Barriere- & Opfersysteme) sowie fundamentale Triebkräfte der Diffusionsvorgänge.', standards: 'DIN EN 1990 / Eurocode-Reihe', useCase: 'Planung von dauerhaft durchlüfteten Holzfassaden oder Gefälleausführungen zur schadensfreien Wasserableitung.' },
      { title: 'Stahlbeton-Karbonatisierung', icon: ShieldAlert, purpose: 'Quadratisches Zeitgesetz des CO₂-Eindringens unter Zerstörung des alkalischen pH-Puffers. Lebensdauersimulation vor Depassivierung.', standards: 'DIN EN 206:2021-06 / DIN 1045-2:2023-08 / DIN EN 1992-1-1 + NA', useCase: 'Soll-Ist-Abgleich der Betondeckung (c_min) zur Sicherstellung von 50 oder 100 Jahren karbonatisierungsfreier Nutzungsdauer.' },
      { title: 'Betonkorrosive Schadensbilder', icon: ShieldAlert, purpose: 'Innere und äußere Treibprozesse: Alkali-Kieselsäure-Reaktion (AKR), Ettringit-Sulfattreiben, chloridinduzierter Lochfraß und Frost-Tau-Abplatzungen (XF/XA/XM).', standards: 'DAfStb-Alkali-Richtlinie (2013-10) / DIN 1045-2 (XA, XF) / DBV-Merkblätter', useCase: 'Auswahl eines sehr dichten LP-Betons für Autobahndecken oder sulfatbeständiger SR-Zemente für Kanalisationsrohre.' },
      { title: 'Korrosion der Metalle', icon: ShieldAlert, purpose: 'Anodische und kathodische Redoxvorgänge, saurer/neutraler Elektrolytfluss, galvanische Verträglichkeiten der elektrochemischen Spannungsreihe.', standards: 'DIN EN ISO 12944 (Teile 1–9) / DIN EN ISO 9223:2012-05 / DIN EN ISO 14713', useCase: 'Bimetall-Verträglichkeitsbewertung von Verbindungsschrauben (Edelstahl A4 vs. Baustahl verzinkt in Nassbereichen).' },
      { title: 'Holzbiologischer Abbau', icon: ShieldAlert, purpose: 'Physiologischer Befall durch holzzerstörende Pilze (Weiß-, Braun-, Moderfäule) und Insektenlarven bei u >= 20% Holzfeuchte.', standards: 'DIN 68800-1 bis -4 (2019–2022) / DIN EN 350:2016-12 / DIN EN 351-1:2023-07', useCase: 'Bestimmung der passenden Kernholzart (z.B. Robinie Klasse 1 oder Eiche Klasse 2) für voll bewitterte Strukturen der Gebrauchsklasse (GK) 3 oder 4.' },
      { title: 'Asphalt-Viskoelastizität', icon: ShieldAlert, purpose: 'Oxidative Alterungsprozesse (Asphaltene-Erhöhung), Tieftemperatur-Querrisse und plastische Spurrinnenbildung (Hitze-Verformung).', standards: 'ZTV Asphalt-StB / TL Asphalt-StB / AL Sp-Asphalt', useCase: 'Einsatz polymer-modifizierter Elastomerbitumine (PmB) und rheometrische Validierung im Scherrheometer (DSR).' },
      { title: 'Spannungsrisse in Polymeren', icon: ShieldAlert, purpose: 'Physikalische und chemische Alterung von Bau-Kunststoffen, UV-Zersetzung, Weichmacher-Migration und tensidinduzierte ESC-Risse.', standards: 'ISO Randspezifikationen / DVS Richtlinien (Kunststoffrohre)', useCase: 'Auslegung und konstruktive Trennung von Weich-PVC-Abdichtungsbahnen und unverträglichen Polystyrol-Dämmmatten.' },
      { title: 'Naturstein- & Mauerwerkserhalt', icon: ShieldAlert, purpose: 'Kryptofloreszenz (Salzkristallisation unter Druck), saurer Gips-Krustenabbau kalkiger Gesteine und Frostsprengungen.', standards: 'WTA-Merkblätter (Wissenschaftlich-Technische Arbeitsgemeinschaft)', useCase: 'Konzeption von makroporösen Sanierputzsystemen nach WTA 2-9 zur schadensfreien Salzaufnahme an feuchten Altbausockeln.' },
      { title: 'ESG-Glasbruch & Hydrolyse', icon: ShieldAlert, purpose: 'Glaskorrosion durch stehende Nässe (pH > 9) und verzögerter NiS-Spontanbruch durch Phasenumwandlung im vorgespannten Gefüge.', standards: 'DIN EN 14179 / DIN EN 12150', useCase: 'Ausschreibung und Qualitätssicherung des Heat-Soak-Sicherheitsprüftests (HST) für Außen-Fassadengläser.' },
      { title: 'Dauerhaftigkeit-Checklisten', icon: ClipboardCheck, purpose: 'Systematische Prüflisten zu Expositionsklassen, Betondeckung, chemischer Beständigkeit und konstruktivem Holzschutz.', standards: 'DIN EN 1990 / DIN EN 206 / DIN 68800', useCase: 'Dauerhaftigkeits-Audit in der Entwurfsphase eines Parkhauses oder einer Fußgängerbrücke.' }
    ],
    didacticCards: [
      { title: 'Interdisziplinäre Chemie', desc: 'Werkstoffdegradation ist kein unkontrollierbares Schicksal, sondern die logische Konsequenz bekannter physikalischer und elektrochemischer Massentransport-Redoxgesetze.' },
      { title: 'Konstruktion vor Chemie', desc: 'Bester und umweltfreundlichster Bautenschatz gelingt stets konstruktiv: Wasser und Staunässe gezielt abführen, um biologischen und elektrochemischen Reaktionen die Reaktionsgrundlage zu entziehen.' },
      { title: 'Lebenszyklus-Betrachtung', desc: 'Investitionen in hochqualitative Baustoffe (z.B. niedriger w/z-Wert, Edelstahl, TMT-Holz) rentieren sich über die Nutzungsphase durch minimalen Wartungsaufwand um ein Vielfaches.' }
    ],
    appStudents: 'Vorbereitung auf Vertiefungsprüfungen in Massivbau, Stahl- und Holzbau, Bauchemie und Denkmalpflege.',
    appProfessionals: 'Wissensbasis für Gutachten, Tragwerks- und Sanierungsplanung bei der Ursachenermittlung.',
    wikipedia: [
      { title: 'Korrosion', url: 'https://de.wikipedia.org/wiki/Korrosion' },
      { title: 'Passivierung', url: 'https://de.wikipedia.org/wiki/Passivierung' },
      { title: 'Alkali-Kieselsäure-Reaktion', url: 'https://de.wikipedia.org/wiki/Alkali-Kiesels%C3%A4ure-Reaktion' },
      { title: 'Holzschutz', url: 'https://de.wikipedia.org/wiki/Holzschutz' }
    ],
    literatur: [
      'Stark, J.; Wicht, B. (2013): Dauerhaftigkeit von Beton (Springer Vieweg)',
      'DIN e. V. (Hrsg.): Holzschutz – Praxiskommentar zu DIN 68800 Teile 1 bis 4. Berlin: DIN Media (aktuelle Auflage)',
      'Bertolini, L.; Elsener, B.; Pedeferri, P.; Redaelli, E.; Polder, R.: Corrosion of Steel in Concrete. 2. Aufl., Weinheim: Wiley-VCH 2013',
      'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
    ],
    regelwerke: [
      { title: 'DIN 68800: Holzschutz (Teil 1:2019-06, Teil 2:2022-02, Teil 3:2020-03, Teil 4:2020-12)' },
      { title: 'DIN EN ISO 12944: Korrosionsschutz von Stahlbauten durch Beschichtungssysteme' },
      { title: 'DIN 1045-2:2023-08: Tragwerke aus Beton, Stahlbeton und Spannbeton – Beton (Anwendungsregeln zu DIN EN 206)' },
      { title: 'WTA-Merkblatt 2-9: Sanierputzsysteme - Kriterien für Planung und Ausführung', url: 'https://www.wta-gmbh.de/' },
      { title: 'DIN EN 14179: Heißgelagertes thermisch vorgespanntes Einscheiben-Sicherheitsglas (HST)' }
    ],
    formeln: [
      { formel: 's(t) = k \\cdot \\sqrt{t}', erklaerung: 'Quadratisches Zeitgesetz der Carbonatisierungstiefe s(t) in Abhängigkeit vom Carbonatisierungsbeiwert k [mm/√a] und Bauteilalter t [Jahre]. Die Norm gibt keine k-Werte vor; Anhaltswerte liefern Messungen oder Modelle nach fib Bulletin 34.', quelle: 'Stark/Wicht: Dauerhaftigkeit von Beton' },
      { formel: '\\text{w/z} = \\frac{W}{Z} \\le \\text{w/z}_{\\text{max}}', erklaerung: 'Wasserzementwert: Massenverhaltnis von wirksamem Wassergehalt W [kg/m³] zu Zementgehalt Z [kg/m³]. Bestimmt direkt die Porenradienverteilung und Porenstruktur.', quelle: 'DIN EN 206' },
      { formel: '\\Delta d_{\\text{loss}} = r_{\\text{corr}} \\cdot t', erklaerung: 'Linearer Korrosionsabtrag von Baustählen und metallischen Zinkbeschichtungen über die Zeit t auf Basis konstanter lufthygienischer Abtragsgeschwindigkeiten r_corr [μm/Jahr] nach DIN EN ISO 12944-2 (Klassen C1 bis CX).', quelle: 'DIN EN ISO 12944-2' },
      { formel: 'J = -D_p \\cdot \\frac{\\partial C}{\\partial x}', erklaerung: '1. Ficksches Gesetz zur Beschreibung des eindringenden diffusiven Schadstoffionen-Massenflusses (z.B. Chloride Cl⁻ oder Sulfate SO₄²⁻) durch das kapillare Zementsteinporennetzwerk.', quelle: 'Ficksches Diffusionsgesetz' }
    ]
  },
  schaeden: {
    title: 'Mängel & Schäden im Bauwesen',
    tagline: 'Mängel und Schadensursachen systematisch erfassen, baustatische Standsicherheit bewerten und forensisch dokumentieren',
    icon: FileWarning,
    basicsTitle: 'Wissenschaftliche Mängel- und Schadensanalyse',
    basicsDesc1: 'Planungsfehler, Ausführungsmängel oder übermäßige Nutzungs- und Umwelteinwirkungen führen zu Baumängeln und Bauschäden. Dieses Modul vermittelt die methodische Erfassung von Mängeln & Schäden von der Risskartierung bis zur zerstörungsfreien Prüfung.',
    basicsDesc2: 'Wir behandeln baurechtliche Pflichten nach BGB und VOB/B, typische Schadens- und Mängelbilder (Schimmel, Feuchte, Trennrisse, Abplatzungen), Überprüfungen nach VDI 6200 (anerkannte Regel der Technik, keine Rechtsnorm; konkretisiert die Instandhaltungs- und Verkehrssicherungspflicht des Eigentümers nach § 3 MBO / Art. 3 BayBO und §§ 823, 836 BGB) sowie beweissichernde Dokumentation.',
    basicsCards: [
      { title: 'VDI 6200 Tragwerksinspektion', desc: 'Strukturierte Beurteilungsverfahren von visuellen Kontrollen bis zu messtechnischen Tiefenprüfungen zur Abwendung von Tragwerkseinstürzen.' },
      { title: 'ZfP & Sensorik-Monitoring', desc: 'Einsatz von LVDT-Rissaufnehmern, Potentialfeldmessungen, Holzbohrwiderstandsmessungen und Endoskopie.' }
    ],
    submodules: [
      { title: 'Recht & Grundlagen', icon: FileWarning, purpose: 'Rechtliche Einordnung von Baumängeln und Bauschäden, Beweissicherungsverfahren, Mängelrügen und Gewährleistungsfristen.', standards: 'VOB/B § 13 (Mängelansprüche)', useCase: 'Durchführung einer mangelfreien Beweissicherung vor Beginn einer innerstädtischen Baugrubenspundung.' },
      { title: 'Typische Bauschäden & Mängel', icon: TrendingDown, purpose: 'Systematischer Schadens- und Mängelatlas: Aufsteigende Feuchte, Setzungsrisse, thermische Spannungsbrüche, WDVS-Schäden und Ausführungsfehler.', standards: 'Bauschadens-Kataloge', useCase: 'Ursachenermittlung bei schrägen Rissen über Fensteröffnungen.' },
      { title: 'Tragwerksmonitoring & Sensorik (SHM)', icon: Activity, purpose: 'Kontinuierliche Schwingungs- und Verformungsüberwachung (SHM) zur Vermeidung von Tragwerksversagen, Sensornetzwerke (LVDT, DMS, Piezogeber, Neigung), Schwellenwert- & Alarmierungsmatrizen nach VDI 6200, Holzdiagnostik mit Resistographen-Bohrwiderstandssimulation sowie konsolidierter ZfP-Prüfkatalog.', standards: 'VDI 6200 / DIN 1076 / DGZfP', useCase: 'Messtechnische Rissbreitenüberwachung (LVDT) und Schwingungsmessung an einer Spannbetonbrücke unter Schwerlastverkehr mit automatischer Grenzwertalarmierung.' },
      { title: 'Zustandsbewertung (VDI 6200)', icon: ClipboardCheck, purpose: 'Überprüfung bestehender Tragwerke nach VDI 6200 (Begehung, Inspektion, eingehende Überprüfung) und Zustandsnoten nach DIN 1076 / RI-EBW-PRÜF.', standards: 'VDI 6200 / VDI 6200 Blatt 1.1 / DIN 1076', useCase: 'Vorbereitung der regelmäßigen Sichtprüfung für eine weitgespannte Holzhalle.' },
      { title: 'Große Materialschäden & Einstürze', icon: AlertTriangle, purpose: 'Forensische Fallstudien historischer Katastrophen (AKR an Betonschwellen Garmisch, Eishalle Bad Reichenhall, Ponte Morandi, Carolabrücke Dresden, Hyatt Regency, Stava, Schiersteiner Brücke, Silver Bridge, Kongresshalle, Reichsbrücke) mit Projektdaten, Historie, Materialursachen und Lehren.', standards: 'DAfStb Alkali-Richtlinie / VDI 6200 / DIN 1076 / Eurocodes', useCase: 'Analyse werkstoffbedingter Einsturzursachen wie Alkali-Kieselsäure-Reaktion, Spannungsrisskorrosion oder Leimhydrolyse für Gutachten und Lehre.' },
      { title: 'Mängel- & Schadens-Checklisten', icon: FileText, purpose: 'Strukturierte Erfassungsbögen und Prüflisten für Begehungen, Risskataster, Mängelrügen und Gutachten.', standards: 'VDI 6200 / VOB/B § 4 Abs. 7, § 13 / DIN 4123', useCase: 'Beweissichernde Dokumentation von Mängeln und Rissprotokollen bei Nachbarbebauung.' }
    ],
    didacticCards: [
      { title: 'Schadensursache vor Schadensbehebung', desc: 'Sanierungen ohne vorherige Beseitigung der Ursache (z.B. Abdichtungsfehler) führen unausweichlich zu Folgeschäden.' },
      { title: 'Systematische Diagnostik', desc: 'Verwendung standardisierter Prüfprotokolle für reproduzierbare, nachvollziehbare Gutachtenergebnisse (die Beweiswürdigung obliegt dem Gericht, § 286 ZPO).' },
      { title: 'Gefahrenabwehr & Standsicherheit', desc: 'Sofortige Identifizierung statisch kritischer Schädigungen zur Verhütung von Personenschäden.' }
    ],
    appStudents: 'Einführung in die Arbeit von Sachverständigenbüros, Bauämtern und Prüfinstituten.',
    appProfessionals: 'Digitaler Leitfaden für Bausachverständige, Prüfingenieure, Bauleiter und Gutachter vor Ort.',
    wikipedia: [
      { title: 'Bauschaden', url: 'https://de.wikipedia.org/wiki/Bauschaden' },
      { title: 'Baustatische Prüfung', url: 'https://de.wikipedia.org/wiki/Pr%C3%BCfingenieur_f%C3%BCr_Baustatik' }
    ],
    literatur: [
      'Oswald, R.; Abel, R.: Hinzunehmende Unregelmäßigkeiten bei Gebäuden. Springer Vieweg (aktuelle Auflage)',
      'Zimmermann, G. (Hrsg.): Bauschadens-Sammlung. Fraunhofer IRB Verlag (mehrbändig)',
      'Raupach, M.; Orlowsky, J.: Erhaltung von Betonbauwerken. Vieweg+Teubner',
      'Scheer, J.: Versagen von Bauwerken. Band 1: Brücken; Band 2: Hochbauten und Sonderbauwerke. Ernst & Sohn'
    ],
    regelwerke: [
      { title: 'VDI 6200:2010-02: Standsicherheit von Bauwerken – Regelmäßige Überprüfung', url: 'https://www.vdi.de/richtlinien' },
      { title: 'VDI 6200 Blatt 1.1:2026-06: Berichtsdokumentation der Überprüfung', url: 'https://www.vdi.de/richtlinien' },
      { title: 'DIN 1076:2026-01: Ingenieurbauwerke im Zuge von Straßen und Wegen – Überwachung und Prüfung (ersetzt 1999-11)' },
      { title: 'VOB/B (Fassung 2016, weiterhin gültig): Vergabe- und Vertragsordnung für Bauleistungen – Teil B', url: 'https://www.bauprofessor.de/vob/' }
    ],
    formeln: [
      { formel: 'w_k = s_{r,\\text{max}} \\cdot (\\varepsilon_{sm} - \\varepsilon_{cm})', erklaerung: 'Rechenwert der Rissbreite als Produkt aus maximalem Rissabstand s_r,max und Dehnungsdifferenz zwischen Betonstahl und Beton (ohne zusätzlichen Beiwert). s_r,max nach Gl. 7.11 bzw. NA(DE).', quelle: 'DIN EN 1992-1-1, Gl. (7.8)' }
    ]
  },
  instandsetzung: {
    title: 'Schutz & Instandsetzung',
    tagline: 'Bauwerkserhaltung, Schutzprinzipien nach DIN EN 1504-9 und werkstoffspezifische Sanierungskonzepte',
    icon: Wrench,
    basicsTitle: 'Dauerhafte Bauwerkserhaltung & Sanierungstechnik',
    basicsDesc1: 'Bestehende Bausubstanz zu schützen, instandzusetzen und zu ertüchtigen ist ökologisch und ökonomisch eine zentrale Bauaufgabe. Dieses Modul bündelt werkstoffübergreifende und baustoffspezifischen Sanierungsverfahren.',
    basicsDesc2: 'Vom normativen Instandsetzungsrahmen nach DIN EN 1504 und TR Instandhaltung über werkstoffspezifische Verfahren (Holzprothesen DIN 68800, Stahlkorrosionsschutz ISO 12944, Kunststoffschweißen DVS, Asphaltsanierung ZTV BEA-StB) bis hin zu WTA-zertifizierten Sanierputzen.',
    basicsCards: [
      { title: 'DIN EN 1504-9 Prinzipien', desc: '11 europäische Prinzipien gegen Betondegradation und Bewehrungskorrosion von Schutzschichten bis zum KKS.' },
      { title: 'Werkstoffspezifischer Bautenschutz', desc: 'Maßgeschneiderte Sanierungs- und Schutztechnologien für mineralische, metallische, organische und bituminöse Baustoffe.' }
    ],
    submodules: [
      { title: 'Schutz- & Instands.-Grundlagen', icon: Layers, purpose: 'Europäische Instandsetzungsprinzipien, passive vs. aktive Schutzkonzepte, Tuutti-Lebensdauermodell und De-Sitter-Regel.', standards: 'DIN EN 1504-9 / TR Instandhaltung', useCase: 'Festlegung des Sanierungsprinzips W vs. C für ein chloridbelastetes Parkhausdeck.' },
      { title: 'Instandsetzung nach Material', icon: Trees, purpose: 'Werkstoffspezifischer Schutz und Reparatur: Holz (DIN 68800), Stahl (ISO 12944), Kunststoffe (DVS), Asphalt (ZTV BEA-StB), Mauerwerk (WTA).', standards: 'DIN 68800 / ISO 12944 / ZTV BEA-StB', useCase: 'Planung von Holzprothesen an morschen Balkenköpfen und Duplex-Beschichtung auf Altstahl.' },
      { title: 'Stahlbetoninstandhaltung', icon: Wrench, purpose: 'Instandsetzungskonzepte, Untergrundvorbereitung mit HDW, Reprofilierung (PCC/SPCC), OS-Systeme und Rissinjektion.', standards: 'TR Instandhaltung (DIBt; Nachfolgerin der Rili-SIB) / DIN EN 1504', useCase: 'Ausschreibung von PCC-Mörtel und OS 11b-Beschichtung auf befahrbaren Parkdeckflächen.' },
      { title: 'Bauwerksabdichtung & Injektion', icon: Droplets, purpose: 'Nachträgliche Bauwerksabdichtung erdberührter Bauteile, Schleierinjektion und Rissverpressung mit EP/PU.', standards: 'DIN 18533 / DIN EN 1504-5 / WTA 4-6-24/D / WTA 4-10', useCase: 'Sanierung einer feuchten Tiefgaragen-Bodenplatte mit kraftschlüssiger Rissinjektion.' },
      { title: 'WTA-Merkblätter', icon: FileText, purpose: 'Richtlinien zur Mauerwerksinstandsetzung, salzresistenten Sanierputzen und nachträglichen Horizontalsperren.', standards: 'WTA-Merkblätter 2-9-20/D, 4-6-24/D, 4-10, 6-5-14/D', useCase: 'Vorgabe der Horizontalsperrendosierung nach WTA-Merkblatt 4-4.' },
      { title: 'Instandsetzungs-Checklisten', icon: ClipboardCheck, purpose: 'Prüfformulare für Sachkundige Planer (SKP), HDW-Untergrundvorbereitung, Haftzugprüfung und QS-Dokumentation.', standards: 'TR Instandhaltung / DIN EN 1504-10', useCase: 'Überprüfung der Mattfeuchte und Abreißfestigkeit vor dem Auftrag von Instandsetzungsmörtel.' }
    ],
    didacticCards: [
      { title: 'De-Sitter: Gesetz der Fünf', desc: 'Jeder aufgeschobene Euro in der Instandhaltungsphase verfünffacht näherungsweise die Sanierungskosten in der nächsten Phase.' },
      { title: 'Systemverträglichkeit & Nachbehandlung', desc: 'Instandsetzungsmörtel müssen bezüglich E-Modul und thermischer Dehnung mit dem Altbeton kompatibel sein.' },
      { title: 'Substanzschonung vor Totalersatz', desc: 'Präzise Teilerneuerung durch Holzprothesen, Reparaturschweißungen und Dünnschichtasphalte spart Ressourcen.' }
    ],
    appStudents: 'Vermittelt Grundlagen für die Qualifikation als Sachkundiger Planer (SKP).',
    appProfessionals: 'Praxisleitfaden für Sachkundige Planer, Sanierungsplaner, SIVV-Fachkräfte und Bauleiter.',
    wikipedia: [
      { title: 'Betoninstandsetzung', url: 'https://de.wikipedia.org/wiki/Betoninstandsetzung' },
      { title: 'Korrosionsschutz', url: 'https://de.wikipedia.org/wiki/Korrosionsschutz' },
      { title: 'Holzschutz', url: 'https://de.wikipedia.org/wiki/Holzschutz' }
    ],
    literatur: [
      'Raupach, M.; Orlowsky, J.: Erhaltung von Betonbauwerken. Wiesbaden: Vieweg+Teubner 2008',
      'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
    ],
    regelwerke: [
      { title: 'DIN EN 1504: Produkte und Systeme für den Schutz und die Instandsetzung von Betontragwerken (Teile 1 bis 10)' },
      { title: 'TR Instandhaltung: DIBt Technische Regel Instandhaltung von Betonbauwerken (Teil 1 Stand Mai 2020, Teil 2; über die MVV TB eingeführt)', url: 'https://www.dibt.de/' },
      { title: 'DIN 68800: Holzschutz (Teil 4:2020-12 Bekämpfung und Sanierung)' },
      { title: 'DIN EN ISO 12944: Korrosionsschutz von Stahlbauten' }
    ],
    formeln: [
      { formel: 'K_n = K_0 \\cdot 5^n', erklaerung: 'De-Sitter-Regel (Law of Fives): Der finanzielle Instandsetzungsaufwand K_n verfünffacht sich näherungsweise in jeder aufeinanderfolgenden Lebenszyklusphase n bei unterlassener Vorsorge.', quelle: 'De Sitter (1984)' },
      { formel: 'f_{\\text{ct,req}} \\ge 1{,}5\\text{ N/mm}^2', erklaerung: 'Üblicher Anhaltswert der Abreißfestigkeit des Betonuntergrunds (Prüfung nach DIN EN 1542) vor dem Auftrag von Instandsetzungsmörteln (Einzelwert mindestens 1,0 N/mm²); maßgebend ist der Instandhaltungsplan.', quelle: 'DIN EN 1542 / TR Instandhaltung' }
    ]
  },
  praxiswissen: {
    title: 'Baubetrieb, Kalkulation & Karriere',
    tagline: 'Ausschreibungen, Bauleitung vor Ort, Kalkulationsschemata und Soft Skills für Ingenieure',
    icon: Wrench,
    basicsTitle: 'Erfolgreiches Umsetzen auf Baustelle und im Büro',
    basicsDesc1: 'Ein Detail muss wirtschaftlich umsetzbar sein und auf der Baustelle richtig ausgeführt werden. Das Modul verbindet Theorie und Baupraxis.',
    basicsDesc2: 'Wir vermitteln Kenntnisse zur Ausarbeitung sauberer Leistungsverzeichnisse (LV) nach VOB, beleuchten die logistische Steuerung und Qualitätskontrollen des Bauleiters, erörtern Kalkulationsannahmen und geben Starthilfe zur persönlichen Karriereplanung.',
    basicsCards: [
      { title: 'Projektsteuerung', desc: 'Verständnis des magischen Dreiecks aus Kosten, Terminen und Qualitäten im Baubetrieb.' },
      { title: 'Mängel- & Schadensvermeidung', desc: 'Rechtlich belastbares Erstellen von Bautagebüchern und Abnahmeprotokollen vor Ort.' }
    ],
    submodules: [
      { title: 'Planung & Ausschreibung', icon: ClipboardCheck, purpose: 'Erstellung von Leistungsverzeichnissen (LV), Bieterverfahren und Vertragsgestaltung.', standards: 'VOB/A (Ausschreibungsordnung)', useCase: 'Verfassen einer fehlerfreien VOB-Funktionalbeschreibung für Erdbauleistungen.' },
      { title: 'Bauleitung & Baustelle', icon: Wrench, purpose: 'Bautagebuch führen, Bauablaufsteuerung, Abnahmeverfahren, Baustellenkoordination und Sicherheitsbelehrung.', standards: 'VOB/B (Ausführung) / ArbSchG', useCase: 'Durchführung einer förmlichen Mängelrüge wegen fehlerhaft verlegter Trittschalldämmung.' },
      { title: 'Bautagebuch', icon: ClipboardCheck, purpose: 'Rechtlich belastbare baubetriebliche Dokumentation und Beweissicherung von Baustellenprojekten unter Witterungseinflüssen.', standards: 'HOAI 2021 Anlage 10 Lph 8 / VOB/B § 4 Abs. 3, § 6', useCase: 'Dokumentation von Schlechtwetterereignissen (Bohrpfahlbeton, Frostbetonieren) und Mängelrügen im Baustellenprojekt.' },
      { title: 'Produktherstellung & QS', icon: Factory, purpose: 'Abläufe in Zement-, Beton- und Fertigteilwerken, Prozessüberwachung vom Rohstoff bis zur Auslieferung.', standards: 'DIN EN 206 / DIN 1045-2 / BauPVO (WPK)', useCase: 'Optimierung des Verdichtungszyklus in einer automatischen Hohldielen-Schalungsbahn.' },
      { title: 'Karrierestart & Soft Skills', icon: GraduationCap, purpose: 'Tipps zum Berufseinstieg in Bauleitung oder Tragwerksplanung, Bauprojektmanagement, Kommunikation im Bauteam.', standards: 'BauKaG Bayern / Fortbildungsordnung der Kammer', useCase: 'Vorbereitung auf die Aufnahme in die Bayerische Ingenieurekammer-Bau.' },
      { title: 'Weiterbildung an der THA', icon: Award, purpose: 'Master- und Zertifikatsprogramme an der Technischen Hochschule Augsburg (THA) für Bauingenieure und Architekten.', standards: 'Akkreditierungsrat / DQR Stufe 7', useCase: 'Berufsbegleitende Weiterbildung im Projektmanagement oder der Fassadentechnologie.' },
      { title: 'Studium an der THA', icon: GraduationCap, purpose: 'Studiengänge Bauingenieurwesen, Energieeffizientes Planen und Bauen (E2D) sowie Architektur an der THA.', standards: 'Modulhandbücher THA', useCase: 'Orientierung für Studieninteressierte und Vertiefungswahl im Hauptstudium.' },
      { title: 'Thesen & Forschungsprojekte', icon: BookOpen, purpose: 'Themenkataloge für Bachelor- und Masterarbeiten, aktuelle Forschungsprojekte im Labor für Baustoffe.', standards: 'Wissenschaftliche Richtlinien', useCase: 'Findung eines praxisrelevanten Themas für die Abschlussarbeit mit Industriepartnern.' },
      { title: 'Kuriositäten & Fundstücke', icon: Sparkles, purpose: 'Ungewöhnliche Baustoffphänomene, historische Bauanekdoten, spektakuläre Materialprüfungen und Rekorde.', standards: 'Baustoff-Fachgeschichte', useCase: 'Anschauliches Lehrbeispiel über römischen Puzzolanbeton oder historische Gusseisenschäden.' }
    ],
    didacticCards: [
      { title: 'Kostenbewusstes Konstruieren', desc: 'Bauwerke scheitern weit häufiger an Budgetüberschreitungen als an statischem Versagen.' },
      { title: 'Menschlicher Faktor', desc: 'Verständnis für interkulturelle Kommunikation und flache Hierarchien auf der Baustelle.' },
      { title: 'Haftungsminimierung', desc: 'Vermittlung klarer Verhaltensregeln im Schadenfall und zur Dokumentationsdisziplin.' }
    ],
    appStudents: 'Bereitet auf den Baustellenalltag und den Berufseinstieg vor.',
    appProfessionals: 'Orientierung für Berufseinsteigende in Bauleitung und Projektabwicklung.',
    wikipedia: [
      { title: 'Vergabe- und Vertragsordnung für Bauleistungen', url: 'https://de.wikipedia.org/wiki/Vergabe-_und_Vertragsordnung_f%C3%BCr_Bauleistungen' },
      { title: 'Bauleitung', url: 'https://de.wikipedia.org/wiki/Bauleitung' }
    ],
    literatur: [
      'Kochendörfer, B.; Liebchen, J. H.; Viering, M. G.: Bau-Projekt-Management. 5. Aufl., Wiesbaden: Springer Vieweg 2018',
      'Ingenstau, H.; Korbion, H.: VOB Teile A und B – Kommentar. Köln: Werner (aktuelle Auflage)'
    ],
    regelwerke: [
      { title: 'VOB Teil A (2019), Teil B (2016), Teil C (aktuelle Ausgabe)' },
      { title: 'HOAI 2021 – Honorarordnung für Architekten und Ingenieure', url: 'https://www.gesetze-im-internet.de/hoai_2021/' },
      { title: 'BGB §§ 650a–650v (Bauvertragsrecht, seit 01.01.2018)', url: 'https://www.gesetze-im-internet.de/bgb/__650a.html' }
    ],
    formeln: [
      { formel: 'K_{Angebot} = (S_{Herstell} + FG_{Zuschlag}) \\cdot (1 + W_G)', erklaerung: 'Kalkulatorische Angebotsbestimmung. Ermittlung des Angebotspreises aus den direkten Herstellkosten plus prozentualem Firmen-Gemeinkostenzuschlag (FG) und Wagnis & Gewinn (W_G).', quelle: 'Baubetriebliche Kalkulation' }
    ]
  }
};
