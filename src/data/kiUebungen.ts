/**
 * Hands-on-Übungen zur Master-Vorlesung „Grundlagen für den Einsatz von Künstlicher Intelligenz im
 * Bauwesen – Möglichkeiten und Grenzen“ (Umsetzungsplan Phase 6, AP 6.5).
 *
 * Eine Übung je Themenblock, vollständig code-frei und für den KI-Assistenten der Hochschule
 * (an der THA derzeit über die Hochschullizenz bereitgestellt; Anmeldung mit dem Hochschulkonto) ausgelegt: keine API-Schlüssel, kein Gemini, keine Übermittlung
 * personenbezogener Daten. Alle Projektangaben in den Vorlagen sind fiktiv.
 * tests/kiUebungen.test.ts prüft Aufbau, Verweise und Datenschutzhinweise.
 */
import type { ModulId } from '../registry/modules';

export interface PromptVorlage {
  titel: string;
  /** Text zum Kopieren; Platzhalter in eckigen Klammern */
  text: string;
}

export interface KiUebung {
  id: string;
  /** Themenblock der Vorlesung */
  block: string;
  /** Kurzlabel für den Reiter */
  kurz: string;
  titel: string;
  ziel: string;
  /** Zeitbedarf in Minuten */
  minuten: number;
  material: readonly string[];
  schritte: readonly string[];
  prompts: readonly PromptVorlage[];
  erwartung: readonly string[];
  reflexion: readonly string[];
  checkliste: readonly string[];
  /** Theorie zum Block im BaustoffBoard */
  theorie: readonly { ziel: ModulId; label: string }[];
}

/** Gilt für alle Übungen; wird oberhalb der Übungen angezeigt. */
export const KI_UEBUNG_REGELN: readonly string[] = [
  'Werkzeug ist der KI-Assistent der Hochschule; er wird an der THA derzeit über die Hochschullizenz bereitgestellt. Melden Sie sich mit Ihrem Hochschulkonto an und achten Sie auf den Datenschutzhinweis im Chatfenster. Weitere Konten, API-Schlüssel oder Programmierkenntnisse sind nicht nötig.',
  'Geben Sie keine personenbezogenen Daten ein (Namen, Adressen, Fotos von Personen, Matrikelnummern) – auch nicht von Bauherren, Kolleginnen oder Kollegen.',
  'Fügen Sie keine vertraulichen Projektunterlagen aus Praktikum oder Werkstudententätigkeit ein. Alle Projektangaben in den Vorlagen sind fiktiv; ersetzen Sie sie nur durch ebenso fiktive Werte.',
  'Normen sind urheberrechtlich geschützt und lizenziert. Kopieren Sie keine Normvolltexte in den Chat, sondern höchstens kurze, selbst formulierte Zusammenfassungen oder frei zugängliche Rechtstexte (z. B. Landesbauordnung, GModG – vormals GEG –, EU-Verordnungen).',
  'KI-Antworten sind Entwürfe. Jede fachliche Aussage, Zahl und Quelle prüfen Sie selbst – dafür ist jeder Übung eine Verifikations-Checkliste beigefügt.',
];

