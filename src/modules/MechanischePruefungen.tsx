import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  Layers, 
  Flame, 
  Hammer, 
  Trees, 
  BookOpen, 
  Calculator, 
  Activity, 
  Info, 
  CheckCircle2, 
  RefreshCw, 
  TrendingUp, 
  ShieldAlert, 
  FileText,
  Boxes
} from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { InlineMath } from 'react-katex';

// Define categories of building materials
type MaterialCategory = 'beton_mineralisch' | 'asphalt_bituminoes' | 'stahl_metalle' | 'holz_organisch';

interface TestDetail {
  id: string;
  title: string;
  subtitle: string;
  norm: string;
  material: string;
  proben: string;
  durchfuehrung: string;
  ergebnisse: string;
  kennwerte: string[];
}

export default function MechanischePruefungen() {
  const [activeCategory, setActiveCategory] = useState<MaterialCategory>('beton_mineralisch');
  
  // Active test selection within each category
  const [activeTestMap, setActiveTestMap] = useState<Record<MaterialCategory, string>>({
    beton_mineralisch: 'druck_festigkeit',
    asphalt_bituminoes: 'spaltzug_asphalt',
    stahl_metalle: 'zugversuch_stahl',
    holz_organisch: 'biegeholz'
  });

  const activeTestId = activeTestMap[activeCategory];

  // Map of category-specific definitions and essential test specifications
  const testDirectory: Record<MaterialCategory, TestDetail[]> = {
    beton_mineralisch: [
      {
        id: 'druck_festigkeit',
        title: 'Druckfestigkeitsprüfung (Beton)',
        subtitle: 'Zerstörende Hauptprüfung zur Festigkeits klassifizierung',
        norm: 'DIN EN 12390-3 (Druckfestigkeit von Probekörpern) & DIN EN 12504-1 (Bohrkerne)',
        material: 'Frisch- und Festbeton aller Druckfestigkeitsklassen (z. B. Normal-, Leicht- und Schwerbeton sowie UHPC) zur Bauqualitätskontrolle.',
        proben: 'Standardwürfel (Kantenlänge 150 mm), Zylinder ($d = 150\\text{ mm}$, $h = 300\\text{ mm}$) oder ausgebohrte Bauwerksbohrkerne ($d \\ge 100\\text{ mm}$). Die Stirnauflagen müssen perfekt planparallel geschliffen oder mit Schwefelleim gekappt sein.',
        durchfuehrung: 'Lagerung der Proben in Wasserbädern bei $20 \\pm 2\\text{ }^\\circ\\text{C}$ bis zur Prüfung (meist nach 28 Tagen). Einlegen des feuchten Körpers in eine normierte Betonpresse. Spannungsgesteuerte, stoßfreie Laststeigerung mit $0.5 \\pm 0.2\\text{ MPa/s}$ ($N/\\text{mm}^2\\cdot\\text{s}$) bis zum Bruchversagen des Körpers.',
        ergebnisse: 'Aufzeichnung der maximalen Bruchlast $F$ in kN. Berechnung der Druckfestigkeit: $f_c = F / A_c$ in $\\text{N/mm}^2$ (MPa). Bewertung des spezifischen Bruchbildes zur Fehleranalyse (z. B. fehlerhaftes Taumelgelenk der Druckplatte oder exzentrische Krafteinleitung).',
        kennwerte: ['Druckfestigkeit $f_c$ [MPa]', 'Bruchkraft $F_{max}$ [kN]', 'In-Situ äquivalente Würfelfestigkeit']
      },
      {
        id: 'biegezug_beton',
        title: 'Biegezugprüfung (Nicht bewehrter Balken)',
        subtitle: 'Tragfähigkeitsnachweis für Decken, Pflasterungen und Industriefußböden',
        norm: 'DIN EN 12390-5 (Prüfung von Festbeton - Biegezugfestigkeit)',
        material: 'Unbewehrter Normal- und Faserbeton, d. h. Industrieböden, Betonbahnen des Straßenbaus oder Betonfertigteile.',
        proben: 'Balkenprismen mit den Maßen $100 \\times 100 \\times 500\\text{ mm}$ oder $150 \\times 150 \\times 700\\text{ mm}$. Feuchtgelagert bei $20\\text{ }^\\circ\\text{C}$.',
        durchfuehrung: 'Lagerung im Wasserbad. Durchführung als 4-Punkt-Belastung (Zwei gleich große Lasten in den Drittelspunkten der Stützweite) oder als 3-Punkt-Belastung (eine Einzellast exakt in der Mitte). Gleichmäßige Laststeigerung mit einer Spannungsrate von $0.05 \\pm 0.02\\text{ MPa/s}$ bis zum plötzlichen Rissdurchbruch.',
        ergebnisse: 'Bestimmung der Biegezugfestigkeit. Die Formel für 4-Punkt-Biegung lautet: $f_{cf} = \\frac{F \\cdot I}{d_1 \\cdot d_2^2}$ und für 3-Punkt-Biegung: $f_{cf} = \\frac{3 \\cdot F \\cdot I}{2 \\cdot d_1 \\cdot d_2^2}$ ($F$: Höchstlast [N], $I$: Stützweite [mm], $d_1, d_2$: Querschnittsmaße [mm]).',
        kennwerte: ['Biegezugfestigkeit $f_{cf}$ [MPa]', 'Vierpunkt- vs. Dreipunktkennwert', 'Risslinienverlauf']
      },
      {
        id: 'spaltzug_beton',
        title: 'Spaltzugfestigkeitsprüfung',
        subtitle: 'Indirekte Zugfestigkeitsbestimmung des Betons',
        norm: 'DIN EN 12390-6 (Prüfung von Festbeton - Spaltzugfestigkeit)',
        material: 'Beton-Zylinder oder Würfel zur Ermittlung des Risswiderstandes unter Spaltzugspannungen.',
        proben: 'Betonzylinder mit Durchmesser $150\\text{ mm}$ und Gesamtlänge $300\\text{ mm}$. Alternativ können auch Würfel über Keilelemente linienförmig belastet werden.',
        durchfuehrung: 'Der Zylinder wird liegend in das Belastungsgestell eingebracht. Zwischen den planen Platten der Prüfmaschine und dem Mantel des Zylinders werden dünne, dämpfende Druckzulageleisten (Kiefernholz oder Pappe) eingelegt. Belastung mit einer konstanten Spannungsrate von $0.04 \\pm 0.01\\text{ MPa/s}$ bis zur diagonalen Längsspaltung.',
        ergebnisse: 'Bestimmung der Spaltzugfestigkeit: $f_{ct} = \\frac{2 \\cdot F}{\\pi \\cdot L \\cdot d}$ in $\\text{N/mm}^2$ ($F$: Höchstlast [N], $L$: Zylinderlänge [mm], $d$: Durchmesser [mm]). Die wahre axiale Zugfestigkeit beträgt näherungsweise $f_{ct} \\approx 0.9 \\cdot f_{ct,spalt}$.',
        kennwerte: ['Spaltzugfestigkeit $f_{ct}$ [MPa]', 'Zug-Druckfestigkeitsverhältnis (meist ca. 1:10)', 'Holzabbild-Druckmarke']
      }
    ],
    asphalt_bituminoes: [
      {
        id: 'spaltzug_asphalt',
        title: 'Asphaltbohrkerne - Spaltzugversuch',
        subtitle: 'Beurteilung des Widerstandes gegen Verformungen & Kälterisse',
        norm: 'DIN EN 12697-23 (Prüfverfahren für Heißasphalt - Teil 23: Indirekter Zugversuch)',
        material: 'Heißasphalt-Formmischungen und Bestandsproben (Asphaltdeckschichten, Asphalttragschichten) zur Prognose der Spurrinnenstabilität.',
        proben: 'Ausgebohrte Fahrbahn-Zylinder oder Labor-Prüfkörper mit Nenndurchmesser $100\\text{ mm}$ oder $150\\text{ mm}$. Exakt rechtwinklig geschnittene Stirnflächen.',
        durchfuehrung: 'Vollständige Vortemperierung auf die festgelegte Prüftemperatur ($15\\text{ }^\\circ\\text{C}$ oder $25\\text{ }^\\circ\\text{C}$) im klimatisierten Wasserbad oder Ofen für mind. 4 Std. Belastung liegend über standardisierte Lastelemente. Vorschubgeschwindigkeit weggesteuert mit konstant $50 \\pm 2\\text{ mm/min}$ bis zur Probenzerteilung.',
        ergebnisse: 'Ermittlung der maximalen Spaltzugkraft $P$ in kN. Berechnung der Asphalt-Spaltzugfestigkeit: $S_t = \\frac{2 \\cdot P}{\\pi \\cdot D \\cdot H}$ in MPa ($D$: Durchmesser [mm], $H$: Zylinderdicke/Höhe [mm]). Hohe Werte deuten auf elastische Bindemittel und guten Korngerüst-Verband.',
        kennwerte: ['Spaltzugfestigkeit $S_t$ [MPa]', 'Maximallast $P$ [kN]', 'Temperaturabhängigkeit des Verformungswiderstandes']
      },
      {
        id: 'marshall_stabilitat',
        title: 'Marshall-Stabilität & Fließwert',
        subtitle: 'Volumetrische Optimierung des Heißasphalt-Mischguts',
        norm: 'DIN EN 12697-34 (Prüfverfahren für Heißasphalt - Teil 34: Marshall-Prüfung)',
        material: 'Walzasphaltmischgut für Deck- und Tragschichten zur optimalen Bestimmung des Bindemittelgehalts.',
        proben: 'Zylindrische Asphaltproben ($d = 101.6\\text{ mm}$, $h = 63.5\\text{ mm}$), im Labor durch das normgerechte mechanische Schlag-Verdichtungsgerät (2 x 50 Schläge) kompaktiert.',
        durchfuehrung: 'Die Probekörper verweilen exakt 30 bis 40 Minuten im temperaturgeregelten Wasserbad bei exakt $60 \\pm 1\\text{ }^\\circ\\text{C}$ (Simulation extremer sommerlicher Deckenschichten). Schnellstmögliches Einspannen in die halbrunde, vorgewärmte Marshall-Schale (Entnahme bis Lastspitze maximal 30 Sekunden). Hubgeschwindigkeit der Presse $50.8\\text{ mm/min}$ bis zum Versagen.',
        ergebnisse: 'Hauptwerte: 1) Marshall-Stabilität $S$ (maximale gemessene Druckfestigkeit in kN). 2) Fließwert $F$ (Stauchungsverformung des Zylinders bis zur Lastspitze in $0.1\\text{ mm}$ Schritten). 3) Marshall-Quotient $Q = S/F$ in kN/mm als Kriterium des Tragwiderstandes gegen dauerhafte Verformung unter stehendem Radverkehr.',
        kennwerte: ['Marshall-Stabilität $S$ [kN]', 'Fließwert $F$ [mm]', 'Marshall-Quotient $S/F$ [kN/mm]']
      },
      {
        id: 'spurrinnen_asphalt',
        title: 'Spurrinnenprüfung (Spurbildungsversuch)',
        subtitle: 'Simulationsprüfung für den Verformungswiderstand im Sommer',
        norm: 'DIN EN 12697-22 (Prüfverfahren für Heißasphalt - Teil 22: Spurbildungstest)',
        material: 'Hochbelastetes Asphaltmischgut (z. B. Asphaltbeton AC, Splittmastixasphalt SMA) zur Absicherung des Spurrinnenwiderstandes.',
        proben: 'Flache Asphaltplatten mit den Maßen $300 \\times 300\\text{ mm}$ und Schichtdicke meist $40\\text{ bis }80\\text{ mm}$ (wahlweise Bohrkerne mit großem Durchmesser d = 300 mm). Platten werden mit Segment-Walzenverdichtern ähnlich der realen Baustellenverdichtung hergestellt.',
        durchfuehrung: 'Klimatisierung im Umluftprüfschrank bei $50\\text{ }^\\circ\\text{C}$ oder $60\\text{ }^\\circ\\text{C}$ Lufttemperatur. Kontinuierlicher Radübergang auf der Asphaltoberfläche unter Last: Ein gummicovertes Rad übt eine Vertikal-Sollkraft von $700 \\pm 10\\text{ N}$ aus und bewegt sich im Hin- und Hergang mit $26.5\\text{ Zyklen pro Minute}$. Prüfdauer standardmäßig $10.000\\text{ Zyklen}$ (20.000 Lastüberrollungen).',
        ergebnisse: 'Aufzeichnung der kontinuierlichen Einsinktiefe des Rads über Wegaufnehmer. Berechnet werden die Spurrinnentiefe nach Abschluss des Versuchs (in mm) sowie die Spurbildungsrate (Verformungssteigung im stabilen, sekundären Bereich) $WTS_{air}$ in mm pro 1000 Belastungshübe.',
        kennwerte: ['Spurrinnentiefe nach 10.000 Zyklen [mm]', 'Spurbildungsrate $WTS_{air}$ [mm/1000 Zyklen]', 'Standardisierte visuelle Platteneindrückung']
      }
    ],
    stahl_metalle: [
      {
        id: 'zugversuch_stahl',
        title: 'Einaxialer Zugversuch an Stahl',
        subtitle: 'Grundlegende mechanische Werkstoffprüfung zur Baustahl-Charakterisierung',
        norm: 'DIN EN ISO 6892-1 (Zugversuch an metallischen Werkstoffen) & DIN 488 (Betonstahl)',
        material: 'Betonstahl-Rippenstäbe, Baustähle (z. B. S235, S355), Gewindestangen und Spanndraht.',
        proben: 'Unbehandelte Stahlstababschnitte im Originallieferzustand (Betonstahl) oder abgedrehte Rundproben mit definierter Anfangsmesslänge $L_0 = 5 \\cdot d_0$ (bzw. $5.65 \\sqrt{S_0}$ für Flachproben).',
        durchfuehrung: 'Einspannen in die hydraulischen Spannbacken eines Universal-Zugprüfstands. Montage des Feindehnungsmessers (Extensometer). Kontinuierliche Dehnungserhöhung: Dehnungsrate von ca. $0.00025\\text{ s}^{-1}$ im elastischen Bereich (Streckgrenze) und ca. $0.002\\text{ s}^{-1}$ im plastischen Fließ- und Verfestigungsbereich bis zum plötzlichen Zerreißbruch.',
        ergebnisse: 'Erfassung des gesamten Kraft-Weg-Verlaufs. Berechnete Kennwerte: \n1) Obere Streckgrenze $R_{eH}$ bzw. 0,2%-Dehngrenze $R_{p0.2}$ ($R_{e} = F_e / S_0$). \n2) Zugfestigkeit $R_m = F_{max} / S_0$. \n3) Bruchdehnung $A_5$ oder $A_{10}$ [%]. \n4) Elastizitätsmodul $E$. \n5) Streckgrenzenverhältnis $R_m/R_e$ (sehr wichtig für die Beurteilung der plastischen Verformungsreserve bei Erdbebeneinwirkungen).',
        kennwerte: ['Streckgrenze $R_e$ (bzw. $R_{p0.2}$) [MPa]', 'Zugfestigkeit $R_m$ [N/mm²]', 'Duktilitsklasse (A: Normalduktil, B: Hochduktil, C: Erdbebenduktil)', 'Bruchdehnung $A$ [%]']
      },
      {
        id: 'kerbschlag_charpy',
        title: 'Kerbschlagbiegeversuch',
        subtitle: 'Zähigkeitsprüfung zur Metallsprödbruchabsicherung bei Tiefsttemperaturen',
        norm: 'DIN EN ISO 148-1 (Kerbschlagbiegeversuch nach Charpy an Metallen)',
        material: 'Strukturelle Baustähle der Brückenoberbauten, Schweißverbindungen und dicke Walzprofile zur Absicherung gegen spröde Gewaltbrüche.',
        proben: 'Rechteckprismen mit den Maßen $10 \\times 10 \\times 55\\text{ mm}$ mit mittig eingestoßener V-Kerbe (Kerbtiefe $2\\text{ mm}$, Flankenwinkel $45^\\circ$, Rundungsradius $0.25\\text{ mm}$ am Kerbgrund).',
        durchfuehrung: 'Vorkonditionierung der Probe auf Solltemperatur (z. B. $-20\\text{ }^\\circ\\text{C}$ in Kältebädern). Platzierung der eiskalten Probe auf den Auflagern des schweren Pendelschlagwerks. Auslösen des Pendelhammers: Das rotierende Messer des Hammers zerschlägt die gekerbte Seite der Stahlprobe. Der Hammer schwingt darüber hinaus; über die mechanische Schleppzeigerauslenkung wird die Restenergie bestimmt.',
        ergebnisse: 'Bestimmung der verbrauchten Schlagarbeit $K_V$ (oder $K_U$) in Joule [$J$]. Für den Tragwerksbereich wird nach Eurocode 3 typischerweise eine Mindestschlagarbeit von $27 \\text{ Joule}$ bei einer definierten Referenztemperatur (z. B. $-20\\text{ }^\\circ\\text{C}$ bei S355J2) gefordert.',
        kennwerte: ['Kerbschlagarbeit $K_v$ [J]', 'Sprödbruch-Übergangstemperatur', 'Bruchflächenanalyse (Wabenbruch / Spaltbruch)']
      },
      {
        id: 'biegebruch_stahl',
        title: 'Biege- & Rückbiegeversuch (Betonstahl)',
        subtitle: 'Plastizitätsprüfung für Schütt- und Abbiegefähigkeit vor Ort',
        norm: 'DIN EN ISO 15630-1 / DIN 488-2',
        material: 'Gerippter Betonstahl im Anlieferzustand zur Absicherung gegen Biegerissbildung beim Formen von Anschlussbewehrungen.',
        proben: 'Betonstahlstababschnitt von mindestens $250\\text{ mm}$ Länge.',
        durchfuehrung: 'Das Stabstück wird auf zwei Rollenlager aufgelegt. Ein Dorn mit normgerechtem Mindest-Durchmesser $D$ (z. B. $D = 4d$ oder $D = 5d$, abhängig vom Stabdurchmesser $d$) drückt den Stab stetig um einen Winkel von exakt $90^\\circ$. Anschließend wird der verformte Stab bei $100\\text{ }^\\circ\\text{C}$ für 30 Minuten einer künstlichen Temperaturalterung unterzogen und nach dem Abkühlen um einen Winkel von min. $20^\\circ$ zurückgebogen.',
        ergebnisse: 'Reine visuelle Abnahmebeurteilung über qualifiziertes Prüfpersonal. Auf der beanspruchten Zugseite dürfen keine Mikrorisse, Schuppenbildung oder gar makroskopische Anbrüche auftreten (Kriterium: Bestanden / Nicht Bestanden).',
        kennwerte: ['Keine Rissbildung an der Zugfaser (Bestanden)', 'Dornverhältnis $D/d$ nach Durchmesserklasse', 'Prüf-Rückbiegewinkel']
      }
    ],
    holz_organisch: [
      {
        id: 'biegeholz',
        title: 'Biegeprüfung & E-Modul an Holz',
        subtitle: 'Charakteristische Elastizität & Tragfähigkeit nach Holzklassen',
        norm: 'DIN EN 408 (Holzbauwerke - Bestimmung physischer und mechanischer Eigenschaften)',
        material: 'Bauholz, Konstruktionsvollholz (KVH), Brettschichtholz (BSH) sowie plattenförmige Holzwerkstoffe.',
        proben: 'Prismatischer Träger mit Mindestquerschnitt $50 \\times 50\\text{ mm}$ und Gesamtlänge entsprechend der Stützweite ($L = 19 \\cdot h$, Stützabstand $18 \\cdot h$). Proben müssen laut Norm im Klima $20\\text{ }^\\circ\\text{C} / 65\\%\\text{ r.F.}$ auf stabile Ausgleichsfeuchte ($\u2248 12\\%$) konditioniert werden.',
        durchfuehrung: 'Einbau über drehbare Kipplager auf dem Prüfstand. Die Krafteinleitung erfolgt standardmäßig im Drittelpunkt der Stützweite (4-Punkt-Biegung) zur Vermeidung von Querkraftüberlagerung im mittleren Segment. Stetiger Vorschub, so dass das totale Bauteilversagen innerhalb von $300 \\pm 120\\text{ Sekunden}$ erreicht ist. Erfassung von Rissstart, Durchbiegungsverlauf und Bruchlast.',
        ergebnisse: 'Ermittlung: \n1) Biegefestigkeit: $f_m = \\frac{3 \\cdot F \\cdot a}{w \\cdot h^2}$ in MPa ($a$: Abstand Auflager zu Lastpunkt, $w$: Trägerbreite, $h$: Trägerhöhe). \n2) Lokaler und globaler Elastizitätsmodul $E_{m,g}$ über Verformungsmessungen im unbelasteten Mittelfeld.',
        kennwerte: ['Biegefestigkeit $f_m$ [MPa]', 'Biegungs-E-Modul $E_{m,g}$ [N/mm²]', 'Jahrringbreite und Faserwinkelcharakterstik']
      },
      {
        id: 'druckholz',
        title: 'Druckprüfung parallel zur Faser',
        subtitle: 'Charakteristische Festigkeit für Holzstützen und Tragglieder',
        norm: 'DIN EN 408',
        material: 'Nadel- und Laubholz im Bauzustand zur statischen Leistungsdiagnose.',
        proben: 'Prismen mit quadratischem Querschnitt ($50 \\times 50\\text{ mm}$) und einer Gesamtlänge von $6$-facher Kantenlänge ($h = 300\\text{ mm}$) oder kleine Probenkörper $20 \\times 20 \\times 60\\text{ mm}$ zur fehlerfreien Reinholzprüfung (holzfaserparallel geschnitten).',
        durchfuehrung: 'Vollflächiges Einspannen der planparallel, fehlerfrei zugeschnittenen Hirnholzenden zwischen den Druckplatten der Prüfmaschine. Hubgeschwindigkeit weggesteuert mit einer Stauchungsrate bis zum Kollaps der dünnen röhrenförmigen Holzzellwände (Knickversagen / Abscheren entlang der Faserrichtung).',
        ergebnisse: 'Bestimmung der maximalen Bruchkraft $F$ in kN. Berechnung der Faser-Druckfestigkeit: $f_{c,0} = F / A_0$ in MPa. Starke Abhängigkeit des gemessenen Werts von Holzfeuchte, Rohdichte und Astfreiheit des Bereichs.',
        kennwerte: ['Druckfestigkeit parallel zur Faser $f_{c,0}$ [MPa]', 'Holzfeuchtekorrektur (Darrstufe)', 'Bruchart (Scherbruch / Knickbruch am Hirnholz)']
      },
      {
        id: 'scherklebung',
        title: 'Scherprüfung an Keilzinken / Klebungen',
        subtitle: 'Qualitätssicherung für geklebte Tragwerksholzkonstruktionen',
        norm: 'DIN EN 302-1 (Prüfverfahren für Klebstoffe für tragende Holzbauteile)',
        material: 'Verklebungssysteme für Brettschichtholz, Brettsperrholz (CLT) und Furnierholzverbindungen.',
        proben: 'Standardisierte Buchenholzlamellen mit überlappter Klebefläche ($A_s = 25 \\times 20\\text{ mm} = 500\\text{ mm}^2$). Prüfstücke werden im Normklima oder nach wechselnder Wasserlagerung (Kochprüfungen) geprüft.',
        durchfuehrung: 'Montage der zweischnittigen Überlappungsprobe im axial ausgerichteten Zugprüfzeug. Kontinuierliche Erhöhung der Zugbeanspruchung, wodurch sich eine reine Scherspannung in der Leimfuge einstellt, bis die Probenhälften gewaltsam voneinander abgleiten.',
        ergebnisse: 'Bestimmung der Zugscherfestigkeit: $\\tau = F_{max} / A_s$ in MPa. Wesentlich ist auch die Bestimmung des Faserbruchanteils: Nach dem Scherbruch wird die Bruchfläche visuell beurteilt. Mindestvoraussetzung nach Norm sind zumeist $\\ge 90\\%$ Holzfaserbruch (d. h. der Holzträger versagte faserintern, nicht die Leimfuge an sich).',
        kennwerte: ['Scherfestigkeit $\\tau$ [N/mm²]', 'Prozentualer Holzfaserbruchanteil [%]', 'Einfluss von Feuchtungzyklen']
      }
    ]
  };

  const activeTestDetail = useMemo(() => {
    return testDirectory[activeCategory].find(t => t.id === activeTestId) || testDirectory[activeCategory][0];
  }, [activeCategory, activeTestId]);

  // Handler to switch categories
  const handleCategoryChange = (category: MaterialCategory) => {
    setActiveCategory(category);
  };

  // Handler to switch active tests
  const handleTestChange = (testId: string) => {
    setActiveTestMap(prev => ({ ...prev, [activeCategory]: testId }));
  };

  // --- CALCULATOR STATES & CALCULATIONS ---
  
  // 1. Concrete Core Compressive Strength
  const [concreteDiam, setConcreteDiam] = useState<number>(100);
  const [concreteHeight, setConcreteHeight] = useState<number>(100);
  const [concreteForce, setConcreteForce] = useState<number>(350);
  const [concreteRebars, setConcreteRebars] = useState<number>(0);
  const [boreDirection, setBoreDirection] = useState<'vertikal' | 'horizontal'>('vertikal');

  const concreteRes = useMemo(() => {
    const area = Math.PI * Math.pow(concreteDiam / 2, 2);
    const rawStrength = (concreteForce * 1000) / area; // MPa (N/mm²)
    const aspect = concreteHeight / concreteDiam;

    // Schlankheitskorrektur lambda_aspect (Aspektverhältnis)
    let lambdaAspect = 1.0;
    if (aspect < 2.0) {
      lambdaAspect = 1.0 / (0.8 + 0.2 / aspect); 
    } else if (aspect > 2.0) {
      lambdaAspect = 1.0 - 0.05 * (aspect - 2.0);
    }

    // Bewehrungsfaktor: Jeder querende Stab verringert die Zylinderkraft um ca. 3% (Faustformel nach DIN EN 12504-1)
    const lambdaRebar = 1.0 / (1.0 + 0.035 * concreteRebars);

    // Drilling direction: Horizontale Kerne (quer zur Festbeton-Ausrüstung) besitzen oft geringere Verbunddichte
    const lambdaDirection = boreDirection === 'horizontal' ? 1.085 : 1.0;

    const fcCore = rawStrength * lambdaAspect * lambdaRebar * lambdaDirection;
    const equivalentCylinder = fcCore;
    const equivalentCube = fcCore / 0.83; // Standard MPa-Cube factor

    return {
      area,
      rawStrength,
      aspect,
      fcCore,
      equivalentCylinder,
      equivalentCube
    };
  }, [concreteDiam, concreteHeight, concreteForce, concreteRebars, boreDirection]);

  // 2. Asphalt Testing: Sub-selection & States
  const [asphaltSubTest, setAsphaltSubTest] = useState<'spaltzug' | 'marshall'>('spaltzug');
  
  // A. Asphalt Spaltzug (Indirect tensile)
  const [asphaltDiam, setAsphaltDiam] = useState<number>(100);
  const [asphaltHeight, setAsphaltHeight] = useState<number>(60);
  const [asphaltForce, setAsphaltForce] = useState<number>(16.5);

  const asphaltSt = useMemo(() => {
    const forceN = asphaltForce * 1000;
    const strength = (2 * forceN) / (Math.PI * asphaltDiam * asphaltHeight);
    return strength;
  }, [asphaltForce, asphaltDiam, asphaltHeight]);

  // B. Asphalt Marshall-Stabilität (Stability & Flow)
  const [marshallStability, setMarshallStability] = useState<number>(9.5);
  const [marshallFlow, setMarshallFlow] = useState<number>(3.2);

  const marshallQuotient = useMemo(() => {
    return marshallStability / marshallFlow; // kN/mm
  }, [marshallStability, marshallFlow]);

  // 3. Metall/Stahl Tensile Test
  const [steelDiam, setSteelDiam] = useState<number>(12); // Nominaldifferenz
  const [steelForceYield, setSteelForceYield] = useState<number>(58.0); // kN at Re
  const [steelForceUltimate, setSteelForceUltimate] = useState<number>(71.5); // kN at Rm
  const [steelLength0, setSteelLength0] = useState<number>(100); // mm iniziale
  const [steelLengthU, setSteelLengthU] = useState<number>(115); // mm frattura

  const steelRes = useMemo(() => {
    const area = Math.PI * Math.pow(steelDiam / 2, 2); // mm²
    const yieldStrength = (steelForceYield * 1000) / area; // MPa (N/mm²)
    const ultimateStrength = (steelForceUltimate * 1000) / area; // MPa (N/mm²)
    const ratio = ultimateStrength / yieldStrength;
    const elongation = ((steelLengthU - steelLength0) / steelLength0) * 100; // %

    // Evaluate steel compliance (e.g. Standard B500B Betonstahl)
    const yieldPassed = yieldStrength >= 500;
    const ratiosPassed = ratio >= 1.08 && ratio <= 1.35; // Hochduktil standard
    const elongationPassed = elongation >= 10.0; // Typical total elongation criteria

    let complianceClass = 'Nicht konform';
    if (yieldStrength >= 500 && ratio >= 1.08 && elongation >= 10) {
      complianceClass = 'Klasse B (Hochduktil, konform nach DIN 488)';
    } else if (yieldStrength >= 500 && ratio >= 1.05 && elongation >= 2.5) {
      complianceClass = 'Klasse A (Normalduktil, konform nach DIN 488)';
    }

    return {
      area,
      yieldStrength,
      ultimateStrength,
      ratio,
      elongation,
      complianceClass,
      yieldPassed,
      ratiosPassed,
      elongationPassed
    };
  }, [steelDiam, steelForceYield, steelForceUltimate, steelLength0, steelLengthU]);

  // 4. Wood Estimator parallel & bending
  const [woodDensity, setWoodDensity] = useState<number>(0.46); // g/cm³
  const [woodMoisture, setWoodMoisture] = useState<number>(12); // %
  const [woodWidth, setWoodWidth] = useState<number>(50); // mm
  const [woodHeight, setWoodHeight] = useState<number>(100); // mm
  const [woodSpan, setWoodSpan] = useState<number>(1800); // mm
  const [woodBendingForce, setWoodBendingForce] = useState<number>(6.5); // kN

  const woodRes = useMemo(() => {
    // Basic estimates for Spruce/Nadelholz: Empirische Skalierung
    const fc0_base = 90 * woodDensity - 3; // MPa bei 12% Holzfeuchte

    // Holzfeuchte-Veränderungsbeiwert: Jedes % Feuchte über 12% mindert Festigkeit um ca. 3.5%
    const moistureFactor = 1.0 - 0.035 * (woodMoisture - 12);
    const fc0_actual = fc0_base * moistureFactor;

    // Biegefestigkeit fm = 1.5 * F * a / (w * h²) [MPa]
    // Bei 3-Punkt-Biegung (Zentrallast): a = L / 2 -> fm = 1.5 * F * (L/2) / (w * h²) = 3/4 * F * L / (w * h²)
    const forceN = woodBendingForce * 1000;
    const f_bending = (1.5 * forceN * (woodSpan / 2)) / (woodWidth * Math.pow(woodHeight, 2));

    // E-Modul Schätzung nach EN 338: scales statically with density & dampening
    const e_modul = 25000 * woodDensity * moistureFactor; // MPa (N/mm²)

    // Holzfestigkeitsklasse schätzen
    let strengthClassName = 'C16';
    if (woodDensity >= 0.65) strengthClassName = 'D30 (Laubholz Hartholz)';
    else if (f_bending >= 30) strengthClassName = 'C30 Premium Nadelholz';
    else if (f_bending >= 24) strengthClassName = 'C24 Konstruktionsvollholz (KVH)';
    else if (f_bending >= 18) strengthClassName = 'C18 Standard Nadelholz';
    
    return {
      fc0_actual,
      f_bending,
      e_modul,
      strengthClassName
    };
  }, [woodDensity, woodMoisture, woodWidth, woodHeight, woodSpan, woodBendingForce]);


  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto text-slate-800 animate-fade-in font-sans">
      
      {/* --- Unified Header: Modern Laboratory Setup --- */}
      <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Scale className="text-shiraz" /> Mechanische &amp; Zerstörende Prüfungen
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p>
            In-Situ Festigkeitsermittlung, Qualitätskontrollen und Tragfähigkeitsprüfungen. Prüfmethoden und Berechnungen strukturiert nach Baustoffgruppen gemäß europäischen Hauptnormen (DIN EN 12390, DIN EN 12697, DIN EN 408, DIN EN ISO 6892) für akkreditierte Prüflabore.
          </p>
        </div>
      </div>

      {/* --- Material Band Category Tabs (Primary Selection) --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-1.5 rounded-xl border border-home-grau/30">
        <button
          onClick={() => handleCategoryChange('beton_mineralisch')}
          className={`px-4 py-3.5 rounded-lg flex items-center justify-center gap-2.5 transition-all text-sm font-bold shadow-xs cursor-pointer ${
            activeCategory === 'beton_mineralisch'
              ? 'bg-shiraz text-white shadow-md'
              : 'bg-white hover:bg-slate-100/80 text-slate-700 border border-home-grau/30'
          }`}
        >
          <Layers size={16} />
          <div className="text-center font-sans tracking-tight">
            <span>Beton &amp; Mineralisch</span>
            <span className="block text-[10px] opacity-75 font-normal">3 Standardprüfungen</span>
          </div>
        </button>

        <button
          onClick={() => handleCategoryChange('asphalt_bituminoes')}
          className={`px-4 py-3.5 rounded-lg flex items-center justify-center gap-2.5 transition-all text-sm font-bold shadow-xs cursor-pointer ${
            activeCategory === 'asphalt_bituminoes'
              ? 'bg-shiraz text-white shadow-md'
              : 'bg-white hover:bg-slate-100/80 text-slate-700 border border-home-grau/30'
          }`}
        >
          <Flame size={16} />
          <div className="text-center font-sans tracking-tight">
            <span>Asphalt &amp; Bitumen</span>
            <span className="block text-[10px] opacity-75 font-normal">3 Standardprüfungen</span>
          </div>
        </button>

        <button
          onClick={() => handleCategoryChange('stahl_metalle')}
          className={`px-4 py-3.5 rounded-lg flex items-center justify-center gap-2.5 transition-all text-sm font-bold shadow-xs cursor-pointer ${
            activeCategory === 'stahl_metalle'
              ? 'bg-shiraz text-white shadow-md'
              : 'bg-white hover:bg-slate-100/80 text-slate-700 border border-home-grau/30'
          }`}
        >
          <Hammer size={16} />
          <div className="text-center font-sans tracking-tight">
            <span>Stahl &amp; Metalle</span>
            <span className="block text-[10px] opacity-75 font-normal">3 Standardprüfungen</span>
          </div>
        </button>

        <button
          onClick={() => handleCategoryChange('holz_organisch')}
          className={`px-4 py-3.5 rounded-lg flex items-center justify-center gap-2.5 transition-all text-sm font-bold shadow-xs cursor-pointer ${
            activeCategory === 'holz_organisch'
              ? 'bg-shiraz text-white shadow-md'
              : 'bg-white hover:bg-slate-100/80 text-slate-700 border border-home-grau/30'
          }`}
        >
          <Trees size={16} />
          <div className="text-center font-sans tracking-tight">
            <span>Holz &amp; Naturstoff</span>
            <span className="block text-[10px] opacity-75 font-normal">3 Standardprüfungen</span>
          </div>
        </button>
      </div>

      {/* --- Alert Info Info Box --- */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-slate-700 leading-relaxed flex gap-3">
        <Info size={18} className="text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800">Baulabor-Leitfaden:</strong> Mechanische Prüfdaten sind die rechtliche Grundlage für die Bauwerksausführung und Bauzustandskontrolle nach VOB. 
          Jeder Versuch setzt einen kalibrierten Prüfausschuss unter klimatisierten Referenzbedingungen (20 °C / 65% r.F.) voraus.
        </div>
      </div>

      {/* --- Main Contents Splitted --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Test Specifications and Standards (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          <div className="bg-white rounded-xl shadow-sm border border-home-grau/30 p-6 space-y-5">
            
            {/* Sub-Tabs: Test Method Selectors */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono mb-2">Normverfahren dieser Sparte</span>
              <div className="flex gap-2 border-b border-home-grau/30 pb-3 overflow-x-auto">
                {testDirectory[activeCategory].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleTestChange(t.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeTestId === t.id
                        ? 'bg-slate-800 text-white shadow-sm font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-home-grau/30'
                    }`}
                  >
                    {t.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Test Core Data Display */}
            <div className="space-y-4">
              <div className="border-b border-home-grau/30 pb-3">
                <div className="text-xs uppercase tracking-wider text-shiraz font-bold font-mono">Verfahrensdatenblatt</div>
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
          {activeTestDetail.title}
        </h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            {activeTestDetail.subtitle}
          </p>
        </div>
              </div>

              {/* Norm reference */}
              <div className="bg-slate-50 border border-home-grau/30 p-3.5 rounded-lg flex gap-3">
                <BookOpen className="w-5 h-5 text-shiraz shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block font-mono">Prüfvorschrift / Norm</span>
                  <span className="text-xs font-bold text-slate-800">{activeTestDetail.norm}</span>
                </div>
              </div>

              {/* Step-by-Step Breakdown */}
              <div className="space-y-3.5 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-4">
                  <span className="md:col-span-3 text-xs font-bold text-shiraz uppercase tracking-wider font-mono">Material:</span>
                  <div className="md:col-span-9 text-xs text-slate-700 leading-relaxed font-sans">
                    <FormulaText text={activeTestDetail.material} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-4 border-t border-home-grau/30 pt-3">
                  <span className="md:col-span-3 text-xs font-bold text-shiraz uppercase tracking-wider font-mono">Probenkörper:</span>
                  <div className="md:col-span-9 text-xs text-slate-700 leading-relaxed font-sans">
                    <FormulaText text={activeTestDetail.proben} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-4 border-t border-home-grau/30 pt-3">
                  <span className="md:col-span-3 text-xs font-bold text-shiraz uppercase tracking-wider font-mono">Versuchsinhalt:</span>
                  <div className="md:col-span-9 text-xs text-slate-700 leading-relaxed font-sans">
                    <FormulaText text={activeTestDetail.durchfuehrung} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-4 border-t border-home-grau/30 pt-3">
                  <span className="md:col-span-3 text-xs font-bold text-shiraz uppercase tracking-wider font-mono">Ergebnisse:</span>
                  <div className="md:col-span-9 text-xs text-slate-700 leading-relaxed font-sans">
                    <FormulaText text={activeTestDetail.ergebnisse} />
                  </div>
                </div>
              </div>

              {/* Typical Kennwerte Badge Strip */}
              <div className="pt-4 border-t border-home-grau/30 flex flex-wrap gap-2 items-center">
                <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider uppercase mr-1">Ausgabekennwerte:</span>
                {activeTestDetail.kennwerte.map((val, idx) => (
                  <span key={idx} className="bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-800 font-sans">
                    ✓ <FormulaText text={val} />
                  </span>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Testing Stand Simulators (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          <div className="bg-white rounded-xl shadow-sm border border-home-grau/30 p-6 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-home-grau/30 pb-3 mb-5">
                <Calculator className="w-5 h-5 text-shiraz" />
                <h4 className="text-base font-bold text-slate-900 font-sans">Interaktiver Baustoff-Prüfstand</h4>
              </div>

              {/* 1. BETON-PRÜFSTAND */}
              {activeCategory === 'beton_mineralisch' && (
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 rounded border border-emerald-150 font-mono uppercase">
                    🛠️ Modus: Betondruck-Kompression
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-750 flex justify-between">
                      <span>Proben-Durchmesser D (Bohrkern):</span>
                      <span className="text-shiraz font-mono font-bold">{concreteDiam} mm</span>
                    </label>
                    <input 
                      type="range" min="50" max="150" step="5" value={concreteDiam}
                      onChange={(e) => setConcreteDiam(Number(e.target.value))}
                      className="w-full accent-shiraz cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500 block leading-tight">DIN EN 12504-1 rät zu Bohrkerndurchmessern von mind. 100 mm bei Normalkorn.</span>
                  </div>

                  <div className="space-y-1 pt-1.5">
                    <label className="text-xs font-bold text-slate-750 flex justify-between">
                      <span>Proben-Höhe H (Planhöhe):</span>
                      <span className="text-shiraz font-mono font-bold">{concreteHeight} mm</span>
                    </label>
                    <input 
                      type="range" min="50" max="300" step="5" value={concreteHeight}
                      onChange={(e) => setConcreteHeight(Number(e.target.value))}
                      className="w-full accent-shiraz cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Aspektverhältnis (Schlankheit) H/D:</span>
                      <strong className="text-slate-700 font-mono">{(concreteHeight / concreteDiam).toFixed(2)}</strong>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1.5">
                    <label className="text-xs font-bold text-slate-755 flex justify-between">
                      <span>Zerstörende Bruchkraft (Lastspitze) F:</span>
                      <span className="text-emerald-700 font-mono font-bold">{concreteForce} kN</span>
                    </label>
                    <input 
                      type="range" min="50" max="1200" step="10" value={concreteForce}
                      onChange={(e) => setConcreteForce(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-750 font-sans">Bewehrungsstörungen:</label>
                      <select 
                        value={concreteRebars}
                        onChange={(e) => setConcreteRebars(Number(e.target.value))}
                        className="w-full border border-home-grau/30 p-2 rounded-lg text-xs bg-slate-50 font-bold focus:outline-none"
                      >
                        <option value="0">Keine Bewehrung</option>
                        <option value="1">1 Stab im Bohrkern</option>
                        <option value="2">2 Stäbe im Bohrkern</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-750 font-sans">Bohrrichtung:</label>
                      <select 
                        value={boreDirection}
                        onChange={(e) => setBoreDirection(e.target.value as 'vertikal' | 'horizontal')}
                        className="w-full border border-home-grau/30 p-2 rounded-lg text-xs bg-slate-50 font-bold focus:outline-none"
                      >
                        <option value="vertikal">Vertikal (Schichtung parallel)</option>
                        <option value="horizontal">Horizontal (Schichtung quer)</option>
                      </select>
                    </div>
                  </div>

                  {/* Calculated Outputs Beton */}
                  <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl mt-4 space-y-3">
                    <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-widest border-b border-emerald-200 pb-1 font-mono">Messergebnisse &amp; Festbetonwert</h5>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-xs font-sans">
                      <div className="text-slate-500">Zylinderquerschnitt (A0):</div>
                      <div className="font-bold text-right text-slate-800 font-mono">{(concreteRes.area).toFixed(0)} mm²</div>

                      <div className="text-slate-500">Rohe Spannung am Kern (fc,raw):</div>
                      <div className="font-bold text-right text-slate-800 font-mono">{concreteRes.rawStrength.toFixed(1)} MPa</div>

                      <div className="text-slate-500 font-bold text-shiraz">Äquiv. Zylinder (fc,eq,cyl):</div>
                      <div className="font-bold text-right text-shiraz font-mono">{concreteRes.equivalentCylinder.toFixed(1)} N/mm²</div>

                      <div className="text-slate-500 font-bold text-emerald-800">Äquiv. Würfel (fc,eq,cube):</div>
                      <div className="font-bold text-right text-emerald-800 font-mono">{concreteRes.equivalentCube.toFixed(1)} N/mm²</div>
                    </div>
                    
                    {concreteRes.equivalentCube >= 37 ? (
                      <div className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-200 px-2 py-1.5 rounded-lg text-center font-bold">
                        Festigkeitsbereich: Erreicht angenähert Festigkeitsklasse <strong>C30/37 (Normenkonform)</strong>.
                      </div>
                    ) : concreteRes.equivalentCube >= 25 ? (
                      <div className="text-[10px] bg-amber-50 text-amber-950 border border-amber-200 px-2 py-1.5 rounded-lg text-center font-semibold">
                        Festigkeitsbereich: Erreicht angenähert die Klasse <strong>C20/25</strong>. Mittlere Güte.
                      </div>
                    ) : (
                      <div className="text-[10px] bg-rose-50 text-rose-950 border border-rose-200 px-2 py-1.5 rounded-lg text-center font-bold flex items-center justify-center gap-1.5">
                        <ShieldAlert size={14} className="text-rose-700 shrink-0" />
                        Tragwerksgefahr: Festigkeit unter <strong>C16/20</strong>! Zustand überprüfen.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. ASPHALT-PRÜFSTAND */}
              {activeCategory === 'asphalt_bituminoes' && (
                <div className="space-y-4">
                  {/* Asphalt SubTest Selector Toggle */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-lg border border-home-grau/30">
                    <button
                      onClick={() => setAsphaltSubTest('spaltzug')}
                      className={`py-1.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                        asphaltSubTest === 'spaltzug' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Spaltzugfestigkeit
                    </button>
                    <button
                      onClick={() => setAsphaltSubTest('marshall')}
                      className={`py-1.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                        asphaltSubTest === 'marshall' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Marshall-Stabilität
                    </button>
                  </div>

                  {asphaltSubTest === 'spaltzug' ? (
                    <div className="space-y-3 pt-1">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 rounded border border-emerald-150 font-mono uppercase">
                        🛠️ Spaltzugbelastung (Indirekt)
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-750 flex justify-between">
                          <span>Bohrkern-Durchmesser d:</span>
                          <span className="text-shiraz font-mono font-bold">{asphaltDiam} mm</span>
                        </label>
                        <select
                          value={asphaltDiam}
                          onChange={(e) => setAsphaltDiam(Number(e.target.value))}
                          className="w-full border border-home-grau/30 p-2 rounded-lg text-xs bg-slate-50 font-bold focus:outline-none"
                        >
                          <option value="100">d = 100 mm (Typisch für Deckschichten)</option>
                          <option value="150">d = 150 mm (Typisch für Tragschichten)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-750 flex justify-between">
                          <span>Bohrkern-Dicke H (Schichthöhe):</span>
                          <span className="text-shiraz font-mono font-bold">{asphaltHeight} mm</span>
                        </label>
                        <input 
                          type="range" min="30" max="150" step="5" value={asphaltHeight}
                          onChange={(e) => setAsphaltHeight(Number(e.target.value))}
                          className="w-full accent-shiraz cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-755 flex justify-between">
                          <span>Maximale Belastungskraft P:</span>
                          <span className="text-emerald-700 font-mono font-bold">{asphaltForce} kN</span>
                        </label>
                        <input 
                          type="range" min="2" max="60" step="0.5" value={asphaltForce}
                          onChange={(e) => setAsphaltForce(Number(e.target.value))}
                          className="w-full accent-emerald-600 cursor-pointer"
                        />
                      </div>

                      {/* Calculations output Spaltzug Asphalt */}
                      <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl mt-4 space-y-2.5 text-xs font-sans">
                        <h5 className="font-bold text-emerald-800 uppercase tracking-widest border-b border-emerald-200 pb-1 font-mono">Ergebnisse Indirect Tensile</h5>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Dicke-Durchmesser-Verhältnis H/d:</span>
                          <span className="font-bold font-mono text-slate-800">{(asphaltHeight / asphaltDiam).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-emerald-100">
                          <span className="text-slate-500 font-bold">Spaltzugfestigkeit (St):</span>
                          <span className="font-bold font-mono text-shiraz text-sm">{asphaltSt.toFixed(2)} MPa</span>
                        </div>
                        <div className="bg-slate-100 p-2 rounded text-[10px] text-slate-700 leading-normal font-semibold text-center">
                          {asphaltSt > 2.2 ? (
                            <span className="text-emerald-800">Hoher Verformungswiderstand. Prüfung auf eventuelle Kältesprödigkeit empfohlen.</span>
                          ) : asphaltSt < 1.0 ? (
                            <span className="text-rose-800 font-bold">Kritisch geringe Kohäsion. Erhöhte Gefahr von Verdrängungen oder Überalterung.</span>
                          ) : (
                            <span className="text-slate-800">Sehr ausgewogenes Dehnungs- und Festigkeitsverhalten (Regelkonform).</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Marshall-Stabilität Rechner
                    <div className="space-y-3 pt-1">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 rounded border border-emerald-150 font-mono uppercase">
                        🛠️ Marshall-Kompression bei 60 °C
                      </div>

                      <div className="bg-white text-slate-850 border border-slate-200 p-2.5 rounded-lg text-[10.5px] leading-snug flex gap-2">
                        <Info size={14} className="text-amber-700 shrink-0 mt-0.5" />
                        <span>Das Wasserbad muss exakt 60 ± 1 °C halten. Minimale Einbauzeit &lt; 30 s!</span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-750 flex justify-between">
                          <span>Marshall-Stabilität S (Bruchlast):</span>
                          <span className="text-shiraz font-mono font-bold">{marshallStability} kN</span>
                        </label>
                        <input 
                          type="range" min="2.0" max="25.0" step="0.5" value={marshallStability}
                          onChange={(e) => setMarshallStability(Number(e.target.value))}
                          className="w-full accent-shiraz cursor-pointer"
                        />
                        <span className="text-[10px] text-slate-500 block">Zulässiges Minimum je nach Belastungsklasse meist &gt; 5.0 bis 9.0 kN.</span>
                      </div>

                      <div className="space-y-1 pt-1">
                        <label className="text-xs font-bold text-slate-755 flex justify-between">
                          <span>Prüf-Fließwert F (Stauchung):</span>
                          <span className="text-emerald-700 font-mono font-bold">{marshallFlow} mm</span>
                        </label>
                        <input 
                          type="range" min="0.5" max="8.0" step="0.1" value={marshallFlow}
                          onChange={(e) => setMarshallFlow(Number(e.target.value))}
                          className="w-full accent-shiraz cursor-pointer"
                        />
                        <span className="text-[10px] text-slate-500 block">Zulässiges Fließfenster liegt typischerweise zwischen 2.0 bis 4.0 mm.</span>
                      </div>

                      {/* Calculations output Marshall */}
                      <div className="bg-slate-50 border border-home-grau/30 p-4 rounded-xl mt-4 space-y-2.5 text-xs font-sans">
                        <h5 className="font-bold text-shiraz uppercase tracking-widest border-b border-home-grau/20 pb-1 font-mono">Ergebnisse Marshallprüfung</h5>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Stabilität <InlineMath math="S" />:</span>
                          <span className="font-bold font-mono text-slate-800">{marshallStability.toFixed(1)} kN</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Fließwert <InlineMath math="F" />:</span>
                          <span className="font-bold font-mono text-slate-800">{marshallFlow.toFixed(1)} mm</span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-home-grau/20">
                          <span className="text-slate-500 font-bold text-shiraz">Marshall-Quotient <InlineMath math="Q = S/F" />:</span>
                          <span className="font-bold font-mono text-shiraz text-sm">{marshallQuotient.toFixed(2)} kN/mm</span>
                        </div>
                        <div className="bg-slate-100 p-2 rounded text-[10px] text-slate-700 leading-normal font-semibold text-center">
                          {marshallQuotient > 4.5 ? (
                            <span className="text-red-900 font-bold block">Sehr spröder Asphalt. Erhöhtes Risiko für Kälterisse im Winter!</span>
                          ) : marshallQuotient < 1.5 ? (
                            <span className="text-amber-900 font-bold block">Zu plastisch. Hohes Risiko für Spurrinnenbildung unter sommerlichen Schwerlasten!</span>
                          ) : (
                            <span className="text-emerald-900 font-bold block">Optimaler elastisch-plastischer Verhaltensbereich für Fahrbahndecken.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. METALL/STAHL-PRÜFSTAND */}
              {activeCategory === 'stahl_metalle' && (
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 rounded border border-emerald-150 font-mono uppercase">
                    🛠️ Modus: Betonstahl-Zerreißprüfung
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-750 font-sans">Nenn-Durchmesser d:</label>
                      <select 
                        value={steelDiam}
                        onChange={(e) => setSteelDiam(Number(e.target.value))}
                        className="w-full border border-home-grau/30 p-2 rounded-lg text-xs bg-slate-50 font-bold focus:outline-none"
                      >
                        <option value="8">d = 8 mm</option>
                        <option value="10">d = 10 mm</option>
                        <option value="12">d = 12 mm</option>
                        <option value="14">d = 14 mm</option>
                        <option value="16">d = 16 mm</option>
                        <option value="20">d = 20 mm</option>
                        <option value="25">d = 25 mm</option>
                        <option value="28">d = 28 mm</option>
                        <option value="32">d = 32 mm</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-755 flex justify-between">
                        <span>Anfangs-L0:</span>
                        <span className="text-slate-600 font-mono font-bold">{steelLength0} mm</span>
                      </label>
                      <input 
                        type="number"
                        value={steelLength0}
                        onChange={(e) => setSteelLength0(Math.max(10, Number(e.target.value)))}
                        className="w-full border border-home-grau/30 p-1 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-shiraz text-center bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-bold text-slate-755 flex justify-between">
                      <span>Streckgrenzenlast (Fließstart) F_e:</span>
                      <span className="text-shiraz font-mono font-bold">{steelForceYield.toFixed(1)} kN</span>
                    </label>
                    <input 
                      type="range" min="10" max="400" step="1" value={steelForceYield}
                      onChange={(e) => {
                        setSteelForceYield(Number(e.target.value));
                        // ultimate strength must be higher than yield strength always
                        if (steelForceUltimate < Number(e.target.value) + 2) {
                          setSteelForceUltimate(Number(e.target.value) + 5);
                        }
                      }}
                      className="w-full accent-shiraz cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-bold text-slate-755 flex justify-between">
                      <span>Zugfestigkeitskraft (Höchstlast) F_m:</span>
                      <span className="text-emerald-700 font-mono font-bold">{steelForceUltimate.toFixed(1)} kN</span>
                    </label>
                    <input 
                      type="range" min="12" max="500" step="1" value={steelForceUltimate}
                      onChange={(e) => setSteelForceUltimate(Math.max(steelForceYield + 2, Number(e.target.value)))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-bold text-slate-755 flex justify-between">
                      <span>Bruchlänge Lu (extensometer):</span>
                      <span className="text-slate-700 font-mono font-bold">{steelLengthU} mm</span>
                    </label>
                    <input 
                      type="range" min={steelLength0} max={steelLength0 + 40} step="0.5" value={steelLengthU}
                      onChange={(e) => setSteelLengthU(Math.max(steelLength0, Number(e.target.value)))}
                      className="w-full accent-slate-800 cursor-pointer"
                    />
                  </div>

                  {/* Steel calculations output panel */}
                  <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl mt-4 space-y-3 font-sans">
                    <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-widest border-b border-emerald-200 pb-1 font-mono">Auswertung Zugversuch nach DIN 488</h5>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-xs">
                      
                      <div className="text-slate-500">Stabquerschnitt (S0):</div>
                      <div className="font-bold text-right text-slate-800 font-mono">{steelRes.area.toFixed(1)} mm²</div>

                      <div className="text-slate-500 font-semibold text-slate-800">Streckgrenze (Re):</div>
                      <div className={`font-bold text-right font-mono ${steelRes.yieldPassed ? 'text-emerald-800' : 'text-rose-700'}`}>
                        {steelRes.yieldStrength.toFixed(1)} MPa
                      </div>

                      <div className="text-slate-500 font-semibold text-slate-800">Zugfestigkeit (Rm):</div>
                      <div className="font-bold text-right text-slate-800 font-mono font-bold">{steelRes.ultimateStrength.toFixed(1)} MPa</div>

                      <div className="text-slate-500">Verhältnis (Rm / Re):</div>
                      <div className={`font-bold text-right font-mono ${steelRes.ratiosPassed ? 'text-emerald-800' : 'text-amber-700'}`}>
                        {steelRes.ratio.toFixed(2)}
                      </div>

                      <div className="text-slate-500">Bruchdehnung (A5):</div>
                      <div className={`font-bold text-right font-mono ${steelRes.elongationPassed ? 'text-emerald-800' : 'text-slate-800'}`}>
                        {steelRes.elongation.toFixed(1)} %
                      </div>
                    </div>
                    
                    <div className="text-[10px] bg-white border border-emerald-200 px-2.5 py-2 rounded-lg text-center">
                      <span className="font-bold text-slate-700 block">Duktilitätsbewertung:</span>
                      <span className="text-shiraz font-bold">{steelRes.complianceClass}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. HOLZ-PRÜFSTAND */}
              {activeCategory === 'holz_organisch' && (
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 rounded border border-emerald-150 font-mono uppercase">
                    🛠️ Modus: Holz-Druck-Biegeversuchsstand
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-755 flex justify-between">
                        <span>Rohdichte ρ0:</span>
                        <span className="text-shiraz font-mono font-bold">{woodDensity.toFixed(2)} g/cm³</span>
                      </label>
                      <input 
                        type="range" min="0.30" max="0.85" step="0.01" value={woodDensity}
                        onChange={(e) => setWoodDensity(Number(e.target.value))}
                        className="w-full h-1 accent-shiraz cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-500 leading-none">Spruce \Fichte: ca. 0.46, Buche Hartholz: &gt;0.68.</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-755 flex justify-between">
                        <span>Holzfeuchte u:</span>
                        <span className="text-emerald-700 font-mono font-bold">{woodMoisture} %</span>
                      </label>
                      <input 
                        type="range" min="5" max="35" step="1" value={woodMoisture}
                        onChange={(e) => setWoodMoisture(Number(e.target.value))}
                        className="w-full h-1 accent-emerald-600 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Beam Geometry Settings */}
                  <div className="grid grid-cols-3 gap-2 border-t border-home-grau/30 pt-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Balkenbreite w:</label>
                      <input 
                        type="number" value={woodWidth}
                        onChange={(e) => setWoodWidth(Math.max(10, Number(e.target.value)))}
                        className="w-full border border-home-grau/30 p-1 rounded font-mono text-xs text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Balkenhöhe h:</label>
                      <input 
                        type="number" value={woodHeight}
                        onChange={(e) => setWoodHeight(Math.max(10, Number(e.target.value)))}
                        className="w-full border border-home-grau/30 p-1 rounded font-mono text-xs text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Stützweite L:</label>
                      <input 
                        type="number" value={woodSpan}
                        onChange={(e) => setWoodSpan(Math.max(100, Number(e.target.value)))}
                        className="w-full border border-home-grau/30 p-1 rounded font-mono text-xs text-center"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 pt-1.5">
                    <label className="text-xs font-bold text-slate-755 flex justify-between">
                      <span>Gemessene Bruch-Biegungslast F_bending:</span>
                      <span className="text-emerald-700 font-mono font-bold">{woodBendingForce.toFixed(1)} kN</span>
                    </label>
                    <input 
                      type="range" min="0.5" max="25" step="0.5" value={woodBendingForce}
                      onChange={(e) => setWoodBendingForce(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  {/* Wood Estimator Calculation Outputs */}
                  <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl mt-4 space-y-3 font-sans">
                    <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-widest border-b border-emerald-200 pb-1 font-mono">Biege- und Druckprognose EN 338</h5>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-xs">
                      
                      <div className="text-slate-500">Druckfestigkeit (faserparallel) fc,0:</div>
                      <div className="font-bold text-right text-slate-800 font-mono">{woodRes.fc0_actual.toFixed(1)} MPa</div>

                      <div className="text-slate-500 font-semibold text-slate-800">Progn. Biegezugfestigkeit fm:</div>
                      <div className="font-bold text-right text-shiraz font-mono font-bold">
                        {woodRes.f_bending.toFixed(1)} N/mm²
                      </div>

                      <div className="text-slate-500">Biegungs-E-Modul E0,mean:</div>
                      <div className="font-bold text-right text-slate-800 font-mono">
                        {woodRes.e_modul.toFixed(0)} MPa
                      </div>

                      <div className="text-slate-500 font-bold text-slate-850">Schätzung Holzklasse:</div>
                      <div className="font-bold text-right text-emerald-800 font-bold font-mono">
                        {woodRes.strengthClassName}
                      </div>

                    </div>

                    <span className="block text-[10px] text-emerald-850 italic text-center">
                      Modifiziert für Feuchtegehalt von {woodMoisture}% (Referenz-Ausgleichsniveau der EN 338: 12%).
                    </span>
                  </div>
                </div>
              )}

            </div>

            <div className="mt-6 pt-3 border-t border-home-grau/30 text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
              <Info size={11} /> 
              <span>Rechenansätze gemäß empirischen Regressionskonstanten der EN 338 / Eurocode 5.</span>
            </div>
          </div>

        </div>

      </div>

      {/* --- Unified Module Footer Integration --- */}
      <ModuleFooter 
        weblinks={[
          { title: "Materialprüfungsanstalt für das Bauwesen (MPA)", url: "https://www.materialpruefung.de" },
          { title: "Eurocode 3 - Metallische Festigkeiten", url: "https://www.din.de/de/mitwirken/normenausschuesse/nabau/eurocodes" }
        ]}
        wikipedia={[
          { title: 'Druckfestigkeit von Beton', url: 'https://de.wikipedia.org/wiki/Beton' },
          { title: 'Zugversuch an Stählen', url: 'https://de.wikipedia.org/wiki/Zugversuch' },
          { title: 'Asphaltprüfungen', url: 'https://de.wikipedia.org/wiki/Asphalt' }
        ]}
        regelwerke={[
          { title: 'DIN EN 12390-3:2019-08 (Prüfung von Festbeton - Teil 3: Druckfestigkeit von Probekörpern)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+12390-3' },
          { title: 'DIN EN 12390-5:2019-10 (Prüfung von Festbeton - Teil 5: Biegezugfestigkeit von Probekörpern)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+12390-5' },
          { title: 'DIN EN 12390-6:2024-04 (Prüfung von Festbeton - Teil 6: Spaltzugfestigkeit von Probekörpern)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+12390-6' },
          { title: 'DIN EN 12697-22:2020-12 / DIN EN 12697-23:2018-03 (Asphalt - Prüfverfahren: Spurbildungstest & Spaltzugfestigkeit)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+12697-22' },
          { title: 'DIN EN ISO 6892-1:2020-06 (Metallische Werkstoffe - Zugversuch - Teil 1: Prüfverfahren bei Raumtemperatur)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+6892-1' },
          { title: 'DIN EN 408:2012-10 (Holzbauwerke - Bauholz für tragende Zwecke: Bestimmung mechanischer Eigenschaften)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+408' },
          { title: 'DIN EN 338:2016-07 (Bauholz für tragende Zwecke - Festigkeitsklassen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+338' }
        ]}
        literatur={[
          'Spann, H.: Straßenbaulaboratorium und Asphaltanalytik (2019)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        formeln={[
          {
            formel: 'f_c = \\frac{F_{max}}{A_0}',
            erklaerung: 'Allg. Druckspannung auf den Nettoquerschnitt bei Würfel- und Zylinderprüfung.',
            quelle: 'DIN EN 12390-3:2019-08'
          },
          {
            formel: 'S_t = \\frac{2 \\cdot P}{\\pi \\cdot D \\cdot H}',
            erklaerung: 'Indirekte Spaltzugfestigkeit des Asphalts unter linienförmiger Stoßlast.',
            quelle: 'DIN EN 12697-23:2018-03'
          },
          {
            formel: 'R_m = \\frac{F_m}{S_0}',
            erklaerung: 'Zugfestigkeit definiert als Verhältnis von Höchstlast zu stabbezogener Ursprungsquerschnittsfläche.',
            quelle: 'DIN EN ISO 6892-1:2020-06'
          },
          {
            formel: 'f_m = \\frac{3 \\cdot F \\cdot a}{w \\cdot h^2}',
            erklaerung: 'Ermittlung der nominalen Biegezugbeanspruchung parallel zu den Belastungspunkten (Eurocode 5).',
            quelle: 'DIN EN 408'
          }
        ]}
      />

    </div>
  );
}
