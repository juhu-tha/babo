# Prüfliste Quiz – Cluster V: Digitales & Infos

Stand: 27.10.2026 · Grundlage: `src/data/quiz.json` (Felder `vorpruefung` und `verified`), `docs/quiz-pruefhinweise.md`, Lernziele aus `src/data/lernziele.ts`. Erzeugt mit `npx tsx scripts/pruefliste.ts`; gesetzte Kreuze übernimmt das Skript beim nächsten Lauf. quiz.json wurde für diese Liste nicht verändert.

Cluster V umfasst 132 Fragen aus 22 Modulen. Aufgeführt sind 27 auffällige Fragen (Vorprüfung „korrigiert“ oder „fraglich“, offener Prüfhinweis oder neu seit 26.10.2026 ohne Freigabe) und eine Stichprobe von 5 unauffälligen Fragen. Entscheidung je Frage ankreuzen; bei „ändern“ den Änderungswunsch in die Zeile darunter schreiben.

Auffällig im Einzelnen (Mehrfachnennung möglich): 27 korrigiert, 0 fraglich, 0 mit offenem Prüfhinweis, 0 neu seit 26.10.2026.

## A. Auffällige Fragen

### q_dg_bim_2 · BIM für Baustoffe

- **Frage:** Wie sollten projektspezifische Eigenschaften, die es in IFC nicht als Standard-Pset gibt, benannt werden?
- **Richtige Antwort:** In einem eigenen Property-Set ohne Präfix Pset_, z. B. CPset_Umweltdaten
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_dg_db_2 · Materialdatenbanken

- **Frage:** Warum dürfen Dämmstoffe nicht pro m³ allein nach ihrem GWP verglichen werden?
- **Richtige Antwort:** Weil verschiedene λ-Werte verschiedene Dicken für denselben R-Wert erfordern
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_dg_mp_1 · Materialpässe

- **Frage:** Besteht in Deutschland (Stand 10/2026) eine gesetzliche Pflicht zum Gebäuderessourcenpass?
- **Richtige Antwort:** Nein; nur freiwillige Pässe (z. B. DGNB, Madaster), ein staatlicher ist angekündigt
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_dg_mp_2 · Materialpässe

- **Frage:** Warum sagt eine hohe massenbezogene Recyclingquote allein wenig über die Kreislauffähigkeit eines Gebäudes aus?
- **Richtige Antwort:** Weil mineralische Massen dominieren, die meist nur zu niederwertiger Gesteinskörnung werden
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_dpp_1 · Digitaler Produktpass (DPP)

- **Frage:** Welche zentrale Aufgabe erfüllt der Digitale Produktpass (DPP) im Lebenszyklus von Bauprodukten?
- **Richtige Antwort:** Er liefert maschinenlesbare Daten zu Material, Rezyklat und Schadstoffen
- **Auffälligkeit:** Vorprüfung „korrigiert“: Zweitprüfung 27.10.: Optionen in der Länge angeglichen, Absolutwort „ausschließlich“ entfernt, Rückmeldungen ergänzt korrigiert (Freigabe vom 28.09.2026 damit aufgehoben).
- [ ] ok
- [x] ändern: Optionen in der Länge angeglichen, „ausschließlich“ entfernt, Rückmeldungen ergänzt; bisherige Freigabe aufgehoben, korrigiert

### q_ki_bs_1 · KI in der Baustoffkunde

- **Frage:** Ein ML-Modell wurde mit w/z = 0,40 bis 0,65 trainiert. Wie belastbar ist eine Prognose für w/z = 0,30?
- **Richtige Antwort:** Nicht belastbar: Extrapolation außerhalb des Trainingsbereichs; Erstprüfung nötig
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_ki_bs_5 · KI in der Baustoffkunde

- **Frage:** Für dieselben Prognosefehler ist der RMSE größer als der MAE. Woran liegt das?
- **Richtige Antwort:** Große Abweichungen werden quadriert
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_ki_lk_2 · KI: Lokale KI (LM Studio)

- **Frage:** Ist ein lokal betriebenes Sprachmodell automatisch DSGVO-konform?
- **Richtige Antwort:** Nein: Drittlandtransfer entfällt, Zweckbindung, Löschkonzept und Zugriffsschutz bleiben
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_ki_re_1 · KI: Fehler, Recht & Ethik

