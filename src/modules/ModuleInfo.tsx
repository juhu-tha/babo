import React, { useState } from 'react';
import { useTabContext } from '../contexts/TabContext';
import { 
  Info, 
  Layers, 
  ClipboardCheck, 
  BookOpen, 
  UserCheck, 
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
  Zap, 
  Coins, 
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
  MapPin,
  CheckCircle,
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
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import ModuleHistoryView from '@/src/components/ui/ModuleHistoryView';
import ModuleOverviewView from '@/src/components/ui/ModuleOverviewView';
import { MODULE_HISTORY_DATA } from '@/src/data/moduleHistoryData';

// Inline Custom SVG Helper Icons
const TableIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M12 3v18" />
    <path d="M3 12h18" />
    <rect width="18" height="18" x="3" y="3" rx="2" />
  </svg>
);

const LeafIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2Z" />
    <path d="M9 22v-4" />
  </svg>
);

const CircleDashedIcon = (props: any) => (
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

const QrCodeIcon = (props: any) => (
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

const Building2Icon = (props: any) => (
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

interface SubmoduleItem {
  title: string;
  icon: any;
  purpose: string;
  standards: string;
  useCase: string;
}

interface GroupData {
  title: string;
  tagline: string;
  icon: any;
  basicsTitle: string;
  basicsDesc1: string;
  basicsDesc2: string;
  basicsCards: { title: string; desc: string }[];
  submodules: SubmoduleItem[];
  didacticCards: { title: string; desc: string }[];
  appStudents: string;
  appProfessionals: string;
  wikipedia: { title: string; url: string }[];
  literatur: string[];
  regelwerke: { title: string; url: string }[];
  formeln: { formel: string; erklaerung: string; quelle: string }[];
}

const MODULES_DATA: Record<string, GroupData> = {
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
    appStudents: 'Ideal zur Vorbereitung auf Klausuren der Baustoffkunde I, Statik, Technischen Mechanik und zur Erstellung erster Tragwerksentwürfe.',
    appProfessionals: 'Dient als verlässliches, schnelles Nachschlagewerk im Planungsalltag zur Überprüfung von Sicherheitsbeiwerten und Materialeigenschaften.',
    wikipedia: [
      { title: 'Internationales Einheitensystem', url: 'https://de.wikipedia.org/wiki/Internationales_Einheitensystem' },
      { title: 'Eurocode', url: 'https://de.wikipedia.org/wiki/Eurocode' }
    ],
    literatur: [
      'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
      'Albert, A. (Hrsg.): Schneider – Bautabellen für Ingenieure. 26. Aufl., Köln: Reguvis 2024'
    ],
    regelwerke: [
      { title: 'DIN EN 1990: Eurocode 0 - Grundlagen der Tragwerksplanung', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1990' },
      { title: 'DIN 1301-1:2010-10: Einheiten – Einheitennamen, Einheitenzeichen', url: 'https://www.dinmedia.de/de/suche?q=DIN+1301-1' },
      { title: 'DIN EN ISO 10456: Wärme- und feuchtetechnische Eigenschaften – Tabellierte Bemessungswerte', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+10456' },
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
    basicsDesc2: 'Durch kontrollierte Zerstörung (Biegezug, Druckversuche) und moderne Diagnostik (Mikroskopie, XRD, Ultraschall) ermitteln wir die tatsächlichen Ist-Zustände, um Tragwerksreserven zu aktivieren oder Schäden exakt einzugrenzen.',
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
      { title: 'DIN EN 12504-1: Prüfung von Beton im Bauwerk - Teil 1: Bohrkernproben', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+12504-1' },
      { title: 'ISO 12491:1997-05: Statistische Verfahren für die Güteüberwachung von Bauprodukten und Bauteilen', url: 'https://www.dinmedia.de/de/suche?q=ISO+12491' },
      { title: 'DIN EN 206:2021-06: Beton – Festlegung, Eigenschaften, Herstellung und Konformität', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+206' },
      { title: 'DIN EN 13791:2020-02: Bewertung der Druckfestigkeit von Beton in Bauwerken', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+13791' }
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
      { title: 'Glas im Bauwesen', icon: Maximize, purpose: 'Einscheiben-Sicherheitsglas (ESG), Verbund-Sicherheitsglas (VSG) und thermischer Verformungswiderstand.', standards: 'DIN 18008 (Glas im Bauwesen)', useCase: 'Tragfähigkeitsnachweis absturzsichernder Scheiben.' },
      { title: 'Stahl- & Metallbau', icon: Flame, purpose: 'Eisen-Kohlenstoff-Diagramm, Gefügebeeinflussung und Eigenschaftsprofil von Baustählen.', standards: 'DIN EN 10025, Eurocode 3', useCase: 'Plastische Momenttragfähigkeit von S355 Profilen.' },
      { title: 'Metalle & NE-Metalle', icon: Flame, purpose: 'Aluminium, Kupfer, Zink, Blei und korrosionsbeständige Edelstähle für Fassaden und Dachdeckungen.', standards: 'DIN EN 485 / DIN EN 1172', useCase: 'Vermeidung von Kontaktkorrosion zwischen Aluminium-Unterkonstruktionen und Edelstahl-Befestigern.' },
      { title: 'Holz & Holzwerkstoffe', icon: Trees, purpose: 'Anisotropie, axiale Abhängigkeiten, Holzfeuchteeinfluss und innovative Brettsperrhölzer.', standards: 'DIN EN 1995 (Eurocode 5)', useCase: 'Bemessung von Brettschichtholzträgern.' },
      { title: 'Biogene Baustoffe (NaWaRo)', icon: LeafIcon, purpose: 'Nachwachsende Rohstoffe: Strohballenbau, Hanffasern, Flachs, Schafwolle und zellulosebasierte Dämmstoffe.', standards: 'ÖKOBAUDAT / DIBt-Zulassungen', useCase: 'Ökobilanziell optimierte Holzrahmenbauwand mit Stroheinblasdämmung.' },
      { title: 'Asphalt & Bitumen', icon: Layers, purpose: 'Viskoelastisches Verhalten, Bitumenprüfungen (Erweichungspunkt RuK, Nadelpenetration) und Mischungsentwürfe.', standards: 'ZTV Asphalt-StB / DIN EN 13108', useCase: 'Optimierung von Deckschichten mit polymermodifiziertem Bitumen.' },
      { title: 'Kunststoffe im Bauwesen', icon: Box, purpose: 'Thermoplaste, Duroplaste, Elastomere für Rohre, Fensterprofile, Folien und Geotextilien.', standards: 'DIN EN ISO 1043 / DVS Richtlinien', useCase: 'Wahl des geeigneten Rohrwerkstoffs (PE-HD vs. PVC-U) für grabenlose Rohrverlegung.' },
      { title: 'Dämm- & Schadstoffe', icon: Box, purpose: 'Vergleich organischer, anorganischer und synthetischer Dämmmaterialien bzgl. Wärmeleitfähigkeit.', standards: 'DIN 4108-10 / GEG', useCase: 'Nachweis der GEG-Konformität im U-Wert-Berechner.' },
      { title: 'Ausbau & Abdichtung', icon: Layers, purpose: 'Bauwerksabdichtungen gegen Bodenfeuchte und drückendes Wasser, Trockenbausysteme und Fugenabdichtungen.', standards: 'DIN 18533 / DIN 18181', useCase: 'Auslegung einer zweilagigen Bitumenbahnenabdichtung nach Wassereinwirkungsklasse W2.1-E.' },
      { title: 'Faserverbund (CFK/GFK)', icon: Zap, purpose: 'Zugfestigkeiten, Mischungsregeln und anisotrope Laminate im Hochleistungsbau.', standards: 'VDI 2014, DAfStb-Richtlinie', useCase: 'Berechnung der Verstärkung einer Stahlbetonstütze mit Kohlefasergelege.' },
      { title: 'Sonstige & Innovationen', icon: Sparkles, purpose: 'Carbonbeton, Aerogele, Formgedächtnislegierungen, selbstheilende Betone und Myzeliumwerkstoffe.', standards: 'DIBt-Zulassungen / ETA', useCase: 'Einsatz ultradünner Carbonbeton-Fassadenelemente im ressourcenschonenden Leichtbau.' }
    ],
    didacticCards: [
      { title: 'Werkstoffübergreifende Logik', desc: 'Gegenüberstellung von Verformungsverhalten (elastisch, plastisch, viskose Fließprozesse).' },
      { title: 'Ressourcenschonung', desc: 'Fokus auf regenerative Rohstoffe (Holz, Lehm) im direkten Vergleich zu energieintensiven Stählen.' },
      { title: 'Grenzbereiche im Spannungs-Dehnungs-Bild', desc: 'Detailliertes Verstehen spröder versus zäher Bruchmechanismen.' }
    ],
    appStudents: 'Umfassendes Kompendium zur Begleitung aller Baustoffvorlesungen von ersten Semestern bis zu Masterarbeiten im Hochbau.',
    appProfessionals: 'Hervorragender digitaler Berater für Tragwerksplaner und Architekten zur bewussten Werkstoffsubstitution und Materialoptimierung.',
    wikipedia: [
      { title: 'Baustoff', url: 'https://de.wikipedia.org/wiki/Baustoff' },
      { title: 'Werkstoffkunde', url: 'https://de.wikipedia.org/wiki/Werkstoffwissenschaft' }
    ],
    literatur: [
      'Scholz Baustoffkunde (19. Auflage, Werner Verlag)',
      'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
    ],
    regelwerke: [
      { title: 'DIN EN 1996: Eurocode 6 - Bemessung und Konstruktion von Mauerwerksbauten', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1996' },
      { title: 'DIN 18008: Glas im Bauwesen - Bemessungs- und Konstruktionsregeln', url: 'https://www.dinmedia.de/de/suche?q=DIN+18008' }
    ],
    formeln: [
      { formel: '\\sigma = E \\cdot \\epsilon', erklaerung: 'Hookesches Gesetz für linear-elastisches Werkstoffverhalten. Bestimmt die proportionale Verknüpfung von Normalspannung und elastischer Dehnung.', quelle: 'Physikalische Grundlagen' },
      { formel: 'f_{m,k} = \\eta \\cdot f_{m,d}', erklaerung: 'Zusammenhang zwischen charakteristischer Festigkeit und Bemessungswert unter Berücksichtigung von Modifikationsbeiwerten im Ingenieurholzbau.', quelle: 'DIN EN 1995-1-1' }
    ]
  },
  bauprodukte: {
    title: 'Bauproduktrecht & Spezifikation',
    tagline: 'Zulassungssysteme, Konformitätsbewertungen und baurechtliche Pflichten',
    icon: Award,
    basicsTitle: 'Sicherheit im harmonisierten europäischen Bauproduktrecht',
    basicsDesc1: 'Das Einbauen von Bauprodukten erfordert strenge Nachweise über deren Brauchbarkeit und Standsicherheit. Dieses Modul navigiert Planer und Hersteller durch die komplexen Verordnungen der Bauproduktenverordnung (BauPVO) und die nationalen Restregelungen.',
    basicsDesc2: 'Vom CE-Kennzeichen über europäische Bewertungsgruppen (EAD, ETA) bis zu den MVV TB und Ü-Zeichen wird die gesamte Kette rechtlicher und technischer Zulassungsdokumente lückenlos visualisiert und praxisnah erarbeitet.',
    basicsCards: [
      { title: 'AVCP-Systeme inkl. System 3+', desc: 'Verständnis der Prüfdichte vom anspruchsvollen System 1+ bis System 4 sowie dem neuen System 3+ (Validierung der Umweltleistungsbewertung / LCA nach DIN EN 15804+A2 durch notifizierte Stellen nach VO (EU) 2024/3110).' },
      { title: 'DoPC & Digitaler Produktpass (DPP)', desc: 'Kombinierte Leistungs- und Konformitätserklärung (Declaration of Performance and Conformity, DoPC) mit verpflichtenden GWP-Umweltindikatoren und digitalem Produktpass via maschinenlesbarem Datenträger (QR-Code).' }
    ],
    submodules: [
      { title: 'Baustoffindustrie', icon: Factory, purpose: 'Wertschöpfungsketten, Rohstoffgewinnung, Energieeinsatz und Zukunftsstrategien der deutschen und europäischen Baustoffindustrie.', standards: 'BDI / bbs Leitlinien', useCase: 'Analyse von CO2-Minderungskostenpfaden in der Zement- und Ziegelherstellung.' },
      { title: 'CE vs. Ü & MVV TB', icon: Scale, purpose: 'Rechtliche Entflechtung europäischer BauPVO und nationaler Richtlinien sowie Muster-Verwaltungsvorschriften.', standards: 'Musterbauordnung (MBO) § 16a', useCase: 'Rechtlich belastbare Klärung der Notwendigkeit einer Übereinstimmungserklärung bei CE-gekennzeichneten Produkten.' },
      { title: 'AVCP-Systeme', icon: ShieldAlert, purpose: 'Aufschlüsselung der Systeme zur Bewertung und Überprüfung der Leistungsbeständigkeit (System 1+, 1, 2+, 3, 4).', standards: 'BauPVO (EU) 2024/3110 Anhang IX / VO (EU) 305/2011 Anhang V', useCase: 'Auswahl des korrekten Prüfablaufs für tragenden Baustahl versus Estrichmörtel.' },
      { title: 'Konformität & Auditierung', icon: Award, purpose: 'Ablauf von Audits durch notifizierte Stellen, werkseigene Produktionskontrolle (WPK) und Zertifizierung.', standards: 'DIN EN ISO/IEC 17065', useCase: 'Vorbereitung einer Fertigteilwerksprüfung zur CE-Zertifizierung.' },
      { title: 'Normenarbeit im Bauwesen', icon: BookOpen, purpose: 'Prozess der Normenentwicklung (CEN, DIN, NA), Einspruchsverfahren und Veröffentlichung.', standards: 'DIN 820 (Normungsarbeit)', useCase: 'Klärung des Unterschieds zwischen Weißdruck, Entwurf und harmonisierter Norm.' },
      { title: 'Beton (Frisch/Fest) & Betonwaren', icon: Layers, purpose: 'Spezifikationen von Transportbeton, Pflastersteinen, Bordsteinen und Rohren.', standards: 'DIN EN 206 / DIN EN 1338', useCase: 'Ausschreibung frost-tausalzbeständiger Betonpflastersteine mit Güteüberwachung.' },
      { title: 'Betonfertigteile', icon: Box, purpose: 'Spannbeton-Hohldielen, Elementdecken, Doppelwandelemente und Fertigteilstützen mit Transportankern.', standards: 'DIN EN 13225 / DIN EN 13747', useCase: 'Bemessung und Montagekontrolle von Elementdecken im Geschosswohnungsbau.' },
      { title: 'Mauerwerk, Dach & Fassade', icon: LayoutGrid, purpose: 'Mauersteine, Dachziegel, Betondachsteine, vorgehängte hinterlüftete Fassaden (VHF) und Wärmedämm-Verbundsysteme.', standards: 'DIN EN 771 / DIN EN 490 / DIN 18516', useCase: 'Auswahl windlastbeständiger Fassadenbekleidungen und Unterkonstruktionen.' },
      { title: 'Verkehrswegebau & RStO 12/24', icon: Layers, purpose: 'Asphalttragschichten, Asphaltbinder, Deckschichten, Bitumen und Gesteinskörnungen nach den Richtlinien für die Standardisierung des Oberbaus (ARS 02/2024).', standards: 'RStO 12/24 / ZTV Asphalt-StB', useCase: 'Dimensionierung des Straßenoberbaus nach Belastungsklassen Bk100 bis Bk0,3.' },
      { title: 'Tiefbau, Bahnbau & Tunnel', icon: Mountain, purpose: 'Kanalrohre, Schachtbauwerke, Gleisschotter (DBS 918061), Tübbinge und Spritzbeton im bergmännischen Vortrieb.', standards: 'DIN EN 1610 / ZTV-ING / DIN EN 14487', useCase: 'Festlegung der Betonzusammensetzung für wasserdichte Tunneltübbinge.' },
      { title: 'Trockenbau, Putz & Estrich', icon: Layers, purpose: 'Gipsplatten, Metallständerwände, Zement-, Calciumsulfat- und Gussasphaltestriche sowie Innen- und Außenputze.', standards: 'DIN 18180 / DIN 18560 / DIN EN 13813', useCase: 'Prüfung der Belegreife von Heizestrichen mittels CM-Feuchtemessung.' },
      { title: 'Abdichtungen & Dämmstoffe', icon: ShieldAlert, purpose: 'Bitumen- und Kunststoffbahnen, mineralische Dichtungsschlämmen (MDS), EPS-, XPS-, Mineralwolle- und PU-Dämmstoffe.', standards: 'DIN 18531 - DIN 18535 / DIN 4108-10', useCase: 'Auswahl des Abdichtungsaufbaus für erdberührte Kellerwände nach DIN 18533.' },
      { title: 'Befestigungstechnik & Bauchemie', icon: Wrench, purpose: 'Mechanische und chemische Dübelsysteme (ETA-Bemessung), Kleb- und Dichtstoffe, Farben, Lacke und Betonzusatzmittel.', standards: 'EOTA EAD 330232 / DIN EN 934', useCase: 'Bemessung von Schwerlast-Verbundankern in gerissenem Beton nach Eurocode 2 Teil 4.' },
      { title: 'Gläser & Fenstertechnik', icon: Maximize, purpose: 'Float-, ESG-, TVG- und VSG-Verbundgläser, Mehrscheiben-Isoliergläser mit Low-E-Bedampfung, Edelgasfüllungen (Argon/Krypton), Rahmenwerkstoffe und Uw-Berechnung.', standards: 'DIN EN 1279 / DIN 18008 / DIN EN 14351-1 / DIN EN ISO 10077', useCase: 'Thermische und absturzsichernde Bemessung von 3-fach Isolierglasfenstern im Passivhausstandard.' },
      { title: 'Werkstoffspezifische Produkte', icon: Trees, purpose: 'Spezifikationen für Vollholz/BSH/CLT, Kunststoffe, mineralische Werkstoffe, Lehmbausteine und Walzstahlprofile.', standards: 'DIN EN 14080 / DIN EN 10025 / DIN 18945', useCase: 'Überprüfung der Konformitätsnachweise für tragende Brettschichtholzbinder im Hallenbau.' }
    ],
    didacticCards: [
      { title: 'Rechtliche Stringenz', desc: 'Keine gefährlichen Vereinfachungen - saubere Gegenüberstellung europäischer und nationaler Rechtsprechungen.' },
      { title: 'Interaktive Flussdiagramme', desc: 'Entscheidungsbaum zur Zulassungspflicht ungewöhnlicher oder neuartiger Sonderbauprodukte.' },
      { title: 'Marktaufsicht & Haftung', desc: 'Grundlegendes Wissen zur zivilrechtlichen Haftung im Falle fehlerhaft zertifizierter Komponenten.' }
    ],
    appStudents: 'Essentieller Leitfaden zur Erarbeitung baurechtlicher Kompetenzen in Seminaren für Baubetrieb, Projektmanagement und Baustoffkunde.',
    appProfessionals: 'Unverzichtbarer Begleiter für Hersteller-Auditoren, Werksleiter, Planer und Bauherren zur juristischen Absicherung von Materialbestellungen.',
    wikipedia: [
      { title: 'Bauproduktenverordnung', url: 'https://de.wikipedia.org/wiki/Bauproduktenverordnung' },
      { title: 'Musterbauordnung', url: 'https://de.wikipedia.org/wiki/Musterbauordnung' }
    ],
    literatur: [
      'Gellert, J. (2018): Handbuch Bauprodukte und Bauarten - Nachweise, europäische Zulassung und nationale Regelungen (DIN Media)',
      'Weyland, J. (2020): Bauordnungsrecht der Bundesländer (Werner Verlag)'
    ],
    regelwerke: [
      { title: 'Muster-Verwaltungsvorschrift Technische Baubestimmungen (MVV TB)', url: 'https://www.dibt.de/' },
      { title: 'Verordnung (EU) 2024/3110 (BauPVO, seit 08.01.2026; übergangsweise VO (EU) 305/2011)', url: 'https://eur-lex.europa.eu/' }
    ],
    formeln: [
      { formel: 'P_a = r \\cdot \\Delta_{stat}', erklaerung: 'Vereinfachte Risikobewertung zur Bestimmung der geforderten werkseigenen Produktionskontrollhäufigkeit r (Auditrate) basierend auf gefundener Prozessvarianz.', quelle: 'Qualitätsmanagement-Leitlinien' }
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
    appStudents: 'Umfassende Vorbereitung auf Vorlesungen und Klausuren der Betontechnologie, Baustoffkunde II und praktische Laborübungen.',
    appProfessionals: 'Praxisleitfaden für Mischungsentwürfe, E-Schein-Inhaber, Transportbetonwerke und bauleitende Ingenieure.',
    wikipedia: [
      { title: 'Beton', url: 'https://de.wikipedia.org/wiki/Beton' },
      { title: 'Zement', url: 'https://de.wikipedia.org/wiki/Zement' }
    ],
    literatur: [
      'Grübl, P.; Weigler, H.; Karl, S.: Beton - Herstellung und Eigenschaften (Ernst & Sohn Verlag)',
      'Verein Deutscher Zementwerke e.V. (VDZ): Zement-Taschenbuch'
    ],
    regelwerke: [
      { title: 'DIN EN 206 (Beton - Festlegung, Eigenschaften, Herstellung und Konformität)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+206' },
      { title: 'DIN 1045-2 (Nationale Anwendungsregeln zur DIN EN 206)', url: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2' }
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
    basicsDesc1: 'Holz ist ein nachwachsender, anisotroper Naturwerkstoff mit herausragendem spezifischem Festigkeits-Gewichts-Verhältnis und natürlicher CO2-Speicherfähigkeit.',
    basicsDesc2: 'Moderne Holzwerkstoffe wie Brettschichtholz (BSH) und Brettsperrholz (BSP / CLT) ermöglichen weitgespannte Hallentragwerke und mehrgeschossige Holz-Hochhäuser nach Eurocode 5.',
    basicsCards: [
      { title: 'Anisotropie & Nutzungsklassen', desc: 'Faserrichtungsabhängige Kennwerte (parallel vs. rechtwinklig zur Faser) und feuchteabhängige Nutzungsklassen (NKL 1 bis 3).' },
      { title: 'Stabilität & Verbindungsmittel', desc: 'Knick- und Biegedrillknicknachweise sowie stiftförmige Verbindungsmittel mit Seilwirkung.' }
    ],
    submodules: [
      { title: 'Werkstoffe & dataholz', icon: Trees, purpose: 'Charakteristische Festigkeiten von Vollholz (C24), BSH (GL24h–GL30h) und dataholz-Aufbauten.', standards: 'DIN EN 338 / EN 14080', useCase: 'Auswahl von Lamellen und Bauteilschichten.' },
      { title: 'Konstruktionsweisen', icon: LayoutGrid, purpose: 'Holzrahmenbau, Massivholzbau (CLT) und Holz-Hybridbau.', standards: 'MHolzBauR / Informationsdienst Holz', useCase: 'Systementscheidung für Geschossdecken und tragende Wandscheiben.' },
      { title: 'Bemessung (EC5)', icon: Calculator, purpose: 'Stabilitätsnachweise für Druckstäbe und Biegeträger mit k_mod und gamma_M.', standards: 'DIN EN 1995-1-1', useCase: 'Ermittlung von Knickbeiwert k_c und Querschnittsausnutzung.' },
      { title: 'Verbindungen & Anschlüsse', icon: GitCommit, purpose: 'Johansen-Theorie für Stabdübel, Passbolzen und Spax-Vollgewindeschrauben.', standards: 'DIN EN 1995-1-1 Kap. 8', useCase: 'Berechnung von Abscher- und Ausziehtragfähigkeiten.' },
      { title: 'Bauphysik & Brandschutz', icon: Flame, purpose: 'Heißbemessung nach der Methode des wirksamen Restquerschnitts (d_ef).', standards: 'DIN EN 1995-1-2', useCase: 'Nachweis des Feuerwiderstands REI 30 bis REI 90.' }
    ],
    didacticCards: [
      { title: 'KLED & Feuchteeinfluss', desc: 'Verknüpfung von Lasteinwirkungsdauer (KLED) und Nutzungsklasse über k_mod.' },
      { title: 'Restquerschnitts-Verfahren', desc: 'Brandbemessung über planmäßige Abbrandrate beta_0 und 7 mm Nulllastschicht.' },
      { title: 'Vorfertigung & Taktung', desc: 'Industrieller Holzbau mit werkseitig geschlossenem Aufbau für feuchtefreie Montage.' }
    ],
    appStudents: 'Fundierte Begleitung von Massivbau- und Holzbauvorlesungen im Bachelor und Master Bauingenieurwesen.',
    appProfessionals: 'Praxistaugliches Nachschlagewerk für Tragwerksplaner im modernen mehrgeschossigen Holz- und Holz-Hybridbau.',
    wikipedia: [
      { title: 'Holzbau', url: 'https://de.wikipedia.org/wiki/Holzbau' },
      { title: 'Brettschichtholz', url: 'https://de.wikipedia.org/wiki/Brettschichtholz' }
    ],
    literatur: [
      'Informationsdienst Holz: Holzbau Handbuch (Fachgemeinschaft Holzbau)',
      'dataholz.eu: Bauteilkatalog der Holzforschung Austria'
    ],
    regelwerke: [
      { title: 'DIN EN 1995-1-1: Eurocode 5 - Bemessung und Konstruktion von Holzbauten', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1995-1-1' },
      { title: 'DIN EN 1995-1-2: Eurocode 5 - Tragwerksbemessung für den Brandfall', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1995-1-2' }
    ],
    formeln: [
      { formel: 'f_d = k_{mod} \\cdot \\frac{f_k}{\\gamma_M}', erklaerung: 'Grundformel für den Bemessungswert einer Festigkeitseigenschaft im Holzbau unter Berücksichtigung von Nutzungsklasse und Lasteinwirkungsdauer.', quelle: 'DIN EN 1995-1-1 Gl. 2.1' }
    ]
  },
  stahlbeton: {
    title: 'Tragwerksplanung im Massivbau',
    tagline: 'Grenzzustände der Tragfähigkeit und Gebrauchstauglichkeit nach Eurocode 2',
    icon: GitCommit,
    basicsTitle: 'Das Verbundverhalten im Massivbau',
    basicsDesc1: 'Der Massivbau (Stahlbeton, Spannbeton, Carbonbeton etc.) verbindet die extreme Druckfestigkeit des Betons mit der hohen Zug- und Biegezugfestigkeit moderner Bewehrungssysteme wie Betonstahl oder Carbongelege. Dieses Zusammenspiel erfordert thermodynamische Abstimmung und ausreichenden Haftverbund.',
    basicsDesc2: 'In diesem Berechnungs- und Konstruktionsmodul analysieren wir die Rissbreitenbegrenzung, Biegung mit und ohne Längskraft, ermitteln Schubbemessungen (Querkraft), dimensionieren druckbelastete Stützen nach Theorie II. Ordnung und erfassen Durchstanzrisiken im Stützenbereich.',
    basicsCards: [
      { title: 'Interaktive Bemessung', desc: 'Echtzeitrechner für Biegezug, Rissbreitenverteilung und erforderliche Bewehrungsflächen.' },
      { title: 'Gebrauchstauglichkeit (SLS)', desc: 'Begrenzung der charakteristischen Rissbreiten (w_max = 0,3 mm) zum Schutz vor karbonatisierungsinduzierter Korrosion.' }
    ],
    submodules: [
      { title: 'Rissbreite', icon: GitCommit, purpose: 'Kontrolle der rechnerischen Rissbreiten w_k im Grenzzustand der Gebrauchstauglichkeit.', standards: 'DIN EN 1992-1-1 (EC2) Kap. 7.3', useCase: 'Auslegung einer Deckenplatte bzgl. Mindestbewehrung zur Begrenzung von Rissen infolge abfließender Hydratationswärme.' },
      { title: 'Spannung-Dehnung', icon: Activity, purpose: 'Gegenüberstellung der Parabel-Rechteck-Diagramme für Beton und der elastisch-plastischen Bewehrungsstahllinien.', standards: 'DIN EN 1992-1-1 Kap. 3', useCase: 'Bestimmung der Betondehnung an der Querschnittsoberseite im Bruchzustand.' },
      { title: 'Biegebemessung', icon: Box, purpose: 'Querschnittsbemessung mit dimensionslosen Beiwerten (kd-Verfahren oder mu-Verfahren).', standards: 'DIN EN 1992-1-1 Kap. 6.1', useCase: 'Schnittgrößenbasierte Berechnung der Tragbewehrung eines Einfeldbalkens.' },
      { title: 'Querkraftbemessung', icon: Box, purpose: 'Tragfähigkeitsnachweis für Querkräfte, Berechnung der Bügelbewehrung (Druckstrebenwinkel theta).', standards: 'DIN EN 1992-1-1 Kap. 6.2', useCase: 'Nachweis der Druckstrebenfestigkeit VRd,max zur Vermeidung von Stegbruch.' },
      { title: 'Stützenbemessung', icon: Box, purpose: 'Knicknachweise, Bemessung nach Nennkrümmungs- oder Nennsteifigkeitsverfahren.', standards: 'DIN EN 1992-1-1 Kap. 5.8', useCase: 'Tragfähigkeitsnachweis einer schlanken Pendelstütze mit Imperfektionen.' },
      { title: 'Durchstanzen', icon: CircleDashedIcon, purpose: 'Abschätzung des Durchstanzkriteriums an Flachdecken im kritischen Rundschnitt.', standards: 'DIN EN 1992-1-1 Kap. 6.4', useCase: 'Dimensionierung einer Durchstanzbewehrung (z.B. Dübelleisten) zur Stützenauflagerung.' },
      { title: 'Verankerungslänge', icon: GitCommit, purpose: 'Berechnung des Grundwertes der Verankerungslänge von Betonstahl im Verbund.', standards: 'DIN EN 1992-1-1 Kap. 8.4', useCase: 'Ermittlung des notwendigen Übergreifungsstoßes zweier Bewehrungslagen.' },
      { title: 'Spannbeton', icon: GitCommit, purpose: 'Prinzipien des vorgespannten Betons, sofortiger und nachträglicher Verbund, Spannkraftverluste.', standards: 'DIN EN 1992-1-1 Kap. 5.10', useCase: 'Tragfähigkeitssteigerung schlanker Brückenträger.' },
      { title: 'WU-Bauwerke', icon: Droplets, purpose: 'Wasserundurchlässige Betonbauteile ("Weiße Wannen"), Mindestbauteildicken, Fugenplanung.', standards: 'DAfStb WU-Richtlinie', useCase: 'Rissbreitennachweis zur Erzielung von Wasserdichtigkeit bei drückendem Wasser.' },
      { title: 'Carbonbeton', icon: Layers, purpose: 'Hochfeste textile Hochleistungsbewehrungen zur Konstruktion ultradünner Schalen.', standards: 'Allg. bauaufsichtliche Zulassungen (abZ)', useCase: 'Instandstellung einer schadhaften Fußgängerbrücke mit Carbon-Spritzmörtel.' }
    ],
    didacticCards: [
      { title: 'Spannungsintegration', desc: 'Verständnis des Kräftepaars (Betondruckkraft und Stahldruck-/Zugkraft) am verbogenen Querschnitt.' },
      { title: 'Normkonformes Bemessungsziel', desc: 'Erzielung eines duktilen, rechtzeitig ankündigenden Biegebruchs im Gegensatz zu spröden Bauteilversagen.' },
      { title: 'Konstruktive Details', desc: 'Verständnis für Betondeckung, Randeinfassungen und Schalungsabgrenzung.' }
    ],
    appStudents: 'Unterstützt die Vorlesungen Massivbau I und II, Tragwerksentwurf und schult das Gefühl für zielsichere Bewehrungsmengen.',
    appProfessionals: 'Schnellcheck im Büro und auf der Baustelle zur statischen Vordimensionierung und schnellen Rissbreitenbewertung.',
    wikipedia: [
      { title: 'Stahlbeton', url: 'https://de.wikipedia.org/wiki/Stahlbeton' },
      { title: 'Spannbeton', url: 'https://de.wikipedia.org/wiki/Spannbeton' }
    ],
    literatur: [
      'Zilch, K.; Zehetmaier, G. (2010): Bemessung im Betonbau (Springer Vieweg)',
      'Goris, A. (2021): Stahlbetonbau kompakt nach Eurocode 2 (Werner Verlag)'
    ],
    regelwerke: [
      { title: 'DIN EN 1992-1-1: Eurocode 2 - Bemessung und Konstruktion von Stahlbeton- und Spannbetontragwerken', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1992-1-1' },
      { title: 'DAfStb-Richtlinie: Wasserundurchlässige Bauwerke aus Beton (WU-Richtlinie)', url: 'https://www.dinmedia.de/de/suche?q=DAfStb+Wasserundurchl%C3%A4ssige+Bauwerke+aus+Beton' }
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
    basicsDesc1: 'Dieses Modul bildet das Herzstück der klassischen werkstoffübergreifenden Strukturmechanik. Es untersucht, wie Kräfte in Bauteilen Spannungen hervorrufen und zu makroskopischen Verformungen (Verschiebungen, Krümmungen) führen.',
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
    appStudents: 'Zentrale Grundlage und interaktives Repetitorium für Technische Mechanik II und III, Baustatik I und Werkstoffmechanik.',
    appProfessionals: 'Hilfreicher Begleiter bei Plausibilitätsprüfungen komplexer Computerausgaben und der anspruchsvollen geotechnischen Vordimensionierung.',
    wikipedia: [
      { title: 'Festigkeitslehre', url: 'https://de.wikipedia.org/wiki/Festigkeitslehre' },
      { title: 'Baustatik', url: 'https://de.wikipedia.org/wiki/Baustatik' }
    ],
    literatur: [
      'Gross, D.; Hauger, W.; Schröder, J.; Wall, W. A.: Technische Mechanik 2 – Elastostatik. Berlin: Springer Vieweg (aktuelle Auflage)',
      'Meschede, D. (2015): Gerthsen Physik (Springer)'
    ],
    regelwerke: [
      { title: 'DIN EN 1993-1-1:2010-12 + A1:2014-07 mit NA (Eurocode 3 – Bemessung und Konstruktion von Stahlbauten); neue Generation DIN EN 1993-1-1:2025-04', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1993-1-1' },
      { title: 'DIN EN 1997-1:2014-03 mit NA und DIN 1054 (Eurocode 7 – Entwurf, Berechnung und Bemessung in der Geotechnik)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1997-1' }
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
      { title: 'Bauphysik (Grundlagen)', icon: Thermometer, purpose: 'U-Wert, Temperatur- und Dampfdruckverlauf (Glaser), Temperaturfaktor f_Rsi sowie Nachhallzeit von Räumen.', standards: 'DIN EN ISO 6946; DIN 4108-2/-3; DIN 18041', useCase: 'Nachweis einer gedämmten Außenwand und akustische Ertüchtigung eines Klassenraums.' },
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
    appStudents: 'Zentrales Tool zur Bewältigung bauphysikalischer Belege und zur Absicherung von Entwurfsarbeiten im Bachelor und Master.',
    appProfessionals: 'Sichere Entscheidungshilfe für Energieberater, Architekten und Bauphysiker im täglichen Entwurfs- und Sanierungsprozess.',
    wikipedia: [
      { title: 'Bauphysik', url: 'https://de.wikipedia.org/wiki/Bauphysik' },
      { title: 'Wärmedurchgangskoeffizient', url: 'https://de.wikipedia.org/wiki/W%C3%A4rmedurchgangskoeffizient' }
    ],
    literatur: [
      'Willems, W. (Hrsg.): Lehrbuch der Bauphysik. 8. Aufl., Wiesbaden: Springer Vieweg 2017',
      'Lohmeyer, G.; Post, M.: Praktische Bauphysik – Eine Einführung mit Berechnungsbeispielen. Wiesbaden: Springer Vieweg (aktuelle Auflage)'
    ],
    regelwerke: [
      { title: 'DIN 4108 (Wärmeschutz und Energie-Einsparung in Gebäuden): Teil 2 2026-05, Teil 3 2024-03, Teil 4 2020-11', url: 'https://www.dinmedia.de/de/suche?q=DIN+4108' },
      { title: 'DIN 4109-1/-2:2018-01 (Schallschutz im Hochbau – Mindestanforderungen und rechnerische Nachweise)', url: 'https://www.dinmedia.de/de/suche?q=DIN+4109' },
      { title: 'DIN 18041:2016-03 (Hörsamkeit in Räumen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+18041' },
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
    basicsDesc1: 'Umsichtige Materialwahl entscheidet über die CO2-Bilanz zukünftiger Generationen. Nachhaltiges Bauen blickt über den Moment des Einbaus hinaus und bewertet den gesamten energetischen Aufwand von der Wiege bis zur Bahre (Cradle-to-Grave).',
    basicsDesc2: 'Wir analysieren Treibhausgaspotenziale (GWP), erfassen Primärenergiebedarfe (PERT/PENRT), bilanzieren Umweltwirkungen über EPDs und vergleichen Nachhaltigkeitssiegel (DGNB, BNB, QNG) zur Erwirkung zinsgünstiger staatlicher Förderprogramme.',
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
    appStudents: 'Zentraler Wegweiser zur Durchführung integrierter Entwurfskonzepte sowie zur Anfertigung bauökologischer Abschlussarbeiten.',
    appProfessionals: 'Zielsicheres Unterstützungstool für DGNB-Consultants, Auditoren und Architekten, um das begehrte QNG-Siegel nachzuweisen.',
    wikipedia: [
      { title: 'Nachhaltiges Bauen', url: 'https://de.wikipedia.org/wiki/Nachhaltiges_Bauen' },
      { title: 'Ökobilanz', url: 'https://de.wikipedia.org/wiki/%C3%96kobilanz' }
    ],
    literatur: [
      'König, H.; Kohler, N.; Kreißig, J.; Lützkendorf, T.: Lebenszyklusanalyse in der Gebäudeplanung. München: Edition Detail 2009',
      'Bauer, M.; Mösle, P.; Schwarz, M.: Green Building – Leitfaden für nachhaltiges Bauen. 2. Aufl., Berlin: Springer Vieweg 2013'
    ],
    regelwerke: [
      { title: 'DIN EN 15804:2022-03 (Umweltproduktdeklarationen; EN 15804+A2)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+15804' },
      { title: 'DIN EN 15978:2026-09 (Bewertung der Umweltqualität von Gebäuden)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+15978' },
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
    basicsDesc1: 'Digitalisierung strukturiert das unübersichtliche Bauwesen. Im Zentrum steht der Digitale Zwilling (Digital Twin) - ein geometrisches und semantisches Datenmodell, das den gesamten Lebenszyklus eines Bauwerks digital begleitet.',
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
    appStudents: 'Bereitet Studierende perfekt auf die digitale Ingenieurpraxis vor, schult IFC-Kompetenz und vermittelt wertvolles Schnittstellenwissen.',
    appProfessionals: 'Wertvolles Nachschlagewerk für BIM-Manager, Koordinatoren und Nachhaltigkeitsauditoren zur digitalen Prozessinitiierung.',
    wikipedia: [
      { title: 'Building Information Modeling', url: 'https://de.wikipedia.org/wiki/Building_Information_Modeling' },
      { title: 'Industrie Foundation Classes', url: 'https://de.wikipedia.org/wiki/Industry_Foundation_Classes' }
    ],
    literatur: [
      'Borrmann, A.; König, M.; Koch, C.; Beetz, J. (Hrsg.): Building Information Modeling – Technologische Grundlagen und industrielle Praxis. 2. Aufl., Wiesbaden: Springer Vieweg 2021',
      'Hausknecht, K. (2018): BIM Einstieg kompakt (DIN Media)'
    ],
    regelwerke: [
      { title: 'DIN EN ISO 19650-1/-2:2019-08 (Organisation und Digitalisierung von Informationen über Bauwerke – BIM)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+19650' },
      { title: 'VDI 2552 (BIM-Richtlinienreihe)', url: 'https://www.dinmedia.de/de/suche?q=VDI+2552' }
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
    appStudents: 'Exzellentes Werkzeug zur wissenschaftlichen Begleitung von Projektarbeiten in der Denkmalpflege, Altbauforschung und Bauforschung.',
    appProfessionals: 'Praxisnaher Berater für Tragwerksplaner und Sanierungsarchitekten zur sicheren Erfassung und Ertüchtigung historischer Bauteile.',
    wikipedia: [
      { title: 'Bauen im Bestand', url: 'https://de.wikipedia.org/wiki/Bauen_im_Bestand' },
      { title: 'Denkmalschutz', url: 'https://de.wikipedia.org/wiki/Denkmalschutz' }
    ],
    literatur: [
      'WTA-Merkblattreihe (Wissenschaftlich-Technische Arbeitsgemeinschaft für Bauwerkserhaltung und Denkmalpflege e.V.)'
    ],
    regelwerke: [
      { title: 'Gebäudemodernisierungsgesetz (GModG, vormals GEG) – § 35 Nachrüstung, § 36 Änderung, § 37 U-Wert, Anlage 7, § 105 Baudenkmäler', url: 'https://www.gesetze-im-internet.de/geg/' },
      { title: 'EN 1990-2:2026 (Bewertung bestehender Tragwerke; ersetzt CEN/TS 17440:2020) – nationale Fassung/NA prüfen', url: 'https://www.dinmedia.de/de/suche?q=EN+1990-2' },
      { title: 'DIN EN 13791:2020-02 + DIN EN 13791/A20 (Bewertung der Druckfestigkeit von Beton im Bauwerk)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+13791' }
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
    basicsDesc1: 'Der geordnete Rückbau hat den klassischen Abbruch abgelöst. Ziel ist es, Schadstoffe frühzeitig zu detektieren, auszuschleusen und die mineralischen Massen in ein unbedenkliches, hochwertiges Baustoffrecycling zurückzuführen.',
    basicsDesc2: 'Dieses Modul deckt das gesamte schadstoffliche Spektrum ab (Asbest, KMF, PCB, PAK, Schwermetalle), zeigt die rechtlich belastbaren Entsorgungswege nach Deponieverordnung (DepV) auf und strukturiert schadstofffreie Sortierungskonzepte.',
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
    appStudents: 'Bereitet angehende Bauleiter und Umweltkoordinatoren auf das anspruchsvolle Abfall- und Sanierungsgeschäft vor.',
    appProfessionals: 'Unverzichtbare Arbeitshilfe für Abbruchplaner, Entsorgungskoordinatoren, Bauleiter und SiGeKos vor Ort.',
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
    basicsDesc1: 'Jedes Bauwerk altert unter wechselnden klimatischen, biologischen, elektrochemischen und chemischen Einflüssen. Ein Bauwerk gilt als dauerhaft, wenn es seine standsichere und gebrauchstaugliche Funktion über die kalkulierte Nutzungszeit (üblicherweise 50 Jahre bei Standardhochbauten, bis zu 100 Jahre bei Brücken und Ingenieurbauwerken nach Eurocode 2) ohne unvorhergesehene Instandsetzung erfüllt. Die moderne DIN 1045:2023 forciert hierfür einen Übergang zu performance-basierten Lebensdauerbemessungen.',
    basicsDesc2: 'Dieses Modul deckt das gesamte Spektrum werkstoffübergreifender Alterungsprozesse ab: von der Gasdiffusion im zementären Porensystem (Carbonatisierung, Chlorid-Lochfraß, Frost-Tausalz-Angriff, treibende Reaktionen wie AKR und Sulfat) über das temperaturabhängige Verhalten viskoelastischer Asphalte, elektrochemische Redoxreaktionen metallischer Korrosionszellen (DIN EN ISO 12944), biologischen Holzabbau (DIN 68800) und physiko-chemische Alterung von Kunststoffen bis hin zur Natursteinverwitterung (WTA) und thermokinetischen Glasspontanbrüchen (HST).',
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
    appStudents: 'Umfassendes, didaktisch geschlossenes Lehrwerk zur Vorbereitung auf anspruchsvolle Vertiefungsprüfungen im Massivbau, Metall- und Stahlbau, Holzbau sowie der Bauchemie und Denkmalpflege.',
    appProfessionals: 'Fundierter, normen-aktualisierter Wissenspool für Bauschadensgutachter, Tragwerksplaner, Bauleiter, Denkmalschützer und Sanierungsplaner zur treffsicheren Schadensursachenforschung.',
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
      { title: 'DIN 68800: Holzschutz (Teil 1:2019-06, Teil 2:2022-02, Teil 3:2020-03, Teil 4:2020-12)', url: 'https://www.dinmedia.de/de/suche?q=DIN+68800' },
      { title: 'DIN EN ISO 12944: Korrosionsschutz von Stahlbauten durch Beschichtungssysteme', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+12944' },
      { title: 'DIN 1045-2:2023-08: Tragwerke aus Beton, Stahlbeton und Spannbeton – Beton (Anwendungsregeln zu DIN EN 206)', url: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2' },
      { title: 'WTA-Merkblatt 2-9: Sanierputzsysteme - Kriterien für Planung und Ausführung', url: 'https://www.wta-gmbh.de/' },
      { title: 'DIN EN 14179: Heißgelagertes thermisch vorgespanntes Einscheiben-Sicherheitsglas (HST)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+14179' }
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
    appStudents: 'Bereitet Studierende auf anspruchsvolle Tätigkeiten in Sachverständigenbüros, Bauämtern und Prüfinstituten vor.',
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
      { title: 'DIN 1076:2026-01: Ingenieurbauwerke im Zuge von Straßen und Wegen – Überwachung und Prüfung (ersetzt 1999-11)', url: 'https://www.dinmedia.de/de/suche?q=DIN+1076' },
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
    basicsDesc1: 'Bestehende Bausubstanz zu schützen, instandzusetzen und zu ertüchtigen ist ökologisch und ökonomisch die zentrale Bauaufgabe des 21. Jahrhunderts. Dieses Modul bündelt alle werkstoffübergreifenden und baustoffspezifischen Sanierungsverfahren.',
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
    appStudents: 'Bereitet Studierende auf die Zertifizierung zum Sachkundigen Planer (SKP) und Bauwerkserhaltungsingenieur vor.',
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
      { title: 'DIN EN 1504: Produkte und Systeme für den Schutz und die Instandsetzung von Betontragwerken (Teile 1 bis 10)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1504' },
      { title: 'TR Instandhaltung: DIBt Technische Regel Instandhaltung von Betonbauwerken (Teil 1 Stand Mai 2020, Teil 2; über die MVV TB eingeführt)', url: 'https://www.dibt.de/' },
      { title: 'DIN 68800: Holzschutz (Teil 4:2020-12 Bekämpfung und Sanierung)', url: 'https://www.dinmedia.de/de/suche?q=DIN+68800' },
      { title: 'DIN EN ISO 12944: Korrosionsschutz von Stahlbauten', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+12944' }
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
    basicsDesc1: 'Das tollste gezeichnete Detail nützt wenig, wenn es ökonomisch nicht darstellbar ist oder auf der Baustelle falsch umgesetzt wird. Dieses Modul schließt die Brücke zwischen nackter Theorie und wirtschaftlicher Realität.',
    basicsDesc2: 'Wir vermitteln Kenntnisse zur Ausarbeitung sauberer Leistungsverzeichnisse (LV) nach VOB, beleuchten die logistische Steuerung und Qualitätskontrollen des Bauleiters, erörtern Kalkulationsannahmen und geben Starthilfe zur persönlichen Karriereplanung.',
    basicsCards: [
      { title: 'Projektsteuerung', desc: 'Verständnis des magischen Dreiecks aus Kosten, Terminen und Qualitäten im Baubetrieb.' },
      { title: 'Mängel- & Schadensvermeidung', desc: 'Rechtlich belastbares Erstellen von Bautagebüchern und Abnahmeprotokollen vor Ort.' }
    ],
    submodules: [
      { title: 'Planung & Ausschreibung', icon: ClipboardCheck, purpose: 'Erstellung von Leistungsverzeichnissen (LV), Bieterverfahren und Vertragsgestaltung.', standards: 'VOB/A (Ausschreibungsordnung)', useCase: 'Verfassen einer fehlerfreien VOB-Funktionalbeschreibung für Erdbauleistungen.' },
      { title: 'Bauleitung & Baustelle', icon: Wrench, purpose: 'Bautagebuch führen, Bauablaufsteuerung, Abnahmeverfahren, Baustellenkoordination und Sicherheitsbelehrung.', standards: 'VOB/B (Ausführung) / ArbSchG', useCase: 'Durchführung einer förmlichen Mängelrüge wegen fehlerhaft verlegter Trittschalldämmung.' },
      { title: 'Bautagebuch', icon: ClipboardCheck, purpose: 'Rechtlich belastbare baubetriebliche Dokumentation und Beweissicherung von Baustellenprojekten unter Witterungseinflüssen.', standards: 'VOB/B § 15 / BGB § 650', useCase: 'Dokumentation von Schlechtwetterereignissen (Bohrpfahlbeton, Frostbetonieren) und Mängelrügen im Baustellenprojekt.' },
      { title: 'Produktherstellung & QS', icon: Factory, purpose: 'Abläufe in Zement-, Beton- und Fertigteilwerken, Prozessüberwachung vom Rohstoff bis zur Auslieferung.', standards: 'DIN EN ISO 9001', useCase: 'Optimierung des Verdichtungszyklus in einer automatischen Hohldielen-Schalungsbahn.' },
      { title: 'Karrierestart & Soft Skills', icon: GraduationCap, purpose: 'Tipps zum Berufseinstieg in Bauleitung oder Tragwerksplanung, Bauprojektmanagement, Kommunikation im Bauteam.', standards: 'Kammerregelungen', useCase: 'Vorbereitung auf die Aufnahme in die bayerische Ingenieurkammer-Bau.' },
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
    appStudents: 'Bereitet Studierende praxisnah auf den rauen Baustellenalltag sowie den erfolgreichen Übergang ins Berufsleben vor.',
    appProfessionals: 'Praktisches Kompendium für junge Bauleiter, frischgebackene Projektingenieure und technische Sachbearbeiter zur Orientierung.',
    wikipedia: [
      { title: 'Vergabe- und Vertragsordnung für Bauleistungen', url: 'https://de.wikipedia.org/wiki/Vergabe-_und_Vertragsordnung_f%C3%BCr_Bauleistungen' },
      { title: 'Bauleitung', url: 'https://de.wikipedia.org/wiki/Bauleitung' }
    ],
    literatur: [
      'Pfarr, A. (2018): Handbuch für die Bauleitung (Werner Verlag)',
      'Bauer, H. (2016): Baubetrieb (Springer Vieweg)'
    ],
    regelwerke: [
      { title: 'Vergabe- und Vertragsordnung für Bauleistungen (VOB) Teil A/B/C', url: 'https://www.dinmedia.de/de/suche?q=VOB+2019' },
      { title: 'HOAI - Honorarordnung für Architekten und Ingenieure', url: 'https://www.hoai.de/' }
    ],
    formeln: [
      { formel: 'K_{Angebot} = (S_{Herstell} + FG_{Zuschlag}) \\cdot (1 + W_G)', erklaerung: 'Kalkulatorische Angebotsbestimmung. Ermittlung des Angebotspreises aus den direkten Herstellkosten plus prozentualem Firmen-Gemeinkostenzuschlag (FG) und Wagnis & Gewinn (W_G).', quelle: 'Baubetriebliche Kalkulation' }
    ]
  }
};

interface FurtherResource {
  websites: { name: string; url: string; desc: string }[];
  books: { title: string; desc: string }[];
  publications: { journal: string; title: string; desc: string }[];
  dissertations: { title: string; desc: string }[];
}

const COMPREHENSIVE_RESOURCES: Record<string, FurtherResource> = {
  grundlagen: {
    websites: [
      { name: "Baulinks Portal - Baustoff-Wissen", url: "https://www.baulinks.de", desc: "Etabliertes deutsches Fachportal für Baustoffe, Materialentwicklungen und Baupraxis-News." },
      { name: "Materialarchiv Wissenschaft", url: "https://www.materialarchiv.ch", desc: "Umfangreiche wissenschaftliche Datenbank für Materialklassen und deren physikalische Auswertung." },
      { name: "VDZ – Forschungs- und Kompetenzzentrum für Zement, Beton und Umweltschutz", url: "https://www.vdz-online.de/", desc: "Zementchemie, Betontechnik und Merkblätter des Vereins Deutscher Zementwerke." },
      { name: "DIBt – Deutsches Institut für Bautechnik", url: "https://www.dibt.de/", desc: "Bauaufsichtliche Zulassungen, Bauartgenehmigungen und Muster-Verwaltungsvorschrift Technische Baubestimmungen (MVV TB)." }
    ],
    books: [
      { title: "Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011", desc: "Klassisches Lehrbuch der Baustoffkunde für Hoch- und Tiefbau." },
      { title: "Möhring, R. (Hrsg.): Baustoffkenntnis (begr. von W. Scholz). 18. Aufl., Köln: Bundesanzeiger Verlag 2016", desc: "Praxisorientiertes Standardwerk zu Eigenschaften und Anwendung der Baustoffe." },
      { title: "Benedix, R.: Bauchemie für das Bachelor-Studium. 3. Aufl., Wiesbaden: Springer Vieweg 2017", desc: "Chemische Grundlagen der Baustoffe für das Bachelorstudium." },
      { title: "Willems, W. M. (Hrsg.): Lehrbuch der Bauphysik. 9. Aufl., Wiesbaden: Springer Vieweg 2022", desc: "Wärme, Feuchte, Schall, Brand – Grundlagen der bauphysikalischen Kenngrößen." }
    ],
    publications: [
      { journal: "Journal of the American Concrete Institute 43 (1946/47)", title: "Powers, T. C.; Brownyard, T. L.: Studies of the Physical Properties of Hardened Portland Cement Paste", desc: "Grundlagenarbeit zum Porenmodell des Zementsteins (Gel- und Kapillarporen)." }
    ],
    dissertations: []
  },
  labor: {
    websites: [
      { name: "DGZfP", url: "https://www.dgzfp.de", desc: "Deutsche Gesellschaft für Zerstörungsfreie Prüfung e.V. mit Fachausschüssen (u. a. ZfP im Bauwesen) und Merkblättern." },
      { name: "MPA Universität Stuttgart", url: "https://www.mpa.uni-stuttgart.de", desc: "Materialprüfungsanstalt der Universität Stuttgart (Prüf-, Überwachungs- und Zertifizierungsstelle)." },
      { name: "BAM Bundesanstalt für Materialforschung", url: "https://www.bam.de", desc: "Bundesoberbehörde für Materialforschung und -prüfung, u. a. Bauwerksdiagnostik und Referenzmaterialien." }
    ],
    books: [
      { title: "Maierhofer, C.; Reinhardt, H.-W.; Dobmann, G. (Hrsg.): Non-Destructive Evaluation of Reinforced Concrete Structures. Bd. 1–2. Cambridge: Woodhead Publishing 2010", desc: "Schädigungsprozesse und zerstörungsfreie Prüfverfahren für Stahlbetonbauwerke." },
      { title: "Scrivener, K.; Snellings, R.; Lothenbach, B. (Hrsg.): A Practical Guide to Microstructural Analysis of Cementitious Materials. Boca Raton: CRC Press 2016", desc: "Praxisleitfaden zu XRD, TGA, REM/EDX und weiteren Gefügeanalysen an Zementstein." },
      { title: "Hedderich, J.; Sachs, L.: Angewandte Statistik – Methodensammlung mit R. 16. Aufl., Berlin: Springer Spektrum 2018", desc: "Statistische Verfahren für die Auswertung von Prüfserien." }
    ],
    publications: [
      { journal: "Transportation Research Record 2290 (2012)", title: "Kim, T.; Olek, J.: Effects of Sample Preparation and Interpretation of Thermogravimetric Curves on Calcium Hydroxide in Hydrated Pastes and Mortars", desc: "Einfluss von Probenvorbereitung und Auswertemethode auf den per TGA bestimmten Portlanditgehalt." }
    ],
    dissertations: []
  },
  baustoffe: {
    websites: [
      { name: "Dachverband Lehm e.V.", url: "https://www.dachverband-lehm.de", desc: "Richtlinien für Lehmputz- und Mauerwerksprodukte sowie ökologische Zertifizierungsbestimmungen." },
      { name: "Informationszentrum Gips e.V.", url: "https://www.gips.de", desc: "Fachliche Abhandlungen über Calciumsulfatphasen, Estriche und Gipsplatten." },
      { name: "Bundesverband Kalk e.V.", url: "https://www.kalk.de", desc: "Forschungsberichte des Verbandes über Luftkalke, hydraulische Kalke und Putzanwendungen." }
    ],
    books: [
      { title: "Lehmbau-Handbuch: Der Baustoff Lehm und seine Anwendung", desc: "Gernot Minke. Umfassendes ökologisches Konstruktionshandbuch zu Stampflehm und Lehmsteinen." },
      { title: "Minerale und Gesteine des Hochbaues", desc: "Vogel et al., Springer. Handbuch zur Petrographie und Geologie der Bausteine." }
    ],
    publications: [
      { journal: "Bauphysik (Ernst & Sohn)", title: "Hygrische und thermische Verhaltenseigenschaften von Stampflehmbauteilen", desc: "Messung kapillarer Leitfähigkeiten zur Raumluftfeuchteregulierung." },
      { journal: "Cement and Concrete Research", title: "Sulfate activation of slag and hydration of calcium aluminate cements", desc: "Phasengleichgewichts-Rechnungen bei säurebeständigen Sonderbindemitteln." }
    ],
    dissertations: [
      { title: "Erhärtungskinetik und Hydratationsmechanismen calciumsulfatbasierter Binärbindemittel", desc: "Dissertation, Bauhaus-Universität Weimar, 2018. Gips-Festigkeitsentwicklung im interaktiven Kinetik-Modell." },
      { title: "Tragfähigkeit von lastabtragendem Lehmsteinmauerwerk unter zyklischer Feuchtebelastung", desc: "Dissertation, Technische Universität Braunschweig. Mechanische Versuche zur Tragfähigkeit poröser Lehmsteinpfeiler." }
    ]
  },
  bauprodukte: {
    websites: [
      { name: "DIBt - Zulassungsdatenbank", url: "https://www.dibt.de", desc: "Deutsches Institut für Bautechnik. Offizielles Register für abZ, ETA und baurechtliche Verordnungen." },
      { name: "Deutsches Bautechnikportal", url: "https://www.bautechnikportal.de", desc: "Normierungsabgleiche, Verwendbarkeitsnachweise und EU-Konformitätsgesetze." },
      { name: "TÜV SÜD Bauzertifikate", url: "https://www.tuvsud.com", desc: "Schnittstellen zu Baumusterprüfung und werkseigener Produktionskontrolle (WPK)." }
    ],
    books: [
      { title: "Die neue Bauproduktenverordnung: Leitfaden für Planer und Hersteller", desc: "Strasburger, DIN Media. Ausführlicher Leitfaden zu CE-Leistungserklärungen und AVCP-Systemen." },
      { title: "Bauordnungsrecht für Architekten und Ingenieure", desc: "Reinhardt, Beck. Sicheres Navigieren durch die Landesbauordnungen (MBO) und VV TB Technische Baubestimmungen." }
    ],
    publications: [
      { journal: "Journal of European Environmental Law", title: "The transformation of the European Construction Products Regulation (CPR): Market access and digital product passes", desc: "Rechtliche Auswirkungen des digitalisierten Produktpasses." },
      { journal: "Baurechts-Report (Beck)", title: "Fremd- und Eigenüberwachung im Wandel der Baurechtsordnungen", desc: "Ingenieurhaftung bei fehlenden Übereinstimmungserklärungen." }
    ],
    dissertations: [
      { title: "Rechtliche Aspekte harmonisierter Europäischer Normen im Spannungsfeld der Bauproduktenverordnung", desc: "Dissertation, Leibniz Universität Hannover, 2019. Verfassungsmäßigkeit privater Normenvereine weisungsgebundener Behörden." },
      { title: "Auswirkung veränderter AVCP-Systeme auf die Zuverlässigkeit tragender Elemente im konstruktiven Ingenieurbau", desc: "Forschungsbericht, DIBt. Analyse statistischer Fehlerwahrscheinlichkeiten bei Eigenüberwachung nach System 4." }
    ]
  },
  stahlbeton: {
    websites: [
      { name: "DAfStb Schriften", url: "https://www.dafstb.de", desc: "Deutscher Ausschuss für Stahlbeton - Herausgeber von Konstruktions-Heften." },
      { name: "InformationsZentrum Beton", url: "https://www.beton.org", desc: "Herstellerunabhängiges Fachorgan mit ausführlichen Leitfäden zum Sichtbeton und Risseschnitt." },
      { name: "fib international", url: "https://www.fib-international.org", desc: "Internationaler Verband für Beton- und Spannbetontragwerke zur Vorbereitung internationaler Normgenerationen." }
    ],
    books: [
      { title: "Stahlbetonbau in Beispielen (Eurocode 2)", desc: "Zilch, Zehetmaier, Springer. Schritt-für-Schritt-Rechnungen zur Biege- und Querkrafttragfähigkeit." },
      { title: "Bemessung von Betonbauten nach Eurocode 2", desc: "Konrad, DIN Media. Leicht verständliches Tabellenwerk mit Anwendungsfällen." }
    ],
    publications: [
      { journal: "Engineering Structures", title: "Bending and shear resistance of concrete beams with recycled aggregate and carbon reinforcements", desc: "Umfassende Querkraftversuche an Carbonbetonbalken." },
      { journal: "ACI Structural Journal", title: "Prestressed concrete structures under long-term cyclic loading scenarios", desc: "Zeitabhängige Schwind- und Kriechverluste in Vorspannkanälen." }
    ],
    dissertations: [
      { title: "Zur Tragwirkung dünnwandiger Carbonbetonstrukturen unter kombinierter Normalkraft-Biege-Beanspruchung", desc: "Dissertation, TU Dresden, 2022. Bemessungsformeln für Carbon-Gittergelege in der Altbautüchtigkeit." },
      { title: "Querkrafttragverhalten von Spannbetonbalken mit geringen Schubbewehrungsgraden", desc: "Dissertation, Technische Universität Kaiserslautern. Tragfähigkeit im ungerissenen und gerissenen Zustand." }
    ]
  },
  mechanik: {
    websites: [
      { name: "Mechanik Online-Portal", url: "https://www.mechanik-portal.de", desc: "Unabhängiges Portal zur Festkörpermechanik und numerischen Kontinuumsmechanik." },
      { name: "Statik-Lernportal", url: "https://www.statik-lernen.de", desc: "Übungs- und Rechenplattform des Instituts für Statik der TU Braunschweig." },
      { name: "DGM (Materialwissenschaft)", url: "https://www.dgm.de", desc: "Deutsche Gesellschaft für Materialkunde mit Fokus auf elasto-plastisches Materialverhalten." }
    ],
    books: [
      { title: "Technische Mechanik 1 & 2 (Statik & Elastostatik)", desc: "Gross, Hauger, Schnell, Springer. Das deutsche Standard-Lehrbuch für Vorlesungen des Bauingenieurwesens." },
      { title: "Einführung in die Baustatik", desc: "Kratzig, Wittek, Ernst & Sohn. Systematische Tragwerkssimulationen vom Stabwerk bis zur Finite-Elemente-Schale." }
    ],
    publications: [
      { journal: "International Journal of Solids and Structures", title: "A generalized formulation of second-order stress-strain relations for buckling of composite steel columns", desc: "Formelsystem zur Traglastbestimmung knickgefährdeter Mehrstoffquerschnitte." },
      { journal: "Forschung im Ingenieurwesen", title: "Rissfortschritt in spröden Baustoffen unter instationären thermomechanischen Zwangsspannungen", desc: "Thermodynamisch gekoppelte FE-Rissmodelle." }
    ],
    dissertations: [
      { title: "Stabilitätsnachweise von Stahlrahmensystemen nach dem Fließgelenktheorie-Verfahren zweiter Ordnung", desc: "Dissertation, Universität Kassel, 2020. Tragwerksberechnung unter Berücksichtigung von Imperfektionen." },
      { title: "Numerische Werkstoffmodelle zur Abbildung elasto-plastischer Materialformänderungen im Hochtemperaturbereich", desc: "Dissertation, Technische Universität Graz. Werkstoffgesetze für Betonbauteile unter Brandbeanspruchung." }
    ]
  },
  bauphysik: {
    websites: [
      { name: "FIW München", url: "https://www.fiw-muenchen.de", desc: "Forschungsinstitut für Wärmeschutz e.V. mit baupraktischen Dämmstoffstudien." },
      { name: "Fraunhofer-Institut für Bauphysik (IBP)", url: "https://www.ibp.fraunhofer.de", desc: "Entwickler von WUFI (hygrothermische Simulation) mit Datenbanken zu Schall und Wärme." },
      { name: "Bundesverband Bauphysik e.V.", url: "https://www.bv-bauphysik.de", desc: "Fachpublikationen und Leitfäden zur Bauakustik und energetischen Altbausanierung." }
    ],
    books: [
      { title: "Lehrbuch der Bauphysik: Schall - Wärme - Feuchte - Licht - Brandschutz", desc: "Lohmeyer, Post, Springer. Didaktisch hervorragend aufbereitetes All-in-One Lehrbuch." },
      { title: "Formeln und Tabellen Bauphysik", desc: "Energetische Gebäudebewertung, DIN Media. Zahlreiche Wärmebrücken- und Klimadatenkataloge." }
    ],
    publications: [
      { journal: "Bauphysik-Journal", title: "Hygrische Transportphänomene an Bauteiloberflächen: Validierung des kapillaren Saugverhaltens", desc: "Bestimmung des Saugkoeffizienten mineralischer Putze und Wandaufbauten." },
      { journal: "Energy and Buildings", title: "Thermal bridging assessment through dynamic simulation vs. steady-state calculations", desc: "Energetischer Abgleich instationärer Klimaszenarien mit stationären Wärmestromberechnungen." }
    ],
    dissertations: [
      { title: "Hygrothermische Dauerhaftigkeitsbewertung von hochgedämmten Holzwandstrukturen der Altbausanierung", desc: "Dissertation, Universität Innsbruck, 2021. Simulation kritischer Schimmelpilzkriterien in Gefachen." },
      { title: "Optimierung der Schalldämmung von mehrschichtigen Trockenbauwandkonstruktionen im tiefen Frequenzbereich", desc: "Dissertation, Technische Universität Berlin (TU Berlin). Schallwellenleitung bei geringen Abständen elastischer Ständerprofile." }
    ]
  },
  nachhaltigkeit: {
    websites: [
      { name: "DGNB e.V.", url: "https://www.dgnb.de", desc: "Deutsche Gesellschaft für Nachhaltiges Bauen mit umfangreichen Zertifizierungskriterien (DGNB-System)." },
      { name: "ÖKOBAUDAT", url: "https://www.oekobaudat.de", desc: "Offizielle Bundes-Materialdatenbank für verifizierte GWP- und PE-Werte von Baustoffen." },
      { name: "Bau-EPD e.V.", url: "https://www.bau-epd.at", desc: "Zertifizierungsplattform für normkonforme Umweltproduktdeklarationen Typ III gemäß ISO 14025." }
    ],
    books: [
      { title: "Nachhaltiges Bauen: Handbuch für Planer, Bauherren und Betreiber", desc: "Bauer, Mösle, Springer. Ein Standardwerk für Ökobilanzierung und Ressourceneffizienz." },
      { title: "Praxis-Handbuch Ökobilanzierung im Bauwesen", desc: "DIN Media. Rechenregeln und Bilanzierungsphasen (A1-A3, B, C, D) nach DIN EN 15804 verständlich erklärt." }
    ],
    publications: [
      { journal: "Journal of Cleaner Production", title: "Life cycle assessment (LCA) of mineral wool vs. biogenic straw insulated wall systems", desc: "Vergleich biogener CO2-Speicherungen im Baustoffkreislauf." },
      { journal: "Environmental Science & Technology", title: "Carbon uptake in cementitious products during active carbonation curing", desc: "Quantifizierung der CO2-Mineralisierung in zementgebundenen Werkstoffen." }
    ],
    dissertations: [
      { title: "Entwicklungs- und Bewertungsmodell für zirkuläres Planen und Konstruieren im Massivbau", desc: "Dissertation, TU Dresden, 2023. Zirkularitäts-Indexformeln für rückbauoptimierte Decken." },
      { title: "Methodik zur Integration von Nachhaltigkeitskennwerten in BIM-basierte Lebenszyklusanalysen", desc: "Dissertation, Universität Stuttgart, 2020. Datenmapping von IFC-Exporten mit GWP-Werten aus EPDs." }
    ]
  },
  digitales: {
    websites: [
      { name: "buildingSMART Deutschland", url: "https://www.buildingsmart.de", desc: "Die offizielle Vertretung für herstellerneutrales openBIM, IFC-Schemata und BIM-Leitfäden." },
      { name: "BIM Deutschland – Zentrum für die Digitalisierung des Bauwesens", url: "https://www.bimdeutschland.de", desc: "Nationales BIM-Kompetenzzentrum des Bundes; Betreiber des BIM-Portals (bim-portal.de) mit Merkmalskatalogen und AIA-Mustern." },
      { name: "planen-bauen 4.0", url: "https://www.planen-bauen40.de", desc: "Kooperationen zur Etablierung des Digitalen Zwillings und BIM-basiertem Bauantrag." }
    ],
    books: [
      { title: "Borrmann, A.; König, M.; Koch, C.; Beetz, J. (Hrsg.): Building Information Modeling. 2. Aufl., Springer Vieweg 2021", desc: "Technologische Grundlagen (IFC, Datenmodelle, Prozesse) und industrielle Praxis." },
      { title: "Hausknecht, K.; Liebich, T.: BIM-Kompendium. Stuttgart: Fraunhofer IRB (aktuelle Auflage)", desc: "Einführung in Methode, Rollen und openBIM-Formate." }
    ],
    publications: [
      { journal: "BMVI (2015)", title: "Stufenplan Digitales Planen und Bauen", desc: "Fahrplan zur Einführung von BIM im Infrastrukturbau des Bundes." },
      { journal: "BMI (2021)", title: "Masterplan BIM für Bundesbauten", desc: "Einführungsstrategie für BIM im Bundeshochbau." }
    ],
    dissertations: [
      
    ]
  },
  bestand: {
    websites: [
      { name: "WTA e.V.", url: "https://www.wta-gmbh.de", desc: "Wissenschaftlich-Technische Arbeitsgemeinschaft für Bauwerkserhaltung und Denkmalpflege mit Richtlinienkatalogen." },
      { name: "Deutsches Nationalkomitee für Denkmalschutz (DNK)", url: "https://www.dnk.de", desc: "Nationale Leitgrundlagen, Rechtsfragen und Handbücher zur historischen Bausubstanz." },
      { name: "Fraunhofer IRB Raum und Bau", url: "https://www.irb.fraunhofer.de", desc: "Kataloge, Merkblätter und Sanierungsbeispiele historischer Baustoffschäden." }
    ],
    books: [
      { title: "Typische Baukonstruktionen von 1860 bis 1960 (Bd. 1–3)", desc: "Ahnert, R.; Krause, K. H. – Standardwerk zur Identifikation historischer Konstruktionen (Decken, Wände, Dächer)." },
      { title: "Historische Bautabellen", desc: "Bargmann, H. – Werner Verlag. Normen und Konstruktionshinweise 1870 bis 1960 für die Nachrechnung." },
      { title: "DBV-Merkblätter „Bauen im Bestand“", desc: "Deutscher Beton- und Bautechnik-Verein: Leitfaden, Beton und Betonstahl, Modifizierte Teilsicherheitsbeiwerte für Stahlbetonbauteile." }
    ],
    publications: [],
    dissertations: []
  },
  rueckbau: {
    websites: [
      { name: "Deutscher Abbruchverband e.V.", url: "https://www.deutscher-abbruchverband.de", desc: "Fachverband für Rückbautechnik, Schadstoffsanierung und technische Abbruchrichtlinien." },
      { name: "Kreislaufwirtschaft Bau", url: "https://kreislaufwirtschaft-bau.de", desc: "Initiative der Bauwirtschaft; Monitoringberichte zu Aufkommen und Verbleib mineralischer Bauabfälle." },
      { name: "Ressourceneffizienz-Zentrum Bayern (REZ)", url: "https://www.umweltpakt.bayern.de/rez/", desc: "Bayerische Plattform des LfU zu Ressourceneffizienz, auch im Bauwesen." }
    ],
    books: [
      { title: "Müller, A.: Baustoffrecycling – Entstehung, Aufbereitung, Verwertung. Wiesbaden: Springer Vieweg 2018", desc: "Aufbereitungstechnik, Eigenschaften und Verwertung mineralischer Recyclingbaustoffe." },
      { title: "Hillebrandt, A.; Riegler-Floors, P.; Rosen, A.; Seggewies, J.-K.: Atlas Recycling – Gebäude als Materialressource. München: Detail 2018", desc: "Konstruktionen und Materialien für rückbau- und recyclinggerechtes Bauen." }
    ],
    publications: [
      { journal: "Kreislaufwirtschaft Bau (Hrsg.), zweijährlich", title: "Mineralische Bauabfälle – Monitoring: Bericht zum Aufkommen und zum Verbleib mineralischer Bauabfälle", desc: "Amtlich gestützte Statistik zu Aufkommen, Recycling und Verfüllung; aktuelle Ausgabe beim Herausgeber." }
    ],
    dissertations: [
      
    ]
  },
  dauerhaftigkeit: {
    websites: [
      { name: "Deutscher Ausschuss für Stahlbeton (DAfStb)", url: "https://www.dafstb.de", desc: "Richtlinien (u. a. Alkali-Richtlinie, WU-Richtlinie) und Schriftenreihe zu Betonbau und Dauerhaftigkeit." },
      { name: "VDZ – Verein Deutscher Zementwerke", url: "https://www.vdz-online.de", desc: "Forschungsinstitut der Zementindustrie u. a. zu Karbonatisierung, Frost-Tausalz-Widerstand und AKR." },
      { name: "BASt Ingenieurbau-Datenbank", url: "https://www.bast.de", desc: "Bundesanstalt für Straßenwesen. Regeluntersuchungen zur AKR-Schadensentwicklung an Brückenkappen." }
    ],
    books: [
      { title: "Stark, J.; Wicht, B.: Dauerhaftigkeit von Beton. 2. Aufl., Berlin: Springer Vieweg 2013", desc: "Schadensmechanismen von Beton, u. a. AKR, Sulfat- und Frostangriff." },
      { title: "Bertolini, L.; Elsener, B.; Pedeferri, P.; Redaelli, E.; Polder, R.: Corrosion of Steel in Concrete. 2. Aufl., Weinheim: Wiley-VCH 2013", desc: "Karbonatisierung, Chloridkorrosion, Diagnose und Instandsetzung." }
    ],
    publications: [
      { journal: "CBI Research 5:82, Stockholm 1982", title: "Tuutti, K.: Corrosion of Steel in Concrete", desc: "Ursprung des Zweiphasenmodells (Einleitungs- und Schädigungsphase)." },
      { journal: "Proceedings Highway Research Board 29 (1949)", title: "Powers, T. C.: The Air Requirement of Frost-Resistant Concrete", desc: "Grundlage des Luftporen-Abstandsfaktors." }
    ],
    dissertations: [
      { title: "Gehlen, C.: Probabilistische Lebensdauerbemessung von Stahlbetonbauwerken", desc: "Dissertation, RWTH Aachen 2000; DAfStb-Heft 510. Grundlage der probabilistischen Dauerhaftigkeitsbemessung." }
    ]
  },
  schaeden: {
    websites: [
      { name: "IFS Schadenforschung", url: "https://www.ifs-ev.de", desc: "Institut für Schadenverhütung und Schadenforschung e.V. mit Bauschadensarchiv." },
      { name: "AIBau – Aachener Institut für Bauschadensforschung", url: "https://www.aibau.de", desc: "Bauschadensforschung; Aachener Bausachverständigentage (Tagungsbände)." },
      { name: "BVS – Bundesverband öffentlich bestellter und vereidigter sowie qualifizierter Sachverständiger", url: "https://www.bvs-ev.de", desc: "Dachverband der Sachverständigen, Fachbereich Bau." }
    ],
    books: [
      { title: "Bauschadens-Sammlung", desc: "Zimmermann, G. (Hrsg.), Fraunhofer IRB Verlag. Mehrbändige Sammlung dokumentierter Schadensfälle mit Ursachen und Sanierung." },
      { title: "Hinzunehmende Unregelmäßigkeiten bei Gebäuden", desc: "Oswald, R.; Abel, R., Springer Vieweg. Abgrenzung Mangel – hinzunehmende Unregelmäßigkeit." }
    ],
    publications: [
      { journal: "Aachener Bausachverständigentage (Springer Vieweg)", title: "Tagungsbände (jährlich)", desc: "Fachbeiträge zu aktuellen Schadensbildern, Abgrenzung Mangel/Schaden und Sachverständigenpraxis." },
      { journal: "Bautechnik / Beton- und Stahlbetonbau (Ernst & Sohn)", title: "Fachaufsätze zu Schadensfällen und Nachrechnung", desc: "Primärquellen zu Einstürzen und Schadensanalysen (z. B. Carolabrücke, Spannungsrisskorrosion)." }
    ],
    dissertations: [
    ]
  },
  instandsetzung: {
    websites: [
      { name: "buev - Bundesgütegemeinschaft Instandsetzung von Betonbauwerken e.V.", url: "https://www.buev.de", desc: "Fachportal für Güteüberwachung, SIVV-Qualifikationen und Instandsetzungsrichtlinien." },
      { name: "WTA e.V. Bautenschutz & Bauwerkserhaltung", url: "https://www.wta-gmbh.de", desc: "Referenz-Merkblätter zu Sanierputzsystemen, nachträglichen Horizontalsperren und Mauerwerksinjektion." },
      { name: "Deutscher Beton- und Bautechnik-Verein (DBV)", url: "https://www.betonverein.de", desc: "Merkblätter zu Parkhäusern, Rissüberbrückung (OS-Systeme), Reprofilierung und Instandhaltungskonzepten." }
    ],
    books: [
      { title: "Raupach, M.; Orlowsky, J.: Erhaltung von Betonbauwerken. Wiesbaden: Vieweg+Teubner 2008", desc: "Baustoffliche Grundlagen, Diagnose und Instandsetzung von Betonbauwerken." },
      { title: "Gieler, R. P.; Dimmig-Osburg, A.: Kunststoffe für den Bautenschutz und die Betoninstandsetzung. Basel: Birkhäuser 2006", desc: "Beschichtungen, Injektionsstoffe und PCC-Systeme." }
    ],
    publications: [
      { journal: "Beton- und Stahlbetonbau (Ernst & Sohn)", title: "Fachaufsätze zur TR Instandhaltung und zum sachkundigen Planer", desc: "Primärquellen zur Einführung der TR Instandhaltung und zu Instandsetzungsverfahren." }
    ],
    dissertations: [
    ]
  },
  praxiswissen: {
    websites: [
      { name: "VOB-Online Informationsdienst", url: "https://www.vob-online.de", desc: "Direktabrechnungen, Ausschreibungsregelungen und VOB-Erläuterungen." },
      { name: "HOAI Honorarrechner", url: "https://www.hoai.de", desc: "Offizielles Portal zur HOAI-Kostenkalkulation und Leistungsphasenvereinbarung." },
      { name: "Bauforum24 Marktportal", url: "https://www.bauforum24.biz", desc: "Etabliertes Diskussionsforum zu Baubetrieb, Großmaschinen, Leistungsbeschreibungen und Baupraxis." }
    ],
    books: [
      { title: "VOB/B im Bild: Praxisnahe Erläuterung der Vertragsordnung", desc: "Kues, DIN Media. Zeichnerische Übersichten für vertragskonforme Mängelanzeigen und Abrechnungen." },
      { title: "Handbuch für den Bausachverständigen: Gutachten professionell erstellen", desc: "Schumacher, Werner Verlag. Leitlinien zur juristisch sicheren Gutachtenstruktur." }
    ],
    publications: [
      { journal: "International Journal of Project Management", title: "Claim Management in large infrastructure projects: Statistical analysis of causes and resolution strategies", desc: "Statistische Hauptursachen für Nachtragsforderungen im Großbaubetrieb." },
      { journal: "Baurecht (Werner-Verlag)", title: "Ausschreibungsvorgaben nach GWP-Grenzbereichen: Vergaberechtliche Integration ökologischer Nachhaltigkeit", desc: "Rechtsgutachten zur Vereinbarkeit von EPD-GWP-Grenzen im VOB/A Vergabeverfahren." }
    ],
    dissertations: [
      { title: "Zur Optimierung der Leistungsbeschreibung mit Leistungsprogramm bei komplexen Infrastrukturprojekten", desc: "Dissertation, Universität Stuttgart, 2022. Strukturierte Funktionalbeschreibungen im schlüsselfertigen Hochbau." },
      { title: "Kollaboratives Änderungsmanagement im Hochbau unter Verwendung intelligenter BIM-Informationsstrukturen", desc: "Dissertation, Technische Universität Graz. Echtzeit-Nachtragstracking bei digitalen Bauwerksmodellen." }
    ]
  },
  beton: {
    websites: [
      { name: "Beton.org Portal", url: "https://www.beton.org", desc: "InformationsZentrum Beton (IZB) mit praxisnahen Regelwerken und Fachmerkblättern." },
      { name: "VDZ Zementportal", url: "https://www.vdz-online.de", desc: "Forschungsinstitut der Zementindustrie mit aktuellen Studien zur Dekarbonisierung." }
    ],
    books: [
      { title: "Beton: Herstellung und Eigenschaften", desc: "Grübl, Weigler, Karl, Ernst & Sohn. Umfassendes Standardwerk der Betontechnologie." },
      { title: "Zement-Taschenbuch", desc: "VDZ. Das unentbehrliche Nachschlagewerk für Bindemittel und Betonzusammensetzungen." }
    ],
    publications: [
      { journal: "Beton- und Stahlbetonbau (Ernst & Sohn)", title: "Klinkereffiziente Zemente CEM II/C-M und CEM VI nach DIN EN 197-5 in der Praxis", desc: "Untersuchungen zu Festigkeitsentwicklung und Dauerhaftigkeit CO2-reduzierter Betone." },
      { journal: "Cement and Concrete Research", title: "Limestone calcined clay cement (LC3): Hydration kinetics and chloride ingress resistance", desc: "Wissenschaftliche Auswertung der Puzzolanreaktion calcinierter Tone." }
    ],
    dissertations: [
      { title: "Zur Hydratationskinetik klinkerreduzierter Zemente mit calzinierten Tonen", desc: "Dissertation, Karlsruher Institut für Technologie (KIT). Gefügeuntersuchungen an LC3-Bindemittelsystemen." }
    ]
  },
  holzbau: {
    websites: [
      { name: "Informationsdienst Holz", url: "https://informationsdienst-holz.de", desc: "Umfangreiche Fachpublikationen, Holzbau Handbücher und Konstruktionsdetails." },
      { name: "dataholz.eu", url: "https://www.dataholz.eu", desc: "Prüfzeugnisse für U-Werte, Schall- und Brandschutznachweise nach HFA-Standard." },
      { name: "Institut für Holzbau", url: "https://www.institut-holzbau.de", desc: "Fortbildung und Forschung zu Landesbauordnungen und Holzbaurichtlinien." }
    ],
    books: [
      { title: "Holzbau: Grundlagen, Bemessungshilfen", desc: "Informationsdienst Holz. Tabellenwerk für Tragwerksplaner nach Eurocode 5." },
      { title: "Holzbau Taschenbuch", desc: "Ernst & Sohn. Bemessungs- und Konstruktionsregeln für Ingenieure." }
    ],
    publications: [
      { journal: "Bautechnik", title: "Mehrgeschossiger Holzbau nach der neuen Muster-Holzbau-Richtlinie (MHolzBauR)", desc: "Brandschutztechnische Nachweisführung und Kapselungskriterien für GK 4 und GK 5." }
    ],
    dissertations: [
      { title: "Trag- und Verformungsverhalten von Brettsperrholzelementen unter mehraxialer Beanspruchung", desc: "Dissertation, TU Graz. Untersuchungen zur Rollschubfestigkeit und Schubmodulbestimmung." }
    ]
  }
};

interface ModuleInfoProps {
  group: string;
}

export default function ModuleInfo({ group }: ModuleInfoProps) {
  const { setActiveTab } = useTabContext();
  const [activeSection, setActiveSection] = useState<'grundlagen' | 'ueberblick' | 'inhalte' | 'weiterfuehrend' | 'klassifizierung' | 'historie'>('grundlagen');
  const [laborStep, setLaborStep] = useState(0);

  const normalizedGroup = group.toLowerCase().replace('_info', '');
  const data = MODULES_DATA[normalizedGroup];
  const resources = COMPREHENSIVE_RESOURCES[normalizedGroup] || { websites: [], books: [], publications: [], dissertations: [] };
  const historyData = MODULE_HISTORY_DATA[normalizedGroup];

  if (!data) {
    return (
      <div className="bg-white dark:bg-slate-900 text-text-main dark:text-slate-100 rounded-2xl shadow-sm border border-home-grau/30 dark:border-slate-800 p-12 text-center">
        <Info className="w-12 h-12 text-shiraz mx-auto mb-4" />
        <h3 className="text-lg font-bold text-text-main dark:text-slate-100 mb-2">Modulinfos für dieses Thema</h3>
        <p className="text-sm text-text-main/60 dark:text-slate-400">Aktuell ist dieses Informationsmodul leer oder befindet sich in Vorbereitung.</p>
      </div>
    );
  }

  const IconComponent = data.icon;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* HEADER CARD */}
      <div className="bg-white dark:bg-slate-900 text-text-main dark:text-slate-100 rounded-2xl shadow-sm border border-home-grau/30 dark:border-slate-800 overflow-hidden">
        <div className="border-b border-home-grau/30 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-shiraz/10 rounded-xl text-shiraz">
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main dark:text-slate-100">Bereich: {data.title}</h2>
              <p className="text-sm text-text-main/70 dark:text-slate-355">{data.tagline}</p>
            </div>
          </div>
        </div>

        {/* SECTION TABS */}
        <div className="border-b border-home-grau/30 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20 p-2 sm:p-4 print:hidden">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveSection('grundlagen')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSection === 'grundlagen'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-home-grau/30 dark:border-slate-700 hover:border-shiraz text-text-main dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <Info size={14} />
              <span className="truncate">Modulbasis</span>
            </button>
            <button
              onClick={() => setActiveSection('ueberblick')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSection === 'ueberblick'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-home-grau/30 dark:border-slate-700 hover:border-shiraz text-text-main dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <Compass size={14} />
              <span className="truncate">Überblick</span>
            </button>
            <button
              onClick={() => setActiveSection('inhalte')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSection === 'inhalte'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-home-grau/30 dark:border-slate-700 hover:border-shiraz text-text-main dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-755'
              }`}
            >
              <BookOpen size={14} />
              <span className="truncate">Lehrthemen</span>
            </button>
            <button
              onClick={() => setActiveSection('weiterfuehrend')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSection === 'weiterfuehrend'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-home-grau/30 dark:border-slate-700 hover:border-shiraz text-text-main dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-755'
              }`}
            >
              <FileSearch size={14} />
              <span className="truncate">Quellen</span>
            </button>
            <button
              onClick={() => setActiveSection('historie')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSection === 'historie'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-home-grau/30 dark:border-slate-700 hover:border-shiraz text-text-main dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-755'
              }`}
            >
              <History size={14} />
              <span className="truncate">Historie</span>
            </button>
            {normalizedGroup === 'baustoffe' && (
              <button
                onClick={() => setActiveSection('klassifizierung')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeSection === 'klassifizierung'
                    ? 'bg-shiraz text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 border border-home-grau/30 dark:border-slate-700 hover:border-shiraz text-text-main dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-755'
                }`}
              >
                <Layers size={14} />
                <span className="truncate">Systematik</span>
              </button>
            )}
          </div>
        </div>

        {/* CONTENT PANEL */}
        <div className="p-6">
          {activeSection === 'grundlagen' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                  <FileText className="text-shiraz w-5 h-5" />
                  {data.basicsTitle}
                </h3>
                <p className="text-sm text-text-main/80 leading-relaxed">
                  {data.basicsDesc1}
                </p>
                <p className="text-sm text-text-main/80 leading-relaxed">
                  {data.basicsDesc2}
                </p>
              </div>

              {/* LABOR WORKFLOW DIRECTIVE (Interactive stepwise roadmap/Fahrplan) */}
              {normalizedGroup === 'labor' && (
                <div className="p-5 bg-stone-50 border border-home-grau/25 rounded-xl space-y-4">
                  <div className="border-b border-home-grau/25 pb-3">
                    <span className="text-[10px] font-bold text-shiraz uppercase tracking-widest block mb-0.5">Praxis-Fahrplan</span>
                    <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                      <Compass size={18} className="text-shiraz" />
                      Interaktiver Schritt-für-Schritt Prüfungsleitfaden (Workflow)
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Dieser chronologische Leitfaden führt Sie Schritt für Schritt durch das Zusammenwirken aller Einzelmodule und Werkstoffdisziplinen der Baubetreuung – von der Baustelle bis zur schlussendlichen Freigabeentscheidung. Jedes Modul ist so eigenständig und ohne Vorwissen anwendbar.
                    </p>
                  </div>

                  {/* Flow Steps Buttons Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                    {[
                      { num: "01", label: "Probenahme", title: "Probenahme", desc: "Entnahme & Logistik" },
                      { num: "02", label: "Sensorik & Messen", title: "Sensorik", desc: "Applikation & Justierung" },
                      { num: "03", label: "Laborprüfung", title: "Mechanische Prüfung", desc: "Druck, Biegezug & E-Modul" },
                      { num: "04", label: "Materialanalytik", title: "Mikroanalytik", desc: "XRD, GC-MS & RFA" },
                      { num: "05", label: "Statistik", title: "Statistische Absicherung", desc: "Konformität & Ausschuss" },
                    ].map((step, idx) => (
                      <button
                        key={idx}
                        onClick={() => setLaborStep(idx)}
                        className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                          laborStep === idx
                            ? 'bg-shiraz text-white border-shiraz shadow-sm ring-1 ring-shiraz hover:bg-shiraz/95'
                            : 'bg-white text-slate-800 border-home-grau/25 hover:bg-slate-50 hover:border-slate-350'
                        }`}
                      >
                        <span className={`text-[10px] font-black tracking-wider ${laborStep === idx ? 'text-white/80' : 'text-shiraz/80'}`}>{step.num}</span>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold leading-tight truncate">{step.label}</span>
                          <span className={`text-[8.5px] leading-tight truncate mt-0.5 ${laborStep === idx ? 'text-white/70' : 'text-slate-450'}`}>{step.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Flow Step Card Content */}
                  <div className="bg-white p-4 rounded-lg border border-home-grau/25 shadow-inner">
                    {laborStep === 0 && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-home-grau/15 pb-2">
                          <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <span className="w-5 h-5 bg-shiraz text-white text-xs font-bold rounded-full flex items-center justify-center">1</span>
                            Schritt 1: Normgerechte Probenahme &amp; Feld-Erkundung (Probenahme-Modul)
                          </h5>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 font-mono rounded">DIN EN 12504-1 / LAGA PN 98</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          Keine Laborprüfung ist besser als ihre Probenahme. Eine unsachgemäße oder willkürliche Materialentnahme (z. B. nur von der Oberfläche eines Haufwerks oder aus nur einem Bauteilbereich) führt zu Entmischungseffekten und nicht repräsentativen Kennwerten.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1.5">
                            <span className="font-extrabold text-slate-900 block text-[11px] uppercase tracking-wide">Praxistipp für Bohrkernentnahme:</span>
                            <ul className="list-disc pl-4 space-y-1 text-slate-650">
                              <li><strong>Bewehrung orten:</strong> Vor der Kernbohrung ist ein zerstörungsfreies Scannen der Bewehrungsstähle zwingend erforderlich, um ein Durchtrennen tragender Eisen zu vermeiden.</li>
                              <li><strong>Mindestmaß beachten:</strong> Der Kerndurchmesser sollte mindestens das Dreifache des Größtkorns betragen (d_K ≥ 3 · d_max). Bei 32 mm Größtkorn ist daher eine Bohrkrone von mindestens 100 mm erforderlich.</li>
                              <li><strong>Kernanzahl planen:</strong> Je Prüfbereich mehrere Kerne entnehmen (Mindestanzahl je Bewertungsverfahren nach DIN EN 13791).</li>
                            </ul>
                          </div>
                          <div className="p-3 bg-stone-50 border border-home-grau/15 rounded-md flex flex-col justify-between">
                            <div>
                              <span className="font-bold text-shiraz block text-[10.5px]">LAGA PN 98 (Abfallbeprobung)</span>
                              <p className="text-[10.5px] text-slate-600 leading-normal mt-1">
                                Um z. B. PAK-haltige Asphaltschichten, HBCD-haltige Dämmstoffe (EPS/XPS) oder auslaugbare Salze im Bauschutt nachvollziehbar zu erfassen, verlangt die LAGA PN 98 eine planmäßige Beprobung des gesamten Haufwerks (nach § 8 EBV verbindlich für mineralische Ersatzbaustoffe).
                              </p>
                            </div>
                            <div className="bg-white p-1.5 border border-home-grau/10 rounded text-[9.5px] font-mono text-slate-500 mt-2 text-center">
                              Mindestvolumen der Proben: abhängig vom Größtkorn (Tabelle der LAGA PN 98)
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {laborStep === 1 && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-home-grau/15 pb-2">
                          <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <span className="w-5 h-5 bg-shiraz text-white text-xs font-bold rounded-full flex items-center justify-center">2</span>
                            Schritt 2: Sensor-Applikation, Justierung &amp; Unsicherheit (Messen &amp; Prüfen-Modul)
                          </h5>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 font-mono rounded">VDI/VDE 2635 / GUM-Standard</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          Für verlässliche Messdaten (z. B. Verformungen im E-Modul-Versuch oder Spannungsaufzeichnungen an Trägern) müssen Sensoren kalibriert, thermische Störungen kompensiert und mechanisch starr angebunden sein.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1.5">
                            <span className="font-extrabold text-slate-900 block text-[11px] uppercase tracking-wide">Dehnungsaufzeichnung (DMS):</span>
                            <ul className="list-disc pl-4 space-y-1 text-slate-650">
                              <li><strong>Oberflächenvorbereitung:</strong> Die Baustoffkontaktfläche muss planparallel angeschliffen, absolut staubbefreit und chemisch entfettet (z. B. mit Isopropanol) werden.</li>
                              <li><strong>Brückenschaltung konfigurieren:</strong> Verwenden Sie Wheatstone-Voll- oder Halbbrücken, um parasitäre Biegespannungen oder witterungsbedingte Temperatureffekte (&Delta;T) automatisch zu kompensieren.</li>
                              <li><strong>Kalibrierfaktor (k-Wert):</strong> Exakt im Verstärker einstellen. Dehnung entspricht &epsilon; = (1/k) · (&Delta;R/R).</li>
                            </ul>
                          </div>
                          <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-md flex flex-col justify-between">
                            <div>
                              <span className="font-bold text-indigo-900 block text-[10.5px]">Messunsicherheit nach GUM (BIPM)</span>
                              <p className="text-[10.5px] text-indigo-950/80 leading-normal mt-1">
                                Messwerte ohne Angabe der Unsicherheit sind wissenschaftlich unbrauchbar. Im Modul &quot;Messen &amp; Prüfen&quot; berechnen Sie die kombinierte Standardunsicherheit u_c aus Typ-A-Beiträgen (Statistik der Messreihe) und Typ-B-Beiträgen (Geräteauflösung, Kalibrierschein).
                              </p>
                            </div>
                            <div className="bg-white p-1.5 border border-indigo-100 rounded text-[9.5px] font-mono text-indigo-700 mt-2 text-center">
                              GUM: Erweiterte Unsicherheit U = k · u_c mit k = 2 (≈ 95 % Überdeckung)
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {laborStep === 2 && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-home-grau/15 pb-2">
                          <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <span className="w-5 h-5 bg-shiraz text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
                            Schritt 3: Zerstörende mechanische Laborprüfungen (Prüfstandsversuche)
                          </h5>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 font-mono rounded">DIN EN 12390-3 / -13</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          Die Bestimmung der Festigkeiten (Druckfestigkeit, Spaltzug- und Biegezugfestigkeit) erfolgt in hydraulischen Prüfmaschinen unter exakt definierten Belastungsraten und Probenbedingungen.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1.5">
                            <span className="font-extrabold text-slate-900 block text-[11px] uppercase tracking-wide">Prüfungsdurchführung &amp; Fehlerminimierung:</span>
                            <ul className="list-disc pl-4 space-y-1 text-slate-650">
                              <li><strong>Ebenheit sichern:</strong> Die Lastflächen von Würfeln und Zylindern müssen die Ebenheitstoleranz nach DIN EN 12390-1 (0,0006 · d) einhalten, sonst führen Kantenpressungen zu deutlich zu niedrigen Werten. Andernfalls planschleifen oder abgleichen.</li>
                              <li><strong>Lasteinleitungsrate steuern:</strong> Beton verhält sich viskoelastisch. Zu schnelle Lasteinleitung verfälscht die Kennwerte nach oben. Für die Druckprüfung gilt nach DIN EN 12390-3 0,6 ± 0,2 MPa/s.</li>
                              <li><strong>E-Modul-Zyklen:</strong> Der Elastizitätsmodul wird nicht beim Erstbruch, sondern durch wiederholte Be- und Entlastungszyklen (Hystereseeffekte) im elastischen Kernspannungsbereich ermittelt.</li>
                            </ul>
                          </div>
                          <div className="p-3 bg-red-50/50 border border-red-100 rounded-md flex flex-col justify-between">
                            <div>
                              <span className="font-bold text-red-900 block text-[10.5px]">Spannungs-Dehnungs-Visualisierung</span>
                              <p className="text-[10.5px] text-red-950/80 leading-normal mt-1">
                                Im Modul &quot;Virtuelle Versuche&quot; simulieren Sie Spannungs-Dehnungs-Kurven für verschiedene Werkstoffe und Prüfarten. Vergleichen Sie sprödes Versagen (Beton, Glas) mit zähelastischem Fließverhalten (B500B Betonstahl).
                              </p>
                            </div>
                            <div className="bg-white p-1.5 border border-red-100 rounded text-[9.5px] font-mono text-red-700 mt-2 text-center">
                              Bruchspannung: σ_B = F_max / A_0 [MPa]
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {laborStep === 3 && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-home-grau/15 pb-2">
                          <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <span className="w-5 h-5 bg-shiraz text-white text-xs font-bold rounded-full flex items-center justify-center">4</span>
                            Schritt 4: Materialanalytik &amp; Chemophysikalische Gefügediagnose (Analytik &amp; Diagnostik)
                          </h5>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 font-mono rounded">Methodenspektrum</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          Makroskopisches Materialverhalten (Tragfähigkeit, Festigkeit) wurzelt in der Nano- und Mikrostruktur. Weisen Sie schädliche Reaktionsphasen, Hydratation und Chemikalien zerstörungsfrei oder mikroskopisch nach.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1.5">
                            <span className="font-extrabold text-slate-900 block text-[11px] uppercase tracking-wide">Analysen-Entscheidungsmatrix:</span>
                            <ul className="list-disc pl-4 space-y-1 text-slate-650">
                              <li><strong>XRD &amp; FTIR (Mineralogie / Molekülbindungen):</strong> XRD weist an Pulverproben kristalline Treibphasen (Ettringit, Thaumasit) nach; FTIR identifiziert organische Polymeradditive.</li>
                              <li><strong>TGA (Thermogravimetrie):</strong> Bestimmt den Portlanditgehalt Ca(OH)₂ (Wasserabgabe bei ca. 400–500&nbsp;&deg;C) und den Calcitgehalt (CO₂-Abgabe bei ca. 600–800&nbsp;&deg;C).</li>
                              <li><strong>RFA &amp; LIPS (Elemente):</strong> RFA liefert makroskopische Elementoxide, während LIBS (laserbasiert, auch mobil) ortsaufgelöste Tiefenprofile (z. B. Chlorid an Bohrkernen aus Tunnelsockeln) liefert.</li>
                              <li><strong>GC-MS (organische Schadstoffe):</strong> Standardverfahren für Holzschutzmittel (PCP/Lindan), Teerbestandteile (PAK) oder Flammschutzmittel.</li>
                            </ul>
                          </div>
                          <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-md flex flex-col justify-between">
                            <div>
                              <span className="font-bold text-emerald-950 block text-[10.5px]">Interaktive Diagnostik-Schnittstelle</span>
                              <p className="text-[10.5px] text-emerald-800 leading-normal mt-1">
                                Nutzen Sie das Modul &quot;Analytik &amp; Diagnostik&quot;, um XRD-Beugung oder REM/EDX-Punktsonden live zu bedienen und Minerale durch reale physikochemische Kriterien zuzuordnen.
                              </p>
                            </div>
                            <div className="bg-white p-1.5 border border-emerald-100 rounded text-[9.5px] font-mono text-emerald-700 mt-2 text-center">
                              Chloridgrenze: ≤ 0,40% (Stahlbeton); ≤ 0,20% (Spannbeton)
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {laborStep === 4 && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-home-grau/15 pb-2">
                          <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <span className="w-5 h-5 bg-shiraz text-white text-xs font-bold rounded-full flex items-center justify-center">5</span>
                            Schritt 5: Statistische Absicherung &amp; Konformitätsnachweis (Statistik-Untermodule)
                          </h5>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 font-mono rounded">DIN EN 206 / DIN EN 1990 / ISO 12491</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          Keine Einzelfestigkeit entscheidet allein über die Freigabe eines Bauwerks oder einer Betoncharge. Prüfstreuungen und mögliche Ausreißer werden statistisch bewertet und – nur mit technischer Begründung – ausgeschlossen.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1.5">
                            <span className="font-extrabold text-slate-900 block text-[11px] uppercase tracking-wide">Statistisches Handwerkszeug für Konstrukteure:</span>
                            <ul className="list-disc pl-4 space-y-1 text-slate-650">
                              <li><strong>Ausreißertest nach Grubbs:</strong> Zeigt, ob ein extremer Einzelwert statistisch auffällig ist; ob er ein Prüffehler ist (z. B. Hohlraum im Würfel), muss technisch geklärt werden.</li>
                              <li><strong>Das 5%-Quantil (f_ck):</strong> Festigkeit, die mit 95 % Wahrscheinlichkeit überschritten wird: f_ck = f_m − 1,645 · σ bei bekannter Streuung; bei aus der Stichprobe geschätztem s mit k_n nach DIN EN 1990, Anhang D.</li>
                              <li><strong>Konformität nach EN 206:</strong> Regelt die Konformität der Produktion (stetige Herstellung: f_cm ≥ f_ck + 1,48 · σ und f_ci ≥ f_ck − 4 N/mm²).</li>
                            </ul>
                          </div>
                          <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-md flex flex-col justify-between">
                            <div>
                              <span className="font-bold text-purple-950 block text-[10.5px]">Statistik &amp; Festbeton-Module</span>
                              <p className="text-[10.5px] text-purple-800 leading-normal mt-1">
                                Nutzen Sie die Module &quot;Statistik&quot; und &quot;Festbeton (Statistik)&quot;, um Stichproben zu erzeugen, Histogramme mit der Normalverteilung zu vergleichen und Konformitätskriterien nachzuvollziehen.
                              </p>
                            </div>
                            <div className="bg-white p-1.5 border border-purple-100 rounded text-[9.5px] font-mono text-purple-700 mt-2 text-center">
                              Statistik-Ziel: Ausschaltquoten ≤ 5%
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {data.basicsCards.map((bc, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-home-grau/20 rounded-xl space-y-2">
                    <h4 className="font-bold text-sm text-text-main">{bc.title}</h4>
                    <p className="text-xs text-text-main/70 leading-relaxed">
                      {bc.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* DIDACTIC PRINCIPLES */}
              {data.didacticCards && data.didacticCards.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-home-grau/15">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-main/60 flex items-center gap-1.5">
                    <CheckCircle className="text-emerald-600 w-4 h-4" /> Didaktische Leitgedanken &amp; Schlüsselkonzepte
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.didacticCards.map((dc, idx) => (
                      <div key={idx} className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-xl space-y-1">
                        <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Leitlinie {idx + 1}</span>
                        <h5 className="font-bold text-xs text-text-main">{dc.title}</h5>
                        <p className="text-[11px] text-text-main/75 leading-relaxed">{dc.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TARGET AUDIENCE SECTIONS */}
              {(data.appStudents || data.appProfessionals) && (
                <div className="space-y-3 pt-4 border-t border-home-grau/15">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-main/60 flex items-center gap-1.5">
                    <GraduationCap className="text-indigo-600 w-4 h-4" /> Zielgruppen &amp; Praxis-Eignung
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.appStudents && (
                      <div className="p-4 bg-indigo-50/35 border border-indigo-100/60 rounded-xl space-y-1.5">
                        <h5 className="font-bold text-xs text-indigo-900 flex items-center gap-1">
                          Für Studierende &amp; Lehre
                        </h5>
                        <p className="text-[11px] text-indigo-950/80 leading-relaxed">
                          {data.appStudents}
                        </p>
                      </div>
                    )}
                    {data.appProfessionals && (
                      <div className="p-4 bg-slate-50 border border-home-grau/25 rounded-xl space-y-1.5">
                        <h5 className="font-bold text-xs text-slate-900 flex items-center gap-1">
                          Für Planer &amp; Bauingenieure
                        </h5>
                        <p className="text-[11px] text-slate-800 leading-relaxed">
                          {data.appProfessionals}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'ueberblick' && (
            <ModuleOverviewView groupKey={normalizedGroup} />
          )}

          {activeSection === 'inhalte' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                  <BookOpen className="text-shiraz w-5 h-5" />
                  Gliederung der Lehrthemen &amp; Inhalte
                </h3>
                <p className="text-sm text-text-main/80">
                  Die Strukturierung dieses Fachbereichs deckt die folgenden relevanten mathematischen, normativen oder physikalisch-chemischen Ausprägungen ab:
                </p>
              </div>

              {/* ITERATING SUBMODULE DESCRIPTIONS */}
              {/* No scrollbars here, using natural high-contrast grid so it page-scrolls safely */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.submodules.map((m, idx) => {
                  const SubIcon = m.icon;
                  return (
                    <div key={idx} className="p-4 bg-white border border-home-grau/25 rounded-xl space-y-3 hover:shadow-md transition-all flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 border-b border-home-grau/15 pb-2 mb-1.5">
                          <SubIcon size={16} className="text-shiraz shrink-0" />
                          <h4 className="font-bold text-sm text-text-main line-clamp-1">{m.title}</h4>
                        </div>
                        <p className="text-[11px] text-text-main/80 leading-relaxed">
                          <strong className="text-text-main font-semibold">Zweck:</strong> {m.purpose}
                        </p>
                        {m.standards && (
                          <div className="text-[10px] text-indigo-700 bg-indigo-50/50 border border-indigo-100/50 px-2.5 py-1 rounded w-fit font-medium">
                            <span className="font-semibold">Regelwerk:</span> {m.standards}
                          </div>
                        )}
                        {m.useCase && (
                          <div className="text-[10px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/50 leading-relaxed transition-all">
                            <strong className="font-semibold text-slate-700 block mb-0.5">Praxis-Einsatz:</strong>
                            {m.useCase}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Standardisierter Druck-Fußzeilen-Bereich */}
              <div className="hidden print-footer">
                <span className="font-bold">Quelle: BaustoffBoard (TH Augsburg)</span>
                <span className="font-semibold">Version: 2.11.0</span>
                <span>Gedruckt am: {new Date().toLocaleString('de-DE', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })} Uhr</span>
              </div>

            </div>
          )}

          {activeSection === 'weiterfuehrend' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                  <Compass className="text-shiraz w-5 h-5" />
                  Umfangreiche wissenschaftliche Ressourcen &amp; Fachpublikationen
                </h3>
                <p className="text-sm text-text-main/80 leading-relaxed">
                  Dieses Fachmodul greift auf anerkannte, unabhängige Quellen zurück. Nachfolgend finden Sie verifizierte Portale, wissenschaftliche Fachliteratur, referenzierte Aufsätze sowie akademische Dissertationen der Baustoffwissenschaften.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* WEBSITES */}
                <div className="bg-slate-50/50 rounded-xl p-5 border border-home-grau/25 space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
                      <Globe className="text-rose-600 w-4 h-4 shrink-0" />
                      Unabhängige Verbände &amp; Fachportale
                    </h4>
                    <p className="text-xs text-text-main/70 leading-relaxed pt-1 mb-3">
                      Direkt zugängliche, neutrale Fachinhalte und Schriftenreihen für Lehre und Ingenieurpraxis.
                    </p>
                    <ul className="space-y-2.5">
                      {resources.websites.map((web, idx) => (
                        <li key={idx} className="text-xs">
                          <a href={web.url} target="_blank" rel="noopener noreferrer" className="font-bold text-shiraz hover:underline flex items-center gap-1">
                            {web.name} <span className="text-[10px]">↗</span>
                          </a>
                          <span className="text-text-main/70 block mt-0.5">{web.desc}</span>
                        </li>
                      ))}
                      {resources.websites.length === 0 && (
                        <li className="text-xs text-text-main/50 italic">Keine Fachportale direkt gelistet.</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* TEXTBOOKS */}
                <div className="bg-slate-50/50 rounded-xl p-5 border border-home-grau/25 space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
                      <BookOpen className="text-indigo-600 w-4 h-4 shrink-0" />
                      Wissenschaftliche Monografien &amp; Lehrbücher
                    </h4>
                    <p className="text-xs text-text-main/70 leading-relaxed pt-1 mb-3">
                      In Bibliotheken etablierte Standardwerke zur vertiefenden wissenschaftlichen Einarbeitung.
                    </p>
                    <ul className="space-y-3 text-xs leading-relaxed text-text-main/80">
                      {resources.books.map((book, idx) => (
                        <li key={idx}>
                          <strong>{book.title}</strong>
                          <span className="block text-[11px] text-text-main/60 mt-0.5">{book.desc}</span>
                        </li>
                      ))}
                      {resources.books.length === 0 && (
                        <li className="text-xs text-text-main/50 italic">Keine Lehrbücher gelistet.</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* SCIENTIFIC PUBLICATIONS */}
                <div className="bg-slate-50/50 rounded-xl p-5 border border-home-grau/25 space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
                      <FileText className="text-emerald-600 w-4 h-4 shrink-0" />
                      Wissenschaftliche Fachaufsätze (Peer-Reviewed)
                    </h4>
                    <p className="text-xs text-text-main/70 leading-relaxed pt-1 mb-3">
                      Internationale wissenschaftliche Publikationen in namhaften Forschungsjournals.
                    </p>
                    <ul className="space-y-3 text-xs">
                      {resources.publications.map((pub, idx) => (
                        <li key={idx}>
                          <span className="font-bold text-emerald-800 block">{pub.journal}</span>
                          <span className="text-[11px] leading-relaxed text-text-main/70 mt-0.5">&quot;{pub.title}&quot; {pub.desc && `— ${pub.desc}`}</span>
                        </li>
                      ))}
                      {resources.publications.length === 0 && (
                        <li className="text-xs text-text-main/50 italic">Keine Publikationsarbeiten aufgezeichnet.</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* DISSERTATIONS */}
                <div className="bg-slate-50/50 rounded-xl p-5 border border-home-grau/25 space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
                      <GraduationCap className="text-amber-600 w-4 h-4 shrink-0" />
                      Dissertationen &amp; Forschungsberichte
                    </h4>
                    <p className="text-xs text-text-main/70 leading-relaxed pt-1 mb-3">
                      Über deutsche Universitätsbibliotheken offen zugängliche Promotionsschriften und Berichte.
                    </p>
                    <ul className="space-y-3 text-xs leading-relaxed text-text-main/80">
                      {resources.dissertations.map((diss, idx) => (
                        <li key={idx}>
                          <strong>{diss.title}</strong>
                          <span className="block text-[11px] text-text-main/60 mt-0.5">{diss.desc}</span>
                        </li>
                      ))}
                      {resources.dissertations.length === 0 && (
                        <li className="text-xs text-text-main/50 italic">Keine Dissertationen gelistet.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'klassifizierung' && normalizedGroup === 'baustoffe' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* WIKIPEDIA BAUSTOFF-RECHERCHE UND KLASSIFIZIERUNG */}
              <div className="bg-slate-50 border border-slate-300/80 p-6 rounded-xl text-left">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="text-shiraz" size={22} />
                  <h3 className="text-lg font-bold text-slate-800">Baustoff-Klassifizierung (Wikipedia-Recherche)</h3>
                </div>
                <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                  Basierend auf der Wikipedia-Enzyklopädie für <strong>Baustoffe</strong> haben wir alle dort klassifizierten Materialarten analysiert und im BaustoffBoard zwecks interaktiver Lehre integriert. Klicken Sie auf einen Baustoff, um direkt in das entsprechende Fachbereichsmodul zu springen:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Kolonne 1: Anorganische Baustoffe */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-1.5">
                      1. Anorganische Baustoffe
                    </h4>
                    
                    {/* Mineralisch */}
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                      <span className="text-xs font-bold text-slate-800 block mb-2">A. Mineralische Baustoffe & Bindemittel</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { name: "Natursteine", tab: "gesteine" },
                          { name: "Lehm & Tone", tab: "lehm" },
                          { name: "Ziegel & Klinker", tab: "mauerwerk" },
                          { name: "KS / Porenbeton", tab: "mauerwerk" },
                          { name: "Zement & Kalk", tab: "bindemittel" },
                          { name: "Gips & Anhydrit", tab: "gips" },
                          { name: "Mörtel & Putze", tab: "putzemoertel" },
                          { name: "Betonprodukte", tab: "betonpraxis" },
                          { name: "Flachglas & ESG", tab: "glas" }
                        ].map((m) => (
                          <button
                            key={m.name}
                            onClick={() => setActiveTab(m.tab as any)}
                            className="text-[11px] bg-slate-100 hover:bg-shiraz/10 border border-slate-250 hover:border-shiraz/40 text-slate-700 hover:text-shiraz py-1 px-2 rounded-md font-medium transition-all cursor-pointer whitespace-nowrap"
                          >
                            {m.name} ✓
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Metallisch */}
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                      <span className="text-xs font-bold text-slate-800 block mb-2">B. Metallische Baustoffe</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { name: "Baustahl", tab: "stahl" },
                          { name: "Bewehrungsstahl", tab: "korrosion" },
                          { name: "Gusseisen", tab: "metalle" },
                          { name: "Aluminium", tab: "metalle" },
                          { name: "Zink & Kupfer", tab: "metalle" },
                          { name: "Blei & Titan", tab: "metalle" }
                        ].map((m) => (
                          <button
                            key={m.name}
                            onClick={() => setActiveTab(m.tab as any)}
                            className="text-[11px] bg-slate-100 hover:bg-shiraz/10 border border-slate-250 hover:border-shiraz/40 text-slate-700 hover:text-shiraz py-1 px-2 rounded-md font-medium transition-all cursor-pointer whitespace-nowrap"
                          >
                            {m.name} ✓
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Kolonne 2: Organische, Verbundstoffe & Biologisch-Lebendig */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-1.5">
                      2. Organische, Verbundwerkstoffe & Myzel
                    </h4>

                    {/* Organische */}
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                      <span className="text-xs font-bold text-slate-800 block mb-2">A. Organische Baustoffe</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { name: "Bauschnittholz", tab: "holz" },
                          { name: "BSH & CLT Werkstoffe", tab: "holzwerkstoffe" },
                          { name: "Bitumen & Asphalt", tab: "asphalt" },
                          { name: "Duro- & Thermoplaste", tab: "kunststoffe" },
                          { name: "Stroh & Hanf dämmung", tab: "daemmstoffe" },
                          { name: "Kork & Naturfasern", tab: "weitere_organik" }
                        ].map((m) => (
                          <button
                            key={m.name}
                            onClick={() => setActiveTab(m.tab as any)}
                            className="text-[11px] bg-slate-100 hover:bg-shiraz/10 border border-slate-250 hover:border-shiraz/40 text-slate-700 hover:text-shiraz py-1 px-2 rounded-md font-medium transition-all cursor-pointer whitespace-nowrap"
                          >
                            {m.name} ✓
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Verbundwerkstoffe */}
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                      <span className="text-xs font-bold text-slate-800 block mb-2">B. Verbundwerkstoffe (Composites)</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { name: "Stahlbeton", tab: "labor" },
                          { name: "Carbonbeton", tab: "carbonbeton" },
                          { name: "Faserverbund (FVK)", tab: "faserverbund" },
                          { name: "Spannbeton", tab: "spannbeton" },
                          { name: "Gipskartonplatten", tab: "bp_trockenbau" }
                        ].map((m) => (
                          <button
                            key={m.name}
                            onClick={() => setActiveTab(m.tab as any)}
                            className="text-[11px] bg-slate-100 hover:bg-shiraz/10 border border-slate-250 hover:border-shiraz/40 text-slate-700 hover:text-shiraz py-1 px-2 rounded-md font-medium transition-all cursor-pointer whitespace-nowrap"
                          >
                            {m.name} ✓
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Living / Innovativ */}
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                      <span className="text-xs font-bold text-slate-800 block mb-2">C. „Lebende“ &amp; Bio-Baustoffe</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { name: "Weidenrute Baubotanik", tab: "weitere_organik" },
                          { name: "Pilzmyzel Dämmplatten", tab: "weitere_organik" },
                          { name: "Bakterieller Bio-Beton", tab: "innovative_werkstoffe" }
                        ].map((m) => (
                          <button
                            key={m.name}
                            onClick={() => setActiveTab(m.tab as any)}
                            className="text-[11px] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 py-1 px-2 rounded-md font-medium transition-all cursor-pointer whitespace-nowrap"
                          >
                            {m.name} ✓
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'historie' && (
            <div className="animate-in fade-in duration-300">
              {historyData ? (
                <ModuleHistoryView history={historyData} />
              ) : (
                <div className="bg-white p-6 rounded-2xl border border-home-grau/30 text-center text-sm text-text-main/70">
                  Keine historische Chronik für diesen Bereich hinterlegt.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ModuleFooter 
        wikipedia={data.wikipedia}
        literatur={data.literatur}
        regelwerke={data.regelwerke}
        formeln={data.formeln}
      />
    </div>
  );
}
