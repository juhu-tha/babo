import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { 
  Search, AlertTriangle, CheckCircle2, RotateCcw, 
  Sparkles, FileText, Microscope, Coins, Clock, Eye, Award, Info
} from 'lucide-react';

interface DiagnosticMethod {
  id: string;
  name: string;
  category: 'zfp' | 'labor' | 'vorort';
  cost: number;
  duration: string;
  shortDesc: string;
  findingTitle: string;
  findingText: string;
  keyValues: { label: string; value: string; isAnomaly?: boolean }[];
  didacticHint: string;
}

interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  yearBuilt: number;
  budget: number;
  situation: string;
  visualType: 'parkhaus' | 'bruecke' | 'mauerwerk' | 'flachdach';
  availableMethods: DiagnosticMethod[];
  hypotheses: {
    id: string;
    title: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  sanitationPrinciples: {
    id: string;
    title: string;
    standard: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case_parkhaus',
    title: 'Fall 1: Die zerbröckelnde Tiefgarage',
    subtitle: 'Stützenabplatzungen & Lochfraß an der Fahrbahnkante',
    location: 'Stadttiefgarage Zentrum, 2. Untergeschoss',
    yearBuilt: 1984,
    budget: 4500,
    visualType: 'parkhaus',
    situation: 
      'Bei einer Begehung der 40 Jahre alten Tiefgarage fallen an den Stützenfüßen und Wandsockeln massive Betonabplatzungen auf. ' +
      'Bewehrungseisen liegen frei und weisen tiefschwarze bis rotbraune Narben auf. Auf dem Fahrbahnbelag ist kein Rissüberbrückungssystem (OS-System) vorhanden; ' +
      'im Winter schleppen PKW regelmäßig Tausalz ein. Die Verwaltung befürchtet akute Einsturzgefahr einzelner Stützen.',
    availableMethods: [
      {
        id: 'phenolphthalein',
        name: 'Phenolphthalein-Test (Karbonatisierung)',
        category: 'vorort',
        cost: 350,
        duration: '1 Stunde',
        shortDesc: 'Aufsprühen von 1%iger alkoholischer Phenolphthaleinlösung auf eine frische Betonbruchfläche zur pH-Wert-Grenze (pH 9).',
        findingTitle: 'Prüfbericht: Karbonatisierungstiefe d_k',
        findingText: 'Der Zementstein schlägt in einer Tiefe von 18 mm schlagartig intensiv violett um (pH > 9). Die Karbonatisierungsfront liegt bei d_k = 18 mm.',
        keyValues: [
          { label: 'Karbonatisierungstiefe d_k', value: '18 mm', isAnomaly: false },
          { label: 'pH-Wert im Kern', value: '> 12,5 (hoch alkalisch)', isAnomaly: false },
          { label: 'Passivierung theoretisch intakt?', value: 'Ja (chemisch passiv)' }
        ],
        didacticHint: 'Merke: Liegt die Karbonatisierungstiefe unterhalb der Bewehrungslage, scheidet reine Karbonatisierungskorrosion als Primärursache aus!'
      },
      {
        id: 'profometer',
        name: 'Elektromagnetische Bewehrungsortung (Profometer)',
        category: 'zfp',
        cost: 600,
        duration: '2 Stunden',
        shortDesc: 'Zerstörungsfreie Ortung der Bewehrungslage und Messung der vorhandenen Betondeckung (Wirbelstromverfahren, z. B. nach DGZfP-Merkblatt B 2).',
        findingTitle: 'Prüfbericht: Betondeckungsmessung',
        findingText: 'Die gemessene Betondeckung an den Stützenfüßen schwankt zwischen 28 mm und 35 mm (Mittelwert c = 31 mm). Keine gravierende Unterschreitung des damaligen Baustandards.',
        keyValues: [
          { label: 'Gemessene Betondeckung c', value: '31 mm (± 3 mm)' },
          { label: 'Verhältnis d_k zu c', value: 'd_k (18 mm) < c (31 mm)', isAnomaly: false }
        ],
        didacticHint: 'Die Betondeckung ist größer als die Karbonatisierungstiefe. Die Bewehrung liegt somit in nicht-karbonatisiertem, alkalischem Beton!'
      },
      {
        id: 'chloridprofil',
        name: 'Bohrmehlanalyse: Tiefengestaffeltes Chloridprofil',
        category: 'labor',
        cost: 1200,
        duration: '2 Tage',
        shortDesc: 'Stufenweises Abbohren von Betonmehl in 10-mm-Schichten und photometrische Chloridbestimmung nach DIN EN 14629.',
        findingTitle: 'Prüfbericht: Chloridgehalt (% bezogen auf Zementmasse)',
        findingText: 'Extrem hoher Chloridgehalt in den oberflächennahen Schichten. In Bewehrungstiefe (30 mm) beträgt der Chloridgehalt 1,85 M.-% bezogen auf Zement!',
        keyValues: [
          { label: 'Tiefe 0 – 10 mm', value: '3,40 M.-% bez. Zement', isAnomaly: true },
          { label: 'Tiefe 10 – 20 mm', value: '2,65 M.-% bez. Zement', isAnomaly: true },
          { label: 'Tiefe 20 – 30 mm (Bewehrung)', value: '1,85 M.-% bez. Zement', isAnomaly: true },
          { label: 'Bewertungswert korrosionsauslösend (kein Normwert)', value: '≈ 0,5 M.-% bez. Zement', isAnomaly: false }
        ],
        didacticHint: 'Der korrosionsauslösende Chloridgehalt (in Deutschland üblicher Bewertungswert ≈ 0,5 M.-% bez. auf Zement) ist in Bewehrungstiefe mit 1,85 M.-% fast um das Vierfache überschritten. Die Passivschicht wird trotz hohem pH-Wert lokal zerstört (Lochfraß). Die 0,40 M.-% der DIN EN 206/DIN 1045-2 (Chloridklasse Cl 0,40) gelten nur für die Herstellung von Stahlbeton.'
      },
      {
        id: 'potentialfeld',
        name: 'Potentialfeldmessung / Halbzellen-Methode',
        category: 'zfp',
        cost: 950,
        duration: '4 Stunden',
        shortDesc: 'Elektrochemische Erfassung der Korrosionsaktivität nach DGZfP-Merkblatt B 03 mittels Cu/CuSO4-Bezugselektrode.',
        findingTitle: 'Prüfbericht: Korrosionspotentiale (mV CSE)',
        findingText: 'Im Sockelbereich (Höhe 0 bis 50 cm über OKFF) treten extrem negative Potentiale von -420 mV bis -510 mV auf. Signifikante Potentialgradienten weisen auf aktive Lokalelemente hin.',
        keyValues: [
          { label: 'Gemessenes Potential E_corr', value: '-480 mV (CSE)', isAnomaly: true },
          { label: 'Korrosionswahrscheinlichkeit', value: '> 90 % (aktive Makroelemente)', isAnomaly: true }
        ],
        didacticHint: 'Nach ASTM C876 deuten Potentiale negativer als −350 mV (CSE) auf eine hohe Korrosionswahrscheinlichkeit hin; nach DGZfP B 3 werden vor allem Potentialgradienten bewertet und durch Sondieröffnungen bestätigt.'
      },
      {
        id: 'duennschliff_akr',
        name: 'Dünnschliffmikroskopie & RFA auf AKR-Gel',
        category: 'labor',
        cost: 1600,
        duration: '5 Tage',
        shortDesc: 'Polarisationsmikroskopie an Bohrkernen zur Detektion von Alkali-Kieselsäure-Gel und Mikrorissen.',
        findingTitle: 'Prüfbericht: Petrographische Gefügeanalyse',
        findingText: 'Keine Hinweise auf alkaliempfindliche Gesteinskörnungen (Kornfraktionen bestehen aus dichtem Kalkstein und Quarzit). Keine Gelnester oder Ettringit-Treiben im Zementstein nachweisbar.',
        keyValues: [
          { label: 'AKR-Gel / Reaktionssäume', value: 'Nicht nachweisbar (Negativ)', isAnomaly: false },
          { label: 'Gefügeschädigung', value: 'Rein rissfrei im Zementsteinkern' }
        ],
        didacticHint: 'AKR scheidet als Ursache aus. Dieses Verfahren war teuer, bestätigt aber die Unbedenklichkeit der Zuschläge.'
      }
    ],
    hypotheses: [
      {
        id: 'h_karbonat',
        title: 'Karbonatisierungsbedingte Bewehrungskorrosion infolge überalterten Betons',
        isCorrect: false,
        explanation: 'Falsch: Der Phenolphthalein-Test hat bewiesen, dass die Karbonatisierungstiefe mit 18 mm deutlich vor der Bewehrung (31 mm) stoppt. Der Beton ist im Bewehrungsbereich hochgradig alkalisch.'
      },
      {
        id: 'h_chlorid',
        title: 'Chloridinduzierte Lochfraßkorrosion (Tausalzschleppung) mit Lokalelementbildung',
        isCorrect: true,
        explanation: 'Richtig! Die Chloridanalyse belegt 1,85 M.-% Cl⁻ in Bewehrungstiefe (Grenzwert 0,40 M.-%). Chloridionen durchbrechen die Passivschicht lokal und bilden zerstörerische Mulden- und Lochfraß-Anoden.'
      },
      {
        id: 'h_akr',
        title: 'Alkali-Kieselsäure-Reaktion („Betonkrebs“) durch Taumittel-Alkalien',
        isCorrect: false,
        explanation: 'Falsch: Die Dünnschliffanalyse zeigt keinerlei quellfähiges AKR-Gel und inerte Zuschläge. Das Schadensbild rührt nicht von treibenden Gesteinskörnern her.'
      },
      {
        id: 'h_ueberlast',
        title: 'Mechanische Quetschüberlastung der Stützen durch statische Zwangskräfte',
        isCorrect: false,
        explanation: 'Falsch: Die Schäden treten gezielt im Tausalz-Spritzwasserbereich auf, der Betonkern ist druckfest und zeigt keine Längsstauchungsrisse.'
      }
    ],
    sanitationPrinciples: [
      {
        id: 'p_reprofil',
        title: 'Prinzip R (Reprofilierung): Chloridverseuchten Beton vollständig abtragen, Bewehrung entrosten, PCC-Mörtel & OS-Beschichtung',
        standard: 'TR Instandhaltung (DIBt) / DIN EN 1504-9',
        isCorrect: true,
        explanation: 'Exakt richtig! Der chloridkontaminierte Beton muss bis hinter die Bewehrung abgetragen werden. Anschließend Reprofilierung mit Instandsetzungsmörtel (PCC/SPCC) und Oberflächenschutzsystem, auf befahrenen Flächen z. B. rissüberbrückendes OS 11.'
      },
      {
        id: 'p_kosmetik',
        title: 'Reine Kosmetik: Rissinjektion mit Epoxidharz und oberflächlicher Spachtelauftrag',
        standard: 'Nicht normkonform',
        isCorrect: false,
        explanation: 'Fataler Fehler: Die Chloride verbleiben im Beton! Unter der Spachtelung rostet der Stahl unsichtbar und beschleunigt weiter, bis der Querschnitt tragfähig versagt (Lochfraß ohne Warnung).'
      },
      {
        id: 'p_kks',
        title: 'Prinzip K (Kathodischer Korrosionsschutz - KKS): Titananodennetz aufbringen und Fremdstrom anlegen',
        standard: 'DIN EN ISO 12696',
        isCorrect: true,
        explanation: 'Ebenfalls eine technisch hervorragende Alternative für Parkhäuser! KKS stoppt den anodischen Eisenabtrag elektrochemisch, ohne dass der gesamte Beton aufwendig ausgestemmt werden muss.'
      }
    ]
  },
  {
    id: 'case_bruecke',
    title: 'Fall 2: Die Autobahnbrücke mit Netzrissen',
    subtitle: 'Schwellende Pfeiler & Gel-Ausscheidungen im Freibewitterungsbereich',
    location: 'Bundesautobahn A7, Talbrücke Pfeiler 4 & 5',
    yearBuilt: 1999,
    budget: 5200,
    visualType: 'bruecke',
    situation:
      'Im Rahmen der Hauptprüfung nach DIN 1076 werden an zwei massiven Pfeilern einer 27 Jahre alten Talbrücke feine, ' +
      'sternförmige und netzartige Risse festgestellt. Aus einigen Rissmündungen tritt eine glasig-gallertartige Substanz aus, ' +
      'die an der Luft weißlich ausblüht. Die Bauteile sind Schlagregen und zeitweise aufsteigender Feuchte ausgesetzt.',
    availableMethods: [
      {
        id: 'duennschliff_akr2',
        name: 'Dünnschliffmikroskopie mit Fluoreszenzfärbung',
        category: 'labor',
        cost: 1500,
        duration: '4 Tage',
        shortDesc: 'Polarisations- und Fluoreszenzmikroskopie an Dünnschliffen (fluoreszierend getränkt) zur Erfassung von Reaktionssäumen und Gel.',
        findingTitle: 'Prüfbericht: Polarisationsmikroskopie',
        findingText: 'Deutliche Reaktionshöfe um Gesteinskörner aus Opalsandstein und Grauwacke. In den Poren und Mikrorissen findet sich reichlich isotropes Alkalisilicat-Gel.',
        keyValues: [
          { label: 'Reaktive Gesteinskörner', value: 'Opalsandstein & Flint (Klasse E3)', isAnomaly: true },
          { label: 'Alkali-Kieselsäure-Gel', value: 'Massiv in Rissen und Poren vorhanden', isAnomaly: true },
          { label: 'Gefügespannung', value: 'Drei-Sterne-Radialrisse um Körner', isAnomaly: true }
        ],
        didacticHint: 'Eindeutiger Nachweis: Das Gel quillt unter Wasseraufnahme; die Quelldrücke übersteigen die Zugfestigkeit des Betons und erzeugen Risse.'
      },
      {
        id: 'alkali_analyse',
        name: 'Chemische Analyse des Alkaligehalts (Na2O-Äquivalent)',
        category: 'labor',
        cost: 900,
        duration: '3 Tage',
        shortDesc: 'Flammenphotometrische Bestimmung der Alkalien im Zementstein nach DIN EN 196-2.',
        findingTitle: 'Prüfbericht: Gesamtalkaligehalt',
        findingText: 'Das wirksame Na2O-Äquivalent beträgt 1,28 M.-% bezogen auf Zement. Der damals verwendete Zement war kein NA-Zement (Grenzwert für NA: max. 0,60 M.-%).',
        keyValues: [
          { label: 'Na2O-Äquivalent', value: '1,28 M.-%', isAnomaly: true },
          { label: 'NA-Grenzwert', value: '0,60 M.-%', isAnomaly: true },
          { label: 'Feuchtigkeitsklasse', value: 'WO / WF / WS -> WS (Feucht + Tausalz)', isAnomaly: true }
        ],
        didacticHint: 'Alle drei Voraussetzungen für AKR sind erfüllt: 1. Reaktive Kieselsäure, 2. Hoher Alkaligehalt (> 0,60%), 3. Ständige Feuchtigkeit.'
      },
      {
        id: 'chlorid_bruecke',
        name: 'Bohrmehlanalyse auf Chloride (Sprühnebel)',
        category: 'labor',
        cost: 850,
        duration: '2 Tage',
        shortDesc: 'Bestimmung des Tausalzgehaltes an der Pfeileroberfläche.',
        findingTitle: 'Prüfbericht: Chloridgehalt',
        findingText: 'In der Randzone 0-10 mm finden sich moderate Chloride (0,45 M.-%), die jedoch in 30 mm Tiefe unter 0,15 M.-% abfallen. Keine signifikante Lochfraßgefahr der Kernbewehrung.',
        keyValues: [
          { label: 'Chlorid in Bewehrungstiefe', value: '0,12 M.-%', isAnomaly: false }
        ],
        didacticHint: 'Tausalzeintrag beschleunigt zwar die AKR durch Zufuhr von Na⁺-Ionen, ist hier aber nicht der primäre strukturelle Rissverursacher.'
      },
      {
        id: 'rissbreiten_monitoring',
        name: 'Rissbreiten-Monitoring & Rissmonitore (ZfP)',
        category: 'vorort',
        cost: 450,
        duration: '1 Tag',
        shortDesc: 'Anbringen von Präzisions-Gipsmarken und Rissmonitoren zur Überwachung aktiver Rissweitenänderungen.',
        findingTitle: 'Prüfbericht: Risskinetik',
        findingText: 'Risse sind aktiv und weiten sich kontinuierlich um ca. 0,15 mm pro Halbjahr auf. Typisches Netzrissmuster ohne Ausrichtung an Hauptspannungstrajektorien.',
        keyValues: [
          { label: 'Mittlere Rissbreite w', value: '0,35 mm – 0,70 mm', isAnomaly: true },
          { label: 'Rissdynamik', value: 'Aktiv fortschreitend (Dehnungsquelldruck)', isAnomaly: true }
        ],
        didacticHint: 'Spannungsunabhängige Netzrisse mit fortschreitender Aufweitung sind der typische Fingerabdruck des Treibens aus dem Baustoffinneren.'
      }
    ],
    hypotheses: [
      {
        id: 'h_akr_bruecke',
        title: 'Schädigende Alkali-Kieselsäure-Reaktion (AKR / „Betonkrebs“)',
        isCorrect: true,
        explanation: 'Volltreffer! Hohes Na₂O-Äquivalent (1,28%), alkaliempfindliche Gesteinskörnung E3 und Feuchte führten zur Bildung von quellendem Alkalisilicat-Gel mit Netzrissen.'
      },
      {
        id: 'h_frost',
        title: 'Reiner Frost-Tausalz-Oberflächenabtrag (CDF-Versagen)',
        isCorrect: false,
        explanation: 'Falsch: Frost erzeugt oberflächliche Abplatzungen (Skalierung), aber keine durchgehenden Netzrisse mit austretendem Alkalisilicat-Gel aus dem Bauteilinneren.'
      },
      {
        id: 'h_setzung',
        title: 'Fundamentsetzung des Brückenpfeilers infolge Baugrundnachgiebigkeit',
        isCorrect: false,
        explanation: 'Falsch: Setzungsrisse verlaufen schräg unter ca. 45° entlang der Schubtrajektorien und zeigen keine Gallertausscheidungen.'
      }
    ],
    sanitationPrinciples: [
      {
        id: 'p_trocken',
        title: 'Prinzip Feuchteentzug & Hydrophobierung: Risse elastisch schließen, Pfeiler einhausen / hydrophobieren',
        standard: 'AKR-Richtlinie (DAfStb) / TR Instandhaltung',
        isCorrect: true,
        explanation: 'Richtig! Da AKR zwingend flüssiges Wasser zum Quellen benötigt, stoppt ein dauerhafter Feuchteentzug (Silan-Hydrophobierung, rissüberbrückende Beschichtung, Ableitung von Brückenwasser) die Schadensprogression.'
      },
      {
        id: 'p_ausstemmen',
        title: 'Vollständiges Ausstemmen der Pfeiler und Ersatz durch Normalbeton',
        standard: 'Unwirtschaftlich / Gefährlich',
        isCorrect: false,
        explanation: 'Falsch: Bei massiven Brückenpfeilern ist ein Totalaustausch statisch extrem riskant und wirtschaftlich meist untragbar. Feuchteentzug und Monitoring sind die anerkannte Praxis.'
      }
    ]
  }
];