- **Frage:** Ab wann gelten nach dem Digital Omnibus die Pflichten für Hochrisiko-KI-Systeme nach Anhang III?
- **Richtige Antwort:** Ab 02.12.2027
- **Auffälligkeit:** Vorprüfung „korrigiert“: Antwort bestätigt; Fundstelle VO (EU) 2026/1744 (ABl. 24.07.2026, in Kraft 27.07.2026) in der Erklärung ergänzt. · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_ki_sy_1 · KI: Systemarchitektur

- **Frage:** Was bewirkt Retrieval-Augmented Generation (RAG)?
- **Richtige Antwort:** Per Ähnlichkeitssuche gefundene Textabschnitte werden dem Prompt als Kontext beigefügt
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_ki_th_1 · KI: Tools für Thesen

- **Frage:** Ein KI-Tool findet 22 von 30 relevanten Artikeln. Was bedeutet der Recall von 0,73 für die Abschlussarbeit?
- **Richtige Antwort:** Gut ein Viertel der relevanten Literatur fehlt; ergänzende Suche ist nötig
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_ku_2 · Kuriositäten & Rekorde

- **Frage:** Was erklärt nach neueren Studien die Dauerhaftigkeit römischen Hafenbetons?
- **Richtige Antwort:** Im Meerwasser nachgewachsene Minerale (Al-Tobermorit, Phillipsit) und reaktive Kalkklasten
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_px_bl_2 · Bauleitung & Baustelle

- **Frage:** Welche Wirkung hat eine ordnungsgemäße schriftliche Bedenkenanmeldung des Auftragnehmers?
- **Richtige Antwort:** Haftungsfreiheit für Mängel, soweit sie auf die beanstandete Vorgabe zurückgehen
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_px_ka_1 · Karrierestart & Soft Skills

- **Frage:** Wofür wird der E-Schein (erweiterte betontechnologische Kenntnisse) nach DIN 1045-3 benötigt?
- **Richtige Antwort:** Leitung der ständigen Betonprüfstelle für Beton der ÜK 2
- **Auffälligkeit:** Vorprüfung „korrigiert“: Zweitprüfung 27.10.: ÜK 2 und 3 → ÜK 2 (DIN 1045-3:2023-08 kennt nur noch ÜK 1 und ÜK 2), normRef mit Ausgabe korrigiert. · Normenabgleich: DIN 1045-3:2023: DIN Media nennt DIN 1045-3:2023-08 → Ausgabe bestätigt
- [ ] ok
- [x] ändern: „ÜK 2 und 3“ → „ÜK 2“ (DIN 1045-3:2023), normRef mit Ausgabe, korrigiert

### q_px_pl_2 · Planung & Ausschreibung

- **Frage:** Was ist bei der Nennung eines Leitprodukts in einer öffentlichen Ausschreibung zu beachten?
- **Richtige Antwort:** Nur ausnahmsweise zulässig, mit Zusatz 'oder gleichwertig' und Kriterien dafür
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_px_pr_2 · Produktherstellung & QS

- **Frage:** Erstherstellung C30/37, drei Würfel: 41, 39, 43 N/mm². Sind die Konformitätskriterien erfüllt?
- **Richtige Antwort:** Ja: f_cm = 41 ≥ 37 + 4 und f_ci,min = 39 ≥ 37 − 4
- **Auffälligkeit:** Vorprüfung „korrigiert“: Zweitprüfung 27.10.: Rückmeldung zu Option 2: f_ck + 8 als Mittelwertbeziehung nach DIN EN 1992-1-1 statt als „Vorhaltemaß“ erklärt korrigiert.
- [ ] ok
- [x] ändern: Rückmeldung zu f_ck + 8 (Mittelwertbeziehung DIN EN 1992-1-1, kein Vorhaltemaß), korrigiert

### qn_bim_baustoffe_1 · BIM für Baustoffe

- **Frage:** Welche Aufgabe erfüllt die Entität IFCRELASSOCIATESMATERIAL im vom Attributgenerator erzeugten IFC-Code?
- **Richtige Antwort:** Sie verknüpft das Bauteil (IFCWALL) mit dem zugehörigen Materialset
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_bim_baustoffe_2 · BIM für Baustoffe

