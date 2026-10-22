import { formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Layers, 
  Database, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Bot, 
  Clock, 
  TrendingUp, 
  HelpCircle, 
  Workflow, 
  FileText, 
  Lightbulb,
  Boxes,
  Compass,
  Zap,
  Info,
  Scale,
  ShieldCheck,
  Check,
  Target,
  FileCheck,
  Calculator
} from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';

export default function KiUeberblick() {
  const [activeTab, setActiveTab] = useState<'kernbegriffe' | 'historie' | 'stand' | 'ausblick' | 'pipeline' | 'vergleich'>('kernbegriffe');
  const [pipelineStep, setPipelineStep] = useState<number>(1);
  
  // State for Kernbegriffe interactive selector
  const [selectedTerm, setSelectedTerm] = useState<'ki' | 'ml' | 'dl' | 'llm' | 'rag' | 'vision' | 'agenten'>('ki');
  const [detailSubTab, setDetailSubTab] = useState<'funktionsweise' | 'beispiele' | 'vergleich' | 'formel' | 'risiken'>('beispiele');
  const [selectedExampleIndex, setSelectedExampleIndex] = useState<number>(0);

  // State for interactive RAG demonstration
  const [simQuestion, setSimQuestion] = useState<'xc4' | 'xf4' | 'rc_beton'>('xc4');
  const [simMode, setSimMode] = useState<'llm_pur' | 'rag'>('rag');

  interface ConstructionExample {
    title: string;
    category: string;
    scenario: string;
    input: string;
    process: string;
    output: string;
    benefit: string;
    normRef: string;
  }

  interface TermData {
    title: string;
    badge: string;
    analogy: string;
    summary: string;
    simpleExpl: string;
    constructionExample: string;
    technicalMechanism: { step: string; title: string; desc: string }[];
    keyCharacteristics: string[];
    examples: ConstructionExample[];
    classicVsAi: {
      classicTitle: string;
      classicSteps: string[];
      classicDisadvantage: string;
      aiTitle: string;
      aiSteps: string[];
      aiAdvantage: string;
      roiSummary: string;
    };
    math: {
      formula: string;
      formulaName: string;
      formulaText: string;
      explanation: string;
      variables: { sym: string; name: string; desc: string }[];
    };
    pitfalls: {
      mainRisk: string;
      engineerDuty: string;
      standards: string;
    };
  }

  const termsData: Record<'ki' | 'ml' | 'dl' | 'llm' | 'rag' | 'vision' | 'agenten', TermData> = {
    ki: {
      title: '1. Künstliche Intelligenz (Synthetische Informationssysteme)',
      badge: 'Systemtheoretischer Oberbegriff',
      analogy: 'Deterministische Wissensrepräsentation & Stochastische Inferenzsysteme',
      summary: 'Oberkategorie aller algorithmischen Systeme zur rechnergestützten Automatisierung kognitiver ingenieurtechnischer Prozesse – von regelbasierten Expertensystemen (Deduktion) bis zu datengetriebenen probabilistischen Modellen (Induktion).',
      simpleExpl: 'Systematische Abbildung ingenieurwissenschaftlicher Entscheidungslogik auf Rechenarchitekturen. Während klassische Bau-Software deterministische physikalische Differentialgleichungen (z. B. FEM-Steifigkeitsmatrizen) löst, verknüpft moderne KI regelbasierte Heuristiken, Optimierungsalgorithmen und selbstlernende statistische Approximationen zur Bewältigung hochdimensionaler Planungsprobleme.',
      constructionExample: 'Ein System, das automatisch eine Baugenehmigung auf Vollständigkeit prüft oder Bauzeitenpläne optimiert.',
      technicalMechanism: [
        { step: '01', title: 'Symbolische Wissensmodellierung', desc: 'Prädikatenlogische Formalisierung baurechtlicher und geometrischer Restriktionen (z. B. regelbasierte Modellprüfung im IFC-Standard nach ISO 16739).' },
        { step: '02', title: 'Subsymbolische Musterinduktion', desc: 'Statistische Approximation hochgradig nichtlinearer Baustoff- und Verformungsphänomene aus empirischen Messreihen ohne a-priori geschlossene physikalische Gleichung.' },
        { step: '03', title: 'Mehrkriterielle Optimierung', desc: 'Gradientenfreie metaheuristische Algorithmen (z. B. Partikelschwarm-Optimierung, Genetische Algorithmen) zur Lösung nicht-konvexer Zielkonflikte (z. B. Eigenfrequenzmaximierung bei Massenminimierung).' },
        { step: '04', title: 'Deterministische Validierung', desc: 'Rückkopplung probabilistischer Modellvorschläge an normativ verankerte Nachweisalgorithmen der Grenzzustände (GZT / GZG nach DIN EN 1990).' }
      ],
      keyCharacteristics: [
        'Taxonomisches Dach: Umfasst maschinelle Lernverfahren, Expertensysteme, Wissensgraphen und generative Inferenzmodelle.',
        'Kombination aus deduktiver Logik (Normenkataloge) und induktiver Datenanalyse (Prüfstandsdaten).',
        'Unterstützung des Building Information Modeling (BIM) über offene Schnittstellen (openBIM, IFC4, BCF).',
        'Rechtliche Determiniertheit: Das System agiert als Rechenhilfsmittel; die Nachweisführung verbleibt in der persönlichen Verantwortung des bauvorlageberechtigten Ingenieurs.'
      ],
      examples: [
        {
          title: 'Automatisiertes Modellprüfverfahren (Rule-Checking) im openBIM-Fachmodell (IFC4)',
          category: 'LPH 4 / Genehmigungsplanung & Bauordnungsrecht',
          scenario: 'Prüfung der normativen Konformität eines 6-geschossigen Hochbaus nach Musterbauordnung (MBO) vor Einreichung der Bauvorlagen.',
          input: 'Semantisch annotiertes IFC4-Modell (3D-Geometrie, Raumvolumina, Feuerwiderstandsklassen REI, lichte Öffnungsmaße).',
          process: 'Rechnerische Überprüfung der Fluchtweggeometrien (Lauflänge ≤ 35 m nach MBO), Brandabschnittstrennungen und Abstandsflächengeometrien (§ 6 LBO) mittels räumlicher Topologieabfragen.',
          output: 'Strukturierter Prüfbericht im BCF-Standard (BIM Collaboration Format) mit georeferenzierten Kollisionselementen.',
          benefit: 'Reduktion behördlicher Nachforderungszyklen um bis zu 75 %; Ausschluss formeller Planungsfehler im Genehmigungsverfahren.',
          normRef: 'Musterbauordnung (MBO) § 33 & jeweilige Landesbauordnungen (LBO § 6)'
        },
        {
          title: 'Topologieoptimierung im Grenzzustand der Tragfähigkeit (SIMP-Verfahren)',
          category: 'LPH 2–3 / Tragwerksplanung & Entwurf',
          scenario: 'Eigengewichts- und Steifigkeitsoptimierung eines weitgespannten Dachträgers (L = 30 m) unter asymmetrischer Schneelast.',
          input: 'Bauraumgrenzen, Stützweiten, Auflagerfreiheitsgrade und Einwirkungskombinationen nach DIN EN 1991-1-1 / DIN EN 1991-1-3.',
          process: 'Kopplung der Solid Isotropic Material with Penalisation (SIMP)-Methode mit einem FEM-Solver zur Minimierung der Nachgiebigkeit (Compliance) unter Erhaltung der Vergleichsspannung σ_v ≤ f_y,d.',
          output: 'Topologieoptimiertes Raumfachwerk (Stahlgüte S355J2) mit idealisiertem Kraftfluss und Fertigungsdaten für CNC-Zuschnitte.',
          benefit: 'Massereduktion um 32 % bei identischer globaler Steifigkeit; unmittelbare Senkung der embodied carbon-Werte.',
          normRef: 'DIN EN 1993-1-1 (Eurocode 3: Bemessung und Konstruktion von Stahlbauten)'
        },
        {
          title: 'Stochastische 4D-Bauablaufsimulation & Kritischer-Pfad-Optimierung (CPM)',
          category: 'LPH 8 / Bauoberleitung & Ausführung',
          scenario: 'Termin- und Ressourcenoptimierung getakteter Ortbetonierabschnitte bei beengten innerstädtischen Baustellenverhältnissen.',
          input: '4D-BIM-Bauzeitenplan, betontechnologische Mindestausschalfristen (Reifegradberechnung nach de Vree), Wetterdaten und Krankapazitäten.',
          process: 'Monte-Carlo-Simulation von 10.000 Bauablaufszenarien zur stochastischen Ermittlung von Pufferzeitverbrauch und logistischen Engpässen.',
          output: 'Dynamisch angepasster Taktterminplan mit probabilistischer Eintrittswahrscheinlichkeit für Meilensteintermine.',
          benefit: 'Minimierung von Bauzeitverzug und vertraglichen Pönalen nach VOB/B § 5; Vermeidung von Frischbeton-Verzögerungsschäden.',
          normRef: 'VOB/B § 5 (Ausführungsfristen) & VDI 2552 (Building Information Modeling)'
        }
      ],
      classicVsAi: {
        classicTitle: 'Konventionelle Ingenieurmethodik (Deterministisch / Manuell)',
        classicSteps: [
          'Händischer visueller Soll-Ist-Abgleich zweidimensionaler Plandokumente gegen Gesetzestexte.',
          'Räumliche geometrische Kollisionen zwischen TGA und Tragwerk werden erst auf der Baustelle offenkundig.',
          'Dimensionierung von Trägern erfolgt auf Basis grober tabellarischer Vorbemessungswerte.'
        ],
        classicDisadvantage: 'Hohe Fehleranfälligkeit bei Planungsänderungen, erhebliche Personalbindung, langwierige Genehmigungsverfahren.',
        aiTitle: 'KI-gestützte Ingenieurmethodik (Hybride Inferenz / Automatisierung)',
        aiSteps: [
          'Vollautomatischer digitaler LBO- und Kollisionscheck im semantischen IFC-Modell in unter 3 Minuten.',
          'Topologieoptimierte Querschnittssynthese führt zu signifikanten Masseneinsparungen bei voller Normkonformität.',
          'Ingenieur agiert als evaluierende Instanz und fokussiert auf komplexe bautechnische Detaillösungen.'
        ],
        aiAdvantage: 'Faktor 20 gesteigerte Prüfgeschwindigkeit, 100 % Prüfdichte, nachweisbare Werkstoff- und CO2-Einsparung.',
        roiSummary: '70–80 % Zeitersparnis bei der Modellvalidierung und Bauantragsvorbereitung.'
      },
      math: {
        formula: '\\mathcal{A}^* = \\arg\\max_{a \\in \\mathcal{A}} \\mathbb{E}\\left[\\sum_{t=0}^T \\gamma^t R(s_t, a_t)\\right]',
        formulaName: 'Markov-Entscheidungsprozess (MDP / Bellman-Optimierungsoperatoren)',
        formulaText: 'Mathematische Formulierung optimaler baulicher Entscheidungsfindung unter stochastischen Randbedingungen.',
        explanation: 'Die KI ermittelt die Handlungssequenz a*, die den mathematischen Erwartungswert einer mehrkriteriellen Zielfunktion R (z. B. minimale Baukosten, minimale CO2-Emissionen, maximale Tragsicherheit) über den Zeithorizont T maximiert.',
        variables: [
          { sym: '\\mathcal{A}^*', name: 'Optimale Strategie', desc: 'Menge optimaler bautechnischer Entscheidungen (z. B. Topologieauswahl, Takttaktung).' },
          { sym: 's_t, a_t', name: 'Zustand & Aktion', desc: 'Zustandsvektor des Bauprojekts zum Zeitschritt t und ausgeführte Dimensionierungs- oder Steuerungsaktion.' },
          { sym: 'R(s, a)', name: 'Zielfunktion (Reward)', desc: 'Skalare Bewertungsfunktion (z. B. Ausnutzungsgrad nach Eurocode, Herstellkosten, GWP-Kennwert).' },
          { sym: '\\gamma', name: 'Diskontierungsfaktor', desc: 'Gewichtung künftiger Bau- und Lebenszyklusfolgen gegenüber kurzfristigen Investitionskosten (0 < gamma <= 1).' }
        ]
      },
      pitfalls: {
        mainRisk: 'Fehlende Nachvollziehbarkeit bei rein probabilistischen Heuristiken; Risiko systematischer Fehleinschätzungen bei atypischen Randbedingungen.',
        engineerDuty: 'Der Entwurfsverfasser und bauvorlageberechtigte Ingenieur haftet persönlich gemäß BGB § 634 und Landesbauordnung. KI-Systeme entbinden nicht von der Pflicht zur unabhängigen statisch-konstruktiven Plausibilitätsprüfung.',
        standards: 'KI-VO (EU) 2024/1689 (Hochrisiko nur bei Zweckbestimmung nach Art. 6 / Anhang I oder III), DIN SPEC 92001, HOAI'
      }
    },

    ml: {
      title: '2. Maschinelles Lernen (Statistische Inferenz & Regression)',
      badge: 'Empirische Induktion',
      analogy: 'Multivariate Inferenzmodelle & Statistische Versuchsfeldkalibrierung',
      summary: 'Mathematische Verfahren zur Extraktion verallgemeinerungsfähiger Gesetzmäßigkeiten aus empirischen Versuchs- und Messdaten ohne explizite analytische Modellierung.',
      simpleExpl: 'Maschinelles Lernen approximiert die unbekannte multivariate Übertragungsfunktion zwischen Materialzusammensetzungen und mechanischen Kennwerten. Anhand historischer Labordaten minimiert das Modell eine quadratische oder logarithmische Verlustfunktion, wodurch hochkomplexe nichtlineare Zusammenhänge (z. B. Hydratationskinetik von Klinkerersatzstoffen) exakt abgebildet werden.',
      constructionExample: 'Aus 5.000 protokollierten Beton-Druckprüfungen prognostiziert das Modell die 28-Tage-Druckfestigkeit einer neuen Mischung.',
      technicalMechanism: [
        { step: '01', title: 'Merkmalsraum-Parametrisierung', desc: 'Definition und Normalisierung des Eingangsvektors x in R^d (z. B. äquivalenter Wasserzementwert (w/z)_eq, Zementgehalt in kg/m³, Klinker-Phasenbestand, Gesteinsmehlanteil).' },
        { step: '02', title: 'Verlustfunktions-Minimierung', desc: 'Numerische Parameteroptimierung (z. B. Stochastic Gradient Descent, L-BFGS) zur Minimierung des mittleren quadratischen Prognosefehlers (MSE).' },
        { step: '03', title: 'Regularisierung & Kreuzvalidierung', desc: 'Unterdrückung von Überanpassung (Overfitting) an Messrauschen durch L1/L2-Strafmatrizen und k-fache Stratified Cross-Validation.' },
        { step: '04', title: 'Inferenz & Konfidenzintervall', desc: 'Punktschätzung der Zielgröße f_ck inklusive quantitativer 95%-Konfidenzintervalle auf Basis der asymptotischen Modellkovarianz.' }
      ],
      keyCharacteristics: [
        'Supervised Learning: Kalibrierung an normativ verifizierten Prüfstandsdaten (z. B. Festbetondruckprüfungen nach DIN EN 12390-3).',
        'Unsupervised Learning: Autonome Clusteranalyse zur Detektion geotechnischer Schichtgrenzen oder Werkstoffanomalien.',
        'Feature Importance: Quantitative Bestimmung der Haupteinflussfaktoren über SHAP-Vektoren (Shapley Additive Explanations).',
        'Strikte Gültigkeitsgrenzen: Gültigkeit beschränkt auf den konvexen Hüllkörper des Trainingsdatensatzes (keine uneingeschränkte Extrapolation).'
      ],
      examples: [
        {
          title: 'Multivariate Inferenz der 28-Tage-Betondruckfestigkeit aus Frühfestigkeitsdaten',
          category: 'Baustoffprüfung & Betontechnologie (DIN EN 206)',
          scenario: 'Echtzeit-Konformitätsprüfung im Transportbetonwerk zur Minimierung von Schalungsstandzeiten im Hochbau.',
          input: 'Zusammensetzungsvektor (CEM-Typ, Klinkergehalt, Hüttensandanteil, PCE-Fließmitteldosierung, (w/z)_eq) und 24h-Frühdruckfestigkeit f_c,1d.',
          process: 'Gradient-Boosted Decision Trees (XGBoost) ermitteln die nichtlineare Kinetik der Festigkeitsentwicklung auf Basis von 12.000 Laborversuchsreihen.',
          output: 'Prognostizierte 28-Tage-Druckfestigkeit f_ck,28d mit zweiseitigem 95%-Konfidenzintervall (z. B. 37,8 ± 1,4 N/mm² -> gesicherte Einstufung in C30/37).',
          benefit: 'Sichere Reduktion der Ausschalfristen um bis zu 48 Stunden; unmittelbare Chargenkorrektur vor Einbau im Folgegeschoss.',
          normRef: 'DIN EN 206 / DIN 1045-2 & DIN EN 12390-3'
        },
        {
          title: 'Numerische Modellierung der Karbonatisierungsfront x_c(t) im Ingenieurbau',
          category: 'Bauwerkserhaltung & Dauerhaftigkeitsbemessung',
          scenario: 'Restlebensdauerprognose von Stahlbeton-Brückenbauwerken bezüglich Depassivierung der Bewehrung.',
          input: 'Bauwerksalter, Mikroklimadaten (relative Feuchte RH, CO2-Partialdruck), gemessene Betondeckung c_nom und Sorptionsporosität.',
          process: 'Support Vector Regression (SVR) mit Radial-Basis-Funktionskern zur Approximation des feuchteabhängigen Diffusionskoeffizienten D_CO2(RH).',
          output: 'Zeitabhängiger Verlauf der Karbonatisierungstiefe x_c(t) = k · √t und Schadenseintrittswahrscheinlichkeit P(c ≤ x_c).',
          benefit: 'Objektivierte Instandsetzungsplanung nach ZTV-ING; gezielte Festlegung von Reprofilierungs- und Oberflächenschutzsystemen.',
          normRef: 'DIN EN 1504 & DAfStb-Instandsetzungsrichtlinie'
        },
        {
          title: 'Räumliche Geostatistik & Baugrund-Setzungsanalyse aus CPT-Sondierungen',
          category: 'Geotechnik & Spezialtiefbau',
          scenario: 'Gründungsoptimierung für Flächengründungen bei stark wechselnden Schichtmächtigkeiten.',
          input: 'Messdaten kontinuierlicher Drucksondierungen (Spitzenwiderstand q_c, Mantelreibung f_s, Porenwasserdruck u).',
          process: 'Kombination aus K-Nearest Neighbors und Kriging-Interpolation zur Konstruktion eines 3D-Bodensteifigkeitsmodells (E_s-Modul).',
          output: 'Kontinuierliche Verteilung des Bettungsmoduls k_s(x,y) zur Übergabe an die FE-Plattenstatik.',
          benefit: 'Minimierung von Differenzsetzungen; signifikante Reduzierung unvorhersehbarer Baugrundrisiken nach § 644 BGB.',
          normRef: 'DIN 4020 & DIN EN 1997-1 (Eurocode 7: Geotechnik)'
        }
      ],
      classicVsAi: {
        classicTitle: 'Konventionelle Ingenieurmethodik (Deterministisch / Manuell)',
        classicSteps: [
          'Anwendung empirischer Potenzansätze (z. B. Walz-Diagramme) mit stark eingeschränktem Bindemittelspektrum.',
          'Keine rechnerische Erfassung komplexer synergistischer Wechselwirkungen klinkerreduzierter Zemente (CEM II/C, CEM III/A).',
          '28-tägige Zwangswartezeit auf Labor-Würfeldruckprüfungen vor statischer Endabnahme.'
        ],
        classicDisadvantage: 'Überdimensionierte Sicherheitsbeiwerte bei Zementgehalten, hoher Klinkereinsatz, verlängerte Taktzeiten.',
        aiTitle: 'ML-gestützte Inferenzmethodik',
        aiSteps: [
          'Multivariates Modell verarbeitet bis zu 20 physikochemische Einflussfaktoren simultan.',
          'Prognosegüte der 28-Tage-Druckfestigkeit erreicht Bestimmtheitsmaße R² > 0,96 bereits 24 h nach Betonage.',
          'Gezielte Klinkersubstitution ermöglicht CO2-reduzierte Betone bei nachgewiesener Festigkeitskonformität.'
        ],
        aiAdvantage: 'Verlässliche Frühfestigkeits-Inferenz, beschleunigte Taktzyklen, planbare Bindemitteloptimierung.',
        roiSummary: '15 % Klinkereinsparung und 2–3 Tage Bauzeitverkürzung pro Geschosstakt.'
      },
      math: {
        formula: 'y = f(\\mathbf{x}) + \\varepsilon \\quad \\text{mit} \\quad \\min_{\\mathbf{w}} \\frac{1}{N}\\sum_{i=1}^N \\left(y_i - \\mathbf{w}^T \\phi(\\mathbf{x}_i)\\right)^2 + \\lambda \\|\\mathbf{w}\\|_2^2',
        formulaName: 'Tikhonov-regularisierte Ridge-Regression & Feature-Mapping',
        formulaText: 'Mathematische Zielfunktion zur Vorhersage kontinuierlicher Baustoffkennwerte.',
        explanation: 'Minimierung der Residuenquadratsumme zwischen Prüfstandsmesswert yi und Modellschätzung w^T phi(xi), stabilisiert durch die L2-Norm zur Unterdrückung von Multikollinearität der Eingangsparameter.',
        variables: [
          { sym: 'y', name: 'Skalare Zielgröße', desc: 'Gesuchter Baustoffkennwert (z. B. 28-Tage-Zylinderdruckfestigkeit f_ck in N/mm² oder Setzung s in mm).' },
          { sym: '\\mathbf{x}', name: 'Parametervektor', desc: 'Vektor der Einflussgrößen ((w/z)_eq, Zementgehalt in kg/m³, Feuchte, Reifealter).' },
          { sym: '\\mathbf{w}', name: 'Regressionskoeffizienten', desc: 'Numerisch optimierte Gewichtungsfaktoren des Inferenzmodells.' },
          { sym: '\\lambda \\|\\mathbf{w}\\|^2', name: 'Tikhonov-Penalty', desc: 'Regularisierungsterm zur Gewährleistung numerischer Stabilität und Generalisierbarkeit.' }
        ]
      },
      pitfalls: {
        mainRisk: 'Modellunsicherheit bei Extrapolation außerhalb des Trainingsbereichs (Domain Shift): Bei gänzlich neuartigen Zementphasen oder unkalibrierten Betonzusatzmitteln liefert das Modell scheinkonforme, physikalisch fehlerhafte Werte.',
        engineerDuty: 'Erforderlichkeit von Plausibilitätsprüfungen gegen baustoffphysikalische Grenzbedingungen (z. B. Abrams-Gesetz: monotone Festigkeitsabnahme bei steigendem Wasserzementwert).',
        standards: 'DIN EN 12390, DIN EN 206, DIN SPEC 92001'
      }
    },

    dl: {
      title: '3. Deep Learning & Künstliche Neuronale Netze (ANN / CNN)',
      badge: 'Hierarchische Repräsentationsnetze',
      analogy: 'Vielschichtige Tensortransformationen & Faltungsoperatoren',
      summary: 'Vielschichtige künstliche neuronale Netzarchitekturen zur hierarchischen Merkmalsextraktion aus unstrukturierten, hochdimensionalen Signalen (Bilddaten, Punktwolken, Zeitserien).',
      simpleExpl: 'Deep-Learning-Netzwerke transformieren sensorische Rohdaten schichtweise über gewichtete Tensoren und nichtlineare Aktivierungsfunktionen. Dadurch erlernen sie autonome Repräsentationen – von lokalen Bildgradienten bis hin zu komplexen Rissgeometrien oder Eigenfrequenzverschiebungen.',
      constructionExample: 'Automatische Risserkennung: Ein neuronales Netz durchsucht hochauflösende Drohnenbilder einer Pfeileroberfläche und markiert Haarrisse mit Sub-Millimeter-Genauigkeit.',
      technicalMechanism: [
        { step: '01', title: 'Räumliche Faltung (Spatial Convolutions)', desc: 'Multiplikation diskreter Faltungskerne mit Bildmatrizen zur Detektion frequenz- und kantenbezogener Schadensmerkmale.' },
        { step: '02', title: 'Nichtlineare Aktivierung (ReLU / GELU)', desc: 'Anwendung von Aktivierungsfunktionen zur mathematischen Abbildung hochgradig nichtlinearer Bruch- und Schadensmechanismen.' },
        { step: '03', title: 'Gradientenbasierte Fehlerrückführung (Backpropagation)', desc: 'Exakte Berechnung partieller Ableitungen dL/dW über die Kettenregel zur Parameteraktualisierung via AdamW-Optimizer.' },
        { step: '04', title: 'Pixelweise Segmentierung', desc: 'U-Net- oder Feature-Pyramid-Decoder zur Rekonstruktion vollständiger semantischer Masken in nativer Bildauflösung.' }
      ],
      keyCharacteristics: [
        'End-to-End-Lernfähigkeit ohne manuelle Feature-Definition (kein heuristisches Feature Engineering).',
        'Skalierbarkeit auf Multi-Megapixel-Bilddaten, multispektrale Sensoren und hochfrequente Körperschallsignale.',
        'Hohe Inferenzgeschwindigkeit auf dedizierter Tensor-Hardware (GPUs / TPUs).',
        'Erfordert methodische Validierung bezüglich Modellunsicherheit und visueller Artefaktbildung.'
      ],
      examples: [
        {
          title: 'Sub-Millimeter-Risssegmentierung auf Betonoberflächen via CNN (U-Net)',
          category: 'Bauwerksprüfung nach DIN 1076 / ZfP-Bau',
          scenario: 'Zustandserfassung von Brückenpfeilern und Hohlkästen ohne verkehrsbeeinträchtigende Rüstung.',
          input: 'Kalibrierte 4K-Bildserien einer autonomen Drohnenbefliegung mit GSD (Ground Sampling Distance) ≤ 0,2 mm/Pixel.',
          process: 'U-Net-Architektur segmentiert Rissstrukturen, differenziert Schalungsgrate und Texturunregelmäßigkeiten und berechnet die Rissbreite w orthogonal zur Mittellinie.',
          output: 'Georeferenzierter Schadensatlas mit tabellarischer Erfassung aller Risse w ≥ 0,1 mm gemäß DIN 1076.',
          benefit: 'Steigerung der Inspektionsgeschwindigkeit um Faktor 5; vollständige Reproduzierbarkeit der Rissbreitenentwicklung über Inspektionsintervalle.',
          normRef: 'DIN 1076 & RI-EBW-PRÜF'
        },
        {
          title: 'Modale Systemidentifikation & Schwingungsmonitoring schlanker Tragwerke',
          category: 'Structural Health Monitoring (SHM) & Baudynamik',
          scenario: 'Kontinuierliche Schwingungsüberwachung einer Fußgänger-Hängebrücke unter dynamischer Erregung.',
          input: 'Zeitserien von 16 piezoelektrischen 3-Achs-Beschleunigungssensoren (Abtastrate f_s = 200 Hz).',
          process: 'Rekurrente Temporal-Transformer-Netzwerke isolieren modale Parameter (Eigenfrequenzen f_i, modale Dämpfung D_i) und berechnen temperaturkorrigierte Residuen.',
          output: 'Echtzeit-Schadensindex; automatische Alarmierung bei signifikanter Eigenfrequenzreduktion Δf_1 > 1,5 % infolge Spanngliedversagens.',
          benefit: 'Frühzeitige Erkennung von Ermüdungsschäden vor dem Eintreten irreversibler plastischer Verformungen.',
          normRef: 'VDI 4551 & VDI 6200 (Standsicherheit baulicher Anlagen)'
        },
        {
          title: 'Semantische Klassifikation von 3D-LiDAR-Punktwolken für den Soll-Ist-Toleranzabgleich',
          category: 'BIM-Qualitätssicherung & Bauvermessung',
          scenario: 'Geometrische Überprüfung von Ortbetonbauteilen und Einbauteilen vor dem Schließen von Schalungen.',
          input: 'Terrestrischer 3D-Laserscan mit 50 Mio. diskreten Raumkoordinaten (x, y, z) und Reflektivitätswerten.',
          process: 'PointNet++ klassifiziert Punkte in semantische Bauteilklassen (Stütze, Unterzug, Bewehrungslage) und berechnet geometrische Abweichungen zum IFC-Planungsmodell.',
          output: 'Orthogonale Abweichungskarte mit automatischer Grenzwertprüfung der Grenzmaße nach DIN 18202.',
          benefit: 'Sofortige Identifikation von Maßtoleranzüberschreitungen vor der Betonage; Vermeidung kostenintensiver Stemmarbeiten.',
          normRef: 'DIN 18202 (Toleranzen im Hochbau) & DIN EN ISO 19650'
        }
      ],
      classicVsAi: {
        classicTitle: 'Konventionelle Ingenieurmethodik (Deterministisch / Manuell)',
        classicSteps: [
          'Visuelle Bauwerksprüfung mittels Rissbreitenlineal und optischer Lupe im Korb eines Hubsteigers.',
          'Händisches Eintragen von Rissverläufen mit Wachskreide und Fotokamera.',
          'Manuelles Zusammenstellen von Schadensberichten im Büro über mehrere Arbeitstage.'
        ],
        classicDisadvantage: 'Subjektive Befundung, hohe Unfallgefahr, schwer zugängliche Bereiche bleiben ungeprüft.',
        aiTitle: 'Deep-Learning-Ablauf',
        aiSteps: [
          'Drohnen erfassen das gesamte Bauwerk lückenlos mit Sub-Millimeter-Auflösung in wenigen Stunden.',
          'Neuronale Netze vermessen zehntausende Risse pixelgenau und klassifizieren Schadensursachen.',
          'Automatischer digitaler Schadenskataster-Export direkt in Bauwerksdatenbanken (z. B. SIB-Bauwerke).'
        ],
        aiAdvantage: 'Vollständig reproduzierbar, 100 % Prüfdichte, null Verkehrsbeeinträchtigung.',
        roiSummary: '70 % Kosteneinsparung bei Bauwerkshauptprüfungen nach DIN 1076.'
      },
      math: {
        formula: '\\mathbf{a}^{(l)} = \\sigma\\left(\\mathbf{W}^{(l)} \\mathbf{a}^{(l-1)} + \\mathbf{b}^{(l)}\\right) \\quad \\text{mit} \\quad \\mathcal{L}_{BCE} = -\\frac{1}{N}\\sum_{i=1}^N \\left[y_i \\ln(\\hat{y}_i) + (1-y_i)\\ln(1-\\hat{y}_i)\\right]',
        formulaName: 'Mehrschichtige Vorwärtstransformation & Binary Cross-Entropy Loss',
        formulaText: 'Mathematische Signalweiterleitung durch Schichten und pixelweiser Segmentierungsfehler.',
        explanation: 'In jeder Netzschicht werden die Ausgänge der vorherigen Schicht mit der Gewichtsmatrix W multipliziert, um den Bias b verschoben und durch die nichtlineare Aktivierungsfunktion sigma (z. B. ReLU) geleitet.',
        variables: [
          { sym: '\\mathbf{a}^{(l)}', name: 'Aktivierungsvektor', desc: 'Repräsentation der Merkmale in Schicht l (z. B. Kanten, Rissbreiten).' },
          { sym: '\\mathbf{W}^{(l)}', name: 'Gewichtsmatrix', desc: 'Faltungskerne und Verbindungsgewichte der Schicht l.' },
          { sym: '\\mathbf{b}^{(l)}', name: 'Bias-Vektor', desc: 'Schwellenwertverschiebung der künstlichen Neuronen.' },
          { sym: '\\mathcal{L}_{BCE}', name: 'Verlustfunktion', desc: 'Misst den Fehler bei der Risssegmentierung (Riss vs. intakter Beton).' }
        ]
      },
      pitfalls: {
        mainRisk: 'Optische Fehldeutungen: Schlagschatten von Gerüsten, feuchte Wasserläufe oder Schalungsnähte können vom Netz irrtümlich als kritische Trennrisse interpretiert werden ("Black Box").',
        engineerDuty: 'Stichprobenartige Validierung der detektierten Risse vor Ort durch sachkundige ZfP-Prüfer (DGZfP Stufe 2/3).',
        standards: 'DGZfP-Merkblätter, DIN 1076, VDI 6200 (Standsicherheit baulicher Anlagen)'
      }
    },

    llm: {
      title: '4. Large Language Models (Transformer-basierte Sprachmodelle)',
      badge: 'Kontextuelle Sequenzmodelle',
      analogy: 'Autoregressive Aufmerksamkeits-Architekturen & Syntax-Parser',
      summary: 'Auf der Transformer-Architektur basierende Sprachmodelle zur semantischen Interpretation, Synthese und Transformation bautechnischer Texte, Regelwerke und Skriptsprachen.',
      simpleExpl: 'Modelle dieser Klasse berechnen über Multi-Head-Self-Attention-Tensoren die kontextuelle Abhängigkeit zwischen Tokens über lange Textsequenzen hinweg. Sie ermöglichen das automatisierte Parsing von Gutachten, die Generierung VOB-konformer Leistungstexte sowie die Erstellung von API-Schnittstellencode für Statiksoftware.',
      constructionExample: 'Zusammenfassung eines 120-seitigen Baugrundgutachtens in eine übersichtliche Tabelle mit Bodenkennwerten (Bodenklasse, Reibungswinkel φ, Kohäsion c).',
      technicalMechanism: [
        { step: '01', title: 'Byte-Pair-Encoding (BPE) Tokenisierung', desc: 'Zerlegung ingenieurtechnischer Fachbegriffe in optimierte Subword-Einheiten unter Erhalt semantischer Wortstämme.' },
        { step: '02', title: 'Multi-Head Self-Attention', desc: 'Parallele Berechnung relationaler Gewichtungsmatrizen zwischen Querverweisen, Lastfällen und Materialkennwerten im Text.' },
        { step: '03', title: 'Positionskodierung (RoPE)', desc: 'Mathematische Einbettung der relativen und absoluten Distanz zwischen Normabsätzen und Bemessungsregeln im Aufmerksamkeitsraum.' },
        { step: '04', title: 'Autoregressive Inferenz & Temperature-Skalierung', desc: 'Deterministische Wortgenerierung mit reduzierter Entropie (Temperature ≈ 0) zur Minimierung stochastischer Varianzen.' }
      ],
      keyCharacteristics: [
        'Erfassung unstrukturierter bautechnischer Fachliteratur, statischer Vorberichte und juristischer Vertragstexte.',
        'Synthese formaler Programmiersprachen (Python, C#, Dynamo, Grasshopper) für ingenieurtechnische Schnittstellen.',
        'Multimodale Erweiterung: Synchrone Verarbeitung von Textbeschreibungen und Plan-Vektorgrafiken.',
        'Deterministischer Schutzbedarf: Unverankerte Modelle neigen bei numerischen Fachfragen zu Halluzinationen.'
      ],
      examples: [
        {
          title: 'Strukturierte Informationsextraktion aus geotechnischen Untersuchungsberichten',
          category: 'Geotechnik & Tragwerksplanung (LPH 1–4)',
          scenario: 'Überführung unstrukturierter Baugrundgutachten in strukturierte Berechnungsparameter für FE-Fundamentberechnungen.',
          input: '150-seitiges Baugrundgutachten (PDF) mit Sondierdiagrammen, Schichtenprofilen und Laborversuchsergebnissen.',
          process: 'LLM extrahiert bodenmechanische Bemessungskennwerte (Bodenklasse nach DIN 18196, Reibungswinkel φ\', Kohäsion c\', Wichten γ / γ\', Steifemoduln E_s) und filtert Grundwasserstände.',
          output: 'Validiertes JSON-Datenschema zur direkten Belegung der Materialdatenbank in geotechnischer Berechnungssoftware.',
          benefit: 'Reduktion des manuellen Erfassungsaufwands um 85 %; vollständiger Ausschluss von Ablese- und Übertragungsfehlern.',
          normRef: 'DIN 1054 / DIN 4020 (Geotechnische Untersuchungen)'
        },
        {
          title: 'VOB-konforme Formulierung von Leistungsbeschreibungen (STLB-Bau / GAEB)',
          category: 'Ausschreibung & Vergabe (LPH 6)',
          scenario: 'Erstellung detaillierter Ausschreibungstexte für eine wasserundurchlässige Weiße Wanne nach WU-Richtlinie.',
          input: 'Bauteilspezifikation: "WU-Bodenplatte d = 40 cm, Beton C35/45, XC4, XD2, XF3, Bewehrungsgehalt 120 kg/m³, Fugenabdichtungssystem".',
          process: 'LLM generiert Leistungsbeschreibungen unter Berücksichtigung von DIN 18331, benennt Nebenleistungen und Prüfpflichten und strukturiert die Ordnungszahlen.',
          output: 'GAEB DA XML (X83)-kompatible Leistungsverzeichnis-Datei zur nahtlosen Übernahme in AVA-Systeme.',
          benefit: 'Minimierung von Nachtragspotenzialen infolge lückenhafter Leistungsbeschreibungen nach VOB/A § 7.',
          normRef: 'VOB/C DIN 18331 (Betonarbeiten) & GAEB-Standard'
        },
        {
          title: 'Code-Synthese für Statik-Programmierschnittstellen (FEM-Automation via Python)',
          category: 'Computational Structural Engineering',
          scenario: 'Parametrisierte Erzeugung von Geometrie- und Lastkombinationsmodellen für iterative Vorbemessungen.',
          input: 'Technische Spezifikation: "Erzeuge ein Berechnungsmodell für einen 3-Feld-Träger mit variablen Stützweiten unter EC0/EC1-Kombinatorik in RFEM 6."',
          process: 'LLM synthetisiert ein syntaktisch fehlerfreies Python-Skript unter Einbindung der herstellerspezifischen REST-API der Statiksoftware.',
          output: 'Ausführbares Skript mit vollständiger Definition von Strukturknoten, Elementquerschnitten, Auflagern und Lastfallgruppen.',
          benefit: 'Zeitersparnis bei der Modellinitialisierung von mehreren Stunden auf wenige Sekunden.',
          normRef: 'DIN EN 1990 (Eurocode 0: Grundlagen der Tragwerksplanung)'
        }
      ],
      classicVsAi: {
        classicTitle: 'Konventionelle Ingenieurmethodik (Deterministisch / Manuell)',
        classicSteps: [
          'Händisches Herauskopieren von Textbausteinen aus Altdokumenten mit hohem Übertragungsfehlerrisiko.',
          'Gefahr der Verwendung zurückgezogener Regelwerksstände (z. B. DIN 1045 statt Eurocode 2).',
          'Programmierung von Statik-Schnittstellen erfordert tiefe IT- und Softwareentwicklungs-Spezialkenntnisse.'
        ],
        classicDisadvantage: 'Hoher Zeitaufwand, Copy-Paste-Fehler führen zu Gewährleistungs- und Nachtragsrisiken.',
        aiTitle: 'LLM-gestützter Ablauf',
        aiSteps: [
          'LLM synthetisiert normaktuelle, baurechtlich präzise Fachtexte und Automationsskripte in wenigen Sekunden.',
          'Semantische Prüfung von Leistungsbeschreibungen und Bauverträgen auf Vollständigkeit und Normkonformität.',
          'Der Ingenieur agiert als qualitätssichernde Prüf- und Freigabeinstanz.'
        ],
        aiAdvantage: 'Faktor 10 gesteigerte Effizienz bei technischen Berichten, Ausschreibungstexten und Skripten.',
        roiSummary: '80 % Zeitersparnis bei der Erstellung von Standardberichten und Leistungsverzeichnissen.'
      },
      math: {
        formula: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V \\quad \\text{mit} \\quad P(w_t \\mid w_1, \\dots, w_{t-1})',
        formulaName: 'Scaled Dot-Product Attention & Autoregressive Wahrscheinlichkeit',
        formulaText: 'Aufmerksamkeitsmechanismus der Transformer-Architektur.',
        explanation: 'Attention berechnet, wie stark jedes Wort im Bauvertrag oder Normtext auf jedes andere Wort achten muss, skaliert durch die Wurzel der Dimension dk.',
        variables: [
          { sym: 'Q', name: 'Query-Matrix', desc: 'Die aktuelle Suchanfrage oder das zu interpretierende Fachwort.' },
          { sym: 'K', name: 'Key-Matrix', desc: 'Schlüsselvektoren aller Wörter im gesamten Dokumentenkontext.' },
          { sym: 'V', name: 'Value-Matrix', desc: 'Die semantischen Bedeutungsinhalte der Textbestandteile.' },
          { sym: 'd_k', name: 'Skalierungsfaktor', desc: 'Dimension der Key-Vektoren, verhindert extreme Gradienten in der Softmax-Funktion.' }
        ]
      },
      pitfalls: {
        mainRisk: 'Stochastische Konfabulation (Halluzination): Unverankerte Sprachmodelle neigen dazu, nicht existente Normabsätze, falsche Expositionsklassen-Zuordnungen oder fehlerhafte Sicherheitsbeiwerte mit hoher grammatikalischer Sicherheit zu behaupten.',
        engineerDuty: 'Ausschließliche Verwendung verankerter RAG-Systeme für rechts- und nachweisrelevante Ingenieurentscheidungen; persönliche Kontrolle aller numerischen Ausgaben.',
        standards: 'VOB Teil A/B/C, DIN EN 1990–1999 (Eurocodes), HOAI § 634 BGB'
      }
    },

    rag: {
      title: '5. Retrieval-Augmented Generation (RAG)',
      badge: 'Evidenzbasierte Inferenz',
      analogy: 'Wissenseinbettung & Vektordatenbank-Retrieval',
      summary: 'Hybride Systemarchitektur, die parametrisches Sprachmodellwissen mit extern indizierten, normativ verifizierten Wissensdatenbanken koppelt, um Halluzinationen auszuschließen.',
      simpleExpl: 'RAG trennt Wissensspeicherung und Textsynthese: Die Anfrage des Ingenieurs wird in einen semantischen Vektor transformiert. Eine Vektordatenbank identifiziert über Abstandsmetriken die mathematisch ähnlichsten Dokumentenauszüge. Das LLM generiert die Antwort ausschließlich konditioniert auf diesen belegten Primärquellen.',
      constructionExample: 'Frage: "Welche Betondeckung verlangt DIN EN 1992-1-1 bei XC4?" -> RAG findet Tabelle 4.4N -> LLM antwortet exakt mit 25 mm + 10 mm Vorhaltemaß und nennt die exakte Seitenzahl.',
      technicalMechanism: [
        { step: '01', title: 'Dokumenten-Chunking & Metadatenstruktur', desc: 'Deterministische Zerlegung von Normen und Fachgutachten in semantisch geschlossene Chunks mit Metadaten (Norm, Kapitel, Revisionsstand).' },
        { step: '02', title: 'Dense Vector Embedding', desc: 'Abbildung von Textpassagen in hochdimensionale Vektoren d in R^1536 über vortrainierte Einbettungsmodelle.' },
        { step: '03', title: 'Approximate Nearest Neighbor (ANN) Retrieval', desc: 'Berechnung der Cosinus-Ähnlichkeit zwischen Suchvektor und Dokumentenbestand in unter 50 ms.' },
        { step: '04', title: 'Konditionierte Prompt-Injektion', desc: 'Synthese der Ingenieurantwort unter strenger Restriktion: "Antworte ausschließlich basierend auf den übergebenen Nachweisdokumenten!".' }
      ],
      keyCharacteristics: [
        'Deterministische Zitationsgenauigkeit mit Angabe von Normabsatz, Tabelle und Seitenzahl.',
        'Vollständige Entkopplung von Datenaktualisierung und Modelltraining: Normenupdates erfordern kein Nachtraining.',
        'Verhinderung von Halluzinationen bei exakter Konfiguration des Abrufschwellenwerts (Cosine-Threshold ≥ 0,82).',
        'Granulare Zugriffsbeschränkungen (Role-Based Access Control) für vertrauliche Projektdokumente.'
      ],
      examples: [
        {
          title: 'Deterministische Normenabfrage nach DIN EN 1992-1-1 (Eurocode 2 inkl. NA Deutschland)',
          category: 'Tragwerksplanung & Dauerhaftigkeitsnachweise',
          scenario: 'Festlegung des Mindestbetondeckungsmaßes für eine Parkhausstütze unter chloridinduzierter Korrosion.',
          input: 'Ingenieuranfrage: "Mindestbetondeckung c_min,dur und Vorhaltemaß Δc_dev für Expositionsklasse XD3 bei 100 Jahren Entwurfslebensdauer nach deutschem Nationalen Anhang?"',
          process: 'Vektorsuche ruft Tabelle 4.4N und Absatz 4.4.1.2 des Nationalen Anhangs zu DIN EN 1992-1-1:2011-01 ab.',
          output: 'Präzise Bemessungswerte: c_min,dur = 40 mm, Δc_dev = 10 mm -> c_nom = 50 mm unter Nennung von Tabelle NA.4.4.',
          benefit: 'Höhere Rechtssicherheit; Ausschluss schwerwiegender Planungsfehler bei Korrosionsschutzmaßnahmen.',
          normRef: 'DIN EN 1992-1-1:2011-01 Tab. 4.4N (NA Deutschland)'
        },
        {
          title: 'Semantische Volltextindizierung historischer Bauwerks- & Instandsetzungsakten',
          category: 'Bestandssanierung & Erhaltungsmanagement',
          scenario: 'Ursachenermittlung und Materialrecherche bei wiederkehrenden Feuchteschäden in einer Tiefgarage.',
          input: 'Abfrage: "Welches Injektionsharzsystem und welcher Packerabstand wurden bei der Rissverpressung im Bauabschnitt 2 (Jahr 2017) eingesetzt?"',
          process: 'RAG durchsucht 40.000 Seiten gescannter Bautagesberichte, Lieferscheine und ZfP-Prüfprotokolle.',
          output: 'Exakter Beleg: "2K-Polyurethanharz MC-Injekt 2300 NV gemäß DIN EN 1504-5, Packerabstand 15 cm im 45°-Winkel, dokumentiert im Abnahmeprotokoll vom 12.06.2017."',
          benefit: 'Erhaltung von firmenspezifischem Erfahrungswissen; Vermeidung chemischer Materialunverträglichkeiten bei Nachinjektionen.',
          normRef: 'DIN EN 1504-5 (Instandsetzung von Betonbauwerken - Injektion von Rissen)'
        },
        {
          title: 'Vertragliche Nachtragsprüfung nach VOB/B & Leistungsbeschreibungsabgleich',
          category: 'Projektsteuerung & Bauvertragsrecht',
          scenario: 'Prüfung eines Nachtrags über 48.000 € für behaupteten bodenmechanischen Mehraufwand bei Rammkernbohrungen.',
          input: 'Nachtragsbegründung des Auftragnehmers im Abgleich mit Hauptbauvertrag, Baubeschreibung und Baugrundgutachten.',
          process: 'RAG führt einen semantischen Abgleich mit den Vertragsklauseln durch und identifiziert explizite Vergütungsregelungen.',
          output: 'Nachweisdokumentation: "Bodenklasse 5 war gemäß Pos. 01.02.0018 der Leistungsbeschreibung ausdrücklich mit dem Einheitspreis abgegolten; die Forderung widerspricht VOB/B § 2 Abs. 1."',
          benefit: 'Rechtlich belastbare Zurückweisung unberechtigter Nachträge; erhebliche Entlastung der Bauleitung.',
          normRef: 'VOB/B § 2 (Vergütung) & § 4 (Ausführung)'
        }
      ],
      classicVsAi: {
        classicTitle: 'Konventionelle Ingenieurmethodik (Deterministisch / Manuell)',
        classicSteps: [
          'Händisches Wälzen mehrbändiger Normenordner und Rundschreiben des Bundesministeriums.',
          'Gefahr des Übersehens nationaler Fußnoten oder herstellerspezifischer Zulassungseinschränkungen.',
          'Historisches Projektwissen verbleibt unstrukturiert in Papierarchiven.'
        ],
        classicDisadvantage: 'Hohe Recherchezeiten, Wissensverlust bei Personalabgängen, latente Haftungsrisiken.',
        aiTitle: 'RAG-gestützter Workflow',
        aiSteps: [
          'Semantische Suche über Millionen Normenseiten und Bauakten in unter 50 Millisekunden.',
          'Direkte Zitation der Primärquelle mit Verknüpfung zum Originaldokument und Markierung der Fundstelle.',
          'Unternehmenseigenes Wissensmanagement wird zu einer strukturierten, abfragbaren Wissensbasis.'
        ],
        aiAdvantage: 'Weniger Halluzinationen durch Quellenbindung, verifizierbare Zitate, nachvollziehbare Belege (Prüfung durch den Ingenieur bleibt erforderlich).',
        roiSummary: '90 % Zeitersparnis bei Normen- und Aktenrecherchen im Büro.'
      },
      math: {
        formula: '\\text{sim}(\\mathbf{q}, \\mathbf{d}) = \\cos(\\theta) = \\frac{\\mathbf{q} \\cdot \\mathbf{d}}{\\|\\mathbf{q}\\| \\|\\mathbf{d}\\|} = \\frac{\\sum_{i=1}^n q_i d_i}{\\sqrt{\\sum_{i=1}^n q_i^2} \\sqrt{\\sum_{i=1}^n d_i^2}}',
        formulaName: 'Cosinus-Ähnlichkeit im hochdimensionalen Einbettungsraum',
        formulaText: 'Semantischer Bedeutungsabgleich zwischen Fragevektor und Text-Chunk.',
        explanation: 'Die Cosinus-Ähnlichkeit misst den Winkel theta zwischen dem Vektor der Ingenieurfrage q und dem Vektor des Normabsatzes d im Einbettungsraum, unabhängig von der Textlänge.',
        variables: [
          { sym: '\\mathbf{q}', name: 'Query-Embedding', desc: 'Vektor der Suchanfrage des Ingenieurs (z. B. Dimension 1536).' },
          { sym: '\\mathbf{d}', name: 'Document-Chunk-Embedding', desc: 'Vektor des extrahierten Normen- oder Berichtsabsatzes.' },
          { sym: '\\cos(\\theta)', name: 'Cosinus-Wert (-1 bis +1)', desc: '1 bedeutet maximale semantische Übereinstimmung, 0 bedeutet kein Zusammenhang.' }
        ]
      },
      pitfalls: {
        mainRisk: 'Index-Kontamination: Befinden sich zurückgezogene Normenausgaben oder ungültige Baustoffzulassungen im Vektorindex, zitiert das System veraltete Bemessungswerte.',
        engineerDuty: 'Implementierung strikter Revisionsfilter (Status: Gültig, Gültigkeitsdatum) und versionskontrollierter Metadatenstrukturen.',
        standards: 'ISO 19650 (Informationsmanagement mit BIM), DIN EN 1990 ff.'
      }
    },

    vision: {
      title: '6. Computer Vision & Photogrammetrische Sensorik',
      badge: 'Visuelle Merkmalsextraktion',
      analogy: 'Optische Detektions- & Rekonstruktionssysteme',
      summary: 'Rechnergestützte Erfassung, geometrische Vermessung und semantische Interpretation optischer, multispektraler und radiometrischer Bilddaten zur Zustandserfassung von Bauwerken.',
      simpleExpl: 'Computer Vision kombiniert digitale Bildverarbeitung, Photogrammetrie und Convolutional Neural Networks zur automatisierten Schadenserkennung, Maßhaltigkeitskontrolle und Baustellenüberwachung. Aus zweidimensionalen Pixelfeldern werden dreidimensionale, metrisch kalibrierte Geometriedaten generiert.',
      constructionExample: 'Fotodokumentation auf der Baustelle: Erkennung, ob alle Arbeiter Helme und Warnwesten tragen oder ob Schalungen maßhaltig stehen.',
      technicalMechanism: [
        { step: '01', title: 'Radiometrische & Geometrische Kalibrierung', desc: 'Objektivverzerrungskorrektur (Kameramatrix K), Entzerrung und Weißabgleich optischer Sensoren.' },
        { step: '02', title: 'Feature Matching & Epipolargeometrie', desc: 'Structure-from-Motion (SfM) detektiert homologe Punkte (SIFT / ORB) zur Bestimmung der äußeren Orientierung.' },
        { step: '03', title: 'Echtzeit-Objektdetektion (YOLO-Architektur)', desc: 'Einstufige Grid-basierte Regression von Bounding Boxes und Klassenwahrscheinlichkeiten.' },
        { step: '04', title: 'Radiometrische Thermografie-Kopplung', desc: 'Überlagerung von IR- und RGB-Matrizen zur Berechnung bauphysikalischer Oberflächentemperaturen.' }
      ],
      keyCharacteristics: [
        'Objektive, millimetergenaue Dokumentation ohne subjektive Schätzfehler des menschlichen Auges.',
        'Echtzeitverarbeitung bis zu 60 FPS für autonome Sicherheits- und Kranführungssysteme.',
        'Fusionierung multispektraler Datenströme (RGB, Thermografie, LiDAR).',
        'Vollständige Integration in den digitalen Bauwerkszwilling (Digital Twin).'
      ],
      examples: [
        {
          title: 'Photogrammetrische Soll-Ist-Deformationsanalyse und 4D-Baufortschrittsquantifizierung',
          category: 'Bauoberleitung & Toleranzprüfung (LPH 8)',
          scenario: 'Metrische Erfassung des Rohbauzustands und Volumenabgleich von Erdbewegungen auf Großbaustellen.',
          input: 'UAV-Befliegung (500 Luftbilder mit RTK-GNSS-Georeferenzierung) + IFC-Ausführungsmodell.',
          process: 'Dense Matching generiert eine dichte 3D-Punktwolke; Algorithmen berechnen Soll-Ist-Abweichungen und Massendifferenzen zur Abrechnung.',
          output: 'Metrischer Differenzbericht: "Deckendurchbiegung im Feld 3 beträgt 14 mm (L/430); Aushubvolumen Baugrube: 14.250 m³ (98 % Soll)".',
          benefit: 'Rechtlich belastbare Dokumentation für Abschlagsrechnungen nach VOB/B § 16; lückenlose Beweissicherung vor Folgegewerken.',
          normRef: 'DIN 18202 & VOB/B § 16 (Zahlungen)'
        },
        {
          title: 'Optische Überwachung der Arbeitssicherheit & PSA-Konformität in Echtzeit',
          category: 'Sicherheits- und Gesundheitsschutzkoordination (SiGeKo)',
          scenario: 'Prävention von Unfällen in Gefahrenbereichen (z. B. Kran-Schwenkbereiche, ungesicherte Deckenabsturzkanten).',
          input: 'Live-RTSP-Videoströme von Baustellen- und Gerüstkameras.',
          process: 'YOLOv10-Modell lokalisiert Personen in 25 ms und prüft die Präsenz von Schutzhelm, Warnweste und Anseilschutz.',
          output: 'Automatische Schaltung optischer/akustischer Warnsignale bei Betreten von Sperrbereichen ohne PSA; revisionssichere Statistiken.',
          benefit: 'Reduktion meldepflichtiger Arbeitsunfälle; Erfüllung der Kontroll- und Sorgfaltspflichten nach BaustellV.',
          normRef: 'Baustellenverordnung (BaustellV) & DGUV Vorschrift 38 (Bauarbeiten)'
        },
        {
          title: 'Multispektrale & thermografische Erfassung von Hüllflächen-Wärmebrücken',
          category: 'Bauphysik & Energetische Sanierung',
          scenario: 'Identifikation energetischer Schwachstellen und Schimmelpilz-Risikobereiche an Bestandsfassaden.',
          input: 'Kalibrierte radiometrische Infrarot- und RGB-Aufnahmen unter stationären Temperaturrandbedingungen (ΔT ≥ 15 K).',
          process: 'Rechnerische Bestimmung des Temperaturfaktors f_Rsi = (θ_si - θ_e) / (θ_i - θ_e) über pixelweise Thermogramm-Auswertung.',
          output: 'Isothermenkarte mit quantitativer Markierung von Zonen mit f_Rsi < 0,70 (Schimmelpilzkriterium nach DIN 4108-2) und Flächenbilanz.',
          benefit: 'Präzise energetische Schadensursachenanalyse; Vermeidung von Sanierungsfehlinvestitionen.',
          normRef: 'DIN 4108-2 (Mindestwärmeschutz) & DIN EN 13187 (Wärmetechnisches Verhalten von Gebäuden)'
        }
      ],
      classicVsAi: {
        classicTitle: 'Konventionelle Ingenieurmethodik (Deterministisch / Manuell)',
        classicSteps: [
          'Punktuelle Begehungen der Baustelle mit handschriftlichen Notizen und unkalibrierten Smartphone-Fotos.',
          'Keine systematische georeferenzierte Zuordnung der Aufnahmen zu Bauteilachsen im Plan.',
          'Fortschrittsbewertungen basieren auf subjektiven Schätzungen der Bauleitung.'
        ],
        classicDisadvantage: 'Hoher Erfassungsaufwand, lückenhafte Dokumentation, Beweisnotstände bei Abnahme- und Vergütungsstreitigkeiten.',
        aiTitle: 'Vision-gestützter Ablauf',
        aiSteps: [
          'Autonome UAV- oder Helmkamerasysteme erfassen den Bauzustand in Bruchteilen der Zeit millimetergenau.',
          'Computer-Vision-Pipelines verknüpfen jeden Pixel mit dem digitalen 4D-BIM-Bauwerksmodell.',
          'Objektive, automatisierte Toleranzprüfungen und Massenermittlungen auf Knopfdruck.'
        ],
        aiAdvantage: 'Vollständige Transparenz, objektive Beweissicherung, 0 unbemerkte Ausführungsfehler.',
        roiSummary: '4 Stunden Bauleiterzeit pro Woche eingespart, 90 % weniger Abnahmestreitigkeiten.'
      },
      math: {
        formula: '\\text{IoU} = \\frac{\\text{Area}(B_p \\cap B_{gt})}{\\text{Area}(B_p \\cup B_{gt})} \\quad \\text{und} \\quad \\text{mAP} = \\frac{1}{|C|} \\sum_{c \\in C} \\int_0^1 p_c(r) \\, dr',
        formulaName: 'Intersection over Union (IoU) & mean Average Precision (mAP)',
        formulaText: 'Mathematische Gütekriterien für Lokalisierung und Schadenserkennung.',
        explanation: 'IoU quantifiziert den Überlappungsgrad zwischen der von der KI vorhergesagten Schadensbox Bp und der realen Prüfmarkierung Bgt. mAP integriert Genauigkeit und Vollständigkeit über alle Schadensklassen.',
        variables: [
          { sym: 'B_p', name: 'Predicted Bounding Box', desc: 'Von der KI vorgeschlagene Schadens- oder Bauteilbegrenzung.' },
          { sym: 'B_{gt}', name: 'Ground Truth Box', desc: 'Die reale, vom Prüfingenieur verifizierte Schadensposition.' },
          { sym: '\\text{IoU}', name: 'Schnitt-über-Vereinigung', desc: '1,0 bedeutet perfekte Überdeckung, Werte >= 0,7 gelten im Bauwesen als zuverlässig.' },
          { sym: 'p_c(r)', name: 'Precision-Recall-Kurve', desc: 'Genauigkeit in Abhängigkeit von der Vollständigkeit der erkannten Schäden.' }
        ]
      },
      pitfalls: {
        mainRisk: 'Witterungseinflüsse: Starker Schattenwurf, blendendes Sonnenlicht, Regen oder Baustellenstaub können Risse verdecken oder optische Täuschungen erzeugen.',
        engineerDuty: 'Plausibilitätsprüfung der Bildqualität und Vor-Ort-Verifizierung sicherheitsrelevanter Risse vor statischen Entscheidungen.',
        standards: 'DIN 18202 (Toleranzen im Hochbau), BaustellV, DIN 1076'
      }
    },

    agenten: {
      title: '7. KI-Agenten & Werkzeugkopplung (Tool-Use / MCP)',
      badge: 'Autonome Steuerungsarchitekturen',
      analogy: 'Reaktive Multi-Agenten-Systeme & Solver-Kopplung',
      summary: 'Softwareagenten, die über Sprachmodelle als Entscheidungsinstanz verfügen und über standardisierte Protokolle (z. B. MCP) externe Ingenieursoftware (FEM-Solver, AVA, CAD, Datenbanken) autonom ausführen, evaluieren und iterativ optimieren.',
      simpleExpl: 'Im Gegensatz zu statischen Chatbots implementieren KI-Agenten das ReAct-Paradigma (Reasoning + Acting). Sie zerlegen komplexe bautechnische Problemstellungen in sequenzielle Arbeitsschritte, rufen externe APIs auf, interpretieren die numerischen Ergebnisse und führen bei Nichterreichen normativer Grenzwerte eigenständige Parameterkorrekturen durch.',
      constructionExample: 'Ein Agent liest CAD-Dateien aus, berechnet die Betonmengen in Excel, holt aktuelle Preise per API ein und erstellt einen fertigen Ausschreibungstext.',
      technicalMechanism: [
        { step: '01', title: 'Task-Dekomposition & Planung', desc: 'Strukturierung der Ingenieuraufgabe in gerichtete azyklische Graphen (DAGs) von Teilaufgaben.' },
        { step: '02', title: 'Model Context Protocol (MCP) & Tool-Invocation', desc: 'Aufruf deterministischer Berechnungsschnittstellen (z. B. Python, Dlubal RFEM API, GAEB-Parser).' },
        { step: '03', title: 'Evaluation & Feedback-Schleife', desc: 'Mathematischer Abgleich der Softwareergebnisse mit normativen Grenzzuständen (E_d ≤ R_d nach Eurocode).' },
        { step: '04', title: 'Iterative Parameteranpassung', desc: 'Autonome Querschnitts- oder Systemmodifikation bei Grenzwertverletzung bis zur stabilen Konvergenz.' }
      ],
      keyCharacteristics: [
        'Schließt die Lücke zwischen generativer KI und deterministischer Ingenieur-Fachsoftware.',
        'Autonome Ausführung repetitiver Berechnungs- und Nachweisroutinen ohne Medienbrüche.',
        'Persistentes Projektgedächtnis und vollständige Protokollierung des Entscheidungspfades (Audit Trail).',
        'Sicherheitskonzept: Zwingende Human-in-the-Loop-Freigabe für irreversible oder haftungsrelevante Entscheidungen.'
      ],
      examples: [
        {
          title: 'Autonome Bemessung & Querschnittsoptimierung im Grenzzustand der Tragfähigkeit',
          category: 'Tragwerksplanung (LPH 3–4)',
          scenario: 'Optimierung von Walzprofilen eines mehrfeldrigen Stahl-Dachträgers (L = 3 x 8 m) unter Biegung und Stabilität.',
          input: 'Tragwerkstopologie, Einwirkungen nach DIN EN 1991, Stahlgüte S355, Zielvorgabe: minimales Profilgewicht bei Ausnutzung η ≤ 0,90.',
          process: 'Agent startet FEM-Solver via API, stellt bei Profil IPE 300 Biegedrillknicken fest (χ_LT = 0,62 -> η = 1,12), wechselt auf HEA 280, rechnet erneut und verifiziert GZT und GZG (w ≤ L/250).',
          output: 'Prüffähiger statischer Berechnungsnachweis mit vollständiger Nachweisführung nach Eurocode 3 inklusive Materialauszug.',
          benefit: 'Reduktion der Vorbemessungszeit von 2 Stunden auf 45 Sekunden; optimale Materialausnutzung.',
          normRef: 'DIN EN 1993-1-1 (Eurocode 3: Bemessung und Konstruktion von Stahlbauten)'
        },
        {
          title: 'Automatisierte Mängeldokumentation, Fristenüberwachung und Rügeerstellung nach VOB/B',
          category: 'Bauoberleitung & Baurecht (LPH 8)',
          scenario: 'Rechtlich belastbare Rüge fehlerhaft verlegter Bewehrung vor dem Betoniertermin.',
          input: 'Bauleiter-Audionotiz ("Abstandhalter Decke 2. OG Feld B fehlen, Betondeckung unzureichend, Unternehmer Meier") + Fotobeleg.',
          process: 'Agent ordnet Mangel dem Nachunternehmervertrag zu, ermittelt die relevante Normenforderung, berechnet eine angemessene Frist nach VOB/B § 4 Abs. 7 (4 Werktage vor Betonage) und generiert das formale Mahnschreiben.',
          output: 'Vollständiges, rechtlich belastbares Mängelrüge-Dokument mit Planverortung zur 1-Klick-Signatur durch den verantwortlichen Bauleiter.',
          benefit: 'Lückenlose Beweissicherung; Vermeidung von Fristversäumnissen und Erhalt von Gewährleistungsansprüchen.',
          normRef: 'VOB/B § 4 Abs. 7 & BGB § 634'
        },
        {
          title: 'Automatisierte Ökobilanzierung (LCA) und Lebenszyklus-Treibhauspotenzialberechnung',
          category: 'Nachhaltigkeit & Green Building (QNG / DGNB)',
          scenario: 'Erstellung des Treibhauspotenzial-Nachweises (GWP) für ein Bürogebäude im Rahmen der KfW-Förderung.',
          input: 'IFC-Fachmodell mit Mengenermittlung für 4.800 Bauteilobjekte.',
          process: 'Agent fragt die ÖKOBAUDAT-API des Bundesministeriums ab, ordnet EPD-Datensätze (Environmental Product Declarations) zu, bilanziert Module A1–A3, B, C und D und testet alternative Klinkerersatz-Zemente (CEM III/A).',
          output: 'Prüffähiger LCA-Nachweisbericht mit Ausweis von kg CO2-Äq./(m² · a) und Nachweis der QNG-Grenzwerteinhaltung.',
          benefit: 'Reduktion der Zertifizierungsdauer von 3 Wochen auf 10 Minuten; sichere Erlangung zinsgünstiger Förderkredite.',
          normRef: 'DIN EN 15978 (Nachhaltigkeit von Bauwerken) & QNG-Kriterienkatalog'
        }
      ],
      classicVsAi: {
        classicTitle: 'Konventionelle Ingenieurmethodik (Deterministisch / Manuell)',
        classicSteps: [
          'Ingenieur bedient sequenziell heterogene Softwareinseln (CAD, FE-Statik, Excel, AVA).',
          'Zahlenwerte und Schnittgrößen werden händisch von Berechnungs- in Nachweisprogramme übertragen.',
          'Iterative Querschnittsvariationen erfordern wiederholte händische Modellierungszyklen.'
        ],
        classicDisadvantage: 'Medienbrüche zwischen Fachprogrammen, hohe Redundanz, Fehlerquellen bei Datenübertragungen.',
        aiTitle: 'Agenten-Workflow',
        aiSteps: [
          'Der Agent steuert und verknüpft spezialisierte Berechnungssolver über offene Programmierschnittstellen (APIs).',
          'Vollständige Automation iterativer Optimierungsschleifen bis zur Konvergenz der Grenzzustände.',
          'Der Bauingenieur fungiert als leitender Systemarchitekt, definiert Randbedingungen und verifiziert Endresultate.'
        ],
        aiAdvantage: 'Vollständige Automation repetitiver Programmier- und Berechnungsroutinen.',
        roiSummary: 'Faktor 10 schnellere Bemessungs- und Nachweiszyklen.'
      },
      math: {
        formula: '\\tau = (o_0, a_0, r_0, o_1, a_1, r_1, \\dots) \\quad \\text{mit} \\quad a_t = \\arg\\max_a P(a \\mid h_t, \\text{Tool-Feedback})',
        formulaName: 'ReAct-Trajektorie (Reasoning + Acting + Tool Execution)',
        formulaText: 'Zustandsfolge eines KI-Agenten mit iterativer Umwelt-Rückkopplung.',
        explanation: 'In jedem Zeitschritt t beobachtet der Agent den Zustand ot (z. B. FE-Ergebnis), wählt die nächste Werkzeugaktion at (z. B. Profil vergrößern) und verarbeitet die Rückmeldung rt des Berechnungswerkzeugs.',
        variables: [
          { sym: '\\tau', name: 'Agenten-Trajektorie', desc: 'Die vollständige Kette von Denkschritten, Programmaufrufen und Ergebnissen.' },
          { sym: 'o_t', name: 'Observation (Beobachtung)', desc: 'Ergebnis der Software-Ausführung (z. B. maximale Spannung sigma_max = 285 N/mm²).' },
          { sym: 'a_t', name: 'Action (Werkzeugaufruf)', desc: 'Ausgeführter API-Befehl (z. B. "run_fea_simulation" oder "update_section").' },
          { sym: 'h_t', name: 'Historie', desc: 'Der bisherige Projekt- und Berechnungsverlauf im Kontextgedächtnis des Agenten.' }
        ]
      },
      pitfalls: {
        mainRisk: 'Autonome Fehlerausbreitung (Cascading Errors): Ein unbeabsichtigter Parameterfehler in einem vorgeschalteten Werkzeugaufruf kann von nachgelagerten Agenten unbemerkt zu fehlerhaften Tragwerksauslegungen führen.',
        engineerDuty: '"Human-in-the-Loop"-Prinzip: Sicherheitsrelevante Schnittstellen (z. B. Freigabe von Bewehrungsplänen, Genehmigungsstatiken oder vertraglichen Fristsetzungen) erfordern ausnahmslos die persönliche Freigabe durch den verantwortlichen Ingenieur.',
        standards: 'KI-VO (EU) 2024/1689 (Art. 14 Menschliche Aufsicht), VDI-Statusreport KI im Bauwesen, BGB § 634, HOAI'
      }
    }
  };

  const ragDemonstrations = {
    xc4: {
      question: 'Welche Mindestbetondeckung c_min,dur gilt nach DIN EN 1992-1-1 für Expositionsklasse XC4 bei 50 Jahren Nutzungsdauer?',
      llmPur: {
        text: 'Für XC4 wird in der Regel eine Betondeckung von etwa 30 bis 35 mm empfohlen. Es könnte aber je nach nationalem Anhang auch 20 mm sein. Bitte prüfen Sie die DIN 1045.',
        verdict: 'Unsicher & ungenau',
        critique: 'Das Modell schätzt vage aus dem Gedächtnis. Das Vorhaltemaß Δc_dev wird nicht klar von c_min getrennt. Für eine prüffähige Statik unbrauchbar.'
      },
      rag: {
        text: 'Nach DIN EN 1992-1-1:2011 (Eurocode 2), Tabelle 4.4N i. V. m. deutschem Nationalen Anhang (NA) gilt für XC4 bei gewöhnlichem Betonstahl (50 Jahre Nutzungsdauer):\n• Mindestbetondeckung c_min,dur = 25 mm\n• Vorhaltemaß Δc_dev = 10 mm (bzw. 5 mm bei Qualitätsüberwachung)\n• Nennmaß c_nom = c_min + Δc_dev = 35 mm (bzw. 30 mm).',
        source: 'DIN EN 1992-1-1, Abs. 4.4.1.2 & Tab. 4.4N (NA Deutschland)',
        verdict: '100% präzise & normgerecht',
        benefit: 'RAG liefert die exakte Normtabelle als Quellennachweis mit. Null Halluzination!'
      }
    },
    xf4: {
      question: 'Welcher maximale äquivalente Wasserzementwert (w/z)_eq ist für die Expositionsklasse XF4 nach DIN 1045-2 gefordert?',
      llmPur: {
        text: 'Für Taumittelangriff XF4 liegt der w/z-Wert meistens bei rund 0,50. Eventuell muss Zement CEM I verwendet werden.',
        verdict: 'Gefährlich falsch!',
        critique: '0,50 ist viel zu hoch! Ein Bauteil mit w/z = 0,50 würde unter XF4-Taumittelangriff innerhalb weniger Winter abplatzen (Frost-Tausalz-Schaden).'
      },
      rag: {
        text: 'Gemäß DIN 1045-2:2023 / DIN EN 206, Tabelle F.1.2 gilt für die Expositionsklasse XF4 (hohe Wassersättigung mit Taumittel):\n• Maximaler (w/z)_eq = 0,45\n• Mindestdruckfestigkeitsklasse: C30/37\n• Mindestzementgehalt: 320 kg/m³ bei Luftporenbeton (LP) bzw. 340 kg/m³ ohne LP\n• Mindestluftgehalt: ≥ 4,0 % (bei Größtkorn 32 mm) bzw. ≥ 4,5 % (bei 16 mm).',
        source: 'DIN 1045-2:2023, Anhang F, Tabelle F.1.2',
        verdict: 'Technisch einwandfrei',
        benefit: 'Verhindert verheerende Bauschäden durch fehlerhafte Mischungsbemessung.'
      }
    },
    rc_beton: {
      question: 'Darf rezyklierte Gesteinskörnung Typ 1 nach DIN EN 206 / DIN 1045-2 in Spannbeton verwendet werden?',
      llmPur: {
        text: 'Ja, Rezyklate können heutzutage problemlos in allen Betonarten eingesetzt werden, da das Bauministerium Nachhaltigkeit fördert.',
        verdict: 'Normativ unzulässig!',
        critique: 'Grober Fehler: Nach deutschem Regelwerk ist RC-Gesteinskörnung für Spannbeton und Leichtbeton aus Sicherheitsgründen strikt ausgeschlossen!'
      },
      rag: {
        text: 'Nein! Nach DIN 1045-2 (Abschnitt 5.1.3) und der DAfStb-Richtlinie "Beton nach DIN EN 206-1 und DIN 1045-2 mit rezyklierten Gesteinskörnungen" gilt:\n• Rezyklierte Gesteinskörnungen (Typ 1 und Typ 2) dürfen NICHT für Spannbeton verwendet werden.\n• Der Einsatz ist beschränkt auf unbewehrten und schlaff bewehrten Beton bis maximal Festigkeitsklasse C30/37.',
        source: 'DIN 1045-2:2023, Abs. 5.1.3 & DAfStb-RC-Richtlinie',
        verdict: 'Rechtlich belastbar belegt',
        benefit: 'Schützt das Ingenieurbüro vor schweren Haftungs- und Gewährleistungsansprüchen.'
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Modulheader & Einleitung */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-shiraz text-white rounded-xl shadow-sm">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-main">
              Künstliche Intelligenz (KI) im Bauwesen: Überblick
            </h2>
            <p className="text-xs text-text-main/60">
              Historie, aktueller Praxisstand, Zukunftsperspektiven und wesentliche Kerntechnologien verständlich erklärt
            </p>
          </div>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p>
            Künstliche Intelligenz ist im Bauwesen kein futuristisches Science-Fiction-Thema mehr, sondern hat sich zu einem konkreten Werkzeugkasten entwickelt. Ob <strong>CO₂-arme Betonmischungsoptimierung</strong>, <strong>KI-gestützte Risserkennung an Brücken</strong> oder <strong>automatisierte Normenrecherchen mit RAG</strong>: Dieses Modul vermittelt Ihnen das fundamentale Verständnis, wie diese Technologien funktionieren, wo die Chancen liegen – und wo Ingenieure nach wie vor unverzichtbar bleiben.
          </p>
        </div>

        {/* Tab-Navigation */}
        <div className="flex flex-wrap gap-2 pt-5 border-t border-home-grau/20 mt-5">
          <button
            onClick={() => setActiveTab('kernbegriffe')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'kernbegriffe'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Boxes size={16} /> 1. Kernbegriffe verständlich (ML, RAG & Co.)
          </button>
          <button
            onClick={() => setActiveTab('historie')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'historie'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Clock size={16} /> 2. Historie (1960 bis heute)
          </button>
          <button
            onClick={() => setActiveTab('stand')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'stand'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <TrendingUp size={16} /> 3. Stand heute (Praxis & Grenzen)
          </button>
          <button
            onClick={() => setActiveTab('ausblick')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'ausblick'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Compass size={16} /> 4. Ausblick (Nächste 5–10 Jahre)
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'pipeline'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Database size={16} /> 5. Enterprise-RAG: Vom Dokument zum Tool
          </button>
          <button
            onClick={() => setActiveTab('vergleich')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'vergleich'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Workflow size={16} /> 6. Interaktiver RAG-Simulator
          </button>
        </div>
      </div>

      {/* 2. TAB CONTENT: KERNBEGRIFFE */}
      {activeTab === 'kernbegriffe' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Das Zwiebelschalenmodell */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                <Layers className="text-shiraz" size={20} />
                Das Zwiebelschalen-Modell: Wie die Begriffe zusammenhängen
              </h3>
              <span className="text-[11px] font-mono bg-shiraz/10 text-shiraz px-2.5 py-1 rounded-full font-bold">
                Keine Synonyme!
              </span>
            </div>

            <p className="text-xs text-text-main/80 leading-relaxed">
              Oft werden die Begriffe <em>Künstliche Intelligenz</em>, <em>Machine Learning</em> und <em>Neuronale Netze</em> durcheinandergeworfen. In Wahrheit verhalten sie sich wie die Schalen einer Zwiebel – von der umfassenden Idee bis zum konkreten Spezialwerkzeug:
            </p>

            {/* Grafisches Schichten-Schema */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider">Ebene 1 (Äußerste Schale)</span>
                <h4 className="font-bold text-sm text-blue-900">Künstliche Intelligenz (KI)</h4>
                <p className="text-xs text-blue-800/80 leading-snug">
                  Das Gesamtfeld: Jede Maschine, die menschenähnliche Problemlösungen zeigt (auch einfache Wenn-Dann-Logiken).
                </p>
              </div>

              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider">Ebene 2 (Teilmenge)</span>
                <h4 className="font-bold text-sm text-indigo-900">Machine Learning (ML)</h4>
                <p className="text-xs text-indigo-800/80 leading-snug">
                  Lernen aus Daten: Algorithmen finden mathematische Muster in Beispielen, ohne fest verdrahtete Regeln.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider">Ebene 3 (Spezialisierung)</span>
                <h4 className="font-bold text-sm text-purple-900">Deep Learning</h4>
                <p className="text-xs text-purple-800/80 leading-snug">
                  Mehrschichtige neuronale Netze für Rohdaten wie Fotos, Punktwolken oder Schwingungsspektren.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-shiraz/30 bg-shiraz/5 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-shiraz tracking-wider">Ebene 4 (Moderner Kern)</span>
                <h4 className="font-bold text-sm text-slate-900">LLMs & Generative KI</h4>
                <p className="text-xs text-slate-700 leading-snug">
                  Transformer-Modelle, die Sprache, Normen, Tabellen oder Programmcode verstehen und neu generieren.
                </p>
              </div>
            </div>
          </div>

          {/* Interaktiver Detail-Erklärer */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2">
              <Lightbulb className="text-shiraz" size={20} />
              Die 7 Kernbegriffe der Bauinformatik & KI-Technologie im Detail
            </h3>

            {/* Term Selector Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'ki', label: '1. Künstliche Intelligenz (KI-Systeme)' },
                { id: 'ml', label: '2. Maschinelles Lernen (ML)' },
                { id: 'dl', label: '3. Deep Learning (ANN / CNN)' },
                { id: 'llm', label: '4. Large Language Models (LLM)' },
                { id: 'rag', label: '5. Retrieval-Augmented Generation (RAG)' },
                { id: 'vision', label: '6. Computer Vision & Sensorik' },
                { id: 'agenten', label: '7. KI-Agenten & Tool-Use' }
              ].map((term) => (
                <button
                  key={term.id}
                  onClick={() => setSelectedTerm(term.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    selectedTerm === term.id
                      ? 'bg-shiraz text-white border-shiraz shadow-sm'
                      : 'bg-off-white text-text-main/80 border-home-grau/30 hover:border-home-grau hover:text-text-main'
                  }`}
                >
                  {term.label}
                </button>
              ))}
            </div>

            {/* Selected Term Detail Card */}
            {termsData[selectedTerm] && (
              <div className="bg-white rounded-2xl border border-home-grau/30 shadow-sm overflow-hidden space-y-0 animate-in fade-in duration-200">
                {/* Header Banner */}
                <div className="p-5 bg-off-white border-b border-home-grau/20 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-full">
                        {termsData[selectedTerm].badge}
                      </span>
                      <span className="text-xs bg-white px-2.5 py-1 rounded-md border border-home-grau/20 text-text-main/70 flex items-center gap-1 font-mono">
                        <Compass size={13} className="text-shiraz" />
                        Klassifikation: <strong>{termsData[selectedTerm].analogy}</strong>
                      </span>
                    </div>
                    <span className="text-[11px] text-text-main/60 bg-white px-2 py-0.5 rounded border border-home-grau/20">
                      Fachbegriff {['ki', 'ml', 'dl', 'llm', 'rag', 'vision', 'agenten'].indexOf(selectedTerm) + 1} von 7
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-text-main">
                      {termsData[selectedTerm].title}
                    </h4>
                    <p className="text-xs text-text-main/80 mt-1 leading-relaxed">
                      {termsData[selectedTerm].summary}
                    </p>
                  </div>

                  {/* Sub-Tab Navigation inside Term Card */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-home-grau/15">
                    {[
                      { id: 'beispiele', label: '🏗️ 3 Ingenieur-Praxisanwendungen', count: 'EC / Normen' },
                      { id: 'funktionsweise', label: '📘 Systemarchitektur & Methodik', count: 'Algorithmen' },
                      { id: 'vergleich', label: '⚖️ Konventionell vs. KI-Workflow', count: 'Prozessanalyse' },
                      { id: 'formel', label: '📐 Mathematische Modellierung', count: 'LaTeX' },
                      { id: 'risiken', label: '⚠️ Normative Konformität & Haftung', count: 'Risikoklasse' }
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setDetailSubTab(st.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                          detailSubTab === st.id
                            ? 'bg-shiraz text-white border-shiraz shadow-sm'
                            : 'bg-white text-text-main/80 border-home-grau/30 hover:border-home-grau hover:text-text-main hover:bg-slate-50'
                        }`}
                      >
                        <span>{st.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                          detailSubTab === st.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {st.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-Tab 1: 3 Bau-Praxisbeispiele im Detail */}
                {detailSubTab === 'beispiele' && (
                  <div className="p-5 space-y-5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Target className="text-shiraz" size={18} />
                        <h5 className="font-bold text-sm text-text-main">
                          Ingenieurtechnische Anwendungsfälle aus Tragwerksplanung, Baustoffkunde & Bauüberwachung
                        </h5>
                      </div>
                      <span className="text-[11px] text-text-main/60">
                        Nachweise nach DIN EN, Eurocodes & VOB
                      </span>
                    </div>

                    {/* Example Selector Tabs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {termsData[selectedTerm].examples.map((ex, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedExampleIndex(idx)}
                          className={`p-3 rounded-xl text-left transition-all border cursor-pointer ${
                            selectedExampleIndex === idx
                              ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold shadow-sm'
                              : 'bg-off-white/80 border-home-grau/25 text-text-main/80 hover:bg-white hover:border-home-grau'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider mb-1">
                            <span className="font-black">Anwendung {idx + 1}</span>
                            <span className="bg-white px-1.5 py-0.5 rounded border border-home-grau/20 text-text-main/60">
                              {ex.category.split('/')[0]}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-text-main line-clamp-1">
                            {ex.title}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Active Example Deep-Dive Card */}
                    {termsData[selectedTerm].examples[selectedExampleIndex] && (
                      <div className="p-5 rounded-xl border border-shiraz/20 bg-gradient-to-br from-white to-shiraz/5 space-y-4 shadow-sm animate-in fade-in duration-150">
                        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-home-grau/15 pb-3">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-shiraz bg-shiraz/10 px-2 py-0.5 rounded">
                              {termsData[selectedTerm].examples[selectedExampleIndex].category}
                            </span>
                            <h4 className="text-base font-bold text-text-main mt-1 flex items-center gap-2">
                              <span>Anwendungsfall {formatDeWert(selectedExampleIndex + 1)}:</span>
                              <span>{termsData[selectedTerm].examples[selectedExampleIndex].title}</span>
                            </h4>
                          </div>
                          <div className="text-xs bg-white px-3 py-1.5 rounded-lg border border-home-grau/25 text-slate-700 font-mono">
                            <strong>Normativer Bezug:</strong> {termsData[selectedTerm].examples[selectedExampleIndex].normRef}
                          </div>
                        </div>

                        <div className="text-xs text-text-main/80 bg-white/80 p-3 rounded-lg border border-home-grau/20">
                          <strong>Problemstellung & Normative Randbedingungen:</strong> {termsData[selectedTerm].examples[selectedExampleIndex].scenario}
                        </div>

                        {/* 4 Pillars: Input -> Process -> Output -> Benefit */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          {/* 1. Input */}
                          <div className="p-3.5 bg-white rounded-xl border border-blue-200/80 space-y-1.5 shadow-2xs">
                            <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                              <FileText size={15} className="text-blue-600" />
                              <span>Eingangsgrößen & Datenbasis (Input):</span>
                            </div>
                            <p className="text-text-main/80 leading-relaxed">
                              {termsData[selectedTerm].examples[selectedExampleIndex].input}
                            </p>
                          </div>

                          {/* 2. Process */}
                          <div className="p-3.5 bg-white rounded-xl border border-purple-200/80 space-y-1.5 shadow-2xs">
                            <div className="flex items-center gap-1.5 text-purple-900 font-bold">
                              <Cpu size={15} className="text-purple-600" />
                              <span>Algorithmische Prozessierung & Inferenz (Process):</span>
                            </div>
                            <p className="text-text-main/80 leading-relaxed">
                              {termsData[selectedTerm].examples[selectedExampleIndex].process}
                            </p>
                          </div>

                          {/* 3. Output */}
                          <div className="p-3.5 bg-white rounded-xl border border-emerald-200/80 space-y-1.5 shadow-2xs">
                            <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                              <CheckCircle2 size={15} className="text-emerald-600" />
                              <span>Prüffähiges Rechenergebnis & Artefakt (Output):</span>
                            </div>
                            <p className="text-text-main/80 leading-relaxed">
                              {termsData[selectedTerm].examples[selectedExampleIndex].output}
                            </p>
                          </div>

                          {/* 4. Benefit */}
                          <div className="p-3.5 bg-white rounded-xl border border-amber-200/80 space-y-1.5 shadow-2xs">
                            <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                              <Zap size={15} className="text-amber-600" />
                              <span>Ingenieurtechnische Relevanz & Wirtschaftlichkeit:</span>
                            </div>
                            <p className="text-text-main/80 leading-relaxed font-semibold text-slate-800">
                              {termsData[selectedTerm].examples[selectedExampleIndex].benefit}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Sub-Tab 2: Funktionsweise & Kern */}
                {detailSubTab === 'funktionsweise' && (
                  <div className="p-5 space-y-5 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Technical Definition Box */}
                      <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                        <h5 className="font-bold text-xs uppercase tracking-wider text-shiraz flex items-center gap-1.5">
                          <HelpCircle size={15} />
                          Wissenschaftliche Definition & Funktionsprinzip:
                        </h5>
                        <p className="text-xs text-text-main/80 leading-relaxed">
                          {termsData[selectedTerm].simpleExpl}
                        </p>
                      </div>

                      {/* Key Characteristics */}
                      <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                        <h5 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
                          <Check size={15} className="text-shiraz" />
                          Ingenieurwissenschaftliche Schlüsselmerkmale:
                        </h5>
                        <ul className="text-xs text-text-main/80 space-y-1.5 list-none">
                          {termsData[selectedTerm].keyCharacteristics.map((kc, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                              <span>{kc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Step-by-Step Technical Mechanism */}
                    <div className="space-y-3">
                      <h5 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
                        <Workflow size={15} className="text-shiraz" />
                        Prozessarchitektur & algorithmischer Signalfluss:
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        {termsData[selectedTerm].technicalMechanism.map((mech, idx) => (
                          <div key={idx} className="p-3.5 bg-white rounded-xl border border-home-grau/25 space-y-1.5 shadow-2xs">
                            <span className="text-[10px] font-mono font-black text-shiraz bg-shiraz/10 px-2 py-0.5 rounded">
                              Phase {mech.step}
                            </span>
                            <h6 className="font-bold text-text-main text-xs">{mech.title}</h6>
                            <p className="text-text-main/70 text-[11px] leading-relaxed">
                              {mech.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-Tab 3: Klassischer Workflow vs. KI */}
                {detailSubTab === 'vergleich' && (
                  <div className="p-5 space-y-5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h5 className="font-bold text-sm text-text-main flex items-center gap-2">
                        <Scale className="text-shiraz" size={18} />
                        Komparative Prozessanalyse: Konventionelle Ingenieurmethodik vs. KI-gestützter Workflow
                      </h5>
                      <span className="text-xs font-bold text-shiraz bg-shiraz/10 px-2.5 py-1 rounded-full font-mono">
                        {termsData[selectedTerm].classicVsAi.roiSummary}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Classical Side */}
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <h6 className="font-bold text-slate-800 flex items-center gap-1.5">
                            <Clock size={16} className="text-slate-500" />
                            {termsData[selectedTerm].classicVsAi.classicTitle}
                          </h6>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                            Konventionelle Methodik
                          </span>
                        </div>
                        <ol className="space-y-2 text-slate-700 list-decimal list-inside leading-relaxed">
                          {termsData[selectedTerm].classicVsAi.classicSteps.map((step, idx) => (
                            <li key={idx} className="pl-1">
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                        <div className="p-2.5 bg-red-50 text-red-900 rounded-lg border border-red-200 text-[11px] flex items-start gap-1.5">
                          <AlertTriangle size={14} className="text-red-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Systematische Schwachstelle:</strong> {termsData[selectedTerm].classicVsAi.classicDisadvantage}
                          </div>
                        </div>
                      </div>

                      {/* AI-Powered Side */}
                      <div className="p-4 bg-gradient-to-br from-shiraz/5 to-white rounded-xl border border-shiraz/30 space-y-3">
                        <div className="flex items-center justify-between border-b border-shiraz/20 pb-2">
                          <h6 className="font-bold text-shiraz flex items-center gap-1.5">
                            <Sparkles size={16} className="text-shiraz" />
                            {termsData[selectedTerm].classicVsAi.aiTitle}
                          </h6>
                          <span className="text-[10px] font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded">
                            KI-gestützte Methodik
                          </span>
                        </div>
                        <ol className="space-y-2 text-text-main/90 list-decimal list-inside leading-relaxed">
                          {termsData[selectedTerm].classicVsAi.aiSteps.map((step, idx) => (
                            <li key={idx} className="pl-1 font-medium">
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                        <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200 text-[11px] flex items-start gap-1.5">
                          <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Ingenieurvorteil:</strong> {termsData[selectedTerm].classicVsAi.aiAdvantage}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-Tab 4: Mathematik & Formel */}
                {detailSubTab === 'formel' && (
                  <div className="p-5 space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h5 className="font-bold text-sm text-text-main flex items-center gap-2">
                        <Calculator className="text-shiraz" size={18} />
                        Mathematisch-physikalische Modellierung & Zielfunktion
                      </h5>
                      <span className="text-xs font-mono text-text-main/70 bg-off-white px-2.5 py-1 rounded border border-home-grau/25">
                        {termsData[selectedTerm].math.formulaName}
                      </span>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
                      <div className="text-xs text-text-main/70 font-semibold">
                        {termsData[selectedTerm].math.formulaText}
                      </div>
                      <div className="overflow-x-auto py-2">
                        <BlockMath math={termsData[selectedTerm].math.formula} />
                      </div>
                      <p className="text-xs text-text-main/80 max-w-2xl mx-auto leading-relaxed text-left bg-white p-3 rounded-lg border border-slate-200">
                        <strong>Mathematische Erläuterung:</strong> {termsData[selectedTerm].math.explanation}
                      </p>
                    </div>

                    {/* Variables Table */}
                    <div className="space-y-2">
                      <h6 className="font-bold text-xs uppercase tracking-wider text-text-main">
                        Nomenklatur, physikalische Einheiten & Parameterbedeutung:
                      </h6>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {termsData[selectedTerm].math.variables.map((v, idx) => (
                          <div key={idx} className="p-3 bg-white rounded-xl border border-home-grau/25 flex items-start gap-3">
                            <div className="px-2 py-1 bg-slate-100 rounded text-slate-800 font-mono text-xs font-bold shrink-0">
                              <InlineMath math={v.sym} />
                            </div>
                            <div className="space-y-0.5">
                              <div className="font-bold text-text-main text-xs">{v.name}</div>
                              <div className="text-[11px] text-text-main/70 leading-snug">{v.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-Tab 5: Risiken, Grenzen & Normen */}
                {detailSubTab === 'risiken' && (
                  <div className="p-5 space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="text-shiraz" size={18} />
                      <h5 className="font-bold text-sm text-text-main">
                        Normative Konformität, Fehlerschranken & Haftungsrechtliche Einordnung
                      </h5>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      {/* Main Risk */}
                      <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
                        <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                          <AlertTriangle size={16} className="text-amber-600" />
                          <span>Kritische Fehlermodi & Systemgrenzen:</span>
                        </div>
                        <p className="text-amber-950/80 leading-relaxed text-[11px]">
                          {termsData[selectedTerm].pitfalls.mainRisk}
                        </p>
                      </div>

                      {/* Engineer Duty */}
                      <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 space-y-2">
                        <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                          <ShieldAlert size={16} className="text-blue-600" />
                          <span>Sorgfalts- & Prüfpflichten des Ingenieurs (BGB / HOAI / BauO):</span>
                        </div>
                        <p className="text-blue-950/80 leading-relaxed text-[11px]">
                          {termsData[selectedTerm].pitfalls.engineerDuty}
                        </p>
                      </div>

                      {/* Standards & Law */}
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                          <FileCheck size={16} className="text-slate-600" />
                          <span>Normativer & gesetzlicher Bezugsrahmen:</span>
                        </div>
                        <p className="text-slate-800 leading-relaxed text-[11px] font-mono">
                          {termsData[selectedTerm].pitfalls.standards}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. TAB CONTENT: HISTORIE */}
      {activeTab === 'historie' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6 animate-in fade-in duration-300">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2">
              <Clock className="text-shiraz" size={20} />
              Die Evolution der Bau-Informatik: Von Lochkarten zu KI-Agenten
            </h3>
            <p className="text-xs text-text-main/70">
              Der Weg der Bauingenieure zur künstlichen Intelligenz in fünf historischen Phasen:
            </p>
          </div>

          <div className="relative border-l-2 border-shiraz/30 ml-3 md:ml-4 space-y-8 pl-5 md:pl-7 pt-2">
            {/* Phase 1 */}
            <div className="relative space-y-1.5">
              <div className="absolute -left-[27px] md:-left-[35px] top-0 w-5 h-5 rounded-full bg-white border-4 border-shiraz shadow-sm" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded">1960er – 1980er</span>
                <h4 className="font-bold text-sm text-text-main">Die Anfänge: Statische Rechenprogramme & Expertensysteme</h4>
              </div>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Einführung von Großrechnern und ersten Finite-Elemente-Programmen (FEM). Ingenieure bauten <strong>regelbasierte Expertensysteme</strong>: Gigantische Sammlungen von Wenn-Dann-Regeln (z.B. "WENN Durchbiegung &gt; l/500 DANN vergrößere Trägerhöhe"). Diese Systeme konnten nicht lernen und brachen bei unvorhergesehenen Fällen zusammen.
              </p>
              <div className="text-[11px] text-text-main/60 bg-off-white p-2 rounded-lg border border-home-grau/20">
                <strong>Meilenstein:</strong> Erste CAD-Systeme ersetzen das Reißbrett; DIN-Vorgaben werden in starre Programmabläufe gegossen.
              </div>
            </div>

            {/* Phase 2 */}
            <div className="relative space-y-1.5">
              <div className="absolute -left-[27px] md:-left-[35px] top-0 w-5 h-5 rounded-full bg-white border-4 border-slate-400 shadow-sm" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">1990er – 2000er</span>
                <h4 className="font-bold text-sm text-text-main">Erste Neuronale Netze & Genetische Algorithmen</h4>
              </div>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Erste akademische Versuche mit künstlichen neuronalen Netzen an Universitäten: Vorhersage der 28-Tage-Betondruckfestigkeit aus Mischungsdaten. <strong>Genetische Algorithmen</strong> wurden populär, um Fachwerke auf minimales Stahlgewicht bei maximaler Steifigkeit zu optimieren.
              </p>
              <div className="text-[11px] text-text-main/60 bg-off-white p-2 rounded-lg border border-home-grau/20">
                <strong>Grenze damals:</strong> Geringe Rechenleistung und fehlende digitale Datensätze beschränkten KI auf Forschungslabore.
              </div>
            </div>

            {/* Phase 3 */}
            <div className="relative space-y-1.5">
              <div className="absolute -left-[27px] md:-left-[35px] top-0 w-5 h-5 rounded-full bg-white border-4 border-slate-400 shadow-sm" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">2010 – 2020</span>
                <h4 className="font-bold text-sm text-text-main">BIM-Reife, Drohnen & Computer Vision</h4>
              </div>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Der weltweite Durchbruch von <strong>Deep Learning</strong> (angetrieben durch Grafikkarten / GPUs): Drohnen befliegen Brückenbauwerke und Algorithmen (Convolutional Neural Networks) erkennen Risse, Abplatzungen und Rostfahnen vollautomatisch. Building Information Modeling (BIM) liefert erstmals strukturierte 3D-Daten.
              </p>
              <div className="text-[11px] text-text-main/60 bg-off-white p-2 rounded-lg border border-home-grau/20">
                <strong>Meilenstein:</strong> Automatisierte Baufortschrittskontrolle durch Abgleich von 3D-Laserscans mit dem BIM-Soll-Modell.
              </div>
            </div>

            {/* Phase 4 */}
            <div className="relative space-y-1.5">
              <div className="absolute -left-[27px] md:-left-[35px] top-0 w-5 h-5 rounded-full bg-white border-4 border-shiraz shadow-sm" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded">2022 – 2024</span>
                <h4 className="font-bold text-sm text-text-main">Die Generative-KI-Revolution (LLMs & RAG)</h4>
              </div>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Mit ChatGPT, Claude und Gemini erreicht KI die Büro- und Planungsebene. Ingenieure nutzen KI zur Analyse hunderter Seiten Gutachten, zum Schreiben von Python-Auswerteskripten und zur Prüfung von Ausschreibungstexten nach VOB. <strong>RAG-Systeme</strong> lösen das Problem der Halluzination bei Normen.
              </p>
              <div className="text-[11px] text-text-main/60 bg-off-white p-2 rounded-lg border border-home-grau/20">
                <strong>Paradigmenwechsel:</strong> Softwareentwicklung wird durch "Vibe Coding" und KI-Assistenten demokratisiert.
              </div>
            </div>

            {/* Phase 5 */}
            <div className="relative space-y-1.5">
              <div className="absolute -left-[27px] md:-left-[35px] top-0 w-5 h-5 rounded-full bg-emerald-500 border-4 border-emerald-100 shadow-sm" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">Ab 2025</span>
                <h4 className="font-bold text-sm text-text-main">Autonome Workflows, PINNs & Agenten-Schwärme</h4>
              </div>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Der Übergang von reinen Chat-Bots zu <strong>autonomen Agenten</strong>: Systeme, die mit Statik-APIs interagieren, physik-informierte neuronale Netze (PINNs), die FEM-Berechnungen in Echtzeit beschleunigen, und geschlossene Regelkreise im 3D-Betondruck.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT: STAND HEUTE */}
      {activeTab === 'stand' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* 4 Praxisfelder */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2">
              <TrendingUp className="text-shiraz" size={20} />
              Wo KI heute in der Baupraxis tatsächlich Mehrwert stiftet
            </h3>
            <p className="text-xs text-text-main/70">
              Vier etablierte Einsatzbereiche, die bereits heute in modernen Ingenieurbüros und auf Baustellen genutzt werden:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-shiraz/10 text-shiraz rounded-lg font-bold text-xs">01</span>
                  <h4 className="font-bold text-sm text-text-main">Material- & Rezepturoptimierung</h4>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Entwicklung klinkerreduzierter Zemente (CEM II/C, CEM VI) und RC-Betone. Machine-Learning-Modelle sagen Festigkeitsentwicklung, Hydratationswärme und Schwinden anhand von Gesteins- und Zusatzmittelkombinationen präzise vorher – und sparen hunderte zeitaufwendige Laborversuche.
                </p>
                <div className="text-[11px] text-slate-500 font-mono">Nutzen: Schnellere Zulassungen, bis zu 40% CO₂-Einsparung</div>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-shiraz/10 text-shiraz rounded-lg font-bold text-xs">02</span>
                  <h4 className="font-bold text-sm text-text-main">Visuelle Bauwerksdiagnose & Drohnen</h4>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Automatisierte Schadenserkennung nach DIN 1076 oder VDI 6200. Hochauflösende Kamerabilder von Brückenunterbauten oder Kühltürmen werden per Convolutional Neural Networks (CNNs) auf Risse, Ausblühungen und Betonabplatzungen gescannt und ins Schadenskataster eingepflegt.
                </p>
                <div className="text-[11px] text-slate-500 font-mono">Nutzen: 80% Zeitersparnis bei der Vor-Ort-Risskartierung</div>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-shiraz/10 text-shiraz rounded-lg font-bold text-xs">03</span>
                  <h4 className="font-bold text-sm text-text-main">Dokumenten- & Ausschreibungsprüfung</h4>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  RAG-gestützte LLMs prüfen Leistungsverzeichnisse (LV), Baugrundgutachten und Verträge nach VOB/B. Widersprüche zwischen Leistungsbeschreibung und statischen Vorbemerkungen werden in Minuten aufgespürt, bevor teure Nachträge auf der Baustelle entstehen.
                </p>
                <div className="text-[11px] text-slate-500 font-mono">Nutzen: Nachtragsrisiken drastisch reduzieren</div>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-shiraz/10 text-shiraz rounded-lg font-bold text-xs">04</span>
                  <h4 className="font-bold text-sm text-text-main">Predictive Maintenance & SHM-Sensorik</h4>
                </div>
                <p className="text-xs text-text-main/80 leading-relaxed">
                  Strukturierte Schwingungsanalyse an bestehenden Tragwerken. Algorithmen lernen das "gesunde" Schwingungsverhalten einer Brücke unter Temperatur- und Verkehrslast. Weicht die Eigenfrequenz plötzlich ab, schlägt die KI Alarm, bevor ein Riss mit bloßem Auge sichtbar ist.
                </p>
                <div className="text-[11px] text-slate-500 font-mono">Nutzen: Frühwarnsystem zur Einsturzprävention</div>
              </div>
            </div>
          </div>

          {/* Ehrliche Matrix: Was funktioniert vs. Was sind die Grenzen */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2">
              <ShieldAlert className="text-amber-600" size={20} />
              Reifegrad-Check: Was funktioniert verlässlich – und was nicht?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2.5">
                <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-700" />
                  Bereits praxistauglich & verlässlich:
                </h4>
                <ul className="space-y-1.5 text-emerald-800 list-disc list-inside leading-snug">
                  <li><strong>Texterfassung & Strukturierung:</strong> Zusammenfassung von Protokollen, GAEB-Dateien, Gutachten.</li>
                  <li><strong>Code & Automatisierung:</strong> Erstellung von Python-Skripten für Plotter, Excel-Makros, Statik-Schnittstellen.</li>
                  <li><strong>Bilderkennung:</strong> Auffinden von Rissen, Abplatzungen und geometrischen Abweichungen in Punktwolken.</li>
                  <li><strong>Normenrecherche mit RAG:</strong> Auffinden exakter Paragraphen in kuratierten Normensammlungen.</li>
                  <li><strong>Vorentwurfsvarianten:</strong> Generieren vieler Gebäudegeometrien zur Beschattungs- und Windoptimierung.</li>
                </ul>
              </div>

              <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200 space-y-2.5">
                <h4 className="font-bold text-rose-900 flex items-center gap-1.5">
                  <AlertTriangle size={16} className="text-rose-700" />
                  Aktuelle Grenzen & No-Gos:
                </h4>
                <ul className="space-y-1.5 text-rose-800 list-disc list-inside leading-snug">
                  <li><strong>Keine ungeprüfte Statik:</strong> Eine KI haftet nicht nach BGB/HOAI. Jede statische Berechnung muss von einem bauvorlageberechtigten Ingenieur gegengezeichnet werden.</li>
                  <li><strong>Blackbox-Problem:</strong> Neuronale Netze können meist nicht begründen, <em>warum</em> sie eine Festigkeit vorhersagen (mangelnde Nachvollziehbarkeit).</li>
                  <li><strong>Halluzinationen bei Zahlen:</strong> Reines LLM ohne RAG erfindet bei Spezialnormen mitunter fiktive Beiwerte (<InlineMath math="\gamma_c" />, <InlineMath math="\alpha_{cc}" />).</li>
                  <li><strong>Datenschutz & Betriebsgeheimnis:</strong> Keine vertraulichen Pläne in öffentliche Cloud-Chats hochladen (Lösung: Lokale LLMs oder Enterprise-Lizenzen).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: AUSBLICK */}
      {activeTab === 'ausblick' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6 animate-in fade-in duration-300">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2">
              <Compass className="text-shiraz" size={20} />
              Blick nach vorn: Wie sieht das Bauingenieurwesen 2030+ aus?
            </h3>
            <p className="text-xs text-text-main/70">
              Vier Schlüsseltechnologien, die das Planen und Bauen im kommenden Jahrzehnt grundlegend transformieren:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-100 text-blue-800 rounded-lg">
                  <Cpu size={16} />
                </span>
                <h4 className="font-bold text-sm text-text-main">Physics-Informed Neural Networks (PINNs)</h4>
              </div>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Bisherige KI lernt nur aus Daten – oft entgegen den Gesetzen der Physik. <strong>PINNs</strong> betten fundamentale Differentialgleichungen (Elastizitätstheorie, Navier-Stokes, Wärmeleitung) direkt in die Verlustfunktion des Netzes ein.
              </p>
              <div className="text-[11px] text-text-main/70 bg-white p-2.5 rounded-lg border border-home-grau/20">
                <strong>Effekt:</strong> FEM-Simulationen und dynamische Erdbebenanalysen, die früher Tage auf Servern rechneten, laufen künftig in Millisekunden auf dem Tablet.
              </div>
            </div>

            <div className="p-5 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                  <Bot size={16} />
                </span>
                <h4 className="font-bold text-sm text-text-main">Autonome Baustellenrobotik & 3D-Druck</h4>
              </div>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Der 3D-Betondruck leidet heute noch an schwankenden rheologischen Eigenschaften (z.B. Temperatur- und Feuchteeinfluss beim Abbinden). KI-Regelkreise messen den Frischbetondruck und die Viskosität an der Düse in Echtzeit und regeln Beschleunigerzusätze mikrosekundengenau nach.
              </p>
              <div className="text-[11px] text-text-main/70 bg-white p-2.5 rounded-lg border border-home-grau/20">
                <strong>Effekt:</strong> Fehlerfreier Freiform-Betondruck ohne Schalung für filigrane, materialsparende Deckenstrukturen.
              </div>
            </div>

            <div className="p-5 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-purple-100 text-purple-800 rounded-lg">
                  <Workflow size={16} />
                </span>
                <h4 className="font-bold text-sm text-text-main">Multimodale Agenten-Schwärme</h4>
              </div>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Spezialisierte KI-Agenten arbeiten Hand in Hand: Ein Agent liest das Baugrundgutachten, ein zweiter modelliert die Gründung im BIM-Modell, ein dritter prüft die Konformität mit dem Bebauungsplan und ein vierter berechnet die Ökobilanz (LCA / CO₂-Äquivalente).
              </p>
              <div className="text-[11px] text-text-main/70 bg-white p-2.5 rounded-lg border border-home-grau/20">
                <strong>Effekt:</strong> Der Vorentwurf beschleunigt sich von Monaten auf wenige Tage; Ingenieure fokussieren sich auf kreative Variantenentscheidungen.
              </div>
            </div>

            <div className="p-5 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                  <Boxes size={16} />
                </span>
                <h4 className="font-bold text-sm text-text-main">Zirkuläres Bauen & Urban Mining</h4>
              </div>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Vor dem Rückbau eines Bestandsgebäudes erfasst ein KI-gestützter Laserscan automatisch alle wiederverwendbaren Bauteile (Stahlträger, Mauerziegel, Fenster). Die KI gleicht Maße und Tragfähigkeiten automatisch mit einer Bauteilbörse für Neubauten ab.
              </p>
              <div className="text-[11px] text-text-main/70 bg-white p-2.5 rounded-lg border border-home-grau/20">
                <strong>Effekt:</strong> Direkte Wiederverwendung (Re-Use) statt energieintensivem Downcycling.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: ENTERPRISE RAG-PIPELINE (SCHRITT FÜR SCHRITT) */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header der Pipeline */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                <Database className="text-shiraz" size={20} />
                Enterprise RAG: Der 6-Stufen-Weg von Firmen-Dateien zum internen KI-Tool
              </h3>
              <span className="text-[11px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
                Datenschutz & IP-Schutz by Design
              </span>
            </div>
            <p className="text-xs text-text-main/80 leading-relaxed">
              In einem Ingenieur- oder Bauunternehmen liegen hunderttausende Seiten wertvolles Wissen verstreut: <strong>Baugrundgutachten (PDF)</strong>, <strong>Mischungsberechnungen (Excel)</strong>, <strong>Baustellenprotokolle (Word)</strong>, <strong>Leistungsverzeichnisse (GAEB)</strong> und <strong>BIM-Modelle (IFC)</strong>. Wie baut man daraus ein System, das Mitarbeitern verlässliche, sekundenschnelle Antworten mit Quellenangabe liefert, ohne dass sensible Firmendaten ins öffentliche Internet abfließen?
            </p>

            {/* Klickbare Prozesskette (Schritte 1 bis 6) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-3">
              {[
                { step: 1, label: '1. Daten & Parsing', icon: FileText, sub: 'PDF, Word, Excel, GAEB' },
                { step: 2, label: '2. Chunking', icon: Layers, sub: 'Abschnitte & Metadaten' },
                { step: 3, label: '3. Embeddings', icon: Cpu, sub: 'Text in Vektoren' },
                { step: 4, label: '4. Vector DB', icon: Database, sub: 'Qdrant / pgvector' },
                { step: 5, label: '5. Retrieval & Rerank', icon: Search, sub: 'Semantische Suche' },
                { step: 6, label: '6. Firmen-Tool', icon: Bot, sub: 'Chat-UI & Rechte' }
              ].map((item) => (
                <button
                  key={item.step}
                  onClick={() => setPipelineStep(item.step)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    pipelineStep === item.step
                      ? 'bg-shiraz text-white border-shiraz shadow-md ring-2 ring-shiraz/20'
                      : 'bg-off-white text-text-main border-home-grau/30 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[10px] font-mono font-bold opacity-80">Stufe {item.step}</span>
                    <item.icon size={15} />
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">{item.label}</div>
                    <div className={`text-[10px] mt-0.5 truncate ${pipelineStep === item.step ? 'text-white/80' : 'text-text-main/60'}`}>
                      {item.sub}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detaillierte Darstellung des ausgewählten Schritts */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
            {pipelineStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 border-b border-home-grau/20 pb-3">
                  <span className="w-7 h-7 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-xs">
                    01
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-text-main">
                      Schritt 1: Datenerfassung, Bereinigung & multimodales Parsing
                    </h4>
                    <p className="text-xs text-text-main/60">Vom chaotischen Netzlaufwerk zu sauberem, lesbarem Text und Tabellen</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                    <h5 className="font-bold text-text-main flex items-center gap-1.5">
                      <FileText size={15} className="text-shiraz" />
                      Die bautechnische Realität:
                    </h5>
                    <p className="text-text-main/80 leading-relaxed">
                      Dateien im Bauwesen sind hochgradig heterogen:
                    </p>
                    <ul className="space-y-1 list-disc list-inside text-text-main/70">
                      <li><strong>PDFs:</strong> Baugrundgutachten mit Schichtenverzeichnissen, statische Berechnungen mit Kopfzeilen.</li>
                      <li><strong>Excel (.xlsx):</strong> Stoffraumrechnungen, Betonprüfzeugnisse, Kostenermittlungen nach DIN 276.</li>
                      <li><strong>Word (.docx):</strong> Baustellenberichte, Bautagebücher, VOB-Bedenkenhinweise.</li>
                      <li><strong>Spezialformate:</strong> GAEB (.x83, .d83) für Ausschreibungen, IFC für BIM-Attribute.</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                    <h5 className="font-bold text-text-main flex items-center gap-1.5">
                      <Zap size={15} className="text-amber-600" />
                      Die Parsing-Herausforderung & Lösung:
                    </h5>
                    <p className="text-text-main/80 leading-relaxed">
                      Standard-Text-Extraktoren versagen bei Tabellen (z. B. Spalten werden zu Brei vermischt). 
                    </p>
                    <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 text-slate-700 leading-normal">
                      <strong>Werkzeuge:</strong> <code>LlamaParse</code>, <code>Unstructured.io</code> oder <code>PyMuPDF4LLM</code> wandeln PDF-Tabellen in sauberes Markdown um:
                      <pre className="text-[10px] font-mono bg-slate-50 p-2 mt-1 rounded border border-slate-200">
| Schicht | Bodenart | Reibungswinkel φ | Kohäsion c |
| 1       | Auffüllung | 27.5°           | 0 kN/m²   |
| 2       | Geschiebemergel | 32.5°      | 15 kN/m²  |
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {pipelineStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 border-b border-home-grau/20 pb-3">
                  <span className="w-7 h-7 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-xs">
                    02
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-text-main">
                      Schritt 2: Intelligentes Chunking & Metadaten-Anreicherung
                    </h4>
                    <p className="text-xs text-text-main/60">Zerschneiden in verdauliche Sinneinheiten mit vollständigem Steckbrief</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                    <h5 className="font-bold text-text-main flex items-center gap-1.5">
                      <Layers size={15} className="text-shiraz" />
                      Warum Chunking unverzichtbar ist:
                    </h5>
                    <p className="text-text-main/80 leading-relaxed">
                      Ein 80-seitiges Gutachten kann nicht als Ganzes an die Vektordatenbank übergeben werden. Die semantische Suche funktioniert nur, wenn einzelne Sinnabschnitte (typ. <strong>400–800 Tokens</strong> ≈ 1–2 Buchseiten) mit 10–15% Überlappung (Overlap) erzeugt werden. Der Overlap verhindert, dass Sätze an der Schnittkante zerrissen werden.
                    </p>
                  </div>

                  <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                    <h5 className="font-bold text-text-main flex items-center gap-1.5">
                      <Info size={15} className="text-blue-600" />
                      Der Schlüssel: Metadaten anhängen!
                    </h5>
                    <p className="text-text-main/80 leading-relaxed">
                      Jeder Chunk erhält unsichtbare Metadaten-Tags. Nur so kann der Chat später filtern:
                    </p>
                    <div className="p-2.5 bg-white rounded-lg border border-home-grau/20 font-mono text-[10px] text-slate-800">
                      <code>
                        {`{`}
                        <br />&nbsp;&nbsp;projekt_id: "BV-2024-Tiefgarage-Nord",
                        <br />&nbsp;&nbsp;dokument_typ: "Baugrundgutachten",
                        <br />&nbsp;&nbsp;bauwerks_teil: "Untergeschoss_2",
                        <br />&nbsp;&nbsp;gueltig_ab: "2024-03-15",
                        <br />&nbsp;&nbsp;sicherheitsstufe: "vertraulich"
                        <br />{`}`}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {pipelineStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 border-b border-home-grau/20 pb-3">
                  <span className="w-7 h-7 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-xs">
                    03
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-text-main">
                      Schritt 3: Vektorisierung durch moderne Embedding-Modelle
                    </h4>
                    <p className="text-xs text-text-main/60">Übersetzung menschlicher Baubegriffe in hochdimensionale Geometrie</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-text-main/80">
                  <p>
                    Ein Computer kann Texte nicht wie ein Mensch "verstehen". Ein <strong>Embedding-Modell</strong> (z. B. <code>text-embedding-3-large</code> von OpenAI oder das quelloffene <code>bge-m3</code> / <code>nomic-embed-text</code> für lokalen Offline-Betrieb) liest den Text-Chunk und wandelt ihn in eine Liste von 1.536 bis 3.072 Zahlen (Vektor) um.
                  </p>

                  <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] space-y-1">
                    <div className="text-slate-400"># Text: "Frost-Tausalz-Angriff auf Brückenkappe mit Taumitteln"</div>
                    <div className="text-emerald-400">Embedding: [0.0421, -0.1983, 0.8124, 0.0039, ..., -0.4412] (3072 Dimensionen)</div>
                  </div>

                  <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 text-blue-950">
                    <strong>Der Clou der Semantik:</strong> Die Suchanfrage <em>"Taumittelschäden Parkhaus"</em> erhält einen mathematisch fast identischen Vektor wie der Absatz <em>"Expositionsklasse XF4 und Taumittelbeanspruchung"</em>. Die Suchmaschine findet den Absatz, obwohl völlig unterschiedliche Wörter verwendet wurden!
                  </div>
                </div>
              </div>
            )}

            {pipelineStep === 4 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 border-b border-home-grau/20 pb-3">
                  <span className="w-7 h-7 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-xs">
                    04
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-text-main">
                      Schritt 4: Speicherung & Indexierung in der Vektordatenbank
                    </h4>
                    <p className="text-xs text-text-main/60">Das Spezial-Archiv für Millionen von Datenpunkten im Firmennetzwerk</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                    <h5 className="font-bold text-text-main">Qdrant / Milvus</h5>
                    <p className="text-text-main/70">
                      Hochperformante, quelloffene Vektordatenbanken. Lassen sich als Docker-Container auf dem firmeneigenen Server installieren (100% On-Premises ohne Cloud-Zwang).
                    </p>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Beste Wahl für On-Prem</span>
                  </div>

                  <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                    <h5 className="font-bold text-text-main">PostgreSQL mit pgvector</h5>
                    <p className="text-text-main/70">
                      Falls das Büro bereits eine SQL-Datenbank besitzt: <code>pgvector</code> erweitert Postgres um Vektorsuche. Spart neue Serverinfrastruktur und verbindet SQL-Tabellen direkt mit Vektoren.
                    </p>
                    <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">Standard für IT-Abteilungen</span>
                  </div>

                  <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
                    <h5 className="font-bold text-text-main">Hybrid Search (HNSW + BM25)</h5>
                    <p className="text-text-main/70">
                      Im Bauwesen unverzichtbar: Vektorsuche für Bedeutungen kombiniert mit exakter Keyword-Suche (BM25) für Normbezeichnungen (z. B. exakte Treffer bei Eingabe von <em>"DIN 18195"</em>).
                    </p>
                    <span className="text-[10px] font-mono bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">Ingenieur-Empfehlung</span>
                  </div>
                </div>
              </div>
            )}

            {pipelineStep === 5 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 border-b border-home-grau/20 pb-3">
                  <span className="w-7 h-7 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-xs">
                    05
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-text-main">
                      Schritt 5: Fragestellung, Vektorsuche & Re-Ranking
                    </h4>
                    <p className="text-xs text-text-main/60">Wie die treffendsten 3–5 Absätze aus 500.000 Seiten herausgefiltert werden</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-text-main/80">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-white rounded-xl border border-home-grau/30 space-y-1">
                      <span className="font-bold text-slate-800">1. Nutzer stellt Frage</span>
                      <p className="text-text-main/70">
                        "Welche Gründungsempfehlung gab der Gutachter für Bauabschnitt 2 bei bindigem Boden?"
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-home-grau/30 space-y-1">
                      <span className="font-bold text-slate-800">2. Schnelle Vektorsuche</span>
                      <p className="text-text-main/70">
                        Die Vector DB sucht per Kosinus-Ähnlichkeit die 25 ähnlichsten Chunks in Millisekunden heraus.
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-home-grau/30 space-y-1">
                      <span className="font-bold text-slate-800">3. Re-Ranking (Präzisionsfilter)</span>
                      <p className="text-text-main/70">
                        Ein Cross-Encoder-Modell (z. B. <em>Cohere Rerank</em> oder <em>bge-reranker</em>) prüft die 25 Chunks detailliert und wählt die besten 3 Treffer aus.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {pipelineStep === 6 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 border-b border-home-grau/20 pb-3">
                  <span className="w-7 h-7 rounded-lg bg-shiraz/10 text-shiraz flex items-center justify-center font-bold text-xs">
                    06
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-text-main">
                      Schritt 6: Generierung, Prompt-Injektion & Rollenberechtigungen
                    </h4>
                    <p className="text-xs text-text-main/60">Die fertige, quellenbelegte Antwort im Chatfenster oder Revit-Plugin</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs leading-relaxed text-text-main/80">
                  <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-2 font-mono text-[10.5px]">
                    <span className="text-purple-400 block font-sans font-bold"># Was das LLM hinter den Kulissen als Prompt erhält:</span>
                    <div className="text-slate-300">
                      System-Prompt: "Du bist der interne KI-Ingenieur-Assistent der Firma Bauplan GmbH. Antworte AUSSCHLIESSLICH basierend auf folgenden verifizierten Dokumentenauszügen. Nenne stets Dokumentname und Seitenzahl. Wenn die Information nicht enthalten ist, antworte ehrlich: 'Dazu liegen keine internen Projektdaten vor'."
                    </div>
                    <div className="text-emerald-400">
                      Kontext: [Quelle: Gutachten_BV2024_Nord.pdf, S. 24: "Für Bauabschnitt 2 wird eine Pfahlgründung mit Ortbeton-Rüttelpfählen Ø 60 cm empfohlen..."]
                    </div>
                    <div className="text-amber-300">
                      Frage: "Welche Gründung wurde für Bauabschnitt 2 empfohlen?"
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1.5">
                      <h5 className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <CheckCircle2 size={15} />
                        Rollen- und Rechtemanagement (RBAC):
                      </h5>
                      <p className="text-emerald-950/80">
                        Vor der Suche prüft das System die Identität des Mitarbeiters: Praktikanten und externe Nachunternehmer dürfen nur freigegebene Normen und Projektordner durchsuchen, während Geschäftsführer auch interne Honorare und Nachtragsverhandlungen abfragen können.
                      </p>
                    </div>

                    <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 space-y-1.5">
                      <h5 className="font-bold text-blue-900 flex items-center gap-1.5">
                        <Bot size={15} />
                        Endnutzer-Schnittstellen:
                      </h5>
                      <p className="text-blue-950/80">
                        Das Tool läuft als internes Web-Chatportal (z. B. <em>OpenWebUI</em> / <em>LibreChat</em>), als Bot in Microsoft Teams oder als direktes Add-In in Autodesk Revit und Word zur automatischen Baubeschreibung.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT: INTERAKTIVER VERGLEICH (RAG-SIMULATOR) */}
      {activeTab === 'vergleich' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6 animate-in fade-in duration-300">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2">
              <Workflow className="text-shiraz" size={20} />
              Interaktiver Praxis-Simulator: Warum RAG für Bauingenieure lebenswichtig ist
            </h3>
            <p className="text-xs text-text-main/70">
              Erleben Sie den Unterschied: Ein reines LLM schätzt vage aus dem Gedächtnis – während RAG die verifizierte DIN-Norm als "Spickzettel" hinzuzieht.
            </p>
          </div>

          {/* Question Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-main">Wählen Sie eine typische bautechnische Fachfrage:</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <button
                onClick={() => setSimQuestion('xc4')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  simQuestion === 'xc4'
                    ? 'bg-shiraz/5 border-shiraz ring-1 ring-shiraz text-text-main font-bold'
                    : 'bg-off-white border-home-grau/30 text-text-main/80 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs">Betondeckung XC4</div>
                <div className="text-[10px] text-text-main/60 mt-0.5">DIN EN 1992-1-1 (EC2)</div>
              </button>

              <button
                onClick={() => setSimQuestion('xf4')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  simQuestion === 'xf4'
                    ? 'bg-shiraz/5 border-shiraz ring-1 ring-shiraz text-text-main font-bold'
                    : 'bg-off-white border-home-grau/30 text-text-main/80 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs">w/z-Grenzwert Taumittel XF4</div>
                <div className="text-[10px] text-text-main/60 mt-0.5">DIN 1045-2 / DIN EN 206</div>
              </button>

              <button
                onClick={() => setSimQuestion('rc_beton')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  simQuestion === 'rc_beton'
                    ? 'bg-shiraz/5 border-shiraz ring-1 ring-shiraz text-text-main font-bold'
                    : 'bg-off-white border-home-grau/30 text-text-main/80 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs">RC-Beton in Spannbeton?</div>
                <div className="text-[10px] text-text-main/60 mt-0.5">Zulässigkeit nach DIN 1045-2</div>
              </button>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex border border-home-grau/30 bg-slate-50 p-1 rounded-xl max-w-md">
            <button
              onClick={() => setSimMode('llm_pur')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                simMode === 'llm_pur'
                  ? 'bg-white text-rose-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Modus A: Reines LLM (ohne RAG)
            </button>
            <button
              onClick={() => setSimMode('rag')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                simMode === 'rag'
                  ? 'bg-shiraz text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Modus B: LLM + RAG (mit Normendatenbank)
            </button>
          </div>

          {/* Current Question Display */}
          <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium flex items-start gap-2.5">
            <HelpCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>Fragestellung:</strong> {ragDemonstrations[simQuestion].question}
            </div>
          </div>

          {/* Comparison Output Box */}
          {simMode === 'llm_pur' ? (
            <div className="p-5 bg-rose-50/40 rounded-xl border border-rose-200 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-rose-100 pb-2">
                <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                  <AlertTriangle size={15} /> Antwort des reinen LLM (auswendig gelernt):
                </span>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                  {ragDemonstrations[simQuestion].llmPur.verdict}
                </span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-line bg-white p-3 rounded-lg border border-rose-100">
                "{ragDemonstrations[simQuestion].llmPur.text}"
              </p>
              <div className="text-xs text-rose-900 bg-rose-100/60 p-3 rounded-lg">
                <strong>Fachliche Kritik:</strong> {ragDemonstrations[simQuestion].llmPur.critique}
              </div>
            </div>
          ) : (
            <div className="p-5 bg-emerald-50/40 rounded-xl border border-emerald-200 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 size={15} /> Antwort mit RAG (DIN-Normen-Kontext eingebunden):
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  {ragDemonstrations[simQuestion].rag.verdict}
                </span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-line bg-white p-3 rounded-lg border border-emerald-100">
                {ragDemonstrations[simQuestion].rag.text}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-emerald-100/60 p-3 rounded-lg text-emerald-950">
                <div>
                  <strong>Automatisch zitierte Normenquelle:</strong> {ragDemonstrations[simQuestion].rag.source}
                </div>
                <div className="font-bold text-[11px] text-emerald-800">
                  {ragDemonstrations[simQuestion].rag.benefit}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Kennzahlen einer KI-Risserkennung"
        zielGleichung="P = \frac{TP}{TP+FP},\ R = \frac{TP}{TP+FN},\ F_1 = \frac{2PR}{P+R}"
        schritte={[
          { titel: 'Konfusionsmatrix', erklaerung: '200 Bildausschnitte: 45 richtig erkannte Risse, 5 Fehlalarme, 15 übersehene Risse, 135 richtig als rissfrei erkannt:', formel: 'TP = 45,\\ FP = 5,\\ FN = 15,\\ TN = 135' },
          { titel: 'Precision und Recall', erklaerung: 'Anteil zutreffender Meldungen und Anteil erkannter Risse:', formel: 'P = \\frac{45}{50} = 0{,}90,\\quad R = \\frac{45}{60} = 0{,}75' },
          { titel: 'F1 und Genauigkeit', erklaerung: 'Die Genauigkeit wirkt gut, verdeckt aber die übersehenen Risse:', formel: 'F_1 = \\frac{2 \\cdot 0{,}90 \\cdot 0{,}75}{1{,}65} = 0{,}82,\\quad Acc = \\frac{180}{200} = 0{,}90' }
        ]}
        ergebnisHinweis="Jeder vierte Riss wird übersehen. Für die Bauwerksprüfung ist der Recall maßgeblich; die KI kann die handnahe Prüfung nach DIN 1076 unterstützen, nicht ersetzen."
        normQuelle="DIN 1076:2026-01; ISO/IEC 22989:2022"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Erforderliche Bildauflösung für Haarrisse"
        zielGleichung="GSD = \frac{B}{n_{px}}"
        schritte={[
          { titel: 'Ist-Auflösung', erklaerung: 'Bildbreite 1,20 m auf 4 000 Pixel:', formel: 'GSD = \\frac{1\\,200\\ \\text{mm}}{4\\,000} = 0{,}30\\ \\text{mm/px}' },
          { titel: 'Anforderung', erklaerung: 'Ein Riss von 0,2 mm sollte mindestens 2 Pixel überdecken:', formel: 'GSD_{erf} \\le \\frac{0{,}2}{2} = 0{,}10\\ \\text{mm/px}' },
          { titel: 'Folge', erklaerung: 'Bei 4 000 Pixeln darf die Bildbreite höchstens betragen:', formel: 'B_{max} = 4\\,000 \\cdot 0{,}10 = 400\\ \\text{mm}' }
        ]}
        ergebnisHinweis="Mit zu grober Auflösung kann kein Algorithmus feine Risse zuverlässig finden – die Datenerfassung bestimmt die Grenze der KI-Auswertung."
        normQuelle="Lehrbeispiel; Bildverarbeitung"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="ki_ueberblick" />

      {/* 7. ModuleFooter nach Styleguide */}
      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 14 KI: KI-VO-Fristen inkl. Digital Omnibus, Art. 50/14, DSGVO-Artikel, UrhG § 44b, Modellangaben auf reale Modellfamilien zurückgeführt; fachliche Freigabe durch den Autor ausstehend)"
        wikipedia={[
          { title: 'Künstliche Intelligenz', url: 'https://de.wikipedia.org/wiki/K%C3%BCnstliche_Intelligenz' },
          { title: 'Maschinelles Lernen', url: 'https://de.wikipedia.org/wiki/Maschinelles_Lernen' },
          { title: 'Deep Learning', url: 'https://de.wikipedia.org/wiki/Deep_Learning' },
          { title: 'Retrieval-Augmented Generation', url: 'https://en.wikipedia.org/wiki/Retrieval-augmented_generation' },
          { title: 'Large Language Model', url: 'https://de.wikipedia.org/wiki/Gro%C3%9Fes_Sprachmodell' }
        ]}
        literatur={[
          'VDI-Statusreport: Künstliche Intelligenz im Bauwesen (Verein Deutscher Ingenieure e.V.)',
          'Goodfellow, I., Bengio, Y., Courville, A.: Deep Learning (MIT Press)',
          'Fraunhofer IESE: Leitfaden zur vertrauenswürdigen KI im industriellen Einsatz',
          'Karniadakis, G. E. et al.: Physics-informed machine learning (Nature Reviews Physics 3, 2021)'
        ]}
        regelwerke={[
          { title: 'Verordnung (EU) 2024/1689 (KI-Verordnung) – in Kraft 01.08.2024, gestaffelte Anwendung; Änderung durch Digital Omnibus (Fundstelle manuell prüfen)', url: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj' },
          { title: 'ISO/IEC 22989:2022 (Information technology — Artificial intelligence concepts and terminology)', url: 'https://www.iso.org/' },
          { title: 'DIN SPEC 92001 (Künstliche Intelligenz – Qualitätsanforderungen an KI-Module)' },
          { title: 'DIN EN ISO 19650 (Organisation von Daten zu Bauwerken / BIM)' }
        ]}
        formeln={
          activeTab === 'kernbegriffe'
            ? [
                {
                  formel: 'y = \\sigma\\left(\\sum_{i=1}^n w_i x_i + b\\right)',
                  erklaerung: 'Künstliches Neuron (Perzeptron): Gewichtete Summe der Eingangsgrößen x_i mit Gewichten w_i und Schwellenwert (Bias) b, überführt durch die Aktivierungsfunktion σ.',
                  quelle: 'Grundmodell des künstlichen Neurons'
                },
                {
                  formel: '\\text{Sim}_{\\cos}(\\mathbf{u}, \\mathbf{v}) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\| \\|\\mathbf{v}\\|}',
                  erklaerung: 'Kosinus-Ähnlichkeit für Text-Embeddings in RAG-Systemen: Misst den Winkel zwischen der Frage u und dem Normabschnitt v im hochdimensionalen Vektorraum.',
                  quelle: 'Vektorsuche & Informationsrückgewinnung (IR)'
                }
              ]
            : activeTab === 'stand'
            ? [
                {
                  formel: 'f_{c,28} = f(w/z, c, s, \\text{Aggregates}, T_{\\text{cure}})',
                  erklaerung: 'Multivariates Regressions- / ML-Modell zur Prädiktion der 28-Tage-Betondruckfestigkeit aus Mischungsparametern und Aushärtebedingungen.',
                  quelle: 'Baustoff-Informatik & Betontechnologie'
                }
              ]
            : []
        }
      />
    </div>
  );
}
