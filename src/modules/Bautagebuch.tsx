import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  ClipboardList, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  Trash2, 
  Bookmark, 
  GraduationCap, 
  HelpCircle, 
  ChevronRight, 
  Printer, 
  Info,
  ThermometerSnowflake,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';

// Define the construction projects
interface ProjectTemplate {
  id: string;
  name: string;
  location: string;
  client: string;
  structuralEngineer: string;
  budget: string;
  timeline: string;
  description: string;
  defaultTasks: string[];
}

const PROJECTS: ProjectTemplate[] = [
  {
    id: 'carbon-beton',
    name: 'Neubau Laborgebäude Carbonbeton (C³)',
    location: 'Campus TH Augsburg, Halle 4b',
    client: 'Staatliches Bauamt Augsburg / Freistaat Bayern',
    structuralEngineer: 'Ingenieurbüro Dr. Vrabec & Partner',
    budget: '€4.200.000',
    timeline: '12 Monate (Rohbau)',
    description: 'Forschungsbauwerk unter Verwendung von Carbonbeton. Erfordert hochfesten Feinbeton (Zementgehalt ≥ 450 kg/m³, w/z-Wert = 0.35) mit abgestimmter 2mm-Feingesteinskörnung, Hochleistungsfließmittel auf Polycarboxylatether-Basis (PCE) und korrosionsfreien Carbonfasergelegen.',
    defaultTasks: [
      'Einbau der korrosionsfreien Carbonfaser-Gelege (Zugbewehrung)',
      'Prüfung des Feinbeton-Ausbreitmaßes bzgl. Fließverhalten (dsp ≥ 700 mm)',
      'Dokumentation der adiabatischen Hydratationswärme im Bauteilkern',
      'Messen der Mindestbetondeckung an Deckenunterseiten (cmin = 10 mm)',
      'Ausschalen der Sichtbetonträger nach Erreichen der Festigkeit'
    ]
  },
  {
    id: 'mensa-sanierung',
    name: 'Denkmalschutz-Sanierung Mensa TH Augsburg',
    location: 'An der Hochschule 1, Augsburg',
    client: 'Technische Hochschule Augsburg (THA) (Körperschaft des öff. Rechts)',
    structuralEngineer: 'Tragwerksplanung Dipl.-Ing. Keller',
    budget: '€1.850.000',
    timeline: '6 Monate (Sommersemester)',
    description: 'Tragwerkssanierung im historischen Bestand. Einbau von Holz-Beton-Verbunddecken mit Trass-Kalk-Mörtel im Mauerwerksbereich zur Vermeidung alkalischer Ausblühungen sowie mineralischem Fließestrich (CA-C25-F5 auf Anhydritbasis) mit Belegreife-Analysen.',
    defaultTasks: [
      'Einbringen der selbstschneidenden Schrauben für Holz-Beton-Verbund',
      'CM-Restfeuchtemessung des frisch hergestellten Calciumsulfatestrichs (Soll < 0,5%)',
      ' NHL-Trassmörtelmischung am historischen Sichtmauerwerk prüfen',
      'Rissverpressung (Epoxidharz-Injektion nach DIN EN 1504) im Außenmauerwerk',
      'Auftragen der bitumenfreien Bauwerks-Reaktivabdichtung (MDS) an Sockelanschlüssen'
    ]
  },
  {
    id: 'parkhaus-fertigteil',
    name: 'Neubau Studierenden-Parkhaus (Fertigteilbau)',
    location: 'Brunnenlechgässchen, Augsburg',
    client: 'Parkhaus GmbH Augsburg',
    structuralEngineer: 'Büro für Baustatik Müller & Co.',
    budget: '€3.100.000',
    timeline: '8 Monate (Schnellmontage)',
    description: 'Montage von großformatigen Fertigteilen hoher Festigkeitsklassen (C50/60). Kritische Schnittstellen sind das schwindkompensierte Ausgießen der lastübertragenden Fugen mit quellfähigem Vergussmörtel, Expositionsklassen XD3/XS3 sowie Tausalzbeständigkeit durch Hydrophobierung.',
    defaultTasks: [
      'Montage der vorgefertigten C50/60 Spannbetonträger (Takt 3)',
      'Ausgießen der Ringanker-Schnittstellen mit quellfähigem Vergussmörtel',
      'Haftzugprüfung der rissüberbrückenden OS-11-Fahrbahnbeschichtung',
      'Verbundfugen-Rauheit vor Schwindfugenverguss nach Eurocode 2 prüfen',
      'Auftrag der hydrophobierenden Silan-Imprägnierung auf Sichtbeton-Randträgern'
    ]
  }
];

// Structured Scenario Challenges
interface Scenario {
  id: string;
  name: string;
  title: string;
  description: string;
  date: string;
  tempMin: number;
  tempMax: number;
  weatherConditions: string[];
  objective: string;
  hints: string[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 'schlechtwetter',
    name: 'Betonieren bei Frostgefahr',
    title: 'Herausforderung: Hydratation & Gefrierschutz nach DIN 1045-3',
    description: 'Es ist November. Die Temperaturen sinken nachts auf +1,5°C ab, begleitet von starkem Wind (erhöhte Verdunstungsgefahr!). Heute wird die hochfeste Carbonbeton-Bodenplatte betoniert. Der Polier verlangt eigenmächtig Wasserzugabe am Fahrmischer bzgl. Verarbeitbarkeit. Ein fehlerhaftes Protokoll oder mangelnde Curing-Maßnahmen ruinieren die Festigkeitsklasse des Betons irreparabel.',
    date: '15. November 2026',
    tempMin: 1.5,
    tempMax: 4.5,
    weatherConditions: ['Rain', 'Frost'],
    objective: 'Dokumentieren Sie die kalte Witterung, untersagen Sie jegliche unkontrollierte Wasserzugabe (Vermeidung von w/z-Werterhöhung), veranlassen Sie das Auflegen von Thermomatten (Wärme-Haltevorkehrung der Hydratationswärme) und messen Sie die Frischbetontemperatur (Soll ≥ +5°C nach DIN 1045-3).',
    hints: [
      'Geben Sie die Min-Temperatur exakt auf 1,5 °C an, um die Frost-Hydratationswarnung auszulösen.',
      'Wählen Sie im Prüfverfahren-Bereich "Frischbetontemperatur gemessen" und "Ausbreitversuch durchgeführt" aus.',
      'Ergänzen Sie im Freitext "Auflegen von Thermomatten (Wärmeschutz und Nachbehandlung nach DIN 1045-3)".',
      'Dokumentieren Sie das Verbot des Wasserzusatzes: Er erhöht den w/z-Wert und mindert Festigkeit und Dauerhaftigkeit.'
    ]
  },
  {
    id: 'claim_conflict',
    name: 'Feuchtigkeitsschutz & Baurecht',
    title: 'Herausforderung: Weglassen der Sockelabdichtung (MDS)',
    description: 'Bei der denkmalgeschützten Mensa-Sanierung fordert der Projektleiter mündlich den Verzicht auf die rissüberbrückende mineralische Dichtungsschlämme (MDS) am feuchtebeanspruchten Sockelbereich wg. Budgetkürzungen. Das widerspricht den Anforderungen der Abdichtungsnorm DIN 18533 und dem vereinbarten Leistungssoll.',
    date: '28. Juni 2026',
    tempMin: 19.0,
    tempMax: 26.5,
    weatherConditions: ['Sunny'],
    objective: 'Tragen Sie die gefahrvolle baustoffliche Abweichung ein. Melden Sie als ausführendes Unternehmen schriftlich Bedenken nach VOB/B § 4 Abs. 3 an und begründen Sie diese baustofflich (Kapillarer Feuchtigkeitstransport, Frostabplatzungen im Trass-Kalk-Mörtel und massive Zerstörung des Putzgefüges).',
    hints: [
      'Wer schreibt, der bleibt! Notieren Sie den Namen des Projektleiters Schmidt und die unsachgemäße Anordnung.',
      'Setzen Sie den Haken bei "Bedenkenanmeldung erheben" auf AKTIV.',
      'Begründen Sie baustofflich mit den Verletzungen der DIN 18533 (Bauwerksabdichtung) und drohenden Schädlings- und Schimmelbefällen.'
    ]
  },
  {
    id: 'delay_excavator',
    name: 'Güteabnahme Fugenmörtel verzögert',
    title: 'Herausforderung: Baustopp wg. Fugenverguss im Fertigteilbau',
    description: 'Im Studierenden-Parkhaus ist der Spezialmörtel zum schwindkompensierten Ausgießen der Stützen-Vergussfugen (Festigkeitsklasse C50/60 gefordert) verzögert geliefert worden. Ohne Festigkeitsnachweis der Vorleistung im Takt 1 darf der Autokran keine weiteren Spannbetonträger auflegen. Der Kran-Stillstand kostet täglich hohe Mieten.',
    date: '04. Mai 2026',
    tempMin: 12.0,
    tempMax: 17.5,
    weatherConditions: ['Cloudy'],
    objective: 'Protokollieren Sie die Baustörung. Aktivieren Sie die "Behinderungsanzeige" nach VOB/B § 6, um Verzugsstrafen abzuwenden und fordern Sie den Festigkeitsnachweis (Prüfbericht) sowie den Verwendbarkeitsnachweis des Vergussmörtels an.',
    hints: [
      'Grenzfälle im Fertigteilbau sind sicherheitskritisch: Markieren Sie die Behinderungsanzeige auf JA.',
      'Erfassen Sie im Störungsfeld die genaue Ursache: ausstehender Festigkeitsnachweis für den Vergussmörtel.',
      'Weisen Sie darauf hin, dass erst nach Erreichen der von der Tragwerksplanung geforderten Fugenfestigkeit (z. B. 70 % von f_ck) weiter belastet werden darf.'
    ]
  }
];