- **Frage:** Welche Zuordnung von Baustoffparametern zu Fachdisziplinen entspricht der Darstellung im Modul?
- **Richtige Antwort:** Tragwerk: Festigkeitsklasse, E-Modul; Bauphysik: λ, μ; LCA: GWP; FM: Wartungshinweise
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_dpp_3 · Digitaler Produktpass (DPP)

- **Frage:** Wie werden DPP-Daten nach der Darstellung im Modul technisch bereitgestellt?
- **Richtige Antwort:** Die Daten bleiben beim Hersteller und sind über eindeutige IDs und APIs abrufbar
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_ki_lokal_4 · Lokale KI (LM Studio)

- **Frage:** Ein Python-Skript soll den lokalen Server von LM Studio über die OpenAI-Bibliothek ansprechen. Welche Einstellung ist nach dem Modul richtig?
- **Richtige Antwort:** base_url = "http://localhost:1234/v1" mit beliebigem Platzhalter-Key
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_ki_prompting_1 · Prompting-Praxis

- **Frage:** Aus welchen vier Bausteinen setzt der Prompt-Generator des Moduls einen strukturierten Ingenieur-Prompt zusammen?
- **Richtige Antwort:** Baustoff, Zielsetzung/Rolle, Ausgabeformat und Tonalität
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_ki_prompting_3 · Prompting-Praxis

- **Frage:** Ein Modell hat 200 000 Token Kontext; Systemprompt 4 000 Token, Antwortreserve 16 000 Token. Ein Gutachten umfasst 180 Seiten à 750 Token. Welche Verarbeitung ist nach dem Modul angemessen?
- **Richtige Antwort:** Vollständig laden (Budget 240 Seiten), wichtige Stellen aber gezielt zitieren lassen
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_px_bauleitung_1 · Bauleitung & Baustelle

- **Frage:** Ein Fahrmischer trifft 105 Minuten nach der ersten Wasserzugabe ein; ein Verzögerer ist auf dem Lieferschein nicht vermerkt, eine Sondervereinbarung besteht nicht. Wie reagiert die Bauleitung nach dem Modul?
- **Richtige Antwort:** Beton ohne Vereinbarung zurückweisen und den Vorgang dokumentieren
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_px_bauleitung_3 · Bauleitung & Baustelle

- **Frage:** Welche Zuordnung von Anlass und Instrument nach VOB/B ist richtig?
- **Richtige Antwort:** Fehlende Vorleistung: Behinderungsanzeige (§ 6 Abs. 1); mangelhafte Vorgabe: Bedenkenanmeldung (§ 4 Abs. 3)
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen Zweitprüfung 27.10.: Rückmeldung zu Option 3 (Mängelrüge § 13 Abs. 5 durch den Auftraggeber) korrigiert.
- [ ] ok
- [x] ändern: Rückmeldung zur Mängelrüge (§ 13 Abs. 5, Auftraggeber) richtiggestellt, korrigiert

### qn_px_bautagebuch_2 · Bautagebuch

- **Frage:** Warum müssen im Bautagebuch die Tiefst- und Höchsttemperaturen jedes Tages eingetragen werden?
- **Richtige Antwort:** Weil nur so die ordnungsgemäße Überwachung bei Frost oder Hitze belegt werden kann
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen; normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_px_karriere_2 · Karrierestart & Soft Skills

- **Frage:** Für welches Tätigkeitsfeld ist nach dem Modul der SIVV-Schein die maßgebende Zusatzqualifikation?
- **Richtige Antwort:** Führungspersonal bei Schutz und Instandsetzung von Beton, z. B. Parkhäuser
- **Auffälligkeit:** Vorprüfung „korrigiert“: Zweitprüfung 27.10.: Überwachungsklasse 3 entfallen (DIN 1045-3:2023-08) – korrigiert.
- [ ] ok
- [ ] ändern: …

### qn_px_karriere_4 · Karrierestart & Soft Skills

- **Frage:** Woraus ergibt sich nach dem Modul die Pflicht zur beruflichen Fortbildung für Kammermitglieder im Ingenieurwesen?
- **Richtige Antwort:** Aus den Baukammerngesetzen der Länder
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