export function SchadensforensikSimulator() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case_parkhaus');
  const [performedMethods, setPerformedMethods] = useState<Record<string, boolean>>({});
  const [selectedHypothesis, setSelectedHypothesis] = useState<string | null>(null);
  const [selectedPrinciple, setSelectedPrinciple] = useState<string | null>(null);
  const [submittedDiagnosis, setSubmittedDiagnosis] = useState(false);
  const [simulationWarning, setSimulationWarning] = useState<string | null>(null);

  const currentCase = useMemo(() => {
    return CASE_STUDIES.find(c => c.id === selectedCaseId) || CASE_STUDIES[0];
  }, [selectedCaseId]);

  // Financial calculations
  const spentBudget = useMemo(() => {
    return currentCase.availableMethods.reduce((sum, method) => {
      return performedMethods[method.id] ? sum + method.cost : sum;
    }, 0);
  }, [currentCase, performedMethods]);

  const remainingBudget = currentCase.budget - spentBudget;

  const handleResetCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setPerformedMethods({});
    setSelectedHypothesis(null);
    setSelectedPrinciple(null);
    setSubmittedDiagnosis(false);
    setSimulationWarning(null);
  };

  const handleToggleMethod = (methodId: string) => {
    const method = currentCase.availableMethods.find(m => m.id === methodId);
    if (!method) return;

    if (!performedMethods[methodId]) {
      // Check budget
      if (remainingBudget < method.cost) {
        setSimulationWarning('Unzureichendes Budget! Sie haben nicht genügend finanzielle Mittel für dieses Prüfverfahren.');
        return;
      }
      setSimulationWarning(null);
      setPerformedMethods(prev => ({ ...prev, [methodId]: true }));
    }
  };

  const correctHypothesis = currentCase.hypotheses.find(h => h.isCorrect);
  const correctPrinciple = currentCase.sanitationPrinciples.find(p => p.isCorrect);
  const isHypothesisCorrect = selectedHypothesis === correctHypothesis?.id;
  const isPrincipleCorrect = selectedPrinciple === correctPrinciple?.id;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Header & Case Selector */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-shiraz bg-shiraz/10 px-3 py-1 rounded-full inline-block mb-1">
            Interaktive Fallstudie
          </span>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Search className="text-shiraz" size={22} />
            Bauforensik &amp; Fallstudien: Diagnostik-Simulator
          </h2>
          <p className="text-xs text-text-main/70 mt-1">
            Schlüpfen Sie in die Rolle des Bausachverständigen: Untersuchen Sie Schäden, verwalten Sie Ihr Untersuchungsbudget und wählen Sie die normkonforme Sanierung.
          </p>
        </div>

        {/* Case Switcher Buttons */}
        <div className="flex gap-2">
          {CASE_STUDIES.map((c) => (
            <button
              key={c.id}
              onClick={() => handleResetCase(c.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                selectedCaseId === c.id
                  ? 'bg-shiraz text-white border-shiraz shadow-xs'
                  : 'bg-off-white text-text-main border-home-grau/30 hover:bg-slate-100'
              }`}
            >
              {c.title.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Case Overview & Budget Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Case Description & Visual (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
            <div>
              <h3 className="font-bold text-base text-text-main">{currentCase.title}</h3>
              <p className="text-xs text-shiraz font-medium">{currentCase.subtitle}</p>
            </div>
            <div className="text-right text-xs">
              <span className="text-text-main/60 block">Baujahr / Ort</span>
              <span className="font-bold text-text-main">{currentCase.yearBuilt} • {currentCase.location.split(',')[0]}</span>
            </div>
          </div>

          <div className="text-xs text-text-main/80 leading-relaxed bg-off-white p-3.5 rounded-xl border border-home-grau/25">
            <strong>Befund bei der Erstbegehung:</strong> {currentCase.situation}
          </div>

          {/* SVG Visual Representation of the Damage Scheme */}
          <div className="svg-buehne rounded-xl p-4 border flex flex-col items-center justify-center relative overflow-hidden min-h-[220px]">
            <span className="absolute top-2 left-3 text-[10px] font-mono bu-text2 uppercase tracking-widest flex items-center gap-1.5">
              <Eye size={12} className="text-shiraz" /> Schadensschematik (Querschnitt)
            </span>

            {currentCase.visualType === 'parkhaus' && (
              <svg role="img" aria-label="Schadensschematik im Querschnitt: Parkhausstütze" width="340" height="180" viewBox="0 0 340 180" className="select-none">
                {/* Concrete Column Body */}
                <rect x="70" y="20" width="200" height="140" fill="var(--bu-beton)" stroke="var(--bu-kontur)" strokeWidth="2" rx="4" />
                
                {/* Carbonation zone boundary (dk = 18mm) */}
                <rect x="70" y="20" width="30" height="140" fill="var(--bu-violett)" opacity="0.12" />
                <rect x="240" y="20" width="30" height="140" fill="var(--bu-violett)" opacity="0.12" />
                <line x1="100" y1="20" x2="100" y2="160" stroke="var(--bu-violett)" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x="105" y="35" fill="var(--bu-violett)" fontSize="8" className="font-mono">dk = 18 mm</text>

                {/* Rebar position (c = 31mm) */}
                <line x1="115" y1="20" x2="115" y2="160" stroke="var(--bu-stahl)" strokeWidth="6" />
                <text x="123" y="50" fill="var(--bu-text2)" fontSize="8" className="font-mono">Bewehrung (c=31mm)</text>

                {/* Chloride Ingress arrows from bottom left (splash water) */}
                <path d="M 30 140 Q 55 130 80 135" stroke="var(--bu-blau)" strokeWidth="2.5" fill="none" markerEnd="url(#arrow)" />
                <path d="M 30 110 Q 60 105 85 112" stroke="var(--bu-blau)" strokeWidth="2.5" fill="none" />
                <text x="25" y="95" fill="var(--bu-blau)" fontSize="9" fontWeight="bold">Cl⁻ (Tausalz)</text>
                <text x="25" y="105" fill="var(--bu-blau)" fontSize="8">Spritzwasser</text>

                {/* Spalled Concrete section at corner */}
                <path d="M 70 100 Q 95 110 90 150 Q 80 160 70 160 Z" fill="var(--bu-grund)" stroke="var(--bu-rot)" strokeWidth="1.5" strokeDasharray="2 2" />
                <text x="82" y="130" fill="var(--bu-rot)" fontSize="8" fontWeight="bold">Abplatzung</text>

                {/* Rust / Pitting corrosion node on rebar */}
                <circle cx="115" cy="125" r="7" fill="#b91c1c" stroke="var(--bu-rot)" strokeWidth="2" />
                <text x="130" y="130" fill="var(--bu-rot)" fontSize="8" fontWeight="bold">Lochfraß-Mulde!</text>
              </svg>
            )}

            {currentCase.visualType === 'bruecke' && (
              <svg role="img" aria-label="Schadensschematik im Querschnitt: Brückenbauteil" width="340" height="180" viewBox="0 0 340 180" className="select-none">
                {/* Bridge Pier Body */}
                <rect x="60" y="20" width="220" height="140" fill="var(--bu-beton)" stroke="var(--bu-kontur)" strokeWidth="2" rx="4" />
                
                {/* Reactive aggregate grain in center */}
                <circle cx="170" cy="85" r="28" fill="var(--bu-beton-hell)" stroke="var(--bu-linie)" strokeWidth="2" />
                <text x="170" y="85" fill="var(--bu-text)" fontSize="8" textAnchor="middle" fontWeight="bold">Opalsandstein</text>
                <text x="170" y="96" fill="var(--bu-text2)" fontSize="7" textAnchor="middle">(Korn E3)</text>

                {/* Swelling Gel Ring */}
                <circle cx="170" cy="85" r="38" fill="none" stroke="var(--bu-amber)" strokeWidth="3" strokeDasharray="4 2" />
                <text x="170" y="42" fill="var(--bu-amber)" fontSize="8" textAnchor="middle" fontWeight="bold">Quelldruck &gt; 8 MPa</text>

                {/* Radiating 3-Star and Map Cracks */}
                <path d="M 170 50 L 170 20 M 140 105 L 85 145 M 200 105 L 255 145" stroke="var(--bu-rot)" strokeWidth="2.5" />
                <path d="M 170 20 L 195 25 M 85 145 L 60 135 M 255 145 L 280 130" stroke="var(--bu-rot)" strokeWidth="1.5" />
                
                <text x="170" y="150" fill="var(--bu-rot)" fontSize="9" textAnchor="middle" fontWeight="bold">
                  Netzrissmuster &amp; Gelaustritt
                </text>
              </svg>
            )}
          </div>
        </div>

        {/* Right: Budget & Progress Card (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between gap-4">
          <div>
            <h3 className="font-bold text-sm text-text-main uppercase tracking-wider flex items-center gap-2 border-b border-home-grau/20 pb-2">
              <Coins size={16} className="text-shiraz" /> Untersuchungs-Budget
            </h3>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-main/70">Verfügbares Gesamtbudget:</span>
                <span className="font-mono font-bold text-text-main">{formatDeWert(currentCase.budget)} €</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-main/70">Bisherige Ausgaben:</span>
                <span className="font-mono font-bold text-rose-600">- {formatDeWert(spentBudget)} €</span>
              </div>
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 flex justify-between items-center">
                <span className="text-xs font-bold text-text-main">Verbleibendes Budget:</span>
                <span className={`text-base font-mono font-bold ${
                  remainingBudget > 1500 ? 'text-emerald-700' : remainingBudget > 500 ? 'text-amber-700' : 'text-red-700'
                }`}>
                  {formatDeWert(remainingBudget)} €
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    (spentBudget / currentCase.budget) > 0.8 ? 'bg-rose-600' : 'bg-shiraz'
                  }`}
                  style={{ width: `${Math.min(100, (spentBudget / currentCase.budget) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-text-main/60 mt-1 block text-right font-mono">
                {formatDeZahl(((spentBudget / currentCase.budget) * 100), 0)} % aufgebraucht
              </span>
            </div>
          </div>

          {/* Quick instructions */}
          <div className="p-3 bg-shiraz/5 border border-shiraz/20 rounded-xl text-xs text-text-main/80 space-y-1">
            <span className="font-bold text-shiraz block flex items-center gap-1">
              <Info size={14} /> Strategischer Rat:
            </span>
            <p className="text-[11px] leading-relaxed">
              Vermeiden Sie es, blindlings alle Tests zu beauftragen. Wählen Sie gezielt die Untersuchungen, 
              die typische Schadensursachen (z. B. Karbonatisierung vs. Chlorid vs. AKR) zweifelsfrei trennen können.
            </p>
          </div>
        </div>
      </div>

      {/* Diagnostic Methods Catalog */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
        <h3 className="font-bold text-base text-text-main flex items-center gap-2">
          <Microscope className="text-shiraz" size={20} />
          Verfügbare Prüfverfahren (Diagnostik-Katalog)
        </h3>
        <p className="text-xs text-text-main/70">
          Beauftragen Sie gezielt Verfahren. Nach Durchführung erhalten Sie den offiziellen Prüfbericht mit den gemessenen Labor- und Vorortdaten.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {currentCase.availableMethods.map((method) => {
            const isDone = !!performedMethods[method.id];
            const canAfford = remainingBudget >= method.cost || isDone;

            return (
              <div 
                key={method.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  isDone 
                    ? 'bg-off-white border-shiraz/40 shadow-xs' 
                    : canAfford 
                      ? 'bg-white border-home-grau/30 hover:border-shiraz/30 hover:shadow-xs' 
                      : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-xs text-text-main">{method.name}</span>
                    <span className="font-mono text-xs font-bold text-shiraz shrink-0">{formatDeWert(method.cost)} €</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-text-main/60 mt-1">
                    <span className="capitalize bg-slate-200 px-1.5 py-0.5 rounded text-[9px] font-medium">
                      {method.category === 'zfp' ? 'Zerstörungsfrei' : method.category === 'labor' ? 'Laborprüfung' : 'Vor-Ort-Test'}
                    </span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {method.duration}</span>
                  </div>
                  <p className="text-[11px] text-text-main/75 mt-2 leading-relaxed">
                    {method.shortDesc}
                  </p>
                </div>

                {/* If executed: show findings! */}
                {isDone ? (
                  <div className="mt-2 pt-3 border-t border-home-grau/20 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                      {method.findingTitle}
                    </span>
                    <p className="text-xs text-text-main/90 font-medium">
                      {method.findingText}
                    </p>

                    <div className="grid grid-cols-1 gap-1.5 pt-1">
                      {method.keyValues.map((kv, idx) => (
                        <div key={idx} className="flex justify-between text-[11px] py-0.5 border-b border-home-grau/10">
                          <span className="text-text-main/70">{kv.label}:</span>
                          <span className={`font-mono font-bold ${kv.isAnomaly ? 'text-rose-700 bg-rose-50 px-1 rounded' : 'text-slate-800'}`}>
                            {kv.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="p-2 bg-amber-50/70 border border-amber-200 rounded-lg text-[10px] text-amber-900 flex items-start gap-1.5">
                      <Sparkles size={12} className="text-amber-700 shrink-0 mt-0.5" />
                      <span>{method.didacticHint}</span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleToggleMethod(method.id)}
                    disabled={!canAfford}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      canAfford 
                        ? 'bg-shiraz text-white hover:bg-shiraz/90 shadow-xs' 
                        : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <FileText size={14} />
                    <span>Untersuchung beauftragen ({formatDeWert(method.cost)} €)</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Synthesis: Diagnosis & Sanitation Concept Selection */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="border-b border-home-grau/20 pb-3">
          <h3 className="font-bold text-base text-text-main flex items-center gap-2">
            <Award className="text-shiraz" size={20} />
            Gutachterliche Bewertung &amp; Sanierungskonzept
          </h3>
          <p className="text-xs text-text-main/70">
            Werten Sie die Befunde aus. Bestimmen Sie die primäre Schadensursache und das zutreffende Sanierungsprinzip.
          </p>
        </div>

        {/* 1. Primary Cause Selection */}
        <div className="space-y-3">
          <span className="font-bold text-xs text-text-main block">
            Schritt 1: Welche primäre Schadensursache diagnostizieren Sie?
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentCase.hypotheses.map((hypo) => {
              const isSelected = selectedHypothesis === hypo.id;
              return (
                <button
                  key={hypo.id}
                  onClick={() => {
                    if (!submittedDiagnosis) {
                      setSelectedHypothesis(hypo.id);
                      setSimulationWarning(null);
                    }
                  }}
                  disabled={submittedDiagnosis}
                  className={`p-3.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-start gap-2.5 ${
                    isSelected 
                      ? 'bg-shiraz/10 border-shiraz text-shiraz font-bold shadow-xs' 
                      : 'bg-off-white border-home-grau/25 text-text-main hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'border-shiraz bg-shiraz text-white' : 'border-slate-400'
                  }`}>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <span>{hypo.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Sanitation Concept Selection */}
        <div className="space-y-3">
          <span className="font-bold text-xs text-text-main block">
            Schritt 2: Welches Instandsetzungsprinzip empfehlen Sie dem Bauherrn?
          </span>

          <div className="grid grid-cols-1 gap-3">
            {currentCase.sanitationPrinciples.map((principle) => {
              const isSelected = selectedPrinciple === principle.id;
              return (
                <button
                  key={principle.id}
                  onClick={() => {
                    if (!submittedDiagnosis) {
                      setSelectedPrinciple(principle.id);
                      setSimulationWarning(null);
                    }
                  }}
                  disabled={submittedDiagnosis}
                  className={`p-3.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-start gap-2.5 ${
                    isSelected 
                      ? 'bg-shiraz/10 border-shiraz text-shiraz font-bold shadow-xs' 
                      : 'bg-off-white border-home-grau/25 text-text-main hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'border-shiraz bg-shiraz text-white' : 'border-slate-400'
                  }`}>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <div className="flex-1">
                    <span className="font-bold block">{principle.title}</span>
                    <span className="text-[10px] text-text-main/60 block mt-0.5">{principle.standard}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {simulationWarning && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
            <AlertTriangle size={16} className="shrink-0 text-rose-600" />
            <span>{simulationWarning}</span>
          </div>
        )}

        {/* Submit Button */}
        {!submittedDiagnosis ? (
          <button
            onClick={() => {
              if (!selectedHypothesis || !selectedPrinciple) {
                setSimulationWarning('Bitte wählen Sie sowohl eine Schadensursache als auch ein Sanierungsprinzip aus!');
                return;
              }
              setSimulationWarning(null);
              setSubmittedDiagnosis(true);
            }}
            className="w-full py-3 bg-shiraz hover:bg-shiraz/90 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <CheckCircle2 size={18} />
            <span>Gutachten abgeben &amp; Auswertung öffnen</span>
          </button>
        ) : (
          /* Result Feedback Card */
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className={`p-4 rounded-2xl border ${
              isHypothesisCorrect && isPrincipleCorrect 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {isHypothesisCorrect && isPrincipleCorrect ? (
                  <>
                    <CheckCircle2 className="text-emerald-700" size={20} />
                    <span>Hervorragend! Ihr Gutachten ist fachlich und normativ vollkommen korrekt.</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="text-rose-700" size={20} />
                    <span>Achtung: Ihr Gutachten weist fachliche oder normative Mängel auf.</span>
                  </>
                )}
              </div>

              {/* Detailed Feedback */}
              <div className="mt-3 space-y-2 text-xs leading-relaxed">
                <div className="p-3 bg-white/70 rounded-xl border border-black/10">
                  <span className="font-bold block text-[11px] text-slate-700">Zu Schritt 1 (Schadensursache):</span>
                  <p className="mt-0.5">{currentCase.hypotheses.find(h => h.id === selectedHypothesis)?.explanation}</p>
                </div>
                <div className="p-3 bg-white/70 rounded-xl border border-black/10">
                  <span className="font-bold block text-[11px] text-slate-700">Zu Schritt 2 (Sanierung):</span>
                  <p className="mt-0.5">{currentCase.sanitationPrinciples.find(p => p.id === selectedPrinciple)?.explanation}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => handleResetCase(selectedCaseId)}
                className="px-4 py-2 bg-shiraz hover:bg-shiraz/90 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw size={14} /> Fallstudie zurücksetzen &amp; erneut versuchen
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