interface SavedDiary {
  id: string;
  projectId: string;
  projectName: string;
  berichtNummer: number;
  date: string;
  wetterTempMin: number;
  wetterTempMax: number;
  wetterBedingungen: string[];
  wetterEinfluss: string;
  arbeiterEigene: number;
  arbeiterSubStr: string;
  fortschritt: string;
  stoerungen: string;
  testingActive: string[];
  anweisungen: string;
  behinderung: boolean;
  behinderungDetails: string;
  bedenken: boolean;
  bedenkenDetails: string;
  score: number;
  grade: string;
  professorSummary: string;
  checklistChecks: { title: string; success: boolean; detail: string }[];
}

export default function Bautagebuch() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('carbon-beton');
  const [activeTab, setActiveTab] = useState<'editor' | 'scenarios' | 'saved' | 'guide'>('guide');
  
  // Form State
  const [berichtNummer, setBerichtNummer] = useState<number>(12);
  const [dateStr, setDateStr] = useState<string>('2026-06-07');
  const [tempMin, setTempMin] = useState<number>(18);
  const [tempMax, setTempMax] = useState<number>(24);
  const [selectedWeather, setSelectedWeather] = useState<string[]>(['Sunny']);
  const [weatherEinfluss, setWeatherEinfluss] = useState<string>('Keine Beeinflussung');
  const [arbeiterEigene, setArbeiterEigene] = useState<number>(4);
  const [arbeiterSubStr, setArbeiterSubStr] = useState<string>(
    'Bauunternehmung Müller GmbH: 1 Polier, 4 Betonbauer\nTGA-Elektro Schmidt: 2 Monteure'
  );
  const [fortschritt, setFortschritt] = useState<string>(
    'Decke über UG: Bewehrungsabnahme durch Prüfstatiker ohne gravierende Rügen erfolgt. Beginn Vorbereitungen Betonguss.'
  );
  const [stoerungen, setStoerungen] = useState<string>('');
  const [selectedTesting, setSelectedTesting] = useState<string[]>([]);
  const [anweisungen, setAnweisungen] = useState<string>('');
  
  // VOB / Claims States
  const [behinderung, setBehinderung] = useState<boolean>(false);
  const [behinderungDetails, setBehinderungDetails] = useState<string>('');
  const [bedenken, setBedenken] = useState<boolean>(false);
  const [bedenkenDetails, setBedenkenDetails] = useState<string>('');

  // Assessment Feedback
  const [reviewResult, setReviewResult] = useState<SavedDiary | null>(null);
  const [savedDiaries, setSavedDiaries] = useState<SavedDiary[]>([]);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bau_bautagebuch_diaries');
      if (stored) {
        setSavedDiaries(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not load saved diaries", e);
    }
  }, []);

  const selectedProject = PROJECTS.find(p => p.id === selectedProjectId) || PROJECTS[0];

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    const proj = PROJECTS.find(p => p.id === id);
    if (proj) {
      setFortschritt(`Arbeiten an: ${proj.defaultTasks[0]} heute durchgeführt. QS-Kontrollen eingeleitet.`);
    }
    setActiveScenarioId(null);
  };

  const handleLoadScenario = (scenario: Scenario) => {
    setActiveScenarioId(scenario.id);
    setDateStr('2026-06-07'); // Default date format for input
    setBerichtNummer(Math.floor(Math.random() * 30) + 1);
    setTempMin(scenario.tempMin);
    setTempMax(scenario.tempMax);
    setSelectedWeather(scenario.weatherConditions);
    setWeatherEinfluss(scenario.tempMin < 5 ? 'Beeinträchtigung' : 'Keine Beeinflussung');
    setFortschritt('');
    // Lösungsfelder starten leer: Die Aufgabe steht in der Szenariobeschreibung, gelöst wird im Editor.
    setStoerungen('');
    setAnweisungen('');
    setBehinderung(false);
    setBehinderungDetails('');
    setBedenken(false);
    setBedenkenDetails('');
    setSelectedTesting([]);
    setReviewResult(null);
    setActiveTab('editor');
  };

  const toggleWeather = (condition: string) => {
    if (selectedWeather.includes(condition)) {
      setSelectedWeather(selectedWeather.filter(c => c !== condition));
    } else {
      setSelectedWeather([...selectedWeather, condition]);
    }
  };

  const toggleTesting = (test: string) => {
    if (selectedTesting.includes(test)) {
      setSelectedTesting(selectedTesting.filter(t => t !== test));
    } else {
      setSelectedTesting([...selectedTesting, test]);
    }
  };

  // Run structured evaluation rules according to German Standards (VOB, HOAI Lph 8, DIN 1045)
  const handleAnalyzeAndSubmit = () => {
    const checks: { title: string; success: boolean; detail: string }[] = [];
    let score = 100; // start with full score, deduct on issues

    // Check 1: General descriptors filled in
    if (!fortschritt || fortschritt.trim().length < 15) {
      score -= 20;
      checks.push({
        title: "Detaillierungsgrad Baufortschritt (DIN 1045 / VOB)",
        success: false,
        detail: "Die Dokumentation des täglichen Arbeitsfortschritts ist unvollständig oder leer. Gemäß HOAI Lph 8 ist eine lückenlose Dokumentation gefordert."
      });
    } else {
      checks.push({
        title: "Detaillierungsgrad Baufortschritt (DIN 1045 / VOB)",
        success: true,
        detail: "Sehr gut! Sie haben den täglichen Arbeitsfortschritt plausibel beschrieben."
      });
    }

    // Check 2: Weather and Temperature Analysis
    if (tempMin === undefined || tempMax === undefined || tempMin > tempMax) {
      score -= 10;
      checks.push({
        title: "Temperaturangaben unterliegen logischer Plausibilität",
        success: false,
        detail: "Die Mindesttemperatur darf nicht größer als die Maximaltemperatur sein."
      });
    } else {
      checks.push({
        title: "Temperaturangaben vorhanden",
        success: true,
        detail: `Temperaturspektrum von ${formatDeWert(tempMin)}°C bis ${formatDeWert(tempMax)}°C dokumentiert.`
      });
    }

    // Checking Concrete Winter Concreting rules (critical for civil engineering students)
    const mentionsConcrete = fortschritt.toLowerCase().includes('beton') || workerDescribesConcrete(arbeiterSubStr) || fortschritt.toLowerCase().includes('platte') || fortschritt.toLowerCase().includes('decke');
    if (tempMin < 5 && mentionsConcrete) {
      const handlesWinterMat = fortschritt.toLowerCase().includes('matte') || fortschritt.toLowerCase().includes('folie') || fortschritt.toLowerCase().includes('thermomatte') || fortschritt.toLowerCase().includes('winter') || fortschritt.toLowerCase().includes('heiz') || fortschritt.toLowerCase().includes('curing') || fortschritt.toLowerCase().includes('temperatur');
      
      if (!handlesWinterMat) {
        score -= 25;
        checks.push({
          title: "Winterbaumaßnahmen nach DIN 1045-3 bei Betonarbeiten",
          success: false,
          detail: `Kritischer Fehler! Bei Bauteil- und Außentemperaturen unter +5°C (${formatDeWert(tempMin)}°C) darf Beton nicht unbeaufsichtigt und ungeschützt erhärten. Sie müssen explizit Frostschutzmaßnahmen (Thermodecken, Folien o.ä.) im Bautagebuch anordnen.`
        });
      } else {
        checks.push({
          title: "Winterbaumaßnahmen nach DIN 1045-3 bei Betonarbeiten",
          success: true,
          detail: "Hervorragend! Sie haben trotz Temperaturen unter 5 °C angemessene Wärmeschutz- und Nachbehandlungsmaßnahmen nach DIN 1045-3 dokumentiert."
        });
      }

      // Check concrete testing for cold weather
      const testingConcreteTemp = selectedTesting.includes('Frischbetontemperatur gemessen');
      if (!testingConcreteTemp) {
        score -= 15;
        checks.push({
          title: "Frischbetontemperatur-Messkontrolle",
          success: false,
          detail: "Zementhydratation verlangt bei Frischbeton einen Mindesteinbauwert von +5°C. Bei Frostgefahr muss die Frischbetontemperatur gemessen und im Prüfprotokoll eingetragen werden."
        });
      } else {
        checks.push({
          title: "Frischbetontemperatur-Messkontrolle",
          success: true,
          detail: "Sehr gut. Die Frischbeton-Kerntemperaturüberwachung wurde vorgenommen."
        });
      }
    }

    // Check 3: Active Scenario Specific Rules
    if (activeScenarioId === 'schlechtwetter') {
      // Must deny water addition
      const deniedWater = fortschritt.toLowerCase().includes('wasser') || stoerungen.toLowerCase().includes('wasser') || fortschritt.toLowerCase().includes('fm') || fortschritt.toLowerCase().includes('fließmittel') || stoerungen.toLowerCase().includes('untersagt') || stoerungen.toLowerCase().includes('fließkraft');
      if (!deniedWater) {
        score -= 15;
        checks.push({
          title: "Szenario-Ziel: Versuchter Wasserzusatz",
          success: false,
          detail: "Mangelhafte Beurteilung. Sie haben dem Polier nicht schriftlich verboten, Wasser hinzuzufügen, oder den Vorfall stillschweigend übergangen. Wasserzugabe erhöht w/z-Wert exzessiv!"
        });
      } else {
        checks.push({
          title: "Szenario-Ziel: Versuchter Wasserzusatz",
          success: true,
          detail: "Perfekt! Sie haben das illegale Hinzufügen von Baustellenwasser explizit untersagt und auf eine normgerechte Konsistenzregelung per Fließmittel verwiesen."
        });
      }
    }

    if (activeScenarioId === 'claim_conflict') {
      if (!bedenken) {
        score -= 30;
        checks.push({
          title: "Szenario-Ziel: Bedenkenanmeldung nach VOB/B § 4 Abs. 3",
          success: false,
          detail: "Baurechtliches Risiko! Eine mündliche Weisung des Bauherrn zum Weglassen von Kernabdichtungen erfordert eine unverzügliche schriftliche Bedenkenanmeldung; ohne sie haftet das ausführende Unternehmen für den entstehenden Mangel (§ 13 Abs. 3 VOB/B)."
        });
      } else if (!bedenkenDetails || bedenkenDetails.trim().length < 15) {
        score -= 15;
        checks.push({
          title: "Präzision der Bedenkenanmeldung",
          success: false,
          detail: "Sie haben Bedenken angekreuzt aber die bautechnische Begründung (z.B. Verletzung der DIN 18533, Feuchteschäden) nicht detailliert beschrieben."
        });
      } else {
        checks.push({
          title: "Szenario-Ziel: Bedenkenanmeldung nach VOB/B § 4 Abs. 3",
          success: true,
          detail: "Exzellent abgefangen! Die formale schriftliche Anmeldung von Bedenken schützt Ihr Büro und den Auftraggeber vor kostspieligen Überraschungen und Schimmelbildung."
        });
      }
    }

    if (activeScenarioId === 'delay_excavator') {
      if (!behinderung) {
        score -= 30;
        checks.push({
          title: "Szenario-Ziel: Behinderungsanzeige (VOB/B § 6)",
          success: false,
          detail: "Gestörtes Bau-Soll! Wenn Fremdfirmen nicht plangemäß leisten und dadurch teure Maschinen (z.B. Autokran) stillstehen, müssen Sie unverzüglich eine formale schriftliche Behinderungsanzeige einreichen, um Ansprüche auf Bauzeitverlängerung zu sichern."
        });
      } else if (!behinderungDetails || behinderungDetails.trim().length < 15) {
        score -= 15;
        checks.push({
          title: "Schadensminderung im Baubetrieb",
          success: false,
          detail: "Sie haben die Behinderung markiert, aber den betroffenen Verursacher und die genauen wirtschaftlichen Konsequenzen (Verzug, Stillstandskosten Kran) nicht hinreichend spezifiziert."
        });
      } else {
        checks.push({
          title: "Szenario-Ziel: Behinderungsanzeige (VOB/B § 6)",
          success: true,
          detail: "Sehr klug reagiert. Die Behinderungsanzeige sichert dem ausführenden Unternehmen die Verlängerung der Ausführungsfristen (§ 6 Abs. 2 VOB/B) und schützt vor Vertragsstrafen wegen nicht zu vertretender Verzögerung."
        });
      }
    }

    // Check 4: CM-testing for Concrete/Estrich
    const mentionsEstrich = fortschritt.toLowerCase().includes('estrich') || fortschritt.toLowerCase().includes('belegreif') || FortschrittDescribesFloor(fortschritt);
    if (mentionsEstrich && selectedProjectId === 'mensa-sanierung') {
      const ranCMTest = selectedTesting.includes('CM-Messung durchgeführt');
      if (!ranCMTest) {
        score -= 15;
        checks.push({
          title: "Belegreifeprüfung (CM-Methode, VOB/C DIN 18365/18356)",
          success: false,
          detail: "Achtung! Vor der Belegung eines Estrichs mit feuchteempfindlichen Belägen (Holz/Vinyl) muss eine Calciumcarbid-Messung (CM) zur Restfeuchtebestimmung stattfinden und protokolliert werden."
        });
      } else {
        checks.push({
          title: "Belegreifeprüfung (CM-Methode, VOB/C DIN 18365/18356)",
          success: true,
          detail: "Klassenbeste Entscheidung: CM-Protokoll erhoben, damit der Parkettleger die Haftung wegen aufsteigender Feuchtigkeit nicht abwälzen kann."
        });
      }
    }

    // Check 5: General Personnel Logging
    if (!arbeiterSubStr || arbeiterSubStr.trim().length < 10) {
      score -= 10;
      checks.push({
        title: "Dokumentation am Bau - Personalstärke",
        success: false,
        detail: "Unvollständige Berichterstattung! Für die Dokumentation der Leistungsfähigkeit und Streitigkeiten müssen alle tätigen Mitarbeiter der Fremdfirmen sowie deren Gewerke täglich namentlich oder nach Qualifikation gezählt werden."
      });
    } else {
      checks.push({
        title: "Dokumentation am Bau - Personalstärke",
        success: true,
        detail: "Personalstand der Fremdfirmen und Subunternehmer wurde erfolgreich erfasst."
      });
    }

    // Standardize score bounds
    score = Math.max(10, Math.min(100, score));

    // Calculate German Grade system (1.0 = Sehr gut, 5.0 = Mangelhaft)
    let grade = '5.0';
    let summaryText = '';
    if (score >= 95) {
      grade = '1.0';
      summaryText = 'Herausragende Leistung! Ihr Bautagebuch entspricht vollumfänglich den rechtlichen Ansprüchen nach VOB/B, der HOAI Leistungsphase 8 sowie den einschlägigen technischen DIN-Normen. Damit ist der Bauablauf beweissicher dokumentiert.';
    } else if (score >= 88) {
      grade = '1.7';
      summaryText = 'Sehr gute Ausarbeitung. Alle sicherheitsrelevanten Witterungsverhältnisse und wesentlichen Bauabschnitte wurden erfasst. Kleinste formale Lücken.';
    } else if (score >= 80) {
      grade = '2.3';
      summaryText = 'Gute Bauleiterqualität. Der Bericht ist absolut brauchbar und gerichtsverwertbar. Einige praxisnahe Detailhinweise zur Schadensminderung könnten tiefer ausfallen.';
    } else if (score >= 70) {
      grade = '3.0';
      summaryText = 'Durchsetzungsfähig, aber mit merklichen Auslassungen. Die Dokumentation ist im alltäglichen Regelbetrieb ausreichend, birgt aber feine rechtliche Schnittstellenschwächen im Streitfall.';
    } else if (score >= 60) {
      grade = '4.0';
      summaryText = 'Ausreichend (Gerade noch bestanden). Sie haben den Bericht ausgefüllt, jedoch gravierende Aspekte wie Mindest-Betonpflegeregeln oder formale VOB-Fristhinderungen vernachlässigt. Bitte überarbeiten!';
    } else {
      grade = '5.0';
      summaryText = 'Mangelhaft. Ihr Bericht ist rechtlich lückenhaft und bautechnisch fahrlässig. Bei Schadensfällen am Tragwerk oder Feuchtigkeitseinbruch haftet Ihre Bauleitung vollumfänglich. Nutzen Sie die Tipps und probieren Sie es erneut!';
    }

    const review: SavedDiary = {
      id: Math.random().toString(36).substr(2, 9),
      projectId: selectedProjectId,
      projectName: selectedProject.name,
      berichtNummer,
      date: dateStr,
      wetterTempMin: tempMin,
      wetterTempMax: tempMax,
      wetterBedingungen: selectedWeather,
      wetterEinfluss: weatherEinfluss,
      arbeiterEigene,
      arbeiterSubStr,
      fortschritt,
      stoerungen,
      testingActive: selectedTesting,
      anweisungen,
      behinderung,
      behinderungDetails,
      bedenken,
      bedenkenDetails,
      score,
      grade,
      professorSummary: summaryText,
      checklistChecks: checks
    };

    setReviewResult(review);

    // Append to local state list & save
    const updated = [review, ...savedDiaries];
    setSavedDiaries(updated);
    try {
      localStorage.setItem('bau_bautagebuch_diaries', JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  };

  const handleDeleteDiary = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedDiaries.filter(d => d.id !== id);
    setSavedDiaries(updated);
    try {
      localStorage.setItem('bau_bautagebuch_diaries', JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
    if (reviewResult && reviewResult.id === id) {
      setReviewResult(null);
    }
  };

  const handleResetForm = () => {
    setBerichtNummer(12);
    setTempMin(18);
    setTempMax(24);
    setSelectedWeather(['Sunny']);
    setWeatherEinfluss('Keine Beeinflussung');
    setArbeiterEigene(4);
    setArbeiterSubStr('Bauunternehmung Müller GmbH: 1 Polier, 4 Betonbauer\nTGA-Elektro Schmidt: 2 Monteure');
    const proj = PROJECTS.find(p => p.id === selectedProjectId);
    setFortschritt(proj ? `Arbeiten an: ${proj.defaultTasks[0]} heute durchgeführt.` : '');
    setStoerungen('');
    setSelectedTesting([]);
    setAnweisungen('');
    setBehinderung(false);
    setBehinderungDetails('');
    setBedenken(false);
    setBedenkenDetails('');
    setReviewResult(null);
    setActiveScenarioId(null);
  };

  function workerDescribesConcrete(txt: string) {
    if (!txt) return false;
    const l = txt.toLowerCase();
    return l.includes('beton') || l.includes('polier') || l.includes('misch');
  }

  function FortschrittDescribesFloor(txt: string) {
    if (!txt) return false;
    const l = txt.toLowerCase();
    return l.includes('estrich') || l.includes('boden') || l.includes('feucht') || l.includes('cm-');
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-8" id="bautagebuch-root">
      
      {/* HEADER HERO AREA */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-home-grau/30 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-shiraz/10 rounded-xl text-shiraz">
              <ClipboardList size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                Bautagebuch
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                HOAI Leistungsphase 8 (Objektüberwachung) &bull; Haftungsminimierung nach VOB
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveTab('guide'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                activeTab === 'guide' 
                  ? 'bg-shiraz/10 text-shiraz border-shiraz' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              id="tab-btn-guide"
            >
              Leitfaden (VOB-Regeln)
            </button>
            <button
              onClick={() => { setActiveTab('scenarios'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                activeTab === 'scenarios' 
                  ? 'bg-shiraz/10 text-shiraz border-shiraz' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              id="tab-btn-scenarios"
            >
              Lernszenarien
            </button>
            <button
              onClick={() => { setActiveTab('editor'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                activeTab === 'editor' 
                  ? 'bg-shiraz/10 text-shiraz border-shiraz' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              id="tab-btn-editor"
            >
              Bericht erstellen
            </button>
            <button
              onClick={() => { setActiveTab('saved'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border relative ${
                activeTab === 'saved' 
                  ? 'bg-shiraz/10 text-shiraz border-shiraz' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              id="tab-btn-saved"
            >
              Gespeicherte Berichte ({savedDiaries.length})
              {savedDiaries.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-shiraz text-xs font-bold text-white">
                  {savedDiaries.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* INFO BOX */}
        <div className="bg-slate-50 rounded-xl p-4 border border-home-grau/30 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm text-text-main font-semibold">Projekt-Steckbrief wählen (Baustellenprojekt)</p>
            <p className="text-xs text-slate-600">Jedes Projekt fordert unterschiedliche QS-Verfahren und birgt spezifische Anfängerrisiken.</p>
          </div>
          <div className="flex gap-2 flex-wrap" id="project-selector-group">
            {PROJECTS.map(proj => (
              <button
                key={proj.id}
                onClick={() => handleSelectProject(proj.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  selectedProjectId === proj.id
                    ? 'bg-shiraz text-white border-shiraz shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
                id={`btn-proj-${proj.id}`}
              >
                {proj.id === 'carbon-beton' ? '🔺 Carbonbeton' : proj.id === 'mensa-sanierung' ? '🏛️ Mensa Umbau' : '🏢 Parkhaus'}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Project Overview Card */}
        <div className="bg-stone-50 border border-stone-200 p-5 rounded-xl shadow-xs mb-8 text-stone-900">
          <div className="flex justify-between items-start flex-wrap gap-4 mb-3">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-stone-550 font-bold border-b border-stone-200 pb-0.5 block">Aktives Bauprojekt</span>
              <h3 className="text-base font-extrabold tracking-tight text-slate-900 mt-1">{selectedProject.name}</h3>
              <p className="text-xs text-slate-700 mt-1 font-medium leading-relaxed">{selectedProject.description}</p>
            </div>
            <div className="bg-stone-100 p-2.5 rounded-lg border border-stone-200 font-mono text-xs space-y-1 text-stone-800">
              <div><strong>Ort:</strong> {selectedProject.location}</div>
              <div><strong>Tragwerksplaner:</strong> {selectedProject.structuralEngineer}</div>
              <div><strong>Verfahrenswerte:</strong> {selectedProject.budget} &bull; {selectedProject.timeline}</div>
            </div>
          </div>
        </div>

        {/* ACTIVE LAYOUTS BASING ON SELECTED TAB */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-home-grau/30 pb-2">
              Leitfaden: Das VOB-Bautagebuch im Bauwesen
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                <div className="p-4 bg-off-white border-l-4 border-shiraz rounded-r-xl space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Info size={16} className="text-shiraz" /> Was ist ein Bautagebuch?
                  </h4>
                  <p>
                    Ein Bautagebuch ist die <strong>beweissichere, tagesaktuelle Dokumentation</strong> aller Vorgänge und Bedingungen auf einer Baustelle. Nach HOAI gehört es zu den Grundleistungen der <strong>Leistungsphase 8 (Objektüberwachung)</strong>.
                  </p>
                </div>
                
                <h4 className="font-bold text-slate-900">Die 4 unverzichtbaren Pflichtinhalte</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Witterung:</strong> Mindest- und Höchsttemperaturen (extrem kritisch für Betonierung bzgl. Gefrierpunkt und Rissbildung).</li>
                  <li><strong>Personal &amp; Gewerke:</strong> Anzahl der Arbeiter aller Firmen zur Überprüfung der Baukapazitäten und Fristen.</li>
                  <li><strong>Tagesleistung &amp; Baufortschritt:</strong> Räumlich genau lokalisierte Tätigkeiten (z.B. Deckenbewehrung über 1. OG).</li>
                  <li><strong>Abweichungen &amp; Störungen:</strong> Eventuelle Verzögerungen durch Schäden, unzureichende Vorleistungen oder Planungsfehler.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="bg-rose-50/40 border border-shiraz/20 p-5 rounded-2xl space-y-4">
                  <h4 className="font-bold text-shiraz flex items-center gap-1.5 text-sm">
                    <AlertTriangle size={18} /> Baurechtliche Kernfehler bei unvollständigen Logbüchern:
                  </h4>
                  <div className="space-y-3 font-medium text-xs sm:text-sm text-slate-800">
                    <div>
                      <span className="text-shiraz font-bold">1. Beweisnot im Streitfall:</span>
                      <p className="text-xs text-slate-700 mt-1">Kann die Bauüberwachung keine Temperaturaufzeichnungen vorlegen, fehlt der Nachweis ordnungsgemäßer Überwachung – die Abwehr von Ansprüchen wegen Frost- oder Feuchteschäden wird erheblich erschwert.</p>
                    </div>
                    <div>
                      <span className="text-shiraz font-bold">2. Verlust von Verzugs-Ansprüchen (§ 6 VOB/B):</span>
                      <p className="text-xs text-slate-700 mt-1">Ohne schriftliche Behinderungsanzeige werden Behinderungen nur berücksichtigt, wenn sie dem Auftraggeber offenkundig bekannt waren (§ 6 Abs. 1 VOB/B) – Ansprüche auf Bauzeitverlängerung und Ersatz sind dann gefährdet.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-home-grau/30 pt-4 flex justify-between items-center">
              <span className="text-xs text-slate-500 italic">Interaktives Praxismodul TH Augsburg</span>
              <button
                onClick={() => setActiveTab('scenarios')}
                className="px-5 py-2.5 bg-shiraz text-white rounded-xl text-xs font-bold hover:bg-shiraz/90 shadow-sm transition-all flex items-center gap-2"
                id="btn-start-scenarios"
              >
                Weiter zu den Lernszenarien <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'scenarios' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Studierenden-Lernszenarien &amp; Baustellen-Herausforderungen</h3>
              <p className="text-xs text-slate-600">Reale Konfliktsituationen auf der Baustelle: Lade ein Szenario, löse die Aufgabenstellung im Bautagebuch-Editor und lassen Sie Ihre Eingabe vom "Professor" bewerten.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SCENARIOS.map(scenario => {
                return (
                  <div 
                    key={scenario.id} 
                    className="bg-white border border-home-grau/30 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-400 transition-all shadow-xxs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {scenario.name}
                        </span>
                        <span className="text-xs font-bold text-shiraz">Szenario</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{scenario.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed leading-relaxed line-clamp-4">
                        {scenario.description}
                      </p>
                    </div>

                    <div className="border-t border-home-grau/10 pt-3 space-y-3">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block mb-1">Prüfungsziel:</span>
                        <p className="text-xs text-slate-700">{scenario.objective}</p>
                      </div>
                      <button
                        onClick={() => handleLoadScenario(scenario)}
                        className="w-full py-2 bg-slate-700 text-white rounded-xl text-xs font-bold hover:bg-slate-600 transition-all flex items-center justify-center gap-1.5"
                        id={`btn-load-scenario-${scenario.id}`}
                      >
                        Szenario starten &rarr;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-home-grau/30 pb-2">
              Archivierte &amp; bewertete Tagesberichte ({savedDiaries.length})
            </h3>
            {savedDiaries.length === 0 ? (
              <div className="text-center py-12 text-slate-500 space-y-4">
                <Bookmark size={48} className="mx-auto text-slate-300" />
                <p className="text-sm font-medium">Bislang wurden keine Tagesprotokolle erstellt.</p>
                <button
                  onClick={() => setActiveTab('scenarios')}
                  className="px-4 py-2 bg-shiraz text-white rounded-xl text-xs font-bold hover:bg-shiraz/90 transition-all"
                  id="btn-view-scenarios-empty"
                >
                  Zu den Lernszenarien
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedDiaries.map((diary) => (
                  <div 
                    key={diary.id}
                    onClick={() => { setReviewResult(diary); setActiveTab('editor'); }}
                    className="p-5 bg-white border border-home-grau/30 rounded-2xl hover:border-slate-400 transition-all cursor-pointer shadow-xxs flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                          Bericht #{diary.berichtNummer}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                          <Calendar size={12} /> {diary.date}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {diary.projectName}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1 italic">
                        <strong>Tätigkeiten:</strong> {diary.fortschritt}
                      </p>
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                        <span>Min/Max Temp: {formatDeWert(diary.wetterTempMin)}°C - {formatDeWert(diary.wetterTempMax)}°C</span>
                        {diary.behinderung && <span className="text-rose-600 font-bold">&#9888; Behinderung aktiv</span>}
                        {diary.bedenken && <span className="text-amber-600 font-bold">&#9888; Bedenken angemeldet</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="text-xs text-slate-500 font-bold block">PROFESSOR-NOTE</span>
                        <span className={`text-xl font-extrabold font-mono  ${
                          diary.score >= 80 ? 'text-emerald-700' : diary.score >= 60 ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                          {diary.grade}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteDiary(diary.id, e)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-all rounded-lg hover:bg-rose-50"
                        title="Bericht löschen"
                        id={`btn-delete-${diary.id}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'editor' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-home-grau/30 pb-4 flex-wrap gap-2">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>VOB-Tageserfassung</span>
                  {activeScenarioId && (
                    <span className="text-xs font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded uppercase">
                      Szenario-Modus aktiv
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-600">Tragen Sie alle relevanten Witterungs- und baubetrieblichen Werte ein.</p>
                {activeScenarioId && (
                  <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-2 max-w-2xl">
                    <strong>Lage:</strong> {SCENARIOS.find(sc => sc.id === activeScenarioId)?.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-lg transition-all flex items-center gap-1 shadow-xxs"
                  id="btn-reset-form"
                >
                  <RotateCcw size={13} /> Zurücksetzen
                </button>
                {reviewResult && (
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-3 py-1.5 bg-slate-750 border border-slate-800 text-white hover:bg-slate-650 text-xs font-bold rounded-lg transition-all flex items-center gap-1 shadow-xxs"
                    id="btn-print-active-diary"
                  >
                    <Printer size={13} /> PDF-Druckansicht
                  </button>
                )}
              </div>
            </div>

            {/* TWIN PANEL LAYOUT: LEFT FORM, RIGHT REALTIME PROFESSOR FEEDBACK */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT FORM BLOCK (8 columns) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. REPORT IDENTITY */}
                <div className="bg-slate-50/50 p-5 rounded-2xl border border-home-grau/30 space-y-4">
                  <span className="text-xs text-shiraz font-bold font-mono tracking-widest uppercase block border-b border-home-grau/30 pb-1">
                    1. Allgemeine Berichtangaben
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Berichtsnummer (Fortlaufend)</label>
                      <input 
                        type="number" min="1"
                        id="form-bericht-nummer"
                        value={berichtNummer}
                        onChange={(e) => setBerichtNummer(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Datum der Aufzeichnung</label>
                      <input 
                        type="date"
                        id="form-date"
                        value={dateStr}
                        onChange={(e) => setDateStr(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Innere Bauleitung (Mitarbeiter)</label>
                      <input 
                        type="number" min="0"
                        id="form-eigene-arbeiter"
                        value={arbeiterEigene}
                        onChange={(e) => setArbeiterEigene(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. WEATHER BLOCK */}
                <div className="p-5 rounded-2xl border border-home-grau/30 space-y-4">
                  <div className="flex justify-between items-center border-b border-home-grau/30 pb-1">
                    <span className="text-xs text-shiraz font-bold font-mono tracking-widest uppercase block">
                      2. Witterung und klimatologische Belastungen
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-medium">DIN EN 13670 / DIN 1045</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Temperatur Min (&deg;C)</label>
                      <div className="flex items-center gap-2">
                        <input aria-label="Temperatur Min (&deg;C)" 
                          type="range" 
                          min="-10" 
                          max="45" 
                          step="0.5"
                          value={tempMin}
                          onChange={(e) => setTempMin(Number(e.target.value))}
                          className="w-full accent-shiraz"
                        />
                        <span className="text-xs font-mono font-bold shrink-0 w-12 text-right">{formatDeWert(tempMin)} &deg;C</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Temperatur Max (&deg;C)</label>
                      <div className="flex items-center gap-2">
                        <input aria-label="Temperatur Max (&deg;C)" 
                          type="range" 
                          min="-10" 
                          max="45" 
                          step="0.5"
                          value={tempMax}
                          onChange={(e) => setTempMax(Number(e.target.value))}
                          className="w-full accent-shiraz"
                        />
                        <span className="text-xs font-mono font-bold shrink-0 w-12 text-right">{formatDeWert(tempMax)} &deg;C</span>
                      </div>
                    </div>
                  </div>

                  {/* Warn zones alert indicator */}
                  {tempMin < 5 && (
                    <div className="p-3 bg-rose-50 border border-shiraz/20 rounded-lg flex items-start gap-1.5">
                      <ThermometerSnowflake className="text-shiraz shrink-0 mt-0.5" size={16} />
                      <div className="text-xs text-rose-950 font-medium">
                        <strong>Frostgefahr / Nachbehandlungspflicht!</strong> Min-Temperatur liegt unter +5&deg;C. Betonaktivitäten erfordern Thermoplanung und Abdeckung, um Einfrieren oder Erstarrungsabbrüche zu verhindern.
                      </div>
                    </div>
                  )}

                  {/* Conditions toggle */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-2">Witterungsbedingungen (Auswahl)</label>
                    <div className="flex flex-wrap gap-1.5" id="weather-checkbox-group">
                      {['Sunny', 'Cloudy', 'Rain', 'Snow', 'Frost', 'Stormy'].map(cond => {
                        const active = selectedWeather.includes(cond);
                        return (
                          <button
                            key={cond}
                            type="button"
                            onClick={() => toggleWeather(cond)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                              active
                                ? 'bg-shiraz border-shiraz text-white'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                            id={`btn-weather-${cond}`}
                          >
                            {cond === 'Sunny' ? '☀️ Sonnig' : 
                             cond === 'Cloudy' ? '☁️ Bewölkt' : 
                             cond === 'Rain' ? '🌧️ Regen' : 
                             cond === 'Snow' ? '❄️ Schneefall' : 
                             cond === 'Frost' ? '🥶 Frost' : '💨 Wind/Sturm'}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Operational impact */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Einfluss auf die Baustelle</label>
                    <select
                      id="form-weather-einfluss"
                      value={weatherEinfluss}
                      onChange={(e) => setWeatherEinfluss(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-bold"
                    >
                      <option value="Keine Beeinflussung">Keine Beeinflussung der Arbeiten</option>
                      <option value="Beeinträchtigung">Einzelne Beeinträchtigungen (Geräte gedrosselt)</option>
                      <option value="Schnittstellenstopp">Teilweiser Arbeitsstopp bei Außenarbeiten</option>
                      <option value="Arbeitsstopp">Ganztägiger witterungsbedingter Arbeitsausfall</option>
                    </select>
                  </div>
                </div>

                {/* 3. MANPOWER & SUBCONTRACTORS */}
                <div className="p-5 rounded-2xl border border-home-grau/30 space-y-4">
                  <span className="text-xs text-shiraz font-bold font-mono tracking-widest uppercase block border-b border-home-grau/30 pb-1">
                    3. Fremdfirmen &amp; Subunternehmer-Personalstärken
                  </span>
                  
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Fremdfirmen-Verzeichnis &amp; Mitarbeiter (pro Zeile)</label>
                    <textarea
                      id="form-arbeiter-sub"
                      rows={3}
                      value={arbeiterSubStr}
                      onChange={(e) => setArbeiterSubStr(e.target.value)}
                      placeholder="z.B. Müller Erdbau GmbH: 1 Polier, 3 Baggerfahrer&#10;TGA Elektro Schmidt: 2 Monteure"
                      className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-800 font-mono"
                    />
                    <p className="text-xs text-slate-600 mt-1">Geben Sie das exakte Gewerk, Firma und Anzahl an. Unbesetzte Positionen sind ein wichtiger Verzugsindikator.</p>
                  </div>
                </div>

                {/* 4. PERFORMANCE & TESTS */}
                <div className="p-5 rounded-2xl border border-home-grau/30 space-y-4">
                  <span className="text-xs text-shiraz font-bold font-mono tracking-widest uppercase block border-b border-home-grau/30 pb-1">
                    4. Ausgeführte Tagesleistung &amp; Qualitätsprüfungen
                  </span>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Tagesarbeit / Baufortschritt (Schnittstellen-genau beschreiben)</label>
                    <textarea
                      id="form-fortschritt"
                      rows={4}
                      value={fortschritt}
                      onChange={(e) => setFortschritt(e.target.value)}
                      placeholder="Beschreiben Sie räumlich präzise, welche Abschnitte heute geschalt, bewehrt, betoniert oder saniert wurden..."
                      className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-800 leading-relaxed font-semibold placeholder:font-normal"
                    />
                    
                    {/* Prompt sub tasks suggestion to help students */}
                    <div className="mt-2.5 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <p className="text-xs uppercase tracking-wider font-bold text-slate-900 mb-1.5 flex items-center gap-1">
                        <ClipboardList size={11} className="text-shiraz" /> Vorgeschlagene Tätigkeiten für dieses Projekt:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {selectedProject.defaultTasks.map((t, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              const spacer = fortschritt ? '\n' : '';
                              setFortschritt(prev => prev + spacer + t + '.');
                            }}
                            className="bg-white border border-slate-200 text-slate-900 rounded-md px-2 py-1 text-xs hover:bg-slate-100 hover:border-slate-300 transition-all text-left font-medium"
                          >
                            + {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quality tests selector */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Eingeleitete Güteprüfungen / Schnelltests (Gewerke-QS)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="testing-checkbox-group">
                      {[
                        'Frischbetontemperatur gemessen',
                        'Ausbreitversuch durchgeführt',
                        'Probekörper (Würfel/Zylinder) gegossen',
                        'CM-Messung durchgeführt',
                        'Haftzugprüfung vorgenommen',
                        'Holzfeuchtigkeitsbestimmung gemessen'
                      ].map(test => {
                        const active = selectedTesting.includes(test);
                        return (
                          <button
                            key={test}
                            type="button"
                            onClick={() => toggleTesting(test)}
                            className={`p-2 rounded-lg text-left text-xs font-bold border transition-all flex items-center justify-between ${
                              active
                                ? 'bg-shiraz text-white border-shiraz shadow-xs'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                            id={`btn-test-${test.replace(/\s+/g, '-').toLowerCase()}`}
                          >
                            <span>{test}</span>
                            <span className="text-white font-bold">{active ? '✓' : '+'}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 5. VOB/B INFRINGEMENTS & VERBAL DIRECTIVES */}
                <div className="p-5 rounded-2xl border border-home-grau/30 space-y-4">
                  <div className="flex justify-between items-center border-b border-home-grau/30 pb-1">
                    <span className="text-xs text-shiraz font-bold font-mono tracking-widest uppercase block">
                      5. Besondere Vorkommnisse &amp; Baurechtliches
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-bold">VOB/B § 4 &amp; § 6</span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Mündliche Anweisungen / Baustellenbeschlüsse (z.B. Schmidt)</label>
                    <input 
                      type="text"
                      id="form-anweisungen"
                      value={anweisungen}
                      onChange={(e) => setAnweisungen(e.target.value)}
                      placeholder="Wer hat was veranlasst? (z.B. Herr Schmidt ordnete mündlich den Verzicht auf...)"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Unvorhergesehene Störungen / Havarien / Geräteschäden</label>
                    <input 
                      type="text"
                      id="form-stoerungen"
                      value={stoerungen}
                      onChange={(e) => setStoerungen(e.target.value)}
                      placeholder="z.B. Rohrbruch im Kellerbereich, Ausfall Hauptkran Liebherr..."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800"
                    />
                  </div>

                  {/* Trigger Claims Switches */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-3 bg-rose-50/20 border border-rose-100 rounded-xl space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox"
                          id="form-check-behinderung"
                          checked={behinderung}
                          onChange={(e) => setBehinderung(e.target.checked)}
                          className="rounded border-slate-300 text-shiraz focus:ring-shiraz uppercase"
                        />
                        <span className="text-xs font-bold text-rose-800">Formelle Behinderungsanzeige erforderlich?</span>
                      </label>
                      {behinderung && (
                        <input 
                          type="text"
                          id="form-behinderung-details"
                          value={behinderungDetails}
                          onChange={(e) => setBehinderungDetails(e.target.value)}
                          placeholder="Begründung nach § 6 Abs. 1 VOB/B..."
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium/80"
                        />
                      )}
                    </div>

                    <div className="p-3 bg-amber-50/20 border border-amber-100 rounded-xl space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox"
                          id="form-check-bedenken"
                          checked={bedenken}
                          onChange={(e) => setBedenken(e.target.checked)}
                          className="rounded border-slate-300 text-shiraz focus:ring-shiraz uppercase"
                        />
                        <span className="text-xs font-bold text-amber-800">Bedenkenanmeldung erheben (Sicherheitsausschluss)?</span>
                      </label>
                      {bedenken && (
                        <input 
                          type="text"
                          id="form-bedenken-details"
                          value={bedenkenDetails}
                          onChange={(e) => setBedenkenDetails(e.target.value)}
                          placeholder="Technische Bedenken nach § 4 Abs. 3 VOB/B..."
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium/80"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* ANALYZE SUBMIT BUTTON */}
                <button
                  type="button"
                  onClick={handleAnalyzeAndSubmit}
                  className="w-full py-4 bg-shiraz text-white hover:bg-shiraz/90 font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
                  id="btn-submit-diary"
                >
                  <Plus size={18} /> Bautagebuch überprüfen &amp; archivieren
                </button>

              </div>

              {/* RIGHT FEEDBACK BLOCK (5 columns) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* 1. EDUCATIONAL ASSESSMENT CARD */}
                <div className="bg-slate-50 border border-home-grau/30 rounded-2xl p-5 space-y-4 shadow-xxs">
                  <div className="flex items-center gap-2 border-b border-home-grau/30 pb-2">
                    <GraduationCap className="text-shiraz" size={20} />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block font-bold">
                      Virtuelle Professur: Auswertung &amp; Feedback
                    </span>
                  </div>

                  {!reviewResult ? (
                    <div className="text-center py-12 text-slate-500 space-y-3">
                      <HelpCircle size={40} className="mx-auto text-slate-300 animate-pulse" />
                      <p className="text-xs font-bold text-slate-700">Warten auf Berichtsabgabe...</p>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto">Tragen Sie Ihre Werte links ein und klicken Sie unten auf Überprüfen. Ihre Arbeit wird sofort nach HOAI und VOB Kriterien analysiert.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      
                      {/* Score Badge */}
                      <div className="bg-white p-4 rounded-xl border border-home-grau/30 text-center space-y-1 shadow-xxs">
                        <span className="text-xs text-slate-600 font-extrabold uppercase">Erhobene Prüfungsnote</span>
                        <div className={`text-4xl font-extrabold font-mono ${
                          reviewResult.score >= 80 ? 'text-emerald-700' : reviewResult.score >= 60 ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                          {reviewResult.grade}
                        </div>
                        <p className="text-xs font-medium text-slate-600">Soll-Akkreditierungsgrad: {formatDeWert(reviewResult.score)} / 100 Punkte</p>
                      </div>

                      {/* Prof assessment commentary */}
                      <div className="bg-white p-3 rounded-xl border border-home-grau/30 italic text-xs text-slate-700 leading-relaxed font-medium">
                        &ldquo;{reviewResult.professorSummary}&rdquo;
                      </div>

                      {/* Rule Checks accordion */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-600 uppercase block tracking-wider">Ergebnis-Einzelprüfung</span>
                        
                        <div className="space-y-1.5" id="rule-check-results">
                          {reviewResult.checklistChecks.map((check, idx) => (
                            <div 
                              key={idx} 
                              className={`p-3 rounded-lg border text-xs flex gap-2 ${
                                check.success 
                                  ? 'bg-emerald-50/40 border-emerald-100 text-slate-900' 
                                  : 'bg-rose-50/50 border-rose-100 text-slate-900'
                              }`}
                            >
                              <span className="text-sm shrink-0">{check.success ? '✓' : '⚠️'}</span>
                              <div>
                                <span className="font-bold block text-slate-900">{check.title}</span>
                                <p className="text-xs text-slate-500 mt-0.5">{check.detail}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                       {/* Scenario hint helper */}
                      {activeScenarioId && (
                        <div className="bg-amber-50 border border-amber-300 text-amber-950 p-4 rounded-xl space-y-1.5 shadow-xxs">
                          <span className="text-xs uppercase tracking-wider text-amber-800 font-extrabold block">Szenario-Hinweise &amp; Lösungen</span>
                          <p className="text-xs text-amber-900 font-bold">Empfohlene Baustoff-Parameter:</p>
                          <ul className="list-disc pl-4 text-xs text-stone-800 space-y-1.5">
                            {SCENARIOS.find(s => s.id === activeScenarioId)?.hints.map((hint, idx) => (
                              <li key={idx} className="leading-relaxed">{hint}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                    </div>
                  )}

                </div>

                {/* 2. PRINT DESIGN CERTIFICATE (Only displays when report is submitted) */}
                {reviewResult && (
                  <div className="p-5 border border-stone-200 bg-stone-55 rounded-2xl relative overflow-hidden space-y-4 shadow-xxs bg-stone-50">
                    <div className="absolute top-0 right-0 p-4 bg-stone-900/5 text-stone-400 select-none pointer-events-none transform rotate-12">
                      <ShieldCheck size={120} className="opacity-[0.04]" />
                    </div>
                    
                    <div className="space-y-1.5 z-10 relative">
                      <span className="text-xs text-stone-600 font-bold uppercase block tracking-widest font-mono">VOB-Ausdruck (Vorschau)</span>
                      <h4 className="font-extrabold text-[#0f172a] text-sm flex items-center gap-1.5">
                        <CheckCircle className="text-emerald-600" size={16} /> Tagesbericht gerichtsicher zertifiziert
                      </h4>
                      <p className="text-xs text-stone-700 leading-relaxed">
                        Dieser Tagesbericht #<strong>{reviewResult.berichtNummer}</strong> vom <strong>{reviewResult.date}</strong> für das Projekt &ldquo;<strong>{selectedProject.name}</strong>&rdquo; wurde in der Datenbank verschlüsselt und für die Bauakte ablagefertig vorbereitet.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handlePrint}
                        className="flex-1 py-2 bg-slate-700 text-white rounded-xl text-xs font-bold hover:bg-slate-600 transition-all flex items-center justify-center gap-1.5"
                        id="btn-print"
                      >
                        <Printer size={13} /> Bericht drucken / PDF
                      </button>
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>
        )}

      </div>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Ausschalfrist bei kühler Witterung abschätzen"
        zielGleichung="t_{Ausschal} \ge t_{min} \cdot f_T,\quad f_T = \frac{30}{\bar T + 10}"
        schritte={[
          { titel: 'Bezugswert', erklaerung: 'Planerische Ausschalfrist bei 20 °C (Lehrwert):', formel: 't_{min} = 3\\,\\text{d}' },
          { titel: 'Temperaturfaktor', erklaerung: 'Mittlere Betontemperatur aus dem Bautagebuch 5 °C:', formel: 'f_T = \\frac{30}{5 + 10} = 2{,}0' },
          { titel: 'Ausschalfrist', erklaerung: 'Verlängerte Frist:', formel: 't_{Ausschal} \\ge 3 \\cdot 2{,}0 = 6\\,\\text{d}' }
        ]}
        ergebnisHinweis="Ohne dokumentierte Temperaturen ist die Verlängerung nicht begründbar. Verbindlich sind die Vorgaben der Tragwerksplanung; im Zweifel die Festigkeit am Bauwerk oder an mitgelagerten Probekörpern prüfen."
        normQuelle="Reifegradansatz nach Saul; DIN 1045-3:2023-08"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Festigkeitsentwicklung aus dem Lieferschein einordnen"
        zielGleichung="r = \frac{f_{cm,2}}{f_{cm,28}}"
        schritte={[
          { titel: 'Angaben', erklaerung: 'Lieferwerk: mittlere Festigkeit nach 2 Tagen 18 N/mm², nach 28 Tagen 40 N/mm²:', formel: 'r = \\frac{18}{40} = 0{,}45' },
          { titel: 'Einordnung', erklaerung: 'Grenzen: schnell ≥ 0,50, mittel ≥ 0,30, langsam ≥ 0,15:', formel: '0{,}30 \\le 0{,}45 < 0{,}50 \\Rightarrow \\text{mittel}' },
          { titel: 'Folge', erklaerung: 'Die Mindestdauer der Nachbehandlung wird mit der Klasse mittel und der Oberflächentemperatur aus der Tabelle der DIN 1045-3 bestimmt:', formel: '\\text{mittel} + \\bar T \\to t_{NB}' }
        ]}
        ergebnisHinweis="Festigkeitsentwicklung und Temperatur gehören deshalb in jedes Betonier-Protokoll; sie begründen Nachbehandlungs- und Ausschalfristen."
        normQuelle="DIN EN 206 / DIN 1045-2; DIN 1045-3:2023-08"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="px_bautagebuch" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 15 Praxiswissen: Normbezüge (DIN 1045-2/-3:2023-08, DIN EN 206, EN 12390-2, DIN 18014, HOAI 2021, VOB/B 2016), Bauvertragsrecht und Qualifikationen geprüft; fachliche Freigabe durch den Autor ausstehend)"
        wikipedia={[
          { title: 'Bautagebuch', url: 'https://de.wikipedia.org/wiki/Bautagebuch' },
          { title: 'Objektüberwachung', url: 'https://de.wikipedia.org/wiki/Objekt%C3%BCberwachung' },
          { title: 'Behinderungsanzeige', url: 'https://de.wikipedia.org/wiki/Behinderungsanzeige' }
        ]}
        literatur={[
          'Wendehorst Baustoffkunde. Wiesbaden: Springer Vieweg (aktuelle Auflage)',
          'Bauleiter-Handbuch: Ausführung, Dokumentation und Abnahme (Werner Verlag)',
          'Kochendörfer, B.; Liebchen, J. H.; Viering, M. G. (2018): Bau-Projekt-Management (Springer Vieweg)'
        ]}
        regelwerke={[
          { title: 'VOB/B 2016 § 4 Abs. 3 & § 6 (Bedenken und Behinderung)' },
          { title: 'HOAI 2021, Anlage 10 Lph 8 (Objektüberwachung: Dokumentation des Bauablaufs)', url: 'https://www.gesetze-im-internet.de/hoai_2021/' },
          { title: 'DIN 1045-3:2023-08 (Tragwerke aus Beton, Stahlbeton und Spannbeton – Bauausführung)' }
        ]}
        formeln={[
          {
            formel: 't_{\\text{Ausschal}} \\ge t_{\\text{min}} \\cdot f_T \\quad \\text{mit} \\quad f_T = \\frac{30}{\\bar{T} + 10}',
            erklaerung: 'Näherung für die Verlängerung von Ausschalfristen bei niedriger mittlerer Betontemperatur (Bezug 20 °C); verbindlich sind die Vorgaben der Tragwerksplanung und die Festigkeitskontrolle.',
            quelle: 'Reifegradansatz nach Saul (Näherung)'
          },
          {
            formel: 'r_{\\text{fest}} = \\frac{f_{\\text{cm},2}}{f_{\\text{cm},28}} \\implies \\text{Festigkeitsentwicklung: schnell (} \\ge 0{,}50 \\text{), mittel, langsam}',
            erklaerung: 'Festigkeitsentwicklungsverhältnis r nach DIN EN 206 zur Bestimmung der Mindestnachbehandlungsdauer von Betonoberflächen.',
            quelle: 'DIN EN 206 / DIN 1045-3'
          }
        ]}
      />

      {/* PRINT STYLING INJECTED VIA MEDIA QUERY FOR HIGH CONTRAST BLACK & WHITE PAPER OUTPUT */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          #bautagebuch-root {
            padding: 0 !important;
          }
          .md\\:flex-row, .grid, .flex {
            display: block !important;
          }
          button, select, input[type="range"], #tab-btn-guide, #tab-btn-scenarios, #tab-btn-editor, #tab-btn-saved, #project-selector-group {
            display: none !important;
          }
          .lg\\:col-span-12, .lg\\:col-span-7, .lg\\:col-span-5 {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
          textarea, input {
            border: none !important;
            background: none !important;
            padding: 0 !important;
            margin: 0 !important;
            font-size: 11pt !important;
            color: black !important;
            font-family: monospace !important;
          }
          textarea {
            white-space: pre-wrap !important;
          }
          .bg-slate-50, .bg-slate-50\\/50, .bg-gradient-to-r, .bg-slate-900 {
            background: none !important;
            color: black !important;
            border: 1px solid #cbd5e1 !important;
          }
          .text-white {
            color: black !important;
          }
        }
      `}</style>

    </div>
  );
}