## B. Stichprobe unauffälliger Fragen (5)

Auswahl deterministisch (Sortierung nach FNV-1a-Hash der Frage-ID), damit die Stichprobe nachvollziehbar ist.

### qn_materialpaesse_1 · Materialpässe

- **Frage:** Ein Gebäude enthält 400 t Beton (r = 0,90), 30 t Stahl (r = 0,95), 10 t Holz (r = 0,50) und 5 t Verbundbauteile (r = 0). Welche massenbezogene Recyclingquote ergibt sich?
- **Richtige Antwort:** R_rec ≈ 88,4 %
- **Auffälligkeit:** keine – Vorprüfung „ok“
- [x] ok
- [ ] ändern: …

### qn_materialpaesse_4 · Materialpässe

- **Frage:** Ein Planer will im Urban Mining Lab sowohl den Circularity Indicator als auch den Urban-Mining-Restwert verbessern. Welche Maßnahme wirkt nach dem Rechenmodell auf beide Größen?
- **Richtige Antwort:** Von verklebter auf geschraubte Fügung wechseln
- **Auffälligkeit:** keine – Vorprüfung „ok“
- [x] ok
- [ ] ändern: …

### q_ki_ub_2 · KI: Überblick & Grundlagen

- **Frage:** Ein Foto bildet 1,20 m auf 4 000 Pixel ab. Kann eine KI darauf zuverlässig 0,2-mm-Risse erkennen?
- **Richtige Antwort:** Nein: 0,30 mm/px ist gröber als die Rissbreite; nötig wären etwa 0,10 mm/px
- **Auffälligkeit:** keine – Vorprüfung „ok“
- [x] ok
- [ ] ändern: …

### q_ki_ub_3 · KI: Überblick & Grundlagen

- **Frage:** Ein Modell soll Risse auf Fotos erkennen und wird dazu mit 5 000 von Fachleuten markierten Bildern trainiert. Welche Lernform ist das?
- **Richtige Antwort:** Überwachtes Lernen mit gelabelten Daten
- **Auffälligkeit:** keine – Vorprüfung „ok“
- [x] ok
- [ ] ändern: …

### q_ki_ub_1 · KI: Überblick & Grundlagen

- **Frage:** Eine Risserkennung findet 45 von 60 vorhandenen Rissen. Wie groß ist der Recall?
- **Richtige Antwort:** 0,75
- **Auffälligkeit:** keine – Vorprüfung „ok“
- [x] ok
- [ ] ändern: …

## C. Lernziel-Stichprobe (5 Module)

Quelle: `src/data/lernziele.ts`. Zu prüfen: Lernziele operationalisiert („Sie können …“ + beobachtbares Verb), Bloom-Stufe passend, fachlich richtig, mit den Modulinhalten und Quizfragen abgedeckt.

### online_tools · Online-Tools & Rechner

Niveau B/M · 60 min · Vorwissen: bauphysik, baustatik, oekobilanz_lca

- (Verstehen) Sie können kuratierte Online-Werkzeuge für Statik, Bauphysik, Holzbau, LCA und BIM nach Einsatzzweck, Zugangsart und hinterlegten Normen zuordnen.
- (Anwenden) Sie können die Ergebnisse eines Online-Stabwerkprogramms durch eine Handrechnung von Biegemoment und Durchbiegung eines Einfeldträgers nachrechnen.
- (Anwenden) Sie können den Bemessungswert einer Deckenlast aus charakteristischen ständigen und veränderlichen Lasten in der Grundkombination berechnen.
- (Analysieren) Sie können typische Fehlerquellen bei der Werkzeugnutzung wie Einheitenfehler, falsche Lagerbedingungen oder doppelt angesetzte Teilsicherheitsbeiwerte identifizieren.
- (Anwenden) Sie können bereitgestellte Python-Snippets zur Abfrage von EPD-Daten über eine REST-Schnittstelle oder zur Mengenermittlung aus IFC-Modellen ausführen und anpassen.

- [x] ok
- [ ] ändern: …

### materialpaesse · Materialpässe

Niveau B/M · 50 min · Vorwissen: bim_baustoffe, kreislauf_dpp