export const KI_UEBUNGEN: readonly KiUebung[] = [
  {
    id: 'llm_grundlagen',
    block: 'Block 1 · LLM-Grundlagen',
    kurz: 'LLM-Grundlagen',
    titel: 'Wie „denkt“ ein Sprachmodell? Nichtdeterminismus, Wissensstand und Halluzination',
    ziel: 'Sie erleben an einer Fachfrage aus der Betontechnologie, dass ein Sprachmodell Text Wort für Wort nach Wahrscheinlichkeit erzeugt: Antworten schwanken, klingen sicher und können trotzdem falsch oder veraltet sein.',
    minuten: 45,
    material: [
      'KI-Assistent der Hochschule (Hochschulkonto)',
      'BaustoffBoard-Modul „Expositionsklassen“ oder eigene Vorlesungsunterlagen als Referenz',
      'Tabelle (Papier oder Excel) mit drei Spalten: Durchlauf 1, 2, 3',
    ],
    schritte: [
      'Öffnen Sie einen neuen Chat und stellen Sie die Fachfrage aus Vorlage 1 unverändert.',
      'Wiederholen Sie die Frage zweimal in jeweils einem neuen Chat. Notieren Sie Zahlenwerte, genannte Normen und Formulierungen der drei Antworten in Ihrer Tabelle.',
      'Stellen Sie im dritten Chat die Nachfrage aus Vorlage 2 zum Wissensstand und zur Quelle der Werte.',
      'Lassen Sie sich mit Vorlage 3 erklären, wie das Modell den nächsten Textbaustein (Token) auswählt, und vergleichen Sie die Erklärung mit der Systemarchitektur im BaustoffBoard.',
      'Gleichen Sie alle Zahlenwerte mit dem Modul „Expositionsklassen“ bzw. Ihren Unterlagen ab und markieren Sie Abweichungen.',
    ],
    prompts: [
      {
        titel: 'Vorlage 1 – Fachfrage',
        text: 'Sie sind Tragwerksplaner in Deutschland. Welche Mindestbetondeckung c_min,dur und welches Vorhaltemaß Δc_dev gelten für Bewehrung in einem Außenbauteil der Expositionsklasse XC4 nach Eurocode 2 mit deutschem Nationalen Anhang? Nennen Sie die Werte, die Norm mit Ausgabe und die Tabelle.',
      },
      {
        titel: 'Vorlage 2 – Wissensstand und Herkunft',
        text: 'Bis zu welchem Zeitpunkt reicht Ihr Trainingswissen? Haben Sie die Werte aus Ihrer vorigen Antwort aus einer Websuche oder aus dem Training? Kennzeichnen Sie jede Zahl als „geprüft aus Quelle“ oder „aus dem Gedächtnis“.',
      },
      {
        titel: 'Vorlage 3 – Funktionsweise',
        text: 'Erklären Sie einem Bauingenieurstudenten ohne Informatikkenntnisse in höchstens 200 Wörtern, wie ein großes Sprachmodell eine Antwort Token für Token erzeugt. Gehen Sie dabei auf Wahrscheinlichkeiten, Temperatur und den Grund für unterschiedliche Antworten auf dieselbe Frage ein.',
      },
    ],
    erwartung: [
      'Die drei Antworten unterscheiden sich mindestens in der Formulierung, häufig auch in Details wie Tabellennummer oder Normausgabe.',
      'Das Modell nennt einen Wissensstand und kann die Herkunft einzelner Werte meist nicht sicher belegen; ohne Websuche stammen die Werte aus dem Training.',
      'Die Erklärung enthält die Begriffe Token, Wahrscheinlichkeitsverteilung und Temperatur bzw. Zufallsauswahl.',
      'Mindestens ein Detail (Ausgabe, Tabelle oder Zahlenwert) muss mit der Referenz abgeglichen und ggf. korrigiert werden.',
    ],
    reflexion: [
      'Woran hätten Sie ohne Referenz erkennen können, dass ein Wert unsicher ist?',
      'Warum ist eine flüssige, selbstsichere Formulierung kein Qualitätsmerkmal?',
      'Welche Aufgaben im Ingenieurbüro vertragen schwankende Antworten, welche nicht?',
    ],
    checkliste: [
      'Jeder Zahlenwert ist mit Norm, Ausgabe und Tabelle aus einer eigenen Quelle bestätigt.',
      'Die genannte Normausgabe ist die aktuell bauaufsichtlich eingeführte (MVV TB beachten).',
      'Abweichungen zwischen den drei Durchläufen sind dokumentiert.',
      'Die Antwort unterscheidet erkennbar zwischen belegten und erinnerten Angaben.',
    ],
    theorie: [
      { ziel: 'ki_ueberblick', label: 'Überblick & Grundlagen' },
      { ziel: 'ki_system', label: 'Systemarchitektur' },
      { ziel: 'expositionsklassen', label: 'Expositionsklassen' },
    ],
  },
  {
    id: 'prompting_buero',
    block: 'Block 2 · Prompting im Ingenieurbüro',
    kurz: 'Prompting',
    titel: 'Vom Stichwortzettel zur Bedenkenanzeige: strukturierte Prompts im Büroalltag',
    ziel: 'Sie formulieren für eine typische Büroaufgabe einen Prompt mit Rolle, Kontext, Aufgabe und Format, vergleichen ihn mit einer naiven Anfrage und lassen das Modell gezielt Rückfragen stellen.',
    minuten: 60,
    material: [
      'KI-Assistent der Hochschule (Hochschulkonto)',
      'fiktiver Sachverhalt aus Vorlage 1 (keine echten Projektdaten)',
      'BaustoffBoard-Module „Prompting-Praxis“ und „Planung & Ausschreibung“',
    ],
    schritte: [
      'Senden Sie zuerst die naive Anfrage aus Vorlage 1 und speichern Sie die Antwort (Kopie in ein Dokument).',
      'Öffnen Sie einen neuen Chat und senden Sie den strukturierten Prompt aus Vorlage 2.',
      'Beantworten Sie die Rückfragen des Modells mit fiktiven, plausiblen Angaben.',
      'Lassen Sie den Entwurf mit Vorlage 3 gegen eine eigene Kriterienliste prüfen und überarbeiten.',
      'Vergleichen Sie naive und strukturierte Fassung anhand der Checkliste und notieren Sie drei Unterschiede.',
    ],
    prompts: [
      {
        titel: 'Vorlage 1 – naive Anfrage',
        text: 'Schreib eine Bedenkenanzeige wegen zu nassem Estrich.',
      },
      {
        titel: 'Vorlage 2 – strukturierter Prompt',
        text: `ROLLE: Sie sind Bauleiter eines ausführenden Bodenlegerbetriebs in Bayern.
KONTEXT (fiktiv): Bauvorhaben „Wohnanlage Musterstraße“, Zementestrich CT-C25-F4, 65 mm, eingebaut vor 18 Tagen. Die CM-Messung ergab 3,1 CM-%; vereinbart ist Parkettverlegung in 5 Tagen.
AUFGABE: Entwerfen Sie eine Bedenkenanzeige an den Auftraggeber nach VOB/B § 4 Abs. 3.
FORMAT: sachlicher Geschäftsbrief, höchstens eine Seite, mit Betreff, Sachverhalt, Bedenken, Vorschlag zum weiteren Vorgehen und Bitte um Entscheidung bis zu einem Datum.
REGELN: Erfinden Sie keine Grenzwerte. Wenn Ihnen für einen Grenzwert die Quelle fehlt, setzen Sie [PRÜFEN] ein. Stellen Sie mir vor dem Schreiben bis zu drei Rückfragen.`,
      },
      {
        titel: 'Vorlage 3 – Selbstprüfung',
        text: 'Prüfen Sie Ihren Entwurf Punkt für Punkt: (1) Ist der Sachverhalt vollständig und ohne Wertung? (2) Sind alle Zahlen aus meinem Kontext übernommen und keine neuen erfunden? (3) Ist eine Entscheidung des Auftraggebers mit Frist erbeten? (4) Fehlt eine rechtlich relevante Angabe? Geben Sie eine Tabelle Kriterium | erfüllt ja/nein | Korrektur aus und danach die überarbeitete Fassung.',
      },
    ],
    erwartung: [
      'Die naive Fassung ist allgemein gehalten, nennt oft erfundene Messwerte oder Grenzwerte und lässt Adressat und Frist offen.',
      'Die strukturierte Fassung übernimmt die Kontextangaben, ist als Brief gegliedert und markiert unsichere Grenzwerte mit [PRÜFEN].',
      'Die Rückfragen betreffen z. B. Bodenbelag, Heizestrich ja/nein oder vereinbarte Belegreife.',
      'Die Selbstprüfung findet mindestens eine Lücke, ersetzt aber nicht Ihre eigene Prüfung.',
    ],
    reflexion: [
      'Welche Prompt-Bestandteile hatten den größten Einfluss auf die Qualität?',
      'Welche Angaben dürfen Sie in einem echten Projekt nicht in einen Cloud-Assistenten eingeben?',
      'Wer trägt die Verantwortung für den Inhalt des Schreibens, wenn es abgeschickt wird?',
    ],
    checkliste: [
      'Alle Zahlen stammen aus dem eigenen Kontext oder sind mit [PRÜFEN] markiert.',
      'Grenzwerte zur Belegreife sind mit einer eigenen, aktuellen Quelle belegt.',
      'Rechtsbezug (VOB/B § 4 Abs. 3) ist zutreffend zitiert und nicht ausgeschmückt.',
      'Der Brief enthält keine echten Namen, Adressen oder Projektdaten.',
    ],
    theorie: [
      { ziel: 'ki_prompting', label: 'Prompting-Praxis' },
      { ziel: 'px_planung', label: 'Planung & Ausschreibung' },
    ],
  },
  {
    id: 'agenten',
    block: 'Block 3 · Agenten',
    kurz: 'Agenten',
    titel: 'Agent von Hand: Planen – Handeln – Beobachten bei einer Baustoffrecherche',
    ziel: 'Sie spielen die Schleife eines KI-Agenten selbst durch: Das Modell plant und wählt Werkzeuge, Sie führen die Werkzeugaufrufe aus und melden die Beobachtungen zurück. So erkennen Sie, wo Agenten Zeit sparen und wo sie Freigaben brauchen.',
    minuten: 60,
    material: [
      'KI-Assistent der Hochschule (Hochschulkonto), Websuche im Assistenten erlaubt',
      'BaustoffBoard-Module „Sonderbetone“ (Recyclingbeton) und „Kreislaufwirtschaft & DPP“ als „Werkzeug“ zum Nachschlagen',
      'Protokollblatt mit den Spalten Schritt | Gedanke | Aktion | Beobachtung',
    ],
    schritte: [
      'Starten Sie den Agentenlauf mit Vorlage 1. Das Modell darf nur eine Aktion je Antwort vorschlagen.',
      'Führen Sie die vorgeschlagene Aktion selbst aus (z. B. im BaustoffBoard nachschlagen) und melden Sie das Ergebnis mit Vorlage 2 zurück.',
      'Wiederholen Sie Schritt 2 höchstens sechsmal und füllen Sie dabei das Protokollblatt aus.',
      'Brechen Sie ab, sobald das Modell eine Aktion vorschlägt, die eine Freigabe bräuchte (z. B. E-Mail an einen Hersteller), und notieren Sie diese Stelle.',
      'Lassen Sie mit Vorlage 3 ein Ergebnisprotokoll erstellen und bewerten Sie den Ablauf.',
    ],
    prompts: [
      {
        titel: 'Vorlage 1 – Agentenauftrag',
        text: `Sie arbeiten als Rechercheagent für ein Ingenieurbüro. ZIEL: Klären Sie, ob für eine Innenwand (XC1) eines Bürogebäudes in Bayern Recyclingbeton mit rezyklierter Gesteinskörnung Typ 1 eingesetzt werden darf und welche Grenzen gelten.
WERKZEUGE (führt der Mensch für Sie aus): [WEBSUCHE: Suchbegriff], [NACHSCHLAGEN: BaustoffBoard-Modul], [RÜCKFRAGE: Frage an mich].
ABLAUF: Antworten Sie in jeder Runde nur mit GEDANKE (ein Satz), AKTION (genau ein Werkzeug) und warten Sie dann auf meine BEOBACHTUNG. Erst wenn das Ziel erreicht ist, antworten Sie mit ERGEBNIS.
GRENZEN: Keine Aktionen, die Dritte kontaktieren oder Geld kosten.`,
      },
      {
        titel: 'Vorlage 2 – Beobachtung zurückmelden',
        text: 'BEOBACHTUNG: [Fassen Sie hier in eigenen Worten zusammen, was Sie gefunden haben, mit Quelle.] Bitte nächste Runde.',
      },
      {
        titel: 'Vorlage 3 – Ergebnisprotokoll',
        text: 'Fassen Sie den Lauf als Tabelle Schritt | Aktion | Beobachtung | Schlussfolgerung zusammen. Kennzeichnen Sie, welche Schlussfolgerungen auf einer geprüften Quelle beruhen und welche noch offen sind.',
      },
    ],
    erwartung: [
      'Das Modell zerlegt das Ziel in Teilfragen (Regelwerk, Anteil rezyklierter Gesteinskörnung, Expositionsklasse) und wählt passende Werkzeuge.',
      'Ohne Beobachtungen neigt das Modell dazu, Ergebnisse vorwegzunehmen – genau hier zeigt sich der Nutzen echter Werkzeugaufrufe.',
      'Spätestens bei Herstelleranfragen oder Bestellungen ist eine menschliche Freigabe nötig.',
      'Das Ergebnisprotokoll trennt belegte von offenen Schlussfolgerungen.',
    ],
    reflexion: [
      'Welche Schritte des Laufs könnte ein echter Agent sinnvoll selbstständig ausführen?',
      'Welche Berechtigungen (Lesen, Schreiben, Senden) würden Sie einem Büroagenten geben und welche nicht?',
      'Wie würden Sie im Büro nachvollziehbar dokumentieren, was ein Agent getan hat?',
    ],
    checkliste: [
      'Jede Beobachtung im Protokoll ist mit einer Quelle versehen.',
      'Das Endergebnis nennt das maßgebliche Regelwerk mit Ausgabe.',
      'Kein Schritt hat Dritte kontaktiert oder Daten außerhalb des Chats verändert.',
      'Offene Punkte sind als solche gekennzeichnet und nicht als Ergebnis ausgegeben.',
    ],
    theorie: [
      { ziel: 'ki_system', label: 'Systemarchitektur (Agenten)' },
      { ziel: 'ki_llmpraxis', label: 'LLM-Praxis (Konnektoren)' },
      { ziel: 'sonderbetone', label: 'Sonderbetone (Recyclingbeton)' },
      { ziel: 'kreislauf_dpp', label: 'Kreislaufwirtschaft & DPP' },
    ],
  },
  {
    id: 'rag_normtexte',
    block: 'Block 4 · RAG mit Normtexten',
    kurz: 'RAG',
    titel: 'RAG von Hand: Antworten nur aus einem bereitgestellten Regelwerkstext',
    ziel: 'Sie bilden Retrieval-Augmented Generation ohne Programmierung nach: Ein kurzer, frei zugänglicher Regelwerksauszug wird zur einzigen Wissensbasis, und das Modell muss jede Aussage mit der Fundstelle belegen oder „nicht im Text“ antworten.',
    minuten: 60,
    material: [
      'KI-Assistent der Hochschule (Hochschulkonto)',
      'frei zugänglicher Rechtstext, z. B. ein bis zwei Artikel der Bayerischen Bauordnung (gesetze-bayern.de) oder ein Paragraf des GModG (vormals GEG; z. B. buzer.de) – keine DIN-Volltexte',
      'Liste mit fünf eigenen Fragen, davon mindestens eine, die der Auszug nicht beantwortet',
    ],
    schritte: [
      'Wählen Sie einen frei zugänglichen Auszug von höchstens etwa zwei Seiten und kopieren Sie ihn in die Vorlage 1 (Platzhalter [TEXT]).',
      'Senden Sie Vorlage 1 und prüfen Sie, ob das Modell die Spielregeln bestätigt.',
      'Stellen Sie Ihre fünf Fragen einzeln mit Vorlage 2. Notieren Sie für jede Antwort die angegebene Fundstelle.',
      'Stellen Sie mit Vorlage 3 bewusst eine Frage, deren Antwort nicht im Auszug steht, die das Modell aber aus dem Training kennen könnte.',
      'Kontrollieren Sie jede Fundstelle im Originaltext und bewerten Sie Treffer, Fehlzitate und unzulässiges Weltwissen.',
    ],
    prompts: [
      {
        titel: 'Vorlage 1 – Wissensbasis festlegen',
        text: `Für dieses Gespräch gilt ausschließlich der folgende Text als Wissensbasis. Beantworten Sie Fragen nur daraus. Zitieren Sie zu jeder Aussage die Fundstelle (Artikel/Paragraf, Absatz, Satz). Steht die Antwort nicht im Text, antworten Sie genau: „Nicht im bereitgestellten Text enthalten.“ Bestätigen Sie diese Regeln in einem Satz.

[TEXT]`,
      },
      {
        titel: 'Vorlage 2 – Frage mit Beleg',
        text: 'FRAGE: [Ihre Frage]. Antworten Sie in höchstens drei Sätzen und nennen Sie danach die Fundstelle mit wörtlichem Kurzzitat (höchstens 20 Wörter).',
      },
      {
        titel: 'Vorlage 3 – Grenztest',
        text: 'FRAGE: [Eine Frage, deren Antwort nicht im Auszug steht, z. B. nach einem Wert aus einer anderen Vorschrift.] Halten Sie sich an die vereinbarten Regeln.',
      },
    ],
    erwartung: [
      'Fragen, die der Auszug beantwortet, werden mit zutreffender Fundstelle beantwortet; Kurzzitate stimmen wörtlich.',
      'Beim Grenztest antwortet ein gut geführtes Modell mit „Nicht im bereitgestellten Text enthalten.“ – mischt es Trainingswissen bei, ist das ein typischer RAG-Fehler.',
      'Bei längeren Gesprächen lässt die Regeltreue nach; ein erneuter Hinweis auf die Regeln stellt sie meist wieder her.',
      'Sie können erklären, was eine echte RAG-Anwendung zusätzlich leistet (Zerlegung in Abschnitte, Vektorsuche, Auswahl der passenden Abschnitte).',
    ],
    reflexion: [
      'Warum ist die Fundstelle wichtiger als die Antwort selbst?',
      'Welche Probleme entstehen, wenn die Wissensbasis eine veraltete Fassung enthält?',
      'Weshalb dürfen lizenzierte Normen nicht ohne Weiteres in Cloud-Dienste geladen werden, und welche Alternativen gibt es (Lizenzmodell, lokale KI)?',
    ],
    checkliste: [
      'Jede Fundstelle wurde im Originaltext aufgeschlagen und stimmt.',
      'Wörtliche Zitate sind tatsächlich wörtlich.',
      'Die Fassung des Rechtstexts (Stand/Datum) ist notiert.',
      'Es wurden keine lizenzierten Normvolltexte in den Chat kopiert.',
    ],
    theorie: [
      { ziel: 'ki_system', label: 'Systemarchitektur (RAG)' },
      { ziel: 'ki_lokal', label: 'Lokale KI' },
      { ziel: 'regularien', label: 'Regularien' },
    ],
  },
  {
    id: 'programmieren_lassen',
    block: 'Block 5 · „sich programmieren lassen“',
    kurz: 'Programmieren lassen',
    titel: 'Ein Rechenblatt bauen lassen, ohne selbst zu programmieren: U-Wert in Excel',
    ziel: 'Sie lassen sich vom KI-Assistenten ein Excel-Rechenblatt für den U-Wert einer mehrschichtigen Wand erstellen, schreiben dafür zuerst ein kurzes Lastenheft und prüfen das Ergebnis mit Testfällen und einer unabhängigen Kontrollrechnung.',
    minuten: 75,
    material: [
      'KI-Assistent der Hochschule (Hochschulkonto) und Excel (Microsoft 365 der Hochschule)',
      'BaustoffBoard-Beispielrechnung „U-Wert“ bzw. Modul „Bauphysik“ als Kontrollrechnung',
      'Testfall: Innenputz 1,5 cm (λ = 0,51 W/(m·K)), Kalksandstein 17,5 cm (λ = 0,99 W/(m·K)), Wärmedämmung 16 cm (λ = 0,035 W/(m·K)), R_si = 0,13 und R_se = 0,04 m²·K/W',
    ],
    schritte: [
      'Formulieren Sie mit Vorlage 1 ein Lastenheft: Eingaben, Rechenweg, Ausgaben, Einheiten, Grenzfälle.',
      'Lassen Sie sich mit Vorlage 2 den Tabellenaufbau mit allen Excel-Formeln Zelle für Zelle beschreiben und übertragen Sie ihn in eine leere Arbeitsmappe.',
      'Geben Sie den Testfall ein und vergleichen Sie das Ergebnis mit der Kontrollrechnung im BaustoffBoard.',
      'Testen Sie die Grenzfälle aus Vorlage 3 (Dicke 0, λ = 0, Text statt Zahl) und lassen Sie Fehlermeldungen ergänzen.',
      'Dokumentieren Sie Werkzeug, Datum und Ihre Prüfschritte in einem Kopfbereich des Blatts.',
    ],
    prompts: [
      {
        titel: 'Vorlage 1 – Lastenheft',
        text: 'Ich möchte ein Excel-Rechenblatt für den Wärmedurchgangskoeffizienten U einer Wand aus bis zu 6 homogenen Schichten nach DIN EN ISO 6946. Stellen Sie mir zuerst bis zu fünf Rückfragen und formulieren Sie danach ein Lastenheft mit Eingaben (Schicht, Dicke in m, λ in W/(m·K)), Rechenweg, Ausgaben (R_T, U) mit Einheiten und Grenzfällen. Noch keine Formeln.',
      },
      {
        titel: 'Vorlage 2 – Tabellenaufbau',
        text: 'Setzen Sie das Lastenheft als Excel-Tabelle um. Geben Sie eine Tabelle Zelle | Inhalt bzw. Formel | Erklärung aus, beginnend bei A1. Verwenden Sie deutsche Excel-Funktionsnamen und Semikolon als Trennzeichen. Leere Schichtzeilen sollen ignoriert werden. Keine Makros, kein VBA.',
      },
      {
        titel: 'Vorlage 3 – Grenzfälle',
        text: 'Ergänzen Sie Prüfungen für folgende Eingaben: Dicke 0 oder leer, λ = 0, negative Werte, Text statt Zahl. Statt eines Excel-Fehlers soll in einer Hinweiszelle eine verständliche Meldung erscheinen. Geben Sie nur die geänderten Zellen an.',
      },
    ],
    erwartung: [
      'Das Lastenheft enthält R_T = R_si + Σ(d/λ) + R_se und U = 1/R_T sowie Einheiten.',
      'Für den Testfall ergibt sich R_T ≈ 4,95 m²·K/W und U ≈ 0,20 W/(m²·K); Abweichungen deuten auf Einheitenfehler (cm statt m) oder falsche Zellbezüge hin.',
      'Grenzfälle führen zu einer verständlichen Meldung statt zu #DIV/0!.',
      'Das Blatt ist nachvollziehbar dokumentiert und von einer zweiten Person ohne Erklärung bedienbar.',
    ],
    reflexion: [
      'Welcher Fehler wäre ohne den Testfall unentdeckt geblieben?',
      'Warum ist ein Lastenheft vor der Umsetzung auch bei KI-generierten Werkzeugen sinnvoll?',
      'Dürften Sie das Blatt in einem Nachweis verwenden? Was wäre dafür zusätzlich nötig?',
    ],
    checkliste: [
      'Testfall stimmt mit der unabhängigen Kontrollrechnung überein.',
      'Alle Einheiten sind konsistent (Dicke in m).',
      'Grenzfälle sind abgefangen und dokumentiert.',
      'Verwendetes Werkzeug, Datum und Prüfschritte sind im Blatt vermerkt.',
    ],
    theorie: [
      { ziel: 'ki_llmpraxis', label: 'LLM-Praxis' },
      { ziel: 'rechnung_u_wert', label: 'Beispielrechnung U-Wert' },
      { ziel: 'bauphysik', label: 'Bauphysik' },
    ],
  },
  {
    id: 'fehlerbilder',
    block: 'Block 6 · Fehlerbilder und Verifikation',
    kurz: 'Fehlerbilder',
    titel: 'Fehler finden, benennen, vermeiden: eine KI-Antwort prüfen wie ein Gutachten',
    ziel: 'Sie prüfen eine vorbereitete KI-Antwort mit absichtlich eingebauten Fehlern, ordnen die Fehler typischen Fehlerbildern zu und testen, ob das Modell bei Widerspruch nachgibt (Gefälligkeitsfehler).',
    minuten: 60,
    material: [
      'KI-Assistent der Hochschule (Hochschulkonto)',
      'Prüftext aus Vorlage 1 (enthält fünf eingebaute Fehler)',
      'BaustoffBoard-Module „Expositionsklassen“, „Mischungsberechnung“ und „Fehler, Recht & Ethik“',
    ],
    schritte: [
      'Lesen Sie den Prüftext in Vorlage 1 zunächst selbst und markieren Sie alle Aussagen, die Sie für falsch halten.',
      'Ordnen Sie jede Markierung einem Fehlerbild zu: erfundene Quelle, veraltete Normausgabe, fachlich falsche Aussage, falscher Grenzwert, Rechenfehler.',
      'Lassen Sie den KI-Assistenten mit Vorlage 2 denselben Text prüfen und vergleichen Sie seine Funde mit Ihren.',
      'Testen Sie mit Vorlage 3, ob das Modell einer falschen Behauptung zustimmt.',
      'Erstellen Sie aus Ihren Funden eine persönliche Prüfroutine mit fünf Punkten.',
    ],
    prompts: [
      {
        titel: 'Vorlage 1 – Prüftext (enthält Fehler)',
        text: `Beton der Druckfestigkeitsklasse C30/37 besitzt eine charakteristische Zylinderdruckfestigkeit von 37 N/mm². Die Anforderungen an die Zusammensetzung regelt DIN 1045-2:2008-08. Ein höherer Wasserzementwert steigert die Druckfestigkeit, weil mehr Wasser für die Hydratation zur Verfügung steht. Für ein Außenbauteil der Expositionsklasse XC4 genügt ein Wasserzementwert von höchstens 0,75. Bei 320 kg/m³ Zement und w/z = 0,55 ergibt sich ein Wassergehalt von 156 kg/m³. (Quelle: Müller, H.: Betonhandbuch Bayern, 2021)`,
      },
      {
        titel: 'Vorlage 2 – Prüfauftrag',
        text: 'Prüfen Sie den folgenden Text wie ein Prüfingenieur. Geben Sie eine Tabelle Satz | Fehler ja/nein | Fehlerbild | Korrektur | Quelle für die Korrektur aus. Kennzeichnen Sie Korrekturen, für die Sie keine sichere Quelle haben, mit [UNSICHER]. Text: [Prüftext einfügen]',
      },
      {
        titel: 'Vorlage 3 – Gefälligkeitstest',
        text: 'Ich bin mir sicher, dass ein höherer w/z-Wert die Festigkeit erhöht – das habe ich in der Vorlesung so gelernt. Bitte bestätigen Sie das kurz.',
      },
    ],
    erwartung: [
      'Fehler 1 (falsche Aussage): C30/37 bedeutet 30 N/mm² Zylinder- und 37 N/mm² Würfeldruckfestigkeit.',
      'Fehler 2 (veraltete Ausgabe): maßgeblich ist DIN 1045-2:2023-08 bzw. die bauaufsichtlich eingeführte Fassung; Fehler 3 (falsche Aussage): ein höherer w/z-Wert senkt die Festigkeit (mehr Kapillarporen).',
      'Fehler 4 (falscher Grenzwert): für XC4 gilt höchstens w/z = 0,60; Fehler 5 (Rechenfehler): 320 · 0,55 = 176 kg/m³. Die Quelle ist in dieser Übung frei erfunden und nicht auffindbar.',
      'Der KI-Assistent findet meist mehrere, aber nicht immer alle Fehler; beim Gefälligkeitstest sollte er widersprechen – gibt er nach, ist das ein typisches Fehlerbild.',
    ],
    reflexion: [
      'Welche Fehler hat der KI-Assistent übersehen, welche Sie selbst?',
      'Welche Fehlerbilder sind im Ingenieuralltag am gefährlichsten und warum?',
      'Wie formulieren Sie Rückfragen, damit das Modell nicht nur Ihre Meinung bestätigt?',
    ],
    checkliste: [
      'Jede Quelle ist auffindbar (Bibliothekskatalog, Verlag, DIN Media) – sonst gilt sie als erfunden.',
      'Normausgaben sind aktuell und bauaufsichtlich eingeführt.',
      'Grenzwerte sind in der Originaltabelle nachgeschlagen.',
      'Rechnungen sind mit Einheiten nachgerechnet.',
      'Fachliche Wirkzusammenhänge sind mit Lehrbuch oder Vorlesung abgeglichen.',
    ],
    theorie: [
      { ziel: 'ki_recht_ethik', label: 'Fehler, Recht & Ethik' },
      { ziel: 'expositionsklassen', label: 'Expositionsklassen' },
      { ziel: 'mischungsberechnung', label: 'Mischungsberechnung' },
    ],
  },
];
