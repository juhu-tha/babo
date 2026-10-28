import { Task } from '../aufgabenData';

export const digitalesTasks: Task[] = [
  {
    id: 't_ki_rag_architektur',
    difficulty: 'Mittel',
    title: 'KI im Bauwesen: Retrieval-Augmented Generation (RAG) für Bauvorschriften',
    question: 'Warum scheitern Standard-Large-Language-Models (LLMs) häufig an präzisen bautechnischen Fachfragen zu deutschen Normen (DIN, Eurocodes, VOB/C), und wie löst eine RAG-Architektur (Retrieval-Augmented Generation) dieses Problem?',
    moduleHint: { id: 'ki_baustoffe', name: 'KI im Bauwesen' },
    solution: '1. **Grenzen klassischer LLMs:**\n   - Trainings-Cutoff: Neue Normenänderungen (z.B. Eurocode-Reformen, neue GEG-Novellen) sind dem Basismodell nicht bekannt.\n   - Halluzinationen: Bei numerischen Tabellenwerten (z.B. w/z-Grenzwerte nach DIN 1045-2) erfinden Basis-LLMs oft plausibel klingende, aber falsche Zahlen.\n   - Urheberrecht: Vollständige DIN-Normtexte unterliegen dem Beuth/DIN Media-Copyright und befinden sich nicht im offenen Internet-Trainingskorpus.\n2. **Funktionsweise von RAG:**\n   - **Retrieval:** Bei einer Anfrage werden aus einer internen Vektordatenbank (Embedding-Suche) exakt die relevanten Abschnitte der verifizierten PDF-Normen oder statischen Richtlinien herausgesucht.\n   - **Augmentation & Generation:** Diese authentischen Textfragmente werden dem LLM zusammen mit der Frage in den Prompt übergeben. Das Modell generiert die Antwort strikt auf Basis dieser Primärquelle und zitiert die genaue Normstelle mit Absatz und Tabelle.'
  },
  {
    id: 't_ki_mcp_server',
    difficulty: 'Schwer',
    title: 'KI im Bauwesen: Model Context Protocol (MCP) & Werkzeuganbindung',
    question: 'Was ist das Model Context Protocol (MCP) und wie kann ein KI-Agent über einen MCP-Server mit bauspezifischen CAD/BIM- oder Statikprogrammen interagieren?',
    moduleHint: { id: 'ki_baustoffe', name: 'KI im Bauwesen' },
    solution: 'Das Model Context Protocol (MCP) ist ein offener Standard von Anthropic zur sicheren, standardisierten Verbindung von KI-Modellen mit externen Datenquellen und Software-Werkzeugen (Tools).\n**Funktion im Bauingenieurwesen:**\nEin lokaler MCP-Server kapselt z.B. die API eines Statikprogramms (wie RFEM/Dlubal oder SOFiSTiK) oder einer BIM-Software (Autodesk Revit). Stellt der Bauingenieur eine Frage wie "Berechnen Sie die Schnittgrößen für eine 20 cm dicke Decke mit 6 m Spannweite", ruft das LLM über das standardisierte MCP-JSON-RPC-Protokoll die Funktion `run_fem_analysis(span=6.0, d=0.20)` auf. Der MCP-Server führt die Finite-Elemente-Berechnung aus und liefert die exakten Verformungen und Biegemomente an die KI zurück.'
  },
  {
    id: 't_ki_prompt_engineering',
    difficulty: 'Leicht',
    title: 'KI im Bauwesen: Prompt Engineering & Systemprompts für Ingenieure',
    question: 'Welche vier strukturellen Elemente sollte ein professioneller "Prompt" für bautechnische Nachweise enthalten (Rolle, Kontext, Aufgabe, Formatbeschränkung)?',
    moduleHint: { id: 'ki_baustoffe', name: 'KI im Bauwesen' },
    solution: '1. **Rolle (Persona):** Zuweisung einer Fachidentität: z.B. *"Du bist ein erfahrener Prüfingenieur für Massivbau und Brandschutz nach Eurocode 2."*\n2. **Kontext (Projekt- & Bauteildaten):** Präzise Randbedingungen: z.B. *"Es handelt sich um einen Stahlbeton-Einfeldträger (b/h = 30/60 cm, L = 7,0 m, Beton C30/37, B500B, qk = 18 kN/m)."*\n3. **Aufgabe (Task):** Eindeutige Handlungsanweisung: z.B. *"Berechnen Sie die erforderliche Längsbewehrungsfläche As,erf für den Grenzzustand der Tragfähigkeit (ULS) nach DIN EN 1992-1-1."*\n4. **Formatbeschränkung (Output Constraints):** Klare Ausgabeformate: z.B. *"Gliedere die Lösung in 1. Schnittgrößen, 2. Bemessungsparameter, 3. Bewehrungsauswahl. Zeige alle Zwischenschritte mit Formel und Einheit in LaTeX."*'
  },
  {
    id: 't_bim_ifc_standard',
    difficulty: 'Mittel',
    title: 'Digitales Planen: IFC-Datenmodell & OpenBIM (DIN EN ISO 16739)',
    question: 'Was ist das IFC-Format (Industry Foundation Classes) und warum ist die native Modellierung in OpenBIM für den herstellerunabhängigen Datenaustausch im Bauwesen unverzichtbar?',
    moduleHint: { id: 'software', name: 'Bausoftware & BIM' },
    solution: 'IFC (DIN EN ISO 16739) ist ein offener, objektorientierter Datenstandard von buildingSMART zur herstellerneutralen Beschreibung digitaler Bauwerksmodelle.\n**Bedeutung für OpenBIM:**\nIn komplexen Bauprojekten arbeiten Architekten, Tragwerksplaner und TGA-Fachingenieure mit unterschiedlicher Spezialsoftware (z.B. Archicad, Allplan, Revit, Plancal). Proprietäre Formate führen zu Informationsverlusten oder zwingen zu teuren Monopol-Softwareketten. Über IFC werden semantische 3D-Objekte (z.B. `IfcWall`, `IfcBeam`, `IfcMaterial`) mit allen bauphysikalischen und geometrischen Attributen fehlerfrei verlustfrei zwischen den Fachdisziplinen ausgetauscht.'
  },
  {
    id: 't_bautagebuch_vob',
    difficulty: 'Leicht',
    title: 'Baustellenmanagement: Das rechtskonforme Bautagebuch nach VOB/B',
    question: 'Welche Mindestangaben muss ein Bautagebuch (Baustellenbericht) nach VOB/B § 4 enthalten, um im Streitfall vor Gericht als beweissicher anerkannt zu werden?',
    moduleHint: { id: 'px_bautagebuch', name: 'Bautagebuch' },
    solution: 'Das Bautagebuch dient der lückenlosen Beweissicherung des Bauablaufs. Mindestangaben:\n1. **Witterungsdaten:** Temperatur um 7:00, 12:00 und 17:00 Uhr, Niederschläge (Regen/Schnee in l/m² oder mm), Windstärke.\n2. **Personal- & Geräteeinsatz:** Anwesende Nachunternehmer mit Mannstärke nach Gewerken sowie Großgeräte (z.B. Krane, Bagger).\n3. **Ausgeführte Leistungen:** Konkrete Bauteile und Bauabschnitte (z.B. "Betonage Bodenplatte Achse A-D/1-4").\n4. **Besondere Vorkommnisse:** Baustellenbehinderungen, Bauzeitverzögerungen, Nachtragsankündigungen, Prüfungen (z.B. Lieferscheinkontrolle, Würfelprobenahmen).\n5. **Datum, Unterschrift des Bauleiters** und Gegenzeichnung durch die örtliche Bauüberwachung (Objektüberwachung / LPH 8).'
  },
  {
    id: 't_ki_vektor_cosine_similarity',
    difficulty: 'Schwer',
    title: 'Bauinformatik & KI: Mathematische Kosinus-Ähnlichkeit (Cosine Similarity) in Vektordatenbanken',
    question: 'In einem bürointernen RAG-System wird eine Suchanfrage des Tragwerksplaners q = (0,60; 0,80; 0,00) im reduzierten 3D-Embeddingraum mit zwei indizierten Normenabschnitten verglichen:\n- Dokument A (Eurocode 2 Betondeckung): d_A = (0,50; 0,70; 0,51)\n- Dokument B (VOB/B Bedenkenanmeldung): d_B = (0,80; 0,10; 0,59)\n\na) Berechnen Sie die Euklidischen Normen ||q||, ||d_A|| und ||d_B|| sowie die Skalarprodukte q · d_A und q · d_B.\nb) Ermitteln Sie die Kosinus-Ähnlichkeit cos(theta) für beide Dokumente.\nc) Welches Dokument wird vom Vektor-Retrieval als relevanter Kontext an das LLM übergeben?',
    moduleHint: { id: 'ki_system', name: 'Systemarchitektur' },
    solution: 'Berechnung der semantischen Richtungsähnlichkeit im Vektorraum:\n1. **Vektornormen ($\\|v\\| = \\sqrt{\\sum v_i^2}$):**\n   - $\\|q\\| = \\sqrt{0{,}60^2 + 0{,}80^2 + 0{,}00^2} = \\sqrt{0{,}36 + 0{,}64 + 0} = \\sqrt{1{,}00} = **1{,}000**$ (bereits normierter Einheitsvektor).\n   - $\\|d_A\\| = \\sqrt{0{,}50^2 + 0{,}70^2 + 0{,}51^2} = \\sqrt{0{,}25 + 0{,}49 + 0{,}2601} = \\sqrt{1{,}0001} \\approx **1{,}000**$.\n   - $\\|d_B\\| = \\sqrt{0{,}80^2 + 0{,}10^2 + 0{,}59^2} = \\sqrt{0{,}64 + 0{,}01 + 0{,}3481} = \\sqrt{0{,}9981} \\approx **0{,}999**$.\n2. **Skalarprodukte ($q \\cdot d = \\sum q_i \\cdot d_i$):**\n   - $q \\cdot d_A = (0{,}60 \\times 0{,}50) + (0{,}80 \\times 0{,}70) + (0{,}00 \\times 0{,}51) = 0{,}30 + 0{,}56 + 0 = **0{,}860**$.\n   - $q \\cdot d_B = (0{,}60 \\times 0{,}80) + (0{,}80 \\times 0{,}10) + (0{,}00 \\times 0{,}59) = 0{,}48 + 0{,}08 + 0 = **0{,}560**$.\n3. **Kosinus-Ähnlichkeiten ($\\cos(\\theta) = \\frac{q \\cdot d}{\\|q\\| \\cdot \\|d\\|}$):**\n   - $\\text{sim}(q, d_A) = \\frac{0{,}860}{1.000 \\times 1{,}000} = **0{,}860**$.\n   - $\\text{sim}(q, d_B) = \\frac{0{,}560}{1.000 \\times 0{,}999} = **0{,}561**$.\n4. **Ergebnis des RAG-Retrievers:**\n   Dokument A weist mit $\\mathbf{0{,}860}$ eine signifikant höhere Richtungsähnlichkeit auf als Dokument B ($0{,}561$). Die Vektordatenbank (z.B. Qdrant, Pinecone) stuft Dokument A auf Rang 1 ein und injiziert diesen Textabschnitt als verifizierten Kontext in den Prompt des LLMs.'
  }
];
