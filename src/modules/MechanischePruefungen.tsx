import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  Layers, 
  Flame, 
  Hammer, 
  Trees, 
  BookOpen, 
  Calculator, 
  Info, 
  ShieldAlert
} from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
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
        subtitle: 'Zerstörende Hauptprüfung zur Festigkeitsklassifizierung',
        norm: 'DIN EN 12390-3 (Druckfestigkeit von Probekörpern) & DIN EN 12504-1 (Bohrkerne)',
        material: 'Frisch- und Festbeton aller Druckfestigkeitsklassen (z. B. Normal-, Leicht- und Schwerbeton sowie UHPC) zur Bauqualitätskontrolle.',
        proben: 'Standardwürfel (Kantenlänge 150 mm), Zylinder ($d = 150\\text{ mm}$, $h = 300\\text{ mm}$) oder ausgebohrte Bauwerksbohrkerne ($d \\ge 100\\text{ mm}$). Die Lastflächen müssen eben und parallel sein (Toleranzen nach DIN EN 12390-1); sonst Planschleifen oder Abgleichen (Kappen) nach DIN EN 12390-3, Anhang A.',
        durchfuehrung: 'Lagerung nach DIN EN 12390-2 im Wasser bei $20 \\pm 2\\text{ }^\\circ\\text{C}$ (in Deutschland alternativ nach dem Nationalen Anhang: 7 Tage Wasser, danach Luftlagerung) bis zur Prüfung, meist nach 28 Tagen. Prüfung in einer Druckprüfmaschine nach DIN EN 12390-4. Stoßfreie Laststeigerung mit konstanter Belastungsgeschwindigkeit von $0{,}6 \\pm 0{,}2\\text{ MPa/s}$ bis zum Bruch.',
        ergebnisse: 'Aufzeichnung der maximalen Bruchlast $F$ in kN. Berechnung der Druckfestigkeit: $f_c = F / A_c$ in $\\text{N/mm}^2$ (MPa). Bewertung des Bruchbildes nach DIN EN 12390-3 (zufriedenstellend / nicht zufriedenstellend), z. B. als Hinweis auf ein klemmendes Kugelgelenk oder exzentrische Krafteinleitung.',
        kennwerte: ['Druckfestigkeit $f_c$ [MPa]', 'Bruchkraft $F_{max}$ [kN]', 'Bruchbild (zufriedenstellend / nicht)']
      },
      {
        id: 'biegezug_beton',
        title: 'Biegezugprüfung (Nicht bewehrter Balken)',
        subtitle: 'Kennwert für Fahrbahndecken, Industrieböden und Betonfertigteile',
        norm: 'DIN EN 12390-5 (Prüfung von Festbeton - Biegezugfestigkeit)',
        material: 'Unbewehrter Normal- und Faserbeton, d. h. Industrieböden, Betonbahnen des Straßenbaus oder Betonfertigteile.',
        proben: 'Balkenprismen mit quadratischem Querschnitt $d = 100$ oder $150\\text{ mm}$ und Länge $\\ge 3{,}5\\,d$ (z. B. $150 \\times 150 \\times 600\\text{ mm}$), Stützweite $l = 3\\,d$. Feuchtlagerung nach DIN EN 12390-2.',
        durchfuehrung: 'Lagerung im Wasserbad. Referenzverfahren ist die 4-Punkt-Belastung (zwei gleich große Lasten in den Drittelspunkten der Stützweite); alternativ 3-Punkt-Belastung (Einzellast in Feldmitte). Gleichmäßige Laststeigerung mit $0{,}04$ bis $0{,}06\\text{ MPa/s}$ bis zum Bruch.',
        ergebnisse: 'Bestimmung der Biegezugfestigkeit. Die Formel für 4-Punkt-Biegung lautet: $f_{cf} = \\frac{F \\cdot l}{d_1 \\cdot d_2^2}$ und für 3-Punkt-Biegung: $f_{cf} = \\frac{3 \\cdot F \\cdot l}{2 \\cdot d_1 \\cdot d_2^2}$ ($F$: Höchstlast [N], $l$: Stützweite [mm], $d_1, d_2$: Querschnittsmaße [mm]). Die 3-Punkt-Werte liegen systematisch höher als die 4-Punkt-Werte.',
        kennwerte: ['Biegezugfestigkeit $f_{cf}$ [MPa]', 'Vierpunkt- vs. Dreipunktkennwert', 'Risslinienverlauf']
      },
      {
        id: 'spaltzug_beton',
        title: 'Spaltzugfestigkeitsprüfung',
        subtitle: 'Indirekte Zugfestigkeitsbestimmung des Betons',
        norm: 'DIN EN 12390-6 (Prüfung von Festbeton - Spaltzugfestigkeit)',
        material: 'Beton-Zylinder oder Würfel zur Ermittlung des Risswiderstandes unter Spaltzugspannungen.',
        proben: 'Betonzylinder mit Durchmesser $150\\text{ mm}$ und Gesamtlänge $300\\text{ mm}$. Alternativ können auch Würfel über Keilelemente linienförmig belastet werden.',
        durchfuehrung: 'Der Zylinder wird liegend in das Belastungsgestell eingebracht. Zwischen den Druckplatten der Prüfmaschine und dem Mantel des Zylinders werden Zwischenstreifen aus Hartfaserplatte eingelegt (Abmessungen nach DIN EN 12390-6). Belastung mit konstanter Spannungsrate von $0{,}04$ bis $0{,}06\\text{ MPa/s}$ bis zur Spaltung entlang der belasteten Durchmesserebene.',
        ergebnisse: 'Bestimmung der Spaltzugfestigkeit: $f_{ct,sp} = \\frac{2 \\cdot F}{\\pi \\cdot L \\cdot d}$ in $\\text{N/mm}^2$ ($F$: Höchstlast [N], $L$: Zylinderlänge [mm], $d$: Durchmesser [mm]). Die zentrische Zugfestigkeit beträgt nach DIN EN 1992-1-1, 3.1.2(8) näherungsweise $f_{ct} = 0{,}9 \\cdot f_{ct,sp}$.',
        kennwerte: ['Spaltzugfestigkeit $f_{ct,sp}$ [MPa]', 'Zug-Druckfestigkeitsverhältnis (meist ca. 1:10)', 'Bruchbild der Spaltfläche']
      }
    ],
    asphalt_bituminoes: [
      {
        id: 'spaltzug_asphalt',
        title: 'Asphaltbohrkerne - Spaltzugversuch',
        subtitle: 'Indirekte Zugfestigkeit, Wasserempfindlichkeit und Schichtenverbund',
        norm: 'DIN EN 12697-23 (Prüfverfahren für Heißasphalt - Teil 23: Indirekter Zugversuch)',
        material: 'Heißasphalt-Formmischungen und Bestandsproben (Asphaltdeckschichten, Asphalttragschichten) zur Ermittlung der indirekten Zugfestigkeit (ITS), u. a. als Grundlage der Wasserempfindlichkeitsprüfung (ITSR nach DIN EN 12697-12).',
        proben: 'Ausgebohrte Fahrbahn-Zylinder oder Labor-Prüfkörper mit Nenndurchmesser $100\\text{ mm}$ oder $150\\text{ mm}$. Rechtwinklig zur Achse geschnittene Stirnflächen.',
        durchfuehrung: 'Temperierung auf die festgelegte Prüftemperatur (häufig $15\\text{ }^\\circ\\text{C}$) im Wasserbad oder Klimaschrank für die in der Norm festgelegte Mindestdauer. Belastung liegend über Laststreifen. Weggesteuerter Vorschub mit konstant $50 \\pm 2\\text{ mm/min}$ bis zum Bruch.',
        ergebnisse: 'Ermittlung der maximalen Spaltzugkraft $P$ in kN. Berechnung der Asphalt-Spaltzugfestigkeit: $S_t = \\frac{2 \\cdot P}{\\pi \\cdot D \\cdot H}$ in MPa ($D$: Durchmesser [mm], $H$: Zylinderdicke/Höhe [mm]). Höhere Werte bei gleicher Temperatur zeigen ein steiferes Bindemittel bzw. einen besseren Zusammenhalt des Mischguts; für die Wasserempfindlichkeit maßgebend ist das Verhältnis nass/trocken (ITSR).',
        kennwerte: ['Spaltzugfestigkeit $S_t$ [MPa]', 'Maximallast $P$ [kN]', 'Temperaturabhängigkeit des Verformungswiderstandes']
      },
      {
        id: 'marshall_stabilitat',
        title: 'Marshall-Stabilität & Fließwert',
        subtitle: 'Volumetrische Optimierung des Heißasphalt-Mischguts',
        norm: 'DIN EN 12697-34 (Prüfverfahren für Heißasphalt - Teil 34: Marshall-Prüfung)',
        material: 'Walzasphaltmischgut. In Deutschland dient die Marshall-Verdichtung vor allem der Herstellung von Probekörpern (Raumdichte, Hohlraumgehalt); Marshall-Stabilität und Fließwert sind kein Abnahmekriterium der TL Asphalt-StB mehr.',
        proben: 'Zylindrische Asphaltproben ($d = 101{,}6\\text{ mm}$, $h = 63{,}5\\text{ mm}$), im Labor mit dem Marshall-Verdichtungsgerät nach DIN EN 12697-30 verdichtet (z. B. 2 × 50 Schläge).',
        durchfuehrung: 'Die Probekörper werden im Wasserbad auf $60 \\pm 1\\text{ }^\\circ\\text{C}$ temperiert (Verweildauer nach DIN EN 12697-34). Zügiges Einsetzen in den vorgewärmten Marshall-Prüfkopf; die Zeit zwischen Entnahme und Höchstkraft ist begrenzt. Vorschub $50 \\pm 2\\text{ mm/min}$ bis zum Versagen.',
        ergebnisse: 'Hauptwerte: 1) Marshall-Stabilität $S$ (Höchstkraft in kN). 2) Fließwert $F$ (Verformung bis zur Höchstkraft in mm). 3) Marshall-Quotient $Q = S/F$ in kN/mm als grober Kennwert der Steifigkeit des Mischguts.',
        kennwerte: ['Marshall-Stabilität $S$ [kN]', 'Fließwert $F$ [mm]', 'Marshall-Quotient $S/F$ [kN/mm]']
      },
      {
        id: 'spurrinnen_asphalt',
        title: 'Spurrinnenprüfung (Spurbildungsversuch)',
        subtitle: 'Simulationsprüfung für den Verformungswiderstand im Sommer',
        norm: 'DIN EN 12697-22 (Prüfverfahren für Heißasphalt - Teil 22: Spurbildungstest)',
        material: 'Hochbelastetes Asphaltmischgut (z. B. Asphaltbeton AC, Splittmastixasphalt SMA) zur Absicherung des Spurrinnenwiderstandes.',
        proben: 'Asphaltplatten (im Labor mit Walzsektor-Verdichter nach DIN EN 12697-33 hergestellt) oder Bohrkerne aus der Fahrbahn; Abmessungen und Dicke nach Gerätegröße und Schichtdicke.',
        durchfuehrung: 'Kleines Prüfgerät, Verfahren in Luft: Temperierung bei z. B. $60\\text{ }^\\circ\\text{C}$, ein gummibereiftes Rad mit $700\\text{ N}$ Radlast fährt mit $26{,}5$ Lastwechseln je Minute hin und her, Regeldauer $10.000$ Lastwechsel. In Deutschland wird der Spurbildungsversuch üblicherweise im Wasserbad nach TP Asphalt-StB, Teil 22 durchgeführt.',
        ergebnisse: 'Aufzeichnung der kontinuierlichen Einsinktiefe des Rads über Wegaufnehmer. Berechnet werden die Spurrinnentiefe nach Abschluss des Versuchs (in mm) sowie die Spurbildungsrate $WTS_{air}$ (Steigung im annähernd linearen Bereich) in mm je 1000 Lastwechsel.',
        kennwerte: ['Spurrinnentiefe nach 10.000 Lastwechseln [mm]', 'Spurbildungsrate $WTS_{air}$ [mm/1000 Lastwechsel]', 'Proportionale Spurrinnentiefe $PRD_{air}$ [%]']
      }
    ],
    stahl_metalle: [
      {
        id: 'zugversuch_stahl',
        title: 'Einaxialer Zugversuch an Stahl',
        subtitle: 'Grundlegende mechanische Werkstoffprüfung zur Baustahl-Charakterisierung',
        norm: 'DIN EN ISO 6892-1 (Zugversuch an metallischen Werkstoffen) & DIN 488 (Betonstahl)',
        material: 'Betonstahl-Rippenstäbe, Baustähle (z. B. S235, S355), Gewindestangen und Spanndraht.',
        proben: 'Unbehandelte Stahlstababschnitte im Originallieferzustand (Betonstahl) oder abgedrehte Rundproben mit Anfangsmesslänge $L_0 = 5 \\cdot d_0$ (allgemein für proportionale Proben $L_0 = 5{,}65 \\sqrt{S_0}$). Prüfung von Betonstahl nach DIN EN ISO 15630-1.',
        durchfuehrung: 'Einspannen in die hydraulischen Spannbacken eines Universal-Zugprüfstands. Montage des Feindehnungsmessers (Extensometer). Dehnungsgeregelte Prüfung (Verfahren A): Dehngeschwindigkeit $0{,}00025\\text{ s}^{-1}$ bis zur Bestimmung der Streckgrenze (Bereich 2: $0{,}00025\\text{ s}^{-1}$ ± 20 %), danach bis zur Zugfestigkeit typischerweise $0{,}0067\\text{ s}^{-1}$ (Bereich 4).',
        ergebnisse: 'Erfassung des gesamten Kraft-Weg-Verlaufs. Berechnete Kennwerte: \n1) Obere Streckgrenze $R_{eH}$ bzw. 0,2-%-Dehngrenze $R_{p0{,}2}$ ($R_{e} = F_e / S_0$). \n2) Zugfestigkeit $R_m = F_{max} / S_0$. \n3) Gesamtdehnung bei Höchstkraft $A_{gt}$ (Duktilitätskriterium für Betonstahl) und Bruchdehnung $A$ [%]. \n4) Elastizitätsmodul $E$. \n5) Streckgrenzenverhältnis $R_m/R_e$ (Verformungsreserve; Duktilitätskriterium nach DIN 488).',
        kennwerte: ['Streckgrenze $R_e$ (bzw. $R_{p0{,}2}$) [MPa]', 'Zugfestigkeit $R_m$ [N/mm²]', 'Duktilitätsklasse A (normal) / B (hoch) nach DIN 488; C nur nach DIN EN 1992-1-1, Anhang C', 'Dehnung $A_{gt}$ [%]']
      },
      {
        id: 'kerbschlag_charpy',
        title: 'Kerbschlagbiegeversuch',
        subtitle: 'Zähigkeitsprüfung zur Absicherung gegen Sprödbruch bei tiefen Temperaturen',
        norm: 'DIN EN ISO 148-1 (Kerbschlagbiegeversuch nach Charpy an Metallen)',
        material: 'Strukturelle Baustähle der Brückenoberbauten, Schweißverbindungen und dicke Walzprofile zur Absicherung gegen spröde Gewaltbrüche.',
        proben: 'Rechteckprismen mit den Maßen $10 \\times 10 \\times 55\\text{ mm}$ mit mittig eingestoßener V-Kerbe (Kerbtiefe $2\\text{ mm}$, Flankenwinkel $45^\\circ$, Rundungsradius $0{,}25\\text{ mm}$ am Kerbgrund).',
        durchfuehrung: 'Vorkonditionierung der Probe auf Solltemperatur (z. B. $-20\\text{ }^\\circ\\text{C}$ in Kältebädern). Die temperierte Probe wird innerhalb weniger Sekunden (nach DIN EN ISO 148-1 höchstens 5 s) auf die Widerlager des Pendelschlagwerks gelegt. Die Hammerfinne trifft die Probe auf der der Kerbe gegenüberliegenden Seite und schlägt sie durch. Aus der Steighöhe des Pendels nach dem Durchschlag (Schleppzeiger oder Drehgeber) wird die verbrauchte Schlagenergie bestimmt.',
        ergebnisse: 'Bestimmung der verbrauchten Schlagarbeit $K_V$ (oder $K_U$) in Joule [$J$]. Die Gütegruppe wird über die Mindestschlagenergie bei Prüftemperatur festgelegt, z. B. S355J2: $27\\text{ J}$ bei $-20\\text{ }^\\circ\\text{C}$ (DIN EN 10025-2); die erforderliche Gütegruppe im Tragwerk folgt aus DIN EN 1993-1-10.',
        kennwerte: ['Kerbschlagarbeit $K_v$ [J]', 'Sprödbruch-Übergangstemperatur', 'Bruchflächenanalyse (Wabenbruch / Spaltbruch)']
      },
      {
        id: 'biegebruch_stahl',
        title: 'Biege- & Rückbiegeversuch (Betonstahl)',
        subtitle: 'Prüfung der Biegbarkeit beim Abbiegen und Zurückbiegen',
        norm: 'DIN EN ISO 15630-1 (Prüfverfahren) / DIN 488-1 (Anforderungen)',
        material: 'Gerippter Betonstahl im Anlieferzustand zur Absicherung gegen Biegerissbildung beim Formen von Anschlussbewehrungen.',
        proben: 'Betonstahlabschnitt im Lieferzustand, Länge nach Biegevorrichtung.',
        durchfuehrung: 'Das Stabstück wird auf zwei Rollenlager aufgelegt. Der Stab wird über einen Dorn, dessen Durchmesser DIN 488-1 abhängig vom Stabdurchmesser $d$ vorgibt, um $90^\\circ$ gebogen. Anschließend wird er künstlich gealtert (Erwärmen auf $100\\text{ }^\\circ\\text{C}$, Haltezeit nach DIN EN ISO 15630-1) und nach dem Abkühlen um mindestens $20^\\circ$ zurückgebogen.',
        ergebnisse: 'Visuelle Beurteilung: Auf der Zugseite dürfen keine mit bloßem Auge (bzw. normaler Sehhilfe) erkennbaren Risse auftreten (Kriterium: bestanden / nicht bestanden).',
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
        proben: 'Prismatischer Träger mit Mindestquerschnitt $50 \\times 50\\text{ mm}$ und Gesamtlänge entsprechend der Stützweite ($L = 19 \\cdot h$, Stützabstand $18 \\cdot h$). Proben werden im Normalklima $20\\text{ }^\\circ\\text{C} / 65\\%\\text{ r.F.}$ bis zur Massekonstanz konditioniert (Ausgleichsfeuchte bei Nadelholz $\u2248 12\\%$).',
        durchfuehrung: 'Lagerung auf Rollenlagern, Krafteinleitung in den Drittelspunkten der Stützweite (4-Punkt-Biegung, $a = 6\\,h$), damit im Mittelfeld ein querkraftfreier Bereich mit konstantem Moment entsteht. Stetiger Vorschub, so dass der Bruch nach $300 \\pm 120\\text{ s}$ eintritt. Erfassung von Rissstart, Durchbiegungsverlauf und Bruchlast.',
        ergebnisse: 'Ermittlung: \n1) Biegefestigkeit: $f_m = \\frac{3 \\cdot F \\cdot a}{b \\cdot h^2}$ in MPa ($F$: Gesamtlast, $a$: Abstand Auflager zu Lastpunkt, $b$: Trägerbreite, $h$: Trägerhöhe). \n2) Lokaler E-Modul $E_{m,l}$ aus der Krümmung im Bereich konstanten Moments zwischen den Lastpunkten, globaler E-Modul $E_{m,g}$ aus der Durchbiegung in Feldmitte über die Stützweite.',
        kennwerte: ['Biegefestigkeit $f_m$ [MPa]', 'Biege-E-Modul $E_{m,g}$ bzw. $E_{m,l}$ [N/mm²]', 'Rohdichte und Holzfeuchte der Probe']
      },
      {
        id: 'druckholz',
        title: 'Druckprüfung parallel zur Faser',
        subtitle: 'Charakteristische Festigkeit für Holzstützen und Tragglieder',
        norm: 'DIN EN 408',
        material: 'Nadel- und Laubholz im Bauzustand zur statischen Leistungsdiagnose.',
        proben: 'Prüfkörper in Bauteilgröße mit einer Länge vom 6-Fachen der kleineren Querschnittsabmessung (z. B. $50 \\times 50 \\times 300\\text{ mm}$). Fehlerfreie Kleinproben (z. B. $20 \\times 20 \\times 60\\text{ mm}$) liefern Reinholzwerte und fallen nicht unter DIN EN 408.',
        durchfuehrung: 'Die planparallel geschnittenen Hirnholzenden werden vollflächig zwischen die Druckplatten gesetzt. Stetiger Vorschub, so dass der Bruch nach $300 \\pm 120\\text{ s}$ eintritt. Versagen durch Ausknicken der Zellwände (Stauchfalten) bzw. Abscheren schräg zur Faser.',
        ergebnisse: 'Bestimmung der maximalen Bruchkraft $F$ in kN. Berechnung der Faser-Druckfestigkeit: $f_{c,0} = F / A_0$ in MPa. Starke Abhängigkeit des gemessenen Werts von Holzfeuchte, Rohdichte und Astfreiheit des Bereichs.',
        kennwerte: ['Druckfestigkeit parallel zur Faser $f_{c,0}$ [MPa]', 'Holzfeuchte (Darrverfahren DIN EN 13183-1)', 'Bruchart (Stauchfalten / Scherbruch)']
      },
      {
        id: 'scherklebung',
        title: 'Zugscherprüfung an Holzklebungen',
        subtitle: 'Qualitätssicherung für geklebte Tragwerksholzkonstruktionen',
        norm: 'DIN EN 302-1 (Prüfverfahren für Klebstoffe für tragende Holzbauteile)',
        material: 'Verklebungssysteme für Brettschichtholz, Brettsperrholz (CLT) und Furnierholzverbindungen.',
        proben: 'Verklebte Buchenholzlamellen mit kleiner überlappter Klebfläche (Abmessungen nach DIN EN 302-1). Prüfung nach unterschiedlichen Vorbehandlungen (Normalklima, Wasserlagerung, Kochen) entsprechend der Klebstoffklasse.',
        durchfuehrung: 'Die einschnittige Überlappungsprobe wird axial in die Zugprüfmaschine eingespannt. Die Zugkraft erzeugt in der Klebfuge überwiegend Schubspannungen; sie wird bis zum Bruch gesteigert.',
        ergebnisse: 'Bestimmung der Zugscherfestigkeit: $\\tau = F_{max} / A_s$ in MPa. Die Mindestwerte je Vorbehandlung legt DIN EN 301 fest. Bei Blockscherprüfungen an Brettschichtholz (DIN EN 14080) wird zusätzlich der Holzfaserbruchanteil beurteilt: Ein hoher Anteil zeigt, dass das Holz und nicht die Klebfuge versagt hat.',
        kennwerte: ['Scherfestigkeit $\\tau$ [N/mm²]', 'Holzfaserbruchanteil [%] (Blockscherprüfung)', 'Einfluss der Vorbehandlung']
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

    // Schlankheitskorrektur auf h/d = 2 (Literaturansatz ASTM C42/C42M, linear interpoliert).
    // DIN EN 13791 ordnet h/d = 1 der Würfel- und h/d = 2 der Zylinderfestigkeit zu.
    // h/d < 1: nicht prüfbar (NaN → „–“); h/d > 2: Kern ist auf h/d = 2 zu kürzen (Faktor 1,0).
    const astmStuetz: [number, number][] = [[1.0, 0.87], [1.25, 0.93], [1.5, 0.96], [1.75, 0.98], [2.0, 1.0]];
    let lambdaAspect = aspect > 2.0 ? 1.0 : NaN;
    for (let i = 0; i < astmStuetz.length - 1; i++) {
      const [l0, k0] = astmStuetz[i];
      const [l1, k1] = astmStuetz[i + 1];
      if (aspect >= l0 && aspect <= l1) {
        lambdaAspect = k0 + (k1 - k0) * (aspect - l0) / (l1 - l0);
        break;
      }
    }

    // Bewehrung im Kern: Lehrannahme (+3,5 % je querendem Stab als Ausgleich der Schwächung).
    // Kein Normansatz – nach DIN EN 12504-1 sollen Kerne möglichst bewehrungsfrei sein.
    const lambdaRebar = 1.0 + 0.035 * concreteRebars;

    // Bohrrichtung: horizontal gebohrte Kerne liefern im Mittel etwa 8 % geringere Werte als vertikal
    // gebohrte (Literaturansatz BS 1881-120: Faktor 2,5/2,3 ≈ 1,085).
    const lambdaDirection = boreDirection === 'horizontal' ? 1.085 : 1.0;

    const fcCore = rawStrength * lambdaAspect * lambdaRebar * lambdaDirection;
    const equivalentCylinder = fcCore;
    const equivalentCube = fcCore / 0.82; // Näherung Zylinder/Würfel ≈ 0,82 (vgl. C30/37: 30/37)

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

    // Einzelwertvergleich mit den Kennwerten von B500A/B500B nach DIN 488-1
    // (R_e ≥ 500 N/mm²; R_m/R_e ≥ 1,05 bzw. 1,08; A_gt ≥ 2,5 % bzw. 5,0 %).
    // Hinweis: Die Norm verlangt charakteristische Werte (Quantile) aus Prüfserien.
    const yieldPassed = yieldStrength >= 500;
    const ratiosPassed = ratio >= 1.08;
    const elongationPassed = elongation >= 5.0;

    let complianceClass = 'Anforderungen B500A/B500B nicht erfüllt';
    if (yieldStrength >= 500 && ratio >= 1.08 && elongation >= 5.0) {
      complianceClass = 'Einzelwert erfüllt B500B (hochduktil, DIN 488-1)';
    } else if (yieldStrength >= 500 && ratio >= 1.05 && elongation >= 2.5) {
      complianceClass = 'Einzelwert erfüllt B500A (normalduktil, DIN 488-1)';
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

    // Holzfeuchte-Näherung: je % Feuchte über 12 % ca. 3,5 % Festigkeitsverlust (Lehrmodell);
    // oberhalb der Fasersättigung (ca. 28 %) keine weitere Abnahme.
    const moistureFactor = 1.0 - 0.035 * (Math.min(woodMoisture, 28) - 12);
    const fc0_actual = fc0_base * moistureFactor;

    // Biegefestigkeit nach DIN EN 408 (4-Punkt-Biegung, Gesamtlast F, Lastpunkte in den Drittelspunkten):
    // f_m = 3·F·a / (b·h²) mit a = L/3  →  f_m = F·L / (b·h²)
    const forceN = woodBendingForce * 1000;
    const f_bending = (3 * forceN * (woodSpan / 3)) / (woodWidth * Math.pow(woodHeight, 2));

    // E-Modul: grobe Lehr-Näherung über die Rohdichte (kein Ansatz der DIN EN 338)
    const e_modul = 25000 * woodDensity * moistureFactor; // MPa (N/mm²)

    // Holzfestigkeitsklasse schätzen
    // Nur Orientierung: Eine Klassenzuordnung erfordert charakteristische Werte aus Prüfserien (DIN EN 384).
    let strengthClassName = 'unter C18 (Einzelwert)';
    if (woodDensity >= 0.65) strengthClassName = 'Laubholz (D-Klassen)';
    else if (f_bending >= 30) strengthClassName = 'Niveau ≥ C30 (Einzelwert)';
    else if (f_bending >= 24) strengthClassName = 'Niveau C24 (Einzelwert)';
    else if (f_bending >= 18) strengthClassName = 'Niveau C18 (Einzelwert)';
    
    return {
      fc0_actual,
      f_bending,
      e_modul,
      strengthClassName
    };
  }, [woodDensity, woodMoisture, woodWidth, woodHeight, woodSpan, woodBendingForce]);


  return (
    <div className="flex flex-col gap-6 w-full text-slate-800 animate-fade-in font-sans">
      
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
          <strong className="text-slate-800">Baulabor-Leitfaden:</strong> Mechanische Prüfdaten sind Grundlage für Konformitätsnachweise, Abnahmen und Bestandsbewertungen. 
          Jeder Versuch setzt eine kalibrierte Prüfeinrichtung (DIN EN ISO 7500-1) und die in der jeweiligen Prüfnorm festgelegten Lagerungs- und Prüfbedingungen voraus (z. B. Normalklima 20 °C / 65 % r. F. für Holz, Wasserlagerung für Beton).
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
                      <span className="text-shiraz font-mono font-bold">{formatDeWert(concreteDiam)} mm</span>
                    </label>
                    <input 
                      type="range" min="50" max="150" step="5" value={concreteDiam}
                      onChange={(e) => setConcreteDiam(Number(e.target.value))}
                      className="w-full accent-shiraz cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500 block leading-tight">Regeldurchmesser 100 mm oder 150 mm; d ≥ 3 · Größtkorn.</span>
                  </div>

                  <div className="space-y-1 pt-1.5">
                    <label className="text-xs font-bold text-slate-750 flex justify-between">
                      <span>Proben-Höhe H (Planhöhe):</span>
                      <span className="text-shiraz font-mono font-bold">{formatDeWert(concreteHeight)} mm</span>
                    </label>
                    <input 
                      type="range" min="50" max="300" step="5" value={concreteHeight}
                      onChange={(e) => setConcreteHeight(Number(e.target.value))}
                      className="w-full accent-shiraz cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Schlankheit H/D (prüfbar: 1 bis 2):</span>
                      <strong className="text-slate-700 font-mono">{formatDeZahl((concreteHeight / concreteDiam), 2)}</strong>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1.5">
                    <label className="text-xs font-bold text-slate-750 flex justify-between">
                      <span>Zerstörende Bruchkraft (Lastspitze) F:</span>
                      <span className="text-emerald-700 font-mono font-bold">{formatDeWert(concreteForce)} kN</span>
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
                      <select aria-label="Bewehrungsstörungen" 
                        value={concreteRebars}
                        onChange={(e) => setConcreteRebars(Number(e.target.value))}
                        className="w-full border border-home-grau/30 p-2 rounded-lg text-xs bg-slate-50 font-bold focus:outline-none"
                      >
                        <option value="0">Keine Bewehrung</option>
                        <option value="1">1 Stab im Bohrkern (Lehrannahme)</option>
                        <option value="2">2 Stäbe im Bohrkern (Lehrannahme)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-750 font-sans">Bohrrichtung:</label>
                      <select aria-label="Bohrrichtung" 
                        value={boreDirection}
                        onChange={(e) => setBoreDirection(e.target.value as 'vertikal' | 'horizontal')}
                        className="w-full border border-home-grau/30 p-2 rounded-lg text-xs bg-slate-50 font-bold focus:outline-none"
                      >
                        <option value="vertikal">Vertikal (in Betonierrichtung)</option>
                        <option value="horizontal">Horizontal (quer zur Betonierrichtung)</option>
                      </select>
                    </div>
                  </div>

                  {/* Calculated Outputs Beton */}
                  <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl mt-4 space-y-3">
                    <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-widest border-b border-emerald-200 pb-1 font-mono">Messergebnisse &amp; Festbetonwert</h5>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-xs font-sans">
                      <div className="text-slate-500">Zylinderquerschnitt (A0):</div>
                      <div className="font-bold text-right text-slate-800 font-mono">{formatDeZahl((concreteRes.area), 0)} mm²</div>

                      <div className="text-slate-500">Rohe Spannung am Kern (fc,raw):</div>
                      <div className="font-bold text-right text-slate-800 font-mono">{formatDeZahl(concreteRes.rawStrength, 1)} MPa</div>

                      <div className="text-slate-500 font-bold text-shiraz">Kern auf h/d = 2 (fc,eq,cyl):</div>
                      <div className="font-bold text-right text-shiraz font-mono">{formatDeZahl(concreteRes.equivalentCylinder, 1)} N/mm²</div>

                      <div className="text-slate-500 font-bold text-emerald-800">Würfelwert, Näherung (fc,eq,cube):</div>
                      <div className="font-bold text-right text-emerald-800 font-mono">{formatDeZahl(concreteRes.equivalentCube, 1)} N/mm²</div>
                    </div>
                    
                    {!Number.isFinite(concreteRes.equivalentCube) ? (
                      <div className="text-[10px] bg-rose-50 text-rose-950 border border-rose-200 px-2 py-1.5 rounded-lg text-center font-bold flex items-center justify-center gap-1.5">
                        <ShieldAlert size={14} className="text-rose-700 shrink-0" />
                        h/d &lt; 1: Kern zu kurz – nicht normgerecht prüfbar.
                      </div>
                    ) : concreteRes.equivalentCube >= 37 ? (
                      <div className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-200 px-2 py-1.5 rounded-lg text-center font-bold">
                        Einzelwert im Bereich <strong>≥ C30/37</strong>. Die Einstufung erfordert mehrere Kerne (DIN EN 13791).
                      </div>
                    ) : concreteRes.equivalentCube >= 25 ? (
                      <div className="text-[10px] bg-amber-50 text-amber-950 border border-amber-200 px-2 py-1.5 rounded-lg text-center font-semibold">
                        Einzelwert im Bereich <strong>C20/25 bis C25/30</strong>. Die Einstufung erfordert mehrere Kerne (DIN EN 13791).
                      </div>
                    ) : (
                      <div className="text-[10px] bg-rose-50 text-rose-950 border border-rose-200 px-2 py-1.5 rounded-lg text-center font-bold flex items-center justify-center gap-1.5">
                        <ShieldAlert size={14} className="text-rose-700 shrink-0" />
                        Einzelwert unter <strong>C20/25</strong>: weitere Kerne entnehmen und Tragfähigkeit durch Fachplaner bewerten lassen.
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
                          <span className="text-shiraz font-mono font-bold">{formatDeWert(asphaltDiam)} mm</span>
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
                          <span className="text-shiraz font-mono font-bold">{formatDeWert(asphaltHeight)} mm</span>
                        </label>
                        <input 
                          type="range" min="30" max="150" step="5" value={asphaltHeight}
                          onChange={(e) => setAsphaltHeight(Number(e.target.value))}
                          className="w-full accent-shiraz cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-750 flex justify-between">
                          <span>Maximale Belastungskraft P:</span>
                          <span className="text-emerald-700 font-mono font-bold">{formatDeWert(asphaltForce)} kN</span>
                        </label>
                        <input 
                          type="range" min="2" max="60" step="0.5" value={asphaltForce}
                          onChange={(e) => setAsphaltForce(Number(e.target.value))}
                          className="w-full accent-emerald-600 cursor-pointer"
                        />
                      </div>

                      {/* Calculations output Spaltzug Asphalt */}
                      <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl mt-4 space-y-2.5 text-xs font-sans">
                        <h5 className="font-bold text-emerald-800 uppercase tracking-widest border-b border-emerald-200 pb-1 font-mono">Ergebnisse indirekter Zugversuch</h5>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Dicke-Durchmesser-Verhältnis H/d:</span>
                          <span className="font-bold font-mono text-slate-800">{formatDeZahl((asphaltHeight / asphaltDiam), 2)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-emerald-100">
                          <span className="text-slate-500 font-bold">Spaltzugfestigkeit (St):</span>
                          <span className="font-bold font-mono text-shiraz text-sm">{formatDeZahl(asphaltSt, 2)} MPa</span>
                        </div>
                        <div className="bg-slate-100 p-2 rounded text-[10px] text-slate-700 leading-normal font-semibold text-center">
                          {asphaltSt > 2.2 ? (
                            <span className="text-emerald-800">Hoher Wert: steifes Mischgut bzw. hartes Bindemittel – Verhalten bei tiefen Temperaturen prüfen.</span>
                          ) : asphaltSt < 1.0 ? (
                            <span className="text-rose-800 font-bold">Niedriger Wert: geringer Zusammenhalt – Bindemittelgehalt, Verdichtung und Wasserempfindlichkeit prüfen.</span>
                          ) : (
                            <span className="text-slate-800">Mittlerer Bereich. Bewertung nur temperaturbezogen und im Vergleich nass/trocken (ITSR) aussagekräftig.</span>
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
                        <span>Wasserbad 60 ± 1 °C; die Probe zügig einsetzen und prüfen (Zeitgrenze nach DIN EN 12697-34).</span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-750 flex justify-between">
                          <span>Marshall-Stabilität S (Bruchlast):</span>
                          <span className="text-shiraz font-mono font-bold">{formatDeWert(marshallStability)} kN</span>
                        </label>
                        <input 
                          type="range" min="2.0" max="25.0" step="0.5" value={marshallStability}
                          onChange={(e) => setMarshallStability(Number(e.target.value))}
                          className="w-full accent-shiraz cursor-pointer"
                        />
                        <span className="text-[10px] text-slate-500 block">Orientierungswerte aus der Literatur; die TL Asphalt-StB enthält keine Marshall-Anforderungen mehr.</span>
                      </div>

                      <div className="space-y-1 pt-1">
                        <label className="text-xs font-bold text-slate-750 flex justify-between">
                          <span>Prüf-Fließwert F (Stauchung):</span>
                          <span className="text-emerald-700 font-mono font-bold">{formatDeWert(marshallFlow)} mm</span>
                        </label>
                        <input 
                          type="range" min="0.5" max="8.0" step="0.1" value={marshallFlow}
                          onChange={(e) => setMarshallFlow(Number(e.target.value))}
                          className="w-full accent-shiraz cursor-pointer"
                        />
                        <span className="text-[10px] text-slate-500 block">Typische Fließwerte liegen etwa zwischen 2 und 4 mm (Orientierung).</span>
                      </div>

                      {/* Calculations output Marshall */}
                      <div className="bg-slate-50 border border-home-grau/30 p-4 rounded-xl mt-4 space-y-2.5 text-xs font-sans">
                        <h5 className="font-bold text-shiraz uppercase tracking-widest border-b border-home-grau/20 pb-1 font-mono">Ergebnisse Marshallprüfung</h5>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Stabilität <InlineMath math="S" />:</span>
                          <span className="font-bold font-mono text-slate-800">{formatDeZahl(marshallStability, 1)} kN</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Fließwert <InlineMath math="F" />:</span>
                          <span className="font-bold font-mono text-slate-800">{formatDeZahl(marshallFlow, 1)} mm</span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-home-grau/20">
                          <span className="text-slate-500 font-bold text-shiraz">Marshall-Quotient <InlineMath math="Q = S/F" />:</span>
                          <span className="font-bold font-mono text-shiraz text-sm">{formatDeZahl(marshallQuotient, 2)} kN/mm</span>
                        </div>
                        <div className="bg-slate-100 p-2 rounded text-[10px] text-slate-700 leading-normal font-semibold text-center">
                          {marshallQuotient > 4.5 ? (
                            <span className="text-red-900 font-bold block">Hoher Quotient: sehr steifes Mischgut – Hinweis auf mögliche Rissempfindlichkeit bei Kälte.</span>
                          ) : marshallQuotient < 1.5 ? (
                            <span className="text-amber-900 font-bold block">Niedriger Quotient: plastisches Mischgut – Hinweis auf mögliche Spurrinnenanfälligkeit (Spurbildungsversuch durchführen).</span>
                          ) : (
                            <span className="text-emerald-900 font-bold block">Mittlerer Bereich (Orientierung; maßgebend ist der Spurbildungsversuch).</span>
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
                      <select aria-label="Nenn-Durchmesser d" 
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
                      <label className="text-xs font-bold text-slate-750 flex justify-between">
                        <span>Anfangs-L0:</span>
                        <span className="text-slate-600 font-mono font-bold">{formatDeWert(steelLength0)} mm</span>
                      </label>
                      <input 
                        type="number" min="0"
                        value={steelLength0}
                        onChange={(e) => setSteelLength0(Math.max(10, Number(e.target.value)))}
                        className="w-full border border-home-grau/30 p-1 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-shiraz text-center bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-bold text-slate-750 flex justify-between">
                      <span>Kraft an der Streckgrenze F_e:</span>
                      <span className="text-shiraz font-mono font-bold">{formatDeZahl(steelForceYield, 1)} kN</span>
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
                    <label className="text-xs font-bold text-slate-750 flex justify-between">
                      <span>Höchstkraft F_m:</span>
                      <span className="text-emerald-700 font-mono font-bold">{formatDeZahl(steelForceUltimate, 1)} kN</span>
                    </label>
                    <input 
                      type="range" min="12" max="500" step="1" value={steelForceUltimate}
                      onChange={(e) => setSteelForceUltimate(Math.max(steelForceYield + 2, Number(e.target.value)))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-bold text-slate-750 flex justify-between">
                      <span>Messlänge bei Höchstkraft L_m (Extensometer, unter Last):</span>
                      <span className="text-slate-700 font-mono font-bold">{formatDeWert(steelLengthU)} mm</span>
                    </label>
                    <input 
                      type="range" min={steelLength0} max={steelLength0 + 40} step="0.5" value={steelLengthU}
                      onChange={(e) => setSteelLengthU(Math.max(steelLength0, Number(e.target.value)))}
                      className="w-full accent-slate-800 cursor-pointer"
                    />
                  </div>

                  {/* Steel calculations output panel */}
                  <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl mt-4 space-y-3 font-sans">
                    <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-widest border-b border-emerald-200 pb-1 font-mono">Auswertung Zugversuch (Vergleich mit DIN 488-1)</h5>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-xs">
                      
                      <div className="text-slate-500">Stabquerschnitt (S0):</div>
                      <div className="font-bold text-right text-slate-800 font-mono">{formatDeZahl(steelRes.area, 1)} mm²</div>

                      <div className="text-slate-500 font-semibold text-slate-800">Streckgrenze (Re):</div>
                      <div className={`font-bold text-right font-mono ${steelRes.yieldPassed ? 'text-emerald-800' : 'text-rose-700'}`}>
                        {formatDeZahl(steelRes.yieldStrength, 1)} MPa
                      </div>

                      <div className="text-slate-500 font-semibold text-slate-800">Zugfestigkeit (Rm):</div>
                      <div className="font-bold text-right text-slate-800 font-mono font-bold">{formatDeZahl(steelRes.ultimateStrength, 1)} MPa</div>

                      <div className="text-slate-500">Verhältnis (Rm / Re):</div>
                      <div className={`font-bold text-right font-mono ${steelRes.ratiosPassed ? 'text-emerald-800' : 'text-amber-700'}`}>
                        {formatDeZahl(steelRes.ratio, 2)}
                      </div>

                      <div className="text-slate-500">Gesamtdehnung bei Höchstkraft (A_gt):</div>
                      <div className={`font-bold text-right font-mono ${steelRes.elongationPassed ? 'text-emerald-800' : 'text-slate-800'}`}>
                        {formatDeZahl(steelRes.elongation, 1)} %
                      </div>
                    </div>
                    
                    <div className="text-[10px] bg-white border border-emerald-200 px-2.5 py-2 rounded-lg text-center">
                      <span className="font-bold text-slate-700 block">Duktilitätsbewertung (Einzelwert, Nennquerschnitt):</span>
                      <span className="text-shiraz font-bold">{steelRes.complianceClass}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. HOLZ-PRÜFSTAND */}
              {activeCategory === 'holz_organisch' && (
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 rounded border border-emerald-150 font-mono uppercase">
                    🛠️ Modus: Holz-Biegeversuch (4-Punkt, DIN EN 408)
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-750 flex justify-between">
                        <span>Rohdichte ρ0:</span>
                        <span className="text-shiraz font-mono font-bold">{formatDeZahl(woodDensity, 2)} g/cm³</span>
                      </label>
                      <input 
                        type="range" min="0.30" max="0.85" step="0.01" value={woodDensity}
                        onChange={(e) => setWoodDensity(Number(e.target.value))}
                        className="w-full h-1 accent-shiraz cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-500 leading-none">Fichte: ca. 0,46; Buche: ca. 0,7.</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-750 flex justify-between">
                        <span>Holzfeuchte u:</span>
                        <span className="text-emerald-700 font-mono font-bold">{formatDeWert(woodMoisture)} %</span>
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
                      <label className="text-[11px] font-bold text-slate-600">Balkenbreite b (mm):</label>
                      <input aria-label="Balkenbreite b (mm)" 
                        type="number" min="0" value={woodWidth}
                        onChange={(e) => setWoodWidth(Math.max(10, Number(e.target.value)))}
                        className="w-full border border-home-grau/30 p-1 rounded font-mono text-xs text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Balkenhöhe h (mm):</label>
                      <input aria-label="Balkenhöhe h (mm)" 
                        type="number" min="0" value={woodHeight}
                        onChange={(e) => setWoodHeight(Math.max(10, Number(e.target.value)))}
                        className="w-full border border-home-grau/30 p-1 rounded font-mono text-xs text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Stützweite L (mm, Norm: 18·h):</label>
                      <input aria-label="Stützweite L (mm, Norm: 18·h)" 
                        type="number" min="0" value={woodSpan}
                        onChange={(e) => setWoodSpan(Math.max(100, Number(e.target.value)))}
                        className="w-full border border-home-grau/30 p-1 rounded font-mono text-xs text-center"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 pt-1.5">
                    <label className="text-xs font-bold text-slate-750 flex justify-between">
                      <span>Gemessene Gesamt-Bruchlast F (beide Lastpunkte):</span>
                      <span className="text-emerald-700 font-mono font-bold">{formatDeZahl(woodBendingForce, 1)} kN</span>
                    </label>
                    <input 
                      type="range" min="0.5" max="25" step="0.5" value={woodBendingForce}
                      onChange={(e) => setWoodBendingForce(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  {/* Wood Estimator Calculation Outputs */}
                  <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl mt-4 space-y-3 font-sans">
                    <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-widest border-b border-emerald-200 pb-1 font-mono">Biege- und Druckschätzung (Lehrmodell)</h5>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-xs">
                      
                      <div className="text-slate-500">Druckfestigkeit (faserparallel) fc,0 – Schätzung:</div>
                      <div className="font-bold text-right text-slate-800 font-mono">{formatDeZahl(woodRes.fc0_actual, 1)} MPa</div>

                      <div className="text-slate-500 font-semibold text-slate-800">Biegefestigkeit fm (aus F, DIN EN 408):</div>
                      <div className="font-bold text-right text-shiraz font-mono font-bold">
                        {formatDeZahl(woodRes.f_bending, 1)} N/mm²
                      </div>

                      <div className="text-slate-500">E-Modul E0 – grobe Schätzung:</div>
                      <div className="font-bold text-right text-slate-800 font-mono">
                        {formatDeZahl(woodRes.e_modul, 0)} MPa
                      </div>

                      <div className="text-slate-500 font-bold text-slate-850">Festigkeitsniveau (Orientierung):</div>
                      <div className="font-bold text-right text-emerald-800 font-bold font-mono">
                        {woodRes.strengthClassName}
                      </div>

                    </div>

                    <span className="block text-[10px] text-emerald-850 italic text-center">
                      Schätzwerte für eine Holzfeuchte von {formatDeWert(woodMoisture)} % (Bezugsfeuchte der Festigkeitsklassen: 12 %). Festigkeitsklassen nach DIN EN 338 erfordern charakteristische Werte aus Prüfserien (DIN EN 384).
                    </span>
                  </div>
                </div>
              )}

            </div>

            <div className="mt-6 pt-3 border-t border-home-grau/30 text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
              <Info size={11} /> 
              <span>Normformeln der Prüfnormen; Korrektur- und Schätzansätze sind als Lehrmodell gekennzeichnet.</span>
            </div>
          </div>

        </div>

      </div>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <div className="flex flex-col gap-6">
        <FormulaDerivationBox
          title="Beispiel 1: Würfeldruckfestigkeit aus der Bruchlast"
          zielGleichung="f_c = \frac{F}{A_c}"
          schritte={[
            { titel: 'Gegeben', erklaerung: 'Würfel mit 150 mm Kantenlänge, Alter 28 Tage, Höchstkraft F = 1050 kN.', formel: 'A_c = 150 \\cdot 150 = 22\\,500\\,\\text{mm}^2' },
            { titel: 'Druckfestigkeit', erklaerung: 'Kraft in N umrechnen (1 kN = 1000 N):', formel: 'f_c = \\frac{1\\,050\\,000}{22\\,500} = 46{,}7\\,\\text{N/mm}^2' },
            { titel: 'Prüfdauer kontrollieren', erklaerung: 'Bei 0,6 MPa/s dauert die Laststeigerung bis zum Bruch etwa:', formel: 't \\approx \\frac{46{,}7}{0{,}6} \\approx 78\\,\\text{s}' }
          ]}
          ergebnisHinweis="Der Einzelwert wird auf 0,1 N/mm² angegeben. Die Konformität der Festigkeitsklasse wird nicht am Einzelwürfel, sondern statistisch nach DIN EN 206 an Prüfserien beurteilt (Modul Festbeton-Statistik)."
          normQuelle="DIN EN 12390-3:2019-10"
        />
        <FormulaDerivationBox
          title="Beispiel 2: Spaltzug- und zentrische Zugfestigkeit eines Zylinders"
          zielGleichung="f_{ct,sp} = \frac{2F}{\pi L d},\qquad f_{ct} = 0{,}9 \cdot f_{ct,sp}"
          schritte={[
            { titel: 'Gegeben', erklaerung: 'Zylinder d = 150 mm, L = 300 mm, Höchstkraft F = 250 kN.', formel: 'F = 250\\,000\\,\\text{N}' },
            { titel: 'Spaltzugfestigkeit', erklaerung: 'Einsetzen in die Formel nach DIN EN 12390-6:', formel: 'f_{ct,sp} = \\frac{2 \\cdot 250\\,000}{\\pi \\cdot 300 \\cdot 150} = 3{,}54\\,\\text{N/mm}^2' },
            { titel: 'Zentrische Zugfestigkeit', erklaerung: 'Umrechnung nach DIN EN 1992-1-1, 3.1.2(8):', formel: 'f_{ct} = 0{,}9 \\cdot 3{,}54 = 3{,}18\\,\\text{N/mm}^2' }
          ]}
          ergebnisHinweis="Zum Vergleich: DIN EN 1992-1-1 nennt für C40/50 f_ctm = 3,5 N/mm². Die Zugfestigkeit beträgt nur rund ein Zehntel bis ein Fünfzehntel der Druckfestigkeit."
          normQuelle="DIN EN 12390-6:2024-05; DIN EN 1992-1-1, 3.1.2(8)"
        />
        <FormulaDerivationBox
          title="Beispiel 3: Betonstahl-Zugversuch auswerten (B500B?)"
          zielGleichung="R_e = \frac{F_e}{S_0},\quad R_m = \frac{F_m}{S_0},\quad k = \frac{R_m}{R_e}"
          schritte={[
            { titel: 'Nennquerschnitt', erklaerung: 'Betonstahl Ø 12 mm, Auswertung auf den Nennquerschnitt:', formel: 'S_0 = \\pi \\cdot 6^2 = 113{,}1\\,\\text{mm}^2' },
            { titel: 'Streckgrenze und Zugfestigkeit', erklaerung: 'Gemessen: F_e = 62,0 kN, F_m = 69,5 kN.', formel: 'R_e = \\frac{62\\,000}{113{,}1} = 548\\,\\text{N/mm}^2,\\quad R_m = \\frac{69\\,500}{113{,}1} = 615\\,\\text{N/mm}^2' },
            { titel: 'Streckgrenzenverhältnis', erklaerung: 'Duktilitätskriterium:', formel: 'k = \\frac{615}{548} = 1{,}12 \\geq 1{,}08' },
            { titel: 'Dehnung bei Höchstkraft', erklaerung: 'Extensometer: Messlänge 100 mm, bei Höchstkraft 107,5 mm:', formel: 'A_{gt} = \\frac{7{,}5}{100} = 7{,}5\\,\\% \\geq 5{,}0\\,\\%' }
          ]}
          ergebnisHinweis="Der Einzelstab erfüllt die Kennwerte von B500B (hochduktil). Für den Nachweis der Lieferung verlangt DIN 488-1 charakteristische Werte aus Prüfserien."
          normQuelle="DIN EN ISO 15630-1 / DIN EN ISO 6892-1; DIN 488-1"
        />
      </div>

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="mechanische_pruefungen" />

      {/* --- Unified Module Footer Integration --- */}
      <ModuleFooter 
        weblinks={[
          { title: "Bundesanstalt für Materialforschung und -prüfung (BAM)", url: "https://www.bam.de" },
          { title: "FGSV – Technische Prüfvorschriften Asphalt (TP Asphalt-StB)", url: "https://www.fgsv-verlag.de" }
        ]}
        wikipedia={[
          { title: 'Beton (Druckfestigkeit)', url: 'https://de.wikipedia.org/wiki/Beton' },
          { title: 'Zugversuch', url: 'https://de.wikipedia.org/wiki/Zugversuch' },
          { title: 'Kerbschlagbiegeversuch', url: 'https://de.wikipedia.org/wiki/Kerbschlagbiegeversuch' },
          { title: 'Asphalt', url: 'https://de.wikipedia.org/wiki/Asphalt' }
        ]}
        regelwerke={[
          { title: 'DIN EN 12390-3:2019-10 (Prüfung von Festbeton - Teil 3: Druckfestigkeit von Probekörpern)' },
          { title: 'DIN EN 12390-5 (Deutsche Fassung EN 12390-5:2019; Biegezugfestigkeit von Probekörpern)' },
          { title: 'DIN EN 12390-6:2024-05 (Prüfung von Festbeton - Teil 6: Spaltzugfestigkeit von Probekörpern)' },
          { title: 'DIN EN 12697-22 / -23 / -34 (Asphalt – Spurbildungstest, indirekte Zugfestigkeit, Marshall-Prüfung)' },
          { title: 'DIN EN ISO 6892-1:2020-06 (Metallische Werkstoffe - Zugversuch - Teil 1: Prüfverfahren bei Raumtemperatur)' },
          { title: 'DIN EN ISO 15630-1 (Stähle für die Bewehrung von Beton – Prüfverfahren) / DIN 488-1 (Betonstahl – Sorten, Eigenschaften)' },
          { title: 'DIN EN ISO 148-1 (Metallische Werkstoffe – Kerbschlagbiegeversuch nach Charpy)' },
          { title: 'DIN EN 408:2012-10 (Holzbauwerke - Bauholz für tragende Zwecke: Bestimmung mechanischer Eigenschaften)' },
          { title: 'DIN EN 338:2016-07 (Bauholz für tragende Zwecke - Festigkeitsklassen) / DIN EN 384 (charakteristische Werte)' },
          { title: 'DIN EN 302-1 / DIN EN 301 (Klebstoffe für tragende Holzbauteile – Prüfverfahren, Anforderungen)' }
        ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Blaß, H. J.; Sandhaas, C.: Ingenieurholzbau – Grundlagen der Bemessung. Karlsruhe: KIT Scientific Publishing 2016',
          'FGSV (Hrsg.): Technische Prüfvorschriften für Asphalt (TP Asphalt-StB). Köln: FGSV Verlag (Teile in jeweils gültiger Fassung)'
        ]}
        formeln={[
          {
            formel: 'f_c = \\frac{F_{max}}{A_0}',
            erklaerung: 'Druckfestigkeit als Höchstkraft bezogen auf die Lastfläche bei Würfel- und Zylinderprüfung.',
            quelle: 'DIN EN 12390-3:2019-10'
          },
          {
            formel: 'S_t = \\frac{2 \\cdot P}{\\pi \\cdot D \\cdot H}',
            erklaerung: 'Indirekte Zugfestigkeit (ITS) des Asphalts unter linienförmiger Last.',
            quelle: 'DIN EN 12697-23 (EN 12697-23:2017)'
          },
          {
            formel: 'R_m = \\frac{F_m}{S_0}',
            erklaerung: 'Zugfestigkeit als Höchstkraft bezogen auf den Anfangsquerschnitt S₀.',
            quelle: 'DIN EN ISO 6892-1:2020-06'
          },
          {
            formel: 'f_m = \\frac{3 \\cdot F \\cdot a}{b \\cdot h^2}',
            erklaerung: 'Biegefestigkeit im 4-Punkt-Biegeversuch (F: Gesamtlast, a: Abstand Auflager–Lastpunkt, b: Breite, h: Höhe).',
            quelle: 'DIN EN 408:2012-10'
          },
          {
            formel: 'f_{ct,sp} = \\frac{2 \\cdot F}{\\pi \\cdot L \\cdot d}',
            erklaerung: 'Spaltzugfestigkeit eines Betonzylinders; zentrische Zugfestigkeit näherungsweise f_ct = 0,9 · f_ct,sp.',
            quelle: 'DIN EN 12390-6:2024-05; DIN EN 1992-1-1, 3.1.2'
          }
        ]}
        lastReviewed="Oktober 2026 (AP 4 Labor: Prüfverfahren Beton, Asphalt, Stahl und Holz gegen DIN EN 12390, DIN EN 12697, DIN EN ISO 6892-1/148-1/15630-1, DIN 488 und DIN EN 408 geprüft; fachliche Freigabe durch den Autor ausstehend)"
      />

    </div>
  );
}
