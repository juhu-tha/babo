import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { BlockMath } from 'react-katex';
import RagDemonstrator from '@/src/modules/ki/RagDemonstrator';
import {
  Cpu,
  Database,
  Sparkles,
  Layers,
  Eye,
  Bot,
  Server,
  CheckCircle2,
  ArrowRight,
  FileText,
  Zap,
  Boxes,
  Scale,
  Network,
  Code2,
  HardDrive,
  Workflow,
  AlertTriangle
} from 'lucide-react';

export default function Systemarchitektur() {
  const [activeTier, setActiveTier] = useState<string>('all');
  const [selectedTech, setSelectedTech] = useState<'ml' | 'dl' | 'llm' | 'rag' | 'vision' | 'agenten' | 'edge'>('ml');
  const [techViewMode, setTechViewMode] = useState<'funktionsweise' | 'einsatzzwecke' | 'daten' | 'grenzen'>('funktionsweise');

  // Technologies data for detailed step-by-step breakdown
  const techDetails = {
    ml: {
      id: 'ml',
      title: 'Classical Machine Learning (ML)',
      subtitle: 'Numerische Mustererkennung & Prädiktion auf strukturierten Messdaten',
      icon: Cpu,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      badge: 'Strukturierte Daten & Regression',
      oneLiner: 'Klassisches maschinelles Lernen lernt mathematische Zusammenhänge aus tabellarischen Labor- und Messreihen, um Zielwerte (z. B. Betondruckfestigkeit oder Setzungen) ohne analytische Differentialgleichungen präzise vorherzusagen.',
      mechanismus: {
        intro: 'Im Gegensatz zu heuristischen Erfahrungswerten oder deterministischen Berechnungsformeln ermittelt ML eine prädiktive Zielfunktion f(X) direkt aus empirischen Datenpunkten (Supervised Learning).',
        steps: [
          {
            step: '1. Feature Engineering',
            desc: 'Aufbereitung messbarer Einflussgrößen in Vektorform: Wasserzementwert (w/z), Klinkergehalt, Zementnormfestigkeit, Gesteinskörnungs-Sieblinie, Zusatzmittelgehalt und Erhärtungsalter (d).'
          },
          {
            step: '2. Modell-Auswahl & Training',
            desc: 'Einsatz von Regressionsbäumen (Random Forest, XGBoost) oder Support Vector Regression (SVR). Das Modell passt interne Parameter so an, dass der Vorhersagefehler auf den Trainingsdaten minimiert wird.'
          },
          {
            step: '3. Verlustfunktion & Minimierung',
            desc: 'Optimierung über den mittleren quadratischen Fehler (Mean Squared Error, MSE):',
            formula: 'L_{\\text{MSE}} = \\frac{1}{N} \\sum_{i=1}^{N} \\left( y_i - \\hat{y}_i \\right)^2'
          },
          {
            step: '4. Validierung & Generalisierung',
            desc: 'Strikte Trennung in Trainings- (80%) und Testdaten (20%) mit K-Fold-Kreuzvalidierung, um Overfitting (reines Auswendiglernen von Messfehlern) auszuschließen.'
          }
        ]
      },
      einsatzzwecke: [
        {
          titel: 'Betondruckfestigkeits-Prognose (f_cm,28)',
          bereich: 'Baustofftechnologie & Transportbetonwerk',
          beschreibung: 'Echtzeit-Prognose der 28-Tage-Druckfestigkeit aus 2-Tage- und 7-Tage-Frühfestigkeitsprüfungen und Rezepturdaten. Ermöglicht sofortiges Nachsteuern der Zementdosierung bei Chargenschwankungen.',
          output: 'Prädizierte Festigkeit in N/mm² mit 95%-Konfidenzintervall'
        },
        {
          titel: 'Baugrund-Setzungsberechnung aus CPT-Sondierungen',
          bereich: 'Geotechnik & Grundbau',
          beschreibung: 'Vorhersage von differentiellen Setzungen und Bettungsmoduln k_s anhand von Spitzenwiderstand q_c und Mantelreibung f_s aus Drucksondierungen ohne zeitintensive Labor-Ödometerversuche.',
          output: 'Setzungsverlauf s(t) in mm über Laststufen'
        },
        {
          titel: 'Bauzeiten- & Taktprognose im Rohbau',
          bereich: 'Baubetrieb & Projektsteuerung',
          beschreibung: 'Prädiktion realer Schal- und Betonierzeiten unter Berücksichtigung von Witterungsprognosen (Frost, Niederschlag), Baustellenlogistik und Personalauslastung.',
          output: 'Kritischer Pfad mit probabilistischer P50/P90-Abschätzung'
        }
      ],
      datenanforderungen: {
        inputFormat: 'Tabellarische Daten (CSV, Parquet, SQL-Datenbanken)',
        datenvolumen: '100 bis 50.000 kalibrierte Labor- oder Baustellenmesspunkte',
        latenz: 'Inferenzzeit < 1 Millisekunde pro Einzelvorhersage',
        hardware: 'Standard-CPU (keine Hochleistungs-GPU erforderlich)'
      },
      grenzen: {
        risiko: 'Extrapolationsversagen: Verlässt eine Baustoffmischung den erprobten Wertebereich (z. B. neuartige Geopolymere ohne Kalibrierungsdaten), können unbemerkt gravierende Fehlprognosen entstehen.',
        massnahme: 'Festlegung harter Definitionsbereiche (Bounding Boxes) und Plausibilitätsprüfungen nach DIN EN 206 / DIN 1045-2.'
      }
    },
    dl: {
      id: 'dl',
      title: 'Deep Learning & Neuronale Netze (DL / CNN / GNN)',
      subtitle: 'Hierarchische Repräsentationslernen für komplexe Tragwerks- und Bildgeometrien',
      icon: Network,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
      badge: 'Mehrschichtige Netze & FE-Surrogate',
      oneLiner: 'Deep Learning nutzt tiefe künstliche neuronale Netze, um nichtlineare physikalische Wechselwirkungen (z. B. Spannungsfelder oder Mikrostrukturen) ohne manuelle Feature-Extraktion hierarchisch abzubilden.',
      mechanismus: {
        intro: 'Ein tiefes neuronales Netz schaltet Millionen verknüpfter Rechenknoten (Neuronen) in Schichten hintereinander. Jeder Knoten berechnet eine gewichtete Summe mit Bias und transformiert diese über eine nichtlineare Aktivierungsfunktion.',
        steps: [
          {
            step: '1. Schichtenarchitektur (MLP / CNN / GNN)',
            desc: 'Eingabeschicht für Rohdaten (Spannungsmatrizen, Bildpixel, Knoten/Kanten von Stabwerken) → Mehrere verborgene Faltungs- oder Übertragungsschichten (Hidden Layers) → Ausgabeschicht.'
          },
          {
            step: '2. Knotentransformation & Aktivierungsfunktion',
            desc: 'Berechnung des Aktivierungszustands eines Neurons unter Einsatz nichtlinearer Schwellenfunktionen (z. B. ReLU oder GELU):',
            formula: 'a_j = \\sigma \\left( \\sum_{i} w_{ij} x_i + b_j \\right), \\quad \\text{mit } \\sigma(z) = \\max(0, z)'
          },
          {
            step: '3. Faltungsoperationen (Convolutional Layers)',
            desc: 'Für Bild- und Rissanalysen gleiten parametrisierte Faltungskerne (Filtermatrizen) über das Bild, um geometrische Kanten, Risse und Porenräume ortsinvariant zu extrahieren.'
          },
          {
            step: '4. Fehlerrückführung (Backpropagation)',
            desc: 'Gradientenabstieg zur schrittweisen Anpassung aller Verbindungsgewichte w_ij über die Kettenregel der Differentialrechnung.'
          }
        ]
      },
      einsatzzwecke: [
        {
          titel: 'FE-Surrogatmodelle (Echtzeit-Statikberechnung)',
          bereich: 'Konstruktiver Ingenieurbau & Tragwerksplanung',
          beschreibung: 'Ersatz aufwendiger nichtlinearer Finite-Elemente-Simulationen (FEM) durch trainierte Deep-Learning-Netze. Berechnet Verformungs- und Spannungszustände in Millisekunden statt Stunden.',
          output: 'Vollständiges 3D-Spannungsfeld (von Mises, Hauptzugspannungen)'
        },
        {
          titel: 'Mikrostrukturanalyse von Zementstein (CT / REM)',
          bereich: 'Bauchemie & Werkstoffprüfung',
          beschreibung: 'Automatisierte 3D-Segmentierung von Computertomographie-Aufnahmen zur quantitativen Bestimmung von Porenradienverteilung, Entmischungszonen und C-S-H-Phasenanteilen.',
          output: 'Porenraumvolumenanteil [%] und Porengeometrie-Klassifikation'
        },
        {
          titel: 'Topologieoptimierung im Betonbau',
          bereich: 'Nachhaltiges Bauen & Leichtbau',
          beschreibung: 'Generative Ermittlung lastpfadgerechter Fachwerkträger- und Deckenstrukturen zur gezielten Materialreduktion um bis zu 40% Betonvolumen.',
          output: 'Optimierte 3D-Netzgeometrie für Schalungs- und 3D-Druckdaten'
        }
      ],
      datenanforderungen: {
        inputFormat: 'Matrizen, Tensoren, FE-Netze (Mesh-Objekte), Rohbilder',
        datenvolumen: '10.000 bis 1.000.000 Trainingszustände (oft synthetisch via FEM generiert)',
        latenz: 'Inferenz 2–50 ms; Trainingszeit mehrere Stunden bis Tage auf GPUs',
        hardware: 'Dedizierte Tensor-Recheneinheiten (NVIDIA CUDA / Tensor Cores)'
      },
      grenzen: {
        risiko: 'Black-Box-Problematik: Die interne Argumentationskette eines tiefen Netzes mit Millionen Gewichten ist numerisch intransparent und kann im Bauwesen ohne Verifikation keine bauaufsichtliche Zulassung begründen.',
        massnahme: 'Kopplung mit physikalisch fundierten Gesetzen (Physics-Informed Neural Networks - PINNs) und Grenzwert-Überwachung nach Eurocode.'
      }
    },
    llm: {
      id: 'llm',
      title: 'Large Language Models (LLMs) & Transformer',
      subtitle: 'Semantisches Verständnis und Erzeugung ingenieurtechnischer Fachsprache',
      icon: FileText,
      color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      badge: 'Transformer & Self-Attention',
      oneLiner: 'Große Sprachmodelle wandeln unstrukturierte Bautech-Texte, Regelwerke und Gutachten über selbstaufmerksamkeitsbasierte Transformer-Architekturen in strukturierte Fachanalysen um.',
      mechanismus: {
        intro: 'Das Herzstück moderner LLMs ist der Transformer. Anstelle sequentieller Abarbeitung bewertet der Self-Attention-Mechanismus alle Wörter (Tokens) eines Dokuments gleichzeitig in Relation zueinander.',
        steps: [
          {
            step: '1. Tokenisierung & Vektor-Projektion',
            desc: 'Ingenieurtexte werden in Sub-Wort-Einheiten (Tokens) zerlegt und in hochdimensionale semantische Räume (z. B. d = 4096) eingebettet.'
          },
          {
            step: '2. Scaled Dot-Product Self-Attention',
            desc: 'Für jedes Token werden drei Vektoren gebildet: Query (Q), Key (K) und Value (V). Die Aufmerksamkeit berechnet, wie stark andere Baubegriffe berücksichtigt werden:',
            formula: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} \\right) V'
          },
          {
            step: '3. Multi-Head Attention',
            desc: 'Parallele Aufmerksamkeitsschichten analysieren gleichzeitig unterschiedliche logische Aspekte: Normbezüge, Bauteilabmessungen, Haftungskonsequenzen und Materialkennwerte.'
          },
          {
            step: '4. Autoregressive Inferenz & Reasoning',
            desc: 'Berechnung von Wahrscheinlichkeitsverteilungen für das jeweils nächste Fachwort unter Nutzung erweiterter logischer Denkschleifen (Reasoning / Chain-of-Thought).'
          }
        ]
      },
      einsatzzwecke: [
        {
          titel: 'Normen- & VOB-Synopse',
          bereich: 'Vergaberecht, AVA & Bauüberwachung',
          beschreibung: 'Automatischer Vergleich von Leistungsverzeichnissen gegen Anforderungen der VOB/C (ATV) und DIN-Normen zur Aufdeckung unvollständiger oder widersprüchlicher Ausschreibungstexte.',
          output: 'Tabelle mit Abweichungen, Risikoeinschätzungen und Paragrafenverweisen'
        },
        {
          titel: 'Rechtlich belastbare Bedenkenanzeigen nach § 4 Abs. 7 VOB/B',
          bereich: 'Bauleitung & Projektmanagement',
          beschreibung: 'Formulierung präziser, formal unangreifbarer Bedenkenanzeigen aus Stichpunkten des Baustellen-Tagebuchs (z. B. unzureichende Vorleistung, zu hohe Bauteilfeuchte vor Estrichverlegung).',
          output: 'Fertiger, unterschriftsreifer Briefentwurf mit Fristsetzung'
        },
        {
          titel: 'Gutachtensynthese & Befundauswertung',
          bereich: 'Bauschadensanalytik & Sanierung',
          beschreibung: 'Zusammenfassung hunderter Seiten geotechnischer Berichte oder Tragwerksgutachten auf die wesentlichen statischen Kennwerte und Sanierungsempfehlungen.',
          output: 'Strukturierte Zusammenfassung nach VDI 6200 / Sanierungsmatrix'
        }
      ],
      datenanforderungen: {
        inputFormat: 'Unstrukturierter Fließtext, Markdown, PDF-Extrakte, JSON',
        datenvolumen: 'Kontextfenster von 8.000 bis zu 2.000.000 Tokens (ganze Projektordner)',
        latenz: '15 bis 100 Tokens pro Sekunde (1–10 Sekunden pro Antwort)',
        hardware: 'Server-Cluster für Cloud-APIs oder High-End Workstation (VRAM-intensiv)'
      },
      grenzen: {
        risiko: 'Faktenhalluzination & falsche Zahlenangaben: Ein LLM ist ein Wahrscheinlichkeitsmodell und versteht Physik nicht a priori deterministisch. Es kann erfundene DIN-Normen oder falsche Einheiten ausgeben.',
        massnahme: 'Zwingende Erdung (Grounding) durch RAG-Systeme und Nachrechnung durch deterministische Rechenmodule mit Human-in-the-Loop.'
      }
    },
    rag: {
      id: 'rag',
      title: 'Retrieval-Augmented Generation (RAG)',
      subtitle: 'Quellentrunkene Wissenseinbettung über Vektordatenbanken ohne Modell-Halluzination',
      icon: Database,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      badge: 'Vektordatenbank & Semantische Suche',
      oneLiner: 'RAG verbindet statische Sprachmodelle mit dynamischen, firmeneigenen Wissensarchiven (DIN-Normen, Baugrundberichte, Zulassungen), indem nur verifizierte Originaltexte als Antwortgrundlage injiziert werden.',
      mechanismus: {
        intro: 'RAG fungiert als „Prüfung mit offenem Buch“. Anstatt sich auf das unzuverlässige Erinnerungsvermögen des Netzes zu verlassen, wird bei jeder Frage erst die exakte Fundstelle im Firmenarchiv gesucht.',
        steps: [
          {
            step: '1. Dokumenten-Parsing & Chunking',
            desc: 'Baudokumente (PDF, DOCX) werden in handhabbare Sinneinheiten (z. B. 500 Zeichen mit 50 Zeichen Überlappung) zerlegt.'
          },
          {
            step: '2. Dense Vector Embedding',
            desc: 'Jeder Textabschnitt wird durch ein Einbettungsmodell (z. B. text-embedding-3 oder BGE) in einen Vektor im d-dimensionalen Raum überführt.'
          },
          {
            step: '3. Kosinus-Ähnlichkeitssuche (KNN / ANN)',
            desc: 'Vergleich der Ingenieurfrage mit allen archivierten Chunks über die geometrische Kosinus-Distanz in einer Vektordatenbank (z. B. Qdrant, Chroma, Pinecone):',
            formula: '\\text{Similarity}(q, d) = \\frac{\\mathbf{q} \\cdot \\mathbf{d}}{\\|\\mathbf{q}\\| \\|\\mathbf{d}\\|} = \\frac{\\sum_{i=1}^n q_i d_i}{\\sqrt{\\sum_{i=1}^n q_i^2} \\sqrt{\\sum_{i=1}^n d_i^2}}'
          },
          {
            step: '4. Context Injection & Grounded Synthesis',
            desc: 'Die besten Textfunde werden als gesicherter Kontext in den System-Prompt des LLMs eingefügt. Das Modell beantwortet die Frage ausschließlich mit diesen Quellennachweisen.'
          }
        ]
      },
      einsatzzwecke: [
        {
          titel: 'Büro-Normenbibliothek & Zulassungsfinder',
          bereich: 'Planungsbüro & Prüfingenieurwesen',
          beschreibung: 'Sekundenschnelle Abfrage von Grenzwerten aus Eurocodes, nationalen Anhängen (NA) und allgemeinen bauaufsichtlichen Zulassungen (abZ) mit exakter Angabe von Tabelle, Absatz und Seite.',
          output: 'Faktenbasierte Antwort mit klickbarem PDF-Fundstellenbeleg'
        },
        {
          titel: 'Bautagebuch- & Mängelarchiv-Recherche',
          bereich: 'Projektsteuerung & Gewährleistungsmanagement',
          beschreibung: 'Semantische Suche über 5 Jahre Bautagebücher: "Wann und durch welches Gewerk wurde die Dämmung an Achse 4 bei Minustemperaturen eingebaut?"',
          output: 'Chronologische Auflistung relevanter Tagesberichte mit Fotos'
        },
        {
          titel: 'Historische Statik- & Sanierungsdatenbank',
          bereich: 'Bauen im Bestand & Bauwerkserhaltung',
          beschreibung: 'Recherche in alten statischen Berechnungen und Bewehrungsplänen nach vergleichbaren Stützenverstärkungen oder Rissinjektionskonzepten.',
          output: 'Vergleichbare Referenzprojekte mit Materialkenndaten'
        }
      ],
      datenanforderungen: {
        inputFormat: 'PDF-Dokumente, Scans mit OCR, Textdateien, BIM-Attributlisten',
        datenvolumen: 'Von wenigen Hundert bis zu mehreren Millionen archivierten Seiten',
        latenz: 'Vektorsuche 5–20 ms; Gesamte RAG-Antwort 1–3 Sekunden',
        hardware: 'Vektordatenbank auf Standardserver oder lokalem NVMe-Speicher'
      },
      grenzen: {
        risiko: 'Chunking-Verlust & Tabellenzerreißung: Werden komplexe Statik-Tabellen unsauber zerschnitten, verliert die Vektorsuche die semantische Zeilen-Spalten-Zuordnung.',
        massnahme: 'Strukturierte Markdown-Konvertierung und hierarchisches Chunking (Parent-Child-Retriever).'
      }
    },
    vision: {
      id: 'vision',
      title: 'Computer Vision & Multimodale Bildverarbeitung',
      subtitle: 'Optische Vermessung, Schadenserkennung und Soll-Ist-Abgleich der Baustelle',
      icon: Eye,
      color: 'text-cyan-700 bg-cyan-50 border-cyan-200',
      badge: 'CNN / ViT / Photogrammetrie',
      oneLiner: 'Computer Vision wandelt Drohnenaufnahmen, Baustellenfotos und Punktwolken über Faltungsnetze und Vision-Transformer in quantifizierbare Schadens- und Baufortschrittsdaten um.',
      mechanismus: {
        intro: 'Moderne Bildverarbeitung kombiniert Objekterkennung (YOLO, Mask R-CNN), semantische Segmentierung und Vision-Language-Modelle (VLMs) zur geometrisch exakten Bauzustandsanalyse.',
        steps: [
          {
            step: '1. Bildvorverarbeitung & Kalibrierung',
            desc: 'Optische Entzerrung, Weißabgleich, Skalierung und metrische Kalibrierung über Passpunkte oder Laser-Distanzmessungen auf der Bauteiloberfläche.'
          },
          {
            step: '2. Feature Extraction (Faltung & Vision Transformer)',
            desc: 'Zerlegung der Aufnahme in Bildpatches (ViT) oder hierarchische Faltungsmerkmale (CNN) zur Erkennung feiner Texturen wie Rissverläufe oder Ausblühungen.'
          },
          {
            step: '3. Semantische Pixelsegmentierung',
            desc: 'Zuordnung jedes Bildpixels zu Schadenskategorien (z. B. Riss, Betonabplatzung, Korrosion, intakter Beton) mittels U-Net oder SegFormer-Architekturen.'
          },
          {
            step: '4. Photogrammetrische Triangulation & BIM-Mapping',
            desc: 'Rückprojektion der 2D-Segmentierung in die 3D-Punktwolke zur Verortung des Schadens an exakter Bauteilkoordinate im IFC-Modell.'
          }
        ]
      },
      einsatzzwecke: [
        {
          titel: 'Bauwerksprüfung nach DIN 1076 (Brücken & Ingenieurbauwerke)',
          bereich: 'Erhaltungsmanagement & Bauwerksdiagnostik',
          beschreibung: 'Drohnengestützte Inspektion schwer zugänglicher Brückenuntersichten mit automatischer Klassifikation von Rissen (Breite ab 0,1 mm), Hohlstellen und Karbonatisierungsschäden.',
          output: 'Schadenskataster mit Schadensausmaß [m²] und Rissbreite [mm]'
        },
        {
          titel: 'As-Built vs. As-Planned Fortschrittsabgleich',
          bereich: 'Bauüberwachung & Building Information Modeling (BIM)',
          beschreibung: 'Automatisierter täglicher 3D-Vergleich zwischen Baustellen-Laserscans und dem 4D-BIM-Terminplan zur Erkennung von Montagefehlern oder Bauverzug.',
          output: 'Farblich kodiertes Differenzmodell (Grün = im Plan, Rot = Verzug)'
        },
        {
          titel: 'Arbeitsschutzüberwachung (SiGeKo)',
          bereich: 'Baustellensicherheit & Gefährdungsbeurteilung',
          beschreibung: 'Echtzeit-Erkennung von Sicherheitsverstößen: Fehlende Schutzhelme, ungesicherte Deckenabsturzkanten oder unbefugtes Betreten von Schwenkbereichen.',
          output: 'Sofortige Warnmeldung an die örtliche Bauleitung'
        }
      ],
      datenanforderungen: {
        inputFormat: 'Hochauflösende RGB-Bilder (RAW/JPG), Drohnen-Orthofotos, LiDAR-Punktwolken (.las, .e57)',
        datenvolumen: '10 bis 10.000 Fotos pro Inspektionsbefliegung (Gigabyte-Bereich)',
        latenz: 'Echtzeit (30 fps) für Sicherheits-Kameras; Batch-Verarbeitung für 3D-Inspektionen',
        hardware: 'GPU-Cluster für 3D-Photogrammetrie und Deep-Learning-Segmentierung'
      },
      grenzen: {
        risiko: 'Sichtbehinderungen & Beleuchtungsschwankungen: Verdeckte Bauteile, Verschmutzungen oder Schlagschatten können zu Fehlinterpretationen führen.',
        massnahme: 'Kombination mit photogrammetrischer Mehrfachüberdeckung und zwingende Freigabe durch den zertifizierten Brückenprüfer.'
      }
    },
    agenten: {
      id: 'agenten',
      title: 'Autonome KI-Agenten & Tool Use (ReAct & MCP)',
      subtitle: 'Kognitive Handlungs- und Regelschleifen zur selbstständigen Nutzung externer Statik- und AVA-Tools',
      icon: Bot,
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      badge: 'Reasoning + Acting (ReAct) & Schnittstellen',
      oneLiner: 'KI-Agenten verbinden Sprachmodelle mit externen Werkzeugen (Python-Sandbox, Statik-APIs, IFC-Parser), um mehrstufige Ingenieuraufgaben selbstständig und fehlerkorrigierend zu lösen.',
      mechanismus: {
        intro: 'Ein Agent beschränkt sich nicht auf Textgenerierung. Er plant eigenständig Zwischenschritte, ruft externe Fachsoftware auf, interpretiert die Rückgabewerte und iteriert bis zur Erfüllung aller Bemessungskriterien.',
        steps: [
          {
            step: '1. ReAct-Schleife (Reasoning + Acting)',
            desc: 'Aufgabe erfassen → Thought (nächsten Schritt planen) → Action (Tool mit konkreten Parametern aufrufen) → Observation (Ergebnis der Berechnung empfangen) → Reflection.'
          },
          {
            step: '2. Funktionsaufrufe (Deterministic Tool Calling)',
            desc: 'Aufruf externer Schnittstellen über streng typisierte JSON-Schemata (z. B. { "profile": "HEB300", "span_m": 6.5, "load_kN_m": 45.0 }).'
          },
          {
            step: '3. Model Context Protocol (MCP)',
            desc: 'Nutzung offener Standards (MCP) zur direkten Anbindung von Bürosoftware: Statikprogramme (Dlubal, Sofistik), BIM-Server (Revit, Allplan) und AVA-Datenbanken.'
          },
          {
            step: '4. Fehlerselbstkorrektur (Self-Correction Loop)',
            desc: 'Ergibt der Nachweis eine Profilüberlastung (Ausnutzung η = 1.18 > 1.0), wählt der Agent automatisch das nächstgrößere Profil (z. B. HEB 320) und wiederholt die Bemessung.'
          }
        ]
      },
      einsatzzwecke: [
        {
          titel: 'Automatisierte Tragwerks-Vorbemessung',
          bereich: 'Entwurfs- & Vorstatik (Lph 2–3 HOAI)',
          beschreibung: 'Agent nimmt Gebäuderaster und Lastannahmen entgegen, erzeugt automatisch statische Rechenmodelle in einer Statik-API, iteriert Profile bis η ≤ 1,0 und gibt einen Bemessungsbericht aus.',
          output: 'Vollständiger prüffähiger Vorbemessungsbericht nach Eurocode 3'
        },
        {
          titel: 'BIM-Mengenermittlung & GAEB-Zuordnung',
          bereich: 'Kostenplanung & AVA (Lph 6–7 HOAI)',
          beschreibung: 'Agent liest IFC-Dateien aus, ermittelt Schalungs- und Betonvolumina, gleicht diese mit VOB/C-Abrechnungsregeln ab und ordnet sie den GAEB-Positionen zu.',
          output: 'Fertig bepreiste GAEB DA XML (X83) Leistungsverzeichnis-Datei'
        },
        {
          titel: 'Vertrags- & Nachtragsprüfung im Baubetrieb',
          bereich: 'Bauvertragswesen & Claim Management',
          beschreibung: 'Agent analysiert Nachtragsforderungen eines Nachunternehmers, gleicht die Einheitspreise mit dem Hauptvertrag ab und prüft den Bauzeitenplan auf Kausalität.',
          output: 'Detaillierter Prüfbericht mit Empfehlung für Freigabe oder Abwehr'
        }
      ],
      datenanforderungen: {
        inputFormat: 'Konstruktionsvorgaben, Lastannahmen, BIM-Dateien (IFC), API-Endpoints',
        datenvolumen: 'Strukturierte Aufgabenbeschreibungen und Tool-Payloads',
        latenz: '10 Sekunden bis mehrere Minuten für komplexe Iterationszyklen',
        hardware: 'Orchestrierungs-Server mit Anbindung an Fachsoftware-Lizenzen'
      },
      grenzen: {
        risiko: 'Endlosschleifen & Tool-Fehlausführungen: Bei widersprüchlichen Randbedingungen kann der Agent in Iterationsschleifen geraten oder fehlerhafte Zwischenwerte generieren.',
        massnahme: 'Strikte Abbruchkriterien (Max Iterations = 5) und obligatorische Ingenieur-Freigabe vor Weiterleitung (Human-in-the-Loop).'
      }
    },
    edge: {
      id: 'edge',
      title: 'Lokale Edge-KI & On-Premise-Systeme',
      subtitle: 'Volle Datenhoheit und netzunabhängige Ausführung im Baustellenbüro',
      icon: Server,
      color: 'text-slate-800 bg-slate-100 border-slate-300',
      badge: 'Quantisierung & Offline Datensicherheit',
      oneLiner: 'Lokale KI betreibt quelloffene Spitzenmodelle (Qwen, Llama, DeepSeek) auf eigener Büro- und Baustellenhardware – offline und ohne Cloud-Übermittlung; das erleichtert Datenschutz und Geheimschutz, ersetzt aber keine DSGVO-Prüfung.',
      mechanismus: {
        intro: 'Durch moderne Modellkompression (Quantisierung) schrumpft der Speicherbedarf von KI-Modellen um bis zu 75%, sodass modernste Sprach- und Vision-Modelle auf normalen Workstations laufen.',
        steps: [
          {
            step: '1. Gewichtungs-Quantisierung (GGUF / AWQ)',
            desc: 'Konvertierung der Modellgewichte von 16-Bit-Fließkommazahlen (FP16) auf 4-Bit- oder 8-Bit-Ganzzahlen (z. B. Q4_K_M) bei vernachlässigbarem Qualitätsverlust (< 1% Perplexität).'
          },
          {
            step: '2. VRAM- & Unified-Memory-Management',
            desc: 'Laden der Modellparameter in den Grafikspeicher (NVIDIA RTX VRAM oder Apple Unified Memory) für maximale Durchsatzraten bei der Token-Generierung.'
          },
          {
            step: '3. Lokale Laufzeitumgebungen (Inference Engines)',
            desc: 'Ausführung über hocheffiziente C++-Engines wie llama.cpp, Ollama oder LM Studio mit lokaler REST-API-Schnittstelle (kompatibel zu OpenAI-Standards).'
          },
          {
            step: '4. Vollständige physische Netzwerk-Isolation (Air-Gapping)',
            desc: 'Der gesamte Rechenprozess findet isoliert im lokalen Netzwerk oder auf dem Baustellen-Laptop statt. Kein Datenpaket verlässt das Baubüro.'
          }
        ]
      },
      einsatzzwecke: [
        {
          titel: 'Geheimschutz- & KRITIS-Infrastrukturprojekte',
          bereich: 'Sicherheitsrelevanter Tief- & Hochbau',
          beschreibung: 'Planung von Bundeswehr-Liegenschaften, Trinkwassergewinnungsanlagen, Rechenzentren oder Chemieparks, bei denen vertraglich jegliche Cloud-Nutzung untersagt ist.',
          output: '100% vertragskonforme, abhörsichere Dokumentenverarbeitung'
        },
        {
          titel: 'Netzunabhängige Baustellen-KI im Tunnel- & Erdbau',
          bereich: 'Tunnelbau, Bergbau & Abgelegene Windparks',
          beschreibung: 'Auswertung von Baugrundprotokollen, Sprengdaten und Vortriebsleistungen direkt vor Ort unter Tage oder auf See ohne jegliche Internetverbindung.',
          output: 'Sofortige Analyse auf dem robusten Baustellen-Laptop'
        },
        {
          titel: 'Bürointernes Know-how- & Patent-Management',
          bereich: 'Forschung & Entwicklung im Baustoffbereich',
          beschreibung: 'Recherche in geschützten Rezepturen für Hochleistungsbetone, neuartige Verbundwerkstoffe und Sanierungsverfahren ohne Risiko von Industriespionage.',
          output: 'Geschütztes firmenweites Fachwissen ohne Cloud-Upload'
        }
      ],
      datenanforderungen: {
        inputFormat: 'Sämtliche internen Firmenformate ohne externe Übertragungsbeschränkungen',
        datenvolumen: 'Beliebig – begrenzt nur durch lokale SSD-Speicherkapazität',
        latenz: '20 bis 80 Tokens/Sekunde auf moderner Hardware',
        hardware: 'Workstation mit 16–64 GB VRAM (RTX 4080/4090) oder Apple Silicon (M3/M4 Max)'
      },
      grenzen: {
        risiko: 'Hardware-Begrenzung: Sehr große Frontier-Modelle (> 70 Milliarden Parameter) erfordern teurere Multi-GPU-Setups.',
        massnahme: 'Fokus auf spezialisierte 8B- bis 32B-Modelle, die für den Großteil der Baustellen- und Büroaufgaben vollkommen ausreichen.'
      }
    }
  };

  const currentTech = techDetails[selectedTech];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      {/* 1. HEADER & INTRO BOX */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Cpu className="text-shiraz" /> Systemarchitektur der Bau-KI
          </h2>
          <span className="px-3 py-1 bg-slate-100 text-slate-700 font-mono text-xs rounded-full border border-slate-200 font-semibold">
            Informatische Schichten &amp; Einsatzzwecke
          </span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30 leading-relaxed space-y-2">
          <p>
            Moderne Künstliche Intelligenz im Bauingenieurwesen ist kein monolithisches Einzelprogramm, sondern eine <strong>hochgradig vernetzte Systemarchitektur</strong>. Sie spannt den Bogen von <strong>numerischen Prädiktionsmodellen (ML)</strong> über <strong>geometrische Bilderkennung (Computer Vision)</strong> und <strong>wissensgestützte Textsysteme (LLM &amp; RAG)</strong> bis hin zu <strong>autonomen agentischen Werkzeug-Schnittstellen</strong>.
          </p>
          <p className="text-xs text-text-main/70">
            Diese Übersicht erklärt schrittweise die mathematischen und technischen Funktionsweisen aller Kerntechnologien sowie deren konkrete Einsatzzwecke im Planungsbüro, Prüflabor und auf der Baustelle.
          </p>
        </div>
      </div>

      {/* 2. DAS SCHICHTENMODELL DER BAU-KI (PIPELINE) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-home-grau/20 pb-3">
          <div>
            <h3 className="text-base font-bold text-text-main flex items-center gap-2">
              <Layers className="text-shiraz" size={18} />
              <span>Das 6-Schichten-Referenzmodell eines modernen Bau-KI-Systems</span>
            </h3>
            <p className="text-xs text-text-main/70">
              Klicken Sie auf eine Schicht, um zu erfahren, wie Daten von der Baustelle zum validierten Ingenieurergebnis fließen.
            </p>
          </div>
          <button
            onClick={() => setActiveTier('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTier === 'all'
                ? 'bg-shiraz text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Alle Schichten anzeigen
          </button>
        </div>

        {/* Interactive Pipeline Architecture Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Layer 1: Datenerfassung */}
          <div
            onClick={() => setActiveTier('tier1')}
            className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
              activeTier === 'tier1' || activeTier === 'all'
                ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-400/20 shadow-sm'
                : 'bg-white border-home-grau/30 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                Schicht 1
              </span>
              <HardDrive size={16} className="text-amber-700" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">Datenerfassung &amp; Sensorik</h4>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug">
              Labor-Druckprüfungen, Baugrund-CPTs, Drohnen-Fotos, 3D-LiDAR-Punktwolken, BIM-Modelle (IFC) und DIN-PDFs.
            </p>
            <div className="mt-2 text-[10px] font-mono text-amber-800 bg-white/80 p-1.5 rounded border border-amber-200">
              Output: Unstrukturierte &amp; tabellarische Rohdaten
            </div>
          </div>

          {/* Layer 2: Prädiktives ML */}
          <div
            onClick={() => { setActiveTier('tier2'); setSelectedTech('ml'); }}
            className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
              activeTier === 'tier2' || activeTier === 'all'
                ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-400/20 shadow-sm'
                : 'bg-white border-home-grau/30 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                Schicht 2
              </span>
              <Cpu size={16} className="text-emerald-700" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">Prädiktive ML- &amp; DL-Modelle</h4>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug">
              XGBoost, Random Forests und FE-Surrogate prognostizieren Festigkeiten, Bettungsmoduln und Spannungsfelder in Millisekunden.
            </p>
            <div className="mt-2 text-[10px] font-mono text-emerald-800 bg-white/80 p-1.5 rounded border border-emerald-200">
              Output: f_cm,28 [N/mm²], Setzungen s [mm]
            </div>
          </div>

          {/* Layer 3: Computer Vision */}
          <div
            onClick={() => { setActiveTier('tier3'); setSelectedTech('vision'); }}
            className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
              activeTier === 'tier3' || activeTier === 'all'
                ? 'bg-cyan-50/60 border-cyan-300 ring-2 ring-cyan-400/20 shadow-sm'
                : 'bg-white border-home-grau/30 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 uppercase">
                Schicht 3
              </span>
              <Eye size={16} className="text-cyan-700" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">Computer Vision &amp; VLM</h4>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug">
              Faltungsnetze (CNNs) und Vision Transformer vermessen Rissbreiten ab 0,1 mm und gleichen Baustellen-Scans mit 4D-BIM ab.
            </p>
            <div className="mt-2 text-[10px] font-mono text-cyan-800 bg-white/80 p-1.5 rounded border border-cyan-200">
              Output: Schadenskataster, Soll-Ist-Abweichung
            </div>
          </div>

          {/* Layer 4: RAG & Vektorspeicher */}
          <div
            onClick={() => { setActiveTier('tier4'); setSelectedTech('rag'); }}
            className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
              activeTier === 'tier4' || activeTier === 'all'
                ? 'bg-indigo-50/60 border-indigo-300 ring-2 ring-indigo-400/20 shadow-sm'
                : 'bg-white border-home-grau/30 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 uppercase">
                Schicht 4
              </span>
              <Database size={16} className="text-indigo-700" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">Semantische RAG-Pipeline</h4>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug">
              Chunking, Embedding-Modelle und Vektordatenbanken (Qdrant, Chroma) liefern normative Zitate aus Eurocodes ohne Halluzination.
            </p>
            <div className="mt-2 text-[10px] font-mono text-indigo-800 bg-white/80 p-1.5 rounded border border-indigo-200">
              Output: Relevante Originalabschnitte mit Paragraf
            </div>
          </div>

          {/* Layer 5: Kognitive LLMs */}
          <div
            onClick={() => { setActiveTier('tier5'); setSelectedTech('llm'); }}
            className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
              activeTier === 'tier5' || activeTier === 'all'
                ? 'bg-purple-50/60 border-purple-300 ring-2 ring-purple-400/20 shadow-sm'
                : 'bg-white border-home-grau/30 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 uppercase">
                Schicht 5
              </span>
              <Sparkles size={16} className="text-purple-700" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">Kognitive Sprachmodelle (LLM)</h4>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug">
              Transformer-Kerne analysieren Widersprüche im Leistungsverzeichnis, formulieren Bedenkenanzeigen und synthetisieren Gutachten.
            </p>
            <div className="mt-2 text-[10px] font-mono text-purple-800 bg-white/80 p-1.5 rounded border border-purple-200">
              Output: Normengerechte Fachtexte &amp; Reasoning
            </div>
          </div>

          {/* Layer 6: Autonome Agenten & Validierung */}
          <div
            onClick={() => { setActiveTier('tier6'); setSelectedTech('agenten'); }}
            className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
              activeTier === 'tier6' || activeTier === 'all'
                ? 'bg-rose-50/60 border-rose-300 ring-2 ring-rose-400/20 shadow-sm'
                : 'bg-white border-home-grau/30 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 uppercase">
                Schicht 6
              </span>
              <Bot size={16} className="text-rose-700" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">Agenten, APIs &amp; Human-in-the-Loop</h4>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug">
              Agenten rufen Statik-APIs (Dlubal, Sofistik) und AVA-Software auf. Der Ingenieur prüft und signiert das Ergebnis rechtlich belastbar.
            </p>
            <div className="mt-2 text-[10px] font-mono text-rose-800 bg-white/80 p-1.5 rounded border border-rose-200">
              Output: Prüffähige Statik &amp; signierte Freigabe
            </div>
          </div>
        </div>

        {/* Dataflow Banner */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Workflow size={16} className="text-shiraz" />
            <span className="font-semibold text-slate-800">Datenfluss im Büro:</span>
            <span className="hidden sm:inline">Sensordaten &amp; Pläne</span>
            <ArrowRight size={13} className="text-slate-400" />
            <span className="hidden sm:inline">ML / Vision</span>
            <ArrowRight size={13} className="text-slate-400" />
            <span className="hidden sm:inline">RAG-Verifikation</span>
            <ArrowRight size={13} className="text-slate-400" />
            <span className="hidden sm:inline">LLM &amp; Agenten-Tools</span>
            <ArrowRight size={13} className="text-slate-400" />
            <span className="font-bold text-shiraz">Ingenieur-Freigabe</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">ISO 19650 / DIN EN 1990</span>
        </div>
      </div>

      {/* 3. SCHRITTWEISE TECHNOLOGIE-ERKLÄRUNG (INTERAKTIVE DETAIL-MATRIX) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
        <div>
          <h3 className="text-base font-bold text-text-main flex items-center gap-2">
            <Boxes className="text-shiraz" size={18} />
            <span>Schrittweise Technologie-Vertiefung &amp; Einsatzzwecke</span>
          </h3>
          <p className="text-xs text-text-main/70">
            Wählen Sie eine Technologie aus, um die informatische Funktionsweise, mathematische Modellierung und konkrete bautechnische Einsatzzwecke zu analysieren.
          </p>
        </div>

        {/* Horizontal Technology Selector Tabs */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
          {(
            [
              { key: 'ml', label: '1. Classical ML', icon: Cpu },
              { key: 'dl', label: '2. Deep Learning', icon: Network },
              { key: 'llm', label: '3. LLM & Transformer', icon: FileText },
              { key: 'rag', label: '4. RAG & Vektoren', icon: Database },
              { key: 'vision', label: '5. Computer Vision', icon: Eye },
              { key: 'agenten', label: '6. KI-Agenten & Tools', icon: Bot },
              { key: 'edge', label: '7. Lokale Edge-KI', icon: Server }
            ] as const
          ).map(tab => {
            const Icon = tab.icon;
            const isSelected = selectedTech === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedTech(tab.key)}
                className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Technology Header Card */}
        <div className="p-5 rounded-2xl border border-home-grau/30 bg-off-white space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className={`p-2.5 rounded-xl border ${currentTech.color}`}>
                <currentTech.icon size={20} />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800">{currentTech.title}</h4>
                <p className="text-xs text-text-main/70">{currentTech.subtitle}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-white text-slate-700 text-xs font-semibold rounded-full border border-home-grau/30 shadow-2xs">
              {currentTech.badge}
            </span>
          </div>

          <p className="text-xs text-text-main/80 font-normal leading-relaxed bg-white p-3.5 rounded-xl border border-home-grau/20">
            {currentTech.oneLiner}
          </p>

          {/* Sub-Aspect Navigation Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-home-grau/20">
            <button
              onClick={() => setTechViewMode('funktionsweise')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                techViewMode === 'funktionsweise'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Code2 size={13} /> Technische Funktionsweise &amp; Formel
            </button>
            <button
              onClick={() => setTechViewMode('einsatzzwecke')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                techViewMode === 'einsatzzwecke'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 size={13} /> 3 Bautechnische Einsatzzwecke
            </button>
            <button
              onClick={() => setTechViewMode('daten')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                techViewMode === 'daten'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <HardDrive size={13} /> Datenanforderungen &amp; Latenz
            </button>
            <button
              onClick={() => setTechViewMode('grenzen')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                techViewMode === 'grenzen'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <AlertTriangle size={13} /> Risiken &amp; Ingenieur-Pflichten
            </button>
          </div>
        </div>

        {/* Dynamic Detail Content Rendering based on techViewMode */}
        {techViewMode === 'funktionsweise' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Zap size={14} className="text-shiraz" />
                <span>Schrittweiser technischer Berechnungsablauf</span>
              </h5>
              <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                {currentTech.mechanismus.intro}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {currentTech.mechanismus.steps.map((st: { step: string; desc: string; formula?: string }, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1.5">
                    <span className="text-xs font-bold text-slate-800 block">{st.step}</span>
                    <p className="text-[11px] text-text-main/70 leading-relaxed">{st.desc}</p>
                    {st.formula && (
                      <div className="my-2 p-2 bg-slate-50 rounded border border-slate-200 text-center font-mono text-xs overflow-x-auto">
                        <BlockMath math={st.formula} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Special Interactive Demonstrator for RAG */}
            {selectedTech === 'rag' && (
              <div className="pt-2">
                <RagDemonstrator />
              </div>
            )}
          </div>
        )}

        {techViewMode === 'einsatzzwecke' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentTech.einsatzzwecke.map((ez, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-shiraz bg-shiraz/5 px-2 py-0.5 rounded border border-shiraz/10">
                      {ez.bereich}
                    </span>
                    <h5 className="text-xs font-bold text-slate-800 leading-snug">{ez.titel}</h5>
                    <p className="text-[11px] text-text-main/70 leading-relaxed">{ez.beschreibung}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 text-[10.5px] font-mono text-slate-600 bg-white p-2 rounded border border-slate-150">
                    <span className="font-bold text-slate-700 block">Ergebnis:</span>
                    {ez.output}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {techViewMode === 'daten' && (
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-4 animate-in fade-in duration-200">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <HardDrive size={14} className="text-slate-600" />
              <span>Technische System- &amp; Datenanforderungen</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Input-Datenformat</span>
                <span className="font-mono text-slate-800 text-[11px] leading-tight block">
                  {currentTech.datenanforderungen.inputFormat}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Erforderliches Datenvolumen</span>
                <span className="font-mono text-slate-800 text-[11px] leading-tight block">
                  {currentTech.datenanforderungen.datenvolumen}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Inferenzzeit / Latenz</span>
                <span className="font-mono text-emerald-800 font-bold text-[11px] leading-tight block">
                  {currentTech.datenanforderungen.latenz}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Empfohlene Rechenhardware</span>
                <span className="font-mono text-slate-800 text-[11px] leading-tight block">
                  {currentTech.datenanforderungen.hardware}
                </span>
              </div>
            </div>
          </div>
        )}

        {techViewMode === 'grenzen' && (
          <div className="p-5 bg-rose-50/50 rounded-xl border border-rose-200/80 space-y-3 animate-in fade-in duration-200">
            <h5 className="text-xs font-bold text-rose-900 uppercase tracking-wide flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-rose-700" />
              <span>Sicherheitsrelevante Risiken &amp; Ingenieur-Pflichten</span>
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-white rounded-xl border border-rose-200 space-y-1.5">
                <span className="font-bold text-rose-950 block flex items-center gap-1">
                  🚨 Spezifisches Fehlerrisiko
                </span>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  {currentTech.grenzen.risiko}
                </p>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-emerald-200 space-y-1.5">
                <span className="font-bold text-emerald-950 block flex items-center gap-1">
                  🛡️ Notwendige Ingenieur-Maßnahme
                </span>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  {currentTech.grenzen.massnahme}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. VERGLEICHENDE SYSTEMARCHITEKTUR-MATRIX */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
        <h3 className="text-base font-bold text-text-main flex items-center gap-2">
          <Scale className="text-shiraz" size={18} />
          <span>Vergleichende Systemarchitektur-Matrix der Bau-KI</span>
        </h3>
        <p className="text-xs text-text-main/70">
          Direkter Vergleich aller 7 Schlüsseltechnologien nach Rechenaufwand, Latenz, Datenstruktur und bautechnischem Haupteinsatz.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-home-grau/20 text-slate-500 font-extrabold uppercase text-[9.5px]">
                <th className="py-2.5 px-3">Technologie</th>
                <th className="py-2.5 px-3">Mathematische Basis</th>
                <th className="py-2.5 px-3">Inferenz-Latenz</th>
                <th className="py-2.5 px-3">Hardware-Bedarf</th>
                <th className="py-2.5 px-3">Fehlerrisiko</th>
                <th className="py-2.5 px-3">Primärer Baustelleneinsatz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-home-grau/10 text-slate-700 text-[11px]">
              <tr className="hover:bg-off-white transition-colors">
                <td className="py-2.5 px-3 font-bold text-slate-900">Classical ML</td>
                <td className="py-2.5 px-3 font-mono">Regression, MSE, Bäume</td>
                <td className="py-2.5 px-3 font-mono text-emerald-700 font-semibold">&lt; 1 ms</td>
                <td className="py-2.5 px-3">CPU (Standard)</td>
                <td className="py-2.5 px-3 text-amber-700">Extrapolationsfehler</td>
                <td className="py-2.5 px-3">Beton-Druckfestigkeit, CPT-Setzung</td>
              </tr>
              <tr className="hover:bg-off-white transition-colors">
                <td className="py-2.5 px-3 font-bold text-slate-900">Deep Learning</td>
                <td className="py-2.5 px-3 font-mono">MLP, CNN, Backpropagation</td>
                <td className="py-2.5 px-3 font-mono text-emerald-700 font-semibold">2–50 ms</td>
                <td className="py-2.5 px-3">GPU (CUDA)</td>
                <td className="py-2.5 px-3 text-amber-700">Black-Box-Intransparenz</td>
                <td className="py-2.5 px-3">FE-Surrogatstatik, Topologie</td>
              </tr>
              <tr className="hover:bg-off-white transition-colors">
                <td className="py-2.5 px-3 font-bold text-slate-900">LLM &amp; Transformer</td>
                <td className="py-2.5 px-3 font-mono">Self-Attention, BPE</td>
                <td className="py-2.5 px-3 font-mono text-amber-700">1–10 s</td>
                <td className="py-2.5 px-3">High-End GPU / Cloud</td>
                <td className="py-2.5 px-3 text-rose-700 font-semibold">Halluzination von Werten</td>
                <td className="py-2.5 px-3">Bedenkenanzeigen, Normensynopse</td>
              </tr>
              <tr className="hover:bg-off-white transition-colors">
                <td className="py-2.5 px-3 font-bold text-slate-900">RAG-Systeme</td>
                <td className="py-2.5 px-3 font-mono">Kosinus-Distanz, HNSW</td>
                <td className="py-2.5 px-3 font-mono text-emerald-700">1–3 s</td>
                <td className="py-2.5 px-3">NVMe SSD + Server</td>
                <td className="py-2.5 px-3 text-amber-700">Chunking-Informationsverlust</td>
                <td className="py-2.5 px-3">Normenbibliothek, Zulassungsfinder</td>
              </tr>
              <tr className="hover:bg-off-white transition-colors">
                <td className="py-2.5 px-3 font-bold text-slate-900">Computer Vision</td>
                <td className="py-2.5 px-3 font-mono">Faltungskerne, ViT, U-Net</td>
                <td className="py-2.5 px-3 font-mono text-emerald-700">30 ms – 1 min</td>
                <td className="py-2.5 px-3">GPU-Cluster / Edge-Chip</td>
                <td className="py-2.5 px-3 text-amber-700">Schatten-/Verschmutzungsfehler</td>
                <td className="py-2.5 px-3">DIN 1076 Rissvermessung, BIM-Abgleich</td>
              </tr>
              <tr className="hover:bg-off-white transition-colors">
                <td className="py-2.5 px-3 font-bold text-slate-900">Autonome Agenten</td>
                <td className="py-2.5 px-3 font-mono">ReAct, JSON-Tool-Calling</td>
                <td className="py-2.5 px-3 font-mono text-amber-700">10 s – 3 min</td>
                <td className="py-2.5 px-3">API-Schnittstellen</td>
                <td className="py-2.5 px-3 text-rose-700 font-semibold">Endlosschleifen / Fehlaufrufe</td>
                <td className="py-2.5 px-3">Stahlbau-Vorbemessung, AVA-GAEB</td>
              </tr>
              <tr className="hover:bg-off-white transition-colors">
                <td className="py-2.5 px-3 font-bold text-slate-900">Lokale Edge-KI</td>
                <td className="py-2.5 px-3 font-mono">GGUF, 4-Bit-Quantisierung</td>
                <td className="py-2.5 px-3 font-mono text-emerald-700">15–60 Tok/s</td>
                <td className="py-2.5 px-3">Lokale Workstation (VRAM)</td>
                <td className="py-2.5 px-3 text-slate-600">Begrenzte Modellgröße</td>
                <td className="py-2.5 px-3">100% Datenschutz, Tunnelbau offline</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. STANDARDISIERTER FOOTER GEMÄSS RULE[GEMINI_md] */}
      <ModuleFooter
        wikipedia={[
          { title: 'Künstliche Intelligenz', url: 'https://de.wikipedia.org/wiki/K%C3%BCnstliche_Intelligenz' },
          { title: 'Künstliches neuronales Netz', url: 'https://de.wikipedia.org/wiki/K%C3%BCnstliches_neuronales_Netz' },
          { title: 'Transformer (Maschinelles Lernen)', url: 'https://de.wikipedia.org/wiki/Transformer_(Maschinelles_Lernen)' },
          { title: 'Computer Vision', url: 'https://de.wikipedia.org/wiki/Computer_Vision' }
        ]}
        literatur={[
          'König, M. et al.: Bauinformatik – Innovative Methoden für Planung, Bau und Betrieb (Springer Vieweg)',
          'Goodfellow, I., Bengio, Y., Courville, A.: Deep Learning (MIT Press)',
          'Vaswani, A. et al.: Attention Is All You Need (Advances in Neural Information Processing Systems)',
          'Wendehorst Baustoffkunde: Werkstoffe, Prüfung und Dauerhaftigkeit (37. Auflage, Springer Vieweg)'
        ]}
        regelwerke={[
          { title: 'DIN EN 1990 (Eurocode 0: Grundlagen der Tragwerksplanung)' },
          { title: 'DIN EN 1992-1-1 (Eurocode 2: Bemessung und Konstruktion von Stahlbeton- und Spannbetontragwerken)' },
          { title: 'VOB/B: Vergabe- und Vertragsordnung für Bauleistungen – Teil B' },
          { title: 'EU Artificial Intelligence Act (Verordnung (EU) 2024/1689 des Europäischen Parlaments)', url: 'https://eur-lex.europa.eu/' }
        ]}
        formeln={[
          {
            formel: 'L_{\\text{MSE}} = \\frac{1}{N} \\sum_{i=1}^{N} \\left( y_i - \\hat{y}_i \\right)^2',
            erklaerung: 'Mittlerer quadratischer Fehler (MSE) als fundamentale Verlustfunktion im überwachten Lernen für baustoffliche Regressionsmodelle.',
            quelle: 'Maschinelles Lernen in der Baustoffprüfung'
          },
          {
            formel: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} \\right) V',
            erklaerung: 'Scaled Dot-Product Attention: Mathematischer Kern der Transformer-Architektur in modernen Large Language Models.',
            quelle: 'Vaswani et al. 2017'
          },
          {
            formel: '\\cos(\\theta) = \\frac{\\mathbf{A} \\cdot \\mathbf{B}}{\\|\\mathbf{A}\\| \\|\\mathbf{B}\\|}',
            erklaerung: 'Kosinus-Ähnlichkeit zur semantischen Vektorsuche im n-dimensionalen Raum für RAG-Systeme im Bauwesen.',
            quelle: 'Vektordatenbank-Retrieval'
          },
          {
            formel: 'a_j = \\sigma \\left( \\sum_{i} w_{ij} x_i + b_j \\right)',
            erklaerung: 'Aktivierungsberechnung eines künstlichen Neurons mit Gewichtsmatrix w, Eingangsvektor x, Bias b und nichtlinearer Aktivierung σ.',
            quelle: 'Neuronale Netze & FE-Surrogatmodelle'
          }
        ]}
      />
    </div>
  );
}