- (Verstehen) Sie können den Zweck und die Inhalte eines Materialpasses bzw. Gebäuderessourcenpasses (Massenbilanz, Rückbaubarkeit, Restwert) erläutern.
- (Anwenden) Sie können die massenbezogene Recyclingquote eines Gebäudes aus Stoffmassen und Verwertungsanteilen berechnen.
- (Anwenden) Sie können den Material Circularity Indicator eines Bauteils aus Rezyklatanteil, Verwertungsquote und Nutzungsfaktor berechnen.
- (Analysieren) Sie können den Einfluss von Bauweise, Recyclinganteil und Fügetechnik (geklebt, vermörtelt, geschraubt) auf Circularity Indicator und Urban-Mining-Restwert vergleichen.
- (Bewerten) Sie können begründen, warum eine hohe massenbezogene Recyclingquote durch Downcycling von Beton allein keinen kreislaufgerechten Entwurf belegt.

- [x] ok
- [ ] ändern: …

### ki_llmpraxis · LLM-Praxis

Niveau M · 75 min · Vorwissen: ki_prompting, ki_system

- (Verstehen) Sie können die Rollen von Systemprompt, Skill und MCP-Konnektor in einem LLM-Workflow unterscheiden.
- (Anwenden) Sie können einen Systemprompt mit Rollendefinition, Normbezug, Formatvorgaben und Halluzinationsverbot für eine ingenieurtechnische Aufgabe zusammenstellen.
- (Analysieren) Sie können den Tokenbedarf und die Kosten verschiedener Dokumentformate (Scan, PDF, Office, Markdown) mit dem Token-Kostenrechner vergleichen.
- (Anwenden) Sie können aus einer Stichprobe die Fehlerquote von KI-Normzitaten schätzen und die Trefferwahrscheinlichkeit eines Mehrheitsentscheids aus drei Abfragen berechnen.
- (Bewerten) Sie können für typische Büroaufgaben begründet auswählen, ob ein dokumenten- und code-orientierter LLM-Assistent, ein datenanalyse-orientierter Assistent, Websuche oder Code-Ausführung eingesetzt werden sollte.

- [x] ok
- [ ] ändern: …

### materialdatenbanken · Materialdatenbanken

Niveau B/M · 45 min · Vorwissen: oekobilanz_lca

- (Erinnern) Sie können Materialdatenbanken wie ÖKOBAUDAT, WECOBIS, GESTIS, DGNB Navigator, ecoinvent und EPD-Programmhalter mit ihrem Einsatzzweck benennen.
- (Verstehen) Sie können generische und herstellerspezifische Datensätze nach Herkunft, Verifizierung und Einsatz in den Leistungsphasen unterscheiden.
- (Anwenden) Sie können das flächenbezogene Treibhauspotenzial eines Bauteils aus Schichtdicke, Rohdichte und massebezogenem GWP-Wert der Module A1 bis A3 berechnen.
- (Analysieren) Sie können masse- und volumenbezogene Deklarationen auf eine gemeinsame funktionale Einheit umrechnen und Dämmstoffe bei gleichem Wärmedurchlasswiderstand vergleichen.

- [x] ok
- [ ] ändern: …

### ki_uebungen · Hands-on-Übungen (Master)

Niveau M · 360 min · Vorwissen: ki_ueberblick, ki_prompting, ki_system

- (Anwenden) Sie können für eine Büroaufgabe einen Prompt mit Rolle, Kontext, Aufgabe, Format und Regeln formulieren und mit einer naiven Anfrage vergleichen.
- (Anwenden) Sie können Retrieval-Augmented Generation ohne Programmierung nachbilden und jede Antwort mit der Fundstelle im bereitgestellten Regelwerkstext belegen lassen.
- (Analysieren) Sie können eine KI-Antwort auf erfundene Quellen, veraltete Normausgaben, falsche Grenzwerte und Rechenfehler untersuchen und die Fehlerbilder benennen.
- (Bewerten) Sie können ein vom KI-Assistenten erstelltes Rechenblatt mit Testfällen und einer unabhängigen Kontrollrechnung prüfen und über seine Verwendbarkeit entscheiden.
- (Bewerten) Sie können beurteilen, welche Schritte eines Agentenlaufs selbstständig ablaufen dürfen und welche eine menschliche Freigabe erfordern.

- [x] ok
- [ ] ändern: …
