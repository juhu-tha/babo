import os, re

changes = {}

def apply_replaces(filepath, replace_list):
    if not os.path.exists(filepath):
        print(f"Not found: {filepath}")
        return
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    orig = content
    for pattern, replacement in replace_list:
        content = re.sub(pattern, replacement, content)
    if content != orig:
        count = 0
        for pattern, replacement in replace_list:
            matches = len(re.findall(pattern, orig))
            count += matches
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        changes[filepath] = changes.get(filepath, 0) + count
        print(f"Updated {filepath}: {count} replacements")

# 1. Modernisierung.tsx - ensure exact text for 2C2, 2C3, 2C5
apply_replaces("src/modules/Modernisierung.tsx", [
    (r"Dämmung oberste Geschossdecke \(§ 47\)", "Dämmung der obersten Geschossdecke (§ 35 GModG, vormals § 47 GEG)"),
    (r"Dämmung Wärmeverteilungs- und Warmwasserrohre \(§ 71\)", "Dämmung Wärmeverteilungs- und Warmwasserrohre (§ 69 Abs. 2 GModG, vormals § 71 GEG)"),
    (r"Rohr-Innendurchmesser bis 22 mm → 20 mm, über 22 bis 35 mm → 30 mm, über 35 bis 100 mm → Dämmdicke gleich Innendurchmesser \(„100-%-Dämmung“\), über 100 mm → 100 mm\. Bei anderem λ ist die Dicke umzurechnen\. Dämmschichtdicke = Rohrinnendurchmesser \(bis 22 mm Innendurchmesser: 20 mm\)\.",
     "Rohr-Innendurchmesser bis 22 mm: 20 mm; über 22 bis 35 mm: 30 mm; über 35 bis 100 mm: gleich Innendurchmesser; über 100 mm: 100 mm. Bei abweichender Wärmeleitfähigkeit ist die Schichtdicke umzurechnen."),
    (r"<strong>Rechtlicher Befreiungstatbestand \(§ 47 Abs\. 4, § 73\) / Ausnahme für Selbstnutzer \(§ 35 Abs\. 3 und § 69 Abs\. 3 und 4 GModG, bis 28\.07\.2026 § 47 Abs\. 3 und § 73 GEG\):</strong>",
     "<strong>Ausnahme für Selbstnutzer (§ 35 Abs. 3 und § 69 Abs. 3 und 4 GModG, bis 28.07.2026 § 47 Abs. 3 und § 73 GEG):</strong>"),
])

# 2. tasks/bestandTasks.ts
apply_replaces("src/data/tasks/bestandTasks.ts", [
    (r"Welche ungefähre Würfeldruckfestigkeit kannst du erwarten\?", "Welche ungefähre Würfeldruckfestigkeit können Sie erwarten?"),
    (r"f_ck sowie f_cd", r"f_{ck} sowie f_{cd}"),
])

# 3. tasks/baustoffeTasks.ts
apply_replaces("src/data/tasks/baustoffeTasks.ts", [
    (r"Makromoleküle\. du bist starr, formstabil", "Makromoleküle. Sie sind starr, formstabil"),
    (r"Polymerknäuel\. Bei Zugbeanspruchung entknäueln sich die Ketten reversibel \(gummielastisch\)\. du bist formstabil",
     "Polymerknäuel. Bei Zugbeanspruchung entknäueln sich die Ketten reversibel (gummielastisch). Sie sind formstabil"),
    (r"Wärmeleitfähigkeit \(\\lambda\)", "Wärmeleitfähigkeit (λ)"),
])

# 4. BpBetonzusatzmittel.tsx
apply_replaces("src/modules/BpBetonzusatzmittel.tsx", [
    (r"inertes Kalksteinmehl\. du wirst dem Mischrezept", "inertes Kalksteinmehl. Sie werden dem Mischrezept"),
])

# 5. ErstsemesterGuide.tsx
apply_replaces("src/modules/ErstsemesterGuide.tsx", [
    (r"Als Erstsemester musst du jedoch", "Als Erstsemester müssen Sie jedoch"),
    (r"Nutze vor dem Betontag", "Nutzen Sie vor dem Betontag"),
    (r"ohne dass dich der Stoff kurz vor der Prüfung erschlägt", "ohne dass Sie der Stoff kurz vor der Prüfung erschlägt"),
    (r"hast du dich um den Faktor 10 verrechnet", "haben Sie sich um den Faktor 10 verrechnet"),
    (r"Nutze KI stattdessen als strengen, geduldigen Prüfer", "Nutzen Sie KI stattdessen als strengen, geduldigen Prüfer"),
    (r"Ergebnis: du musst selbst nachdenken und formulieren", "Ergebnis: Sie müssen selbst nachdenken und formulieren"),
    (r"in deinem Browser gespeichert\. Hake die Themen ab, sobald du sie verstanden hast", "in Ihrem Browser gespeichert. Haken Sie die Themen ab, sobald Sie sie verstanden haben"),
    (r"Möchtest du alle Häkchen zurücksetzen\?", "Möchten Sie alle Häkchen zurücksetzen?"),
])

# 6. Nachhaltigkeit.tsx
apply_replaces("src/modules/Nachhaltigkeit.tsx", [
    (r"musst du die Volumina akkurat ermitteln", "müssen Sie die Volumina akkurat ermitteln"),
    (r"keinen offiziellen bautechnischen EnEV/GEG- oder QNG-Nachweis", "keinen offiziellen bautechnischen Nachweis nach dem Gebäudemodernisierungsgesetz (GModG, vormals GEG/EnEV) oder QNG-Nachweis"),
])

# 7. Datenschutz.tsx
apply_replaces("src/modules/Datenschutz.tsx", [
    (r"in deinem Browser", "in Ihrem Browser"),
    (r"Du kannst diese Daten jederzeit in den Einstellungen deines Webbrowsers \(Browser-Cache / Website-Daten\) vollständig löschen\.",
     "Sie können diese Daten jederzeit in den Einstellungen Ihres Webbrowsers (Browser-Cache / Website-Daten) vollständig löschen."),
    (r"6\. Deine Rechte", "6. Ihre Rechte"),
    (r"Du hast im Rahmen der geltenden gesetzlichen Bestimmungen \(Art\. 15 bis 21 DSGVO\) jederzeit das Recht auf:",
     "Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen (Art. 15 bis 21 DSGVO) jederzeit das Recht auf:"),
    (r"Auskunft über deine bei uns verarbeiteten", "Auskunft über Ihre bei uns verarbeiteten"),
    (r"Löschung deiner bei uns gespeicherten", "Löschung Ihrer bei uns gespeicherten"),
    (r"Widerspruch gegen die Verarbeitung deiner Daten", "Widerspruch gegen die Verarbeitung Ihrer Daten"),
    (r"steht dir ein Beschwerderecht", "steht Ihnen ein Beschwerderecht"),
])

# 8. Rueckbau.tsx
apply_replaces("src/modules/Rueckbau.tsx", [
    (r"findest Du im Modulbereich", "finden Sie im Modulbereich"),
    (r"Wähle die Bauwerksepoche aus", "Wählen Sie die Bauwerksepoche aus"),
])

# 9. Fortbildungen.tsx
apply_replaces("src/modules/Fortbildungen.tsx", [
    (r"qualifiziert dich dieser Schein", "qualifiziert Sie dieser Schein"),
    (r"sichert dich beim staubigen Ausbau", "sichert Sie beim staubigen Ausbau"),
    (r"berechtigt dich zur sicheren und ordnungsgemäßen Beseitigung", "berechtigt Sie zur sicheren und ordnungsgemäßen Beseitigung"),
    (r"eröffnet dir der RAB-30-Nachweis", "eröffnet Ihnen der RAB-30-Nachweis"),
    (r"1\. Dein beruflicher / akademischer Hintergrund:", "1. Ihr beruflicher / akademischer Hintergrund:"),
    (r"2\. Dein primäres Einsatz- oder Karriereziel im Bestand:", "2. Ihr primäres Einsatz- oder Karriereziel im Bestand:"),
])

# 10. Nawaro.tsx
apply_replaces("src/modules/Nawaro.tsx", [
    (r"dickere Dämmschichten zur EnEV/GEG-Einhaltung", "dickere Dämmschichten zur GModG-Einhaltung (vormals GEG/EnEV)"),
    (r"Wähle deine primären konstruktiven Zielstellungen", "Wählen Sie Ihre primären konstruktiven Zielstellungen"),
])

# 11. Bauschaeden.tsx
apply_replaces("src/modules/Bauschaeden.tsx", [
    (r"zeigen wir dir hiermit unverzüglich", "zeigen wir Ihnen hiermit unverzüglich"),
])

# 12. Feedback.tsx
apply_replaces("src/modules/Feedback.tsx", [
    (r"Hilft dir dieses Tool beim Lernen und Verstehen\?", "Hilft Ihnen dieses Tool beim Lernen und Verstehen?"),
    (r"Was gefällt dir besonders gut\? Was könnte verbessert werden\?", "Was gefällt Ihnen besonders gut? Was könnte verbessert werden?"),
])

# 13. ki/ToolsFuerThesen.tsx
apply_replaces("src/modules/ki/ToolsFuerThesen.tsx", [
    (r'Nutze die Funktion "Extract data from PDFs"', 'Nutzen Sie die Funktion "Extract data from PDFs"'),
    (r"Prüfe immer die extrahierten Zahlen im Original-PDF nach, bevor du diese in deine Thesis übernehmen\.",
     "Prüfen Sie immer die extrahierten Zahlen im Original-PDF nach, bevor Sie diese in Ihre Thesis übernehmen."),
    (r"lass dir graphisch zeigen", "lassen Sie sich grafisch zeigen"),
    (r"Synchronisiere deine Zotero-Kollektionen", "Synchronisieren Sie Ihre Zotero-Kollektionen"),
    (r"setze dir ein klares Zeitlimit", "setzen Sie sich ein klares Zeitlimit"),
    (r'Kernhypothesen deiner Thesis, z\. B\. "Does superplasticizer dosage affect concrete shrinkage\?" – du erhältst sofort eine Übersicht',
     'Kernhypothesen Ihrer Thesis, z. B. "Does superplasticizer dosage affect concrete shrinkage?" – Sie erhalten sofort eine Übersicht'),
    (r"Unverzichtbar zur Verifikation von Literaturwerten: Prüfe, ob ein vielzitiertes Forschungsergebnis",
     "Unverzichtbar zur Verifikation von Literaturwerten: Prüfen Sie, ob ein vielzitiertes Forschungsergebnis"),
    (r"Zitiere in der Diskussion deiner Thesis gezielt Arbeiten, die deine Laborergebnisse stützen",
     "Zitieren Sie in der Diskussion Ihrer Thesis gezielt Arbeiten, die Ihre Laborergebnisse stützen"),
    (r"prüfe den Zugang über deine Universitätsbibliothek", "prüfen Sie den Zugang über Ihre Universitätsbibliothek"),
    (r"verlass dich nie blind auf die KI-Zusammenfassung", "verlassen Sie sich nie blind auf die KI-Zusammenfassung"),
    (r"Arbeitet ausschließlich auf den von dir hochgeladenen Dokumenten", "Arbeitet ausschließlich auf den von Ihnen hochgeladenen Dokumenten"),
    (r'Lade alle 30 Kern-PDFs deiner Thesis hoch\. Frage NotebookLM: "Welche Prüftemperaturen wurden in den Versuchsreihen von Quelle A im Vergleich zu Quelle B verwendet\?" – du erhältst die präzise Antwort',
     'Laden Sie alle 30 Kern-PDFs Ihrer Thesis hoch. Fragen Sie NotebookLM: "Welche Prüftemperaturen wurden in den Versuchsreihen von Quelle A im Vergleich zu Quelle B verwendet?" – Sie erhalten die präzise Antwort'),
    (r"Nutze die Notiz-Funktion, um Gliederungsentwürfe schrittweise mit direkten Zitaten aus deiner Literaturbasis zu befüllen\.",
     "Nutzen Sie die Notiz-Funktion, um Gliederungsentwürfe schrittweise mit direkten Zitaten aus Ihrer Literaturbasis zu befüllen."),
    (r"Lade keine vertraulichen Industriedaten", "Laden Sie keine vertraulichen Industriedaten"),
    (r"Füge deine fertigen Rohkapitel abschnittsweise ein", "Fügen Sie Ihre fertigen Rohkapitel abschnittsweise ein"),
    (r"Klicke auf einzelne Wörter", "Klicken Sie auf einzelne Wörter"),
    (r"Prüfe bei LaTeX-Tabellen immer", "Prüfen Sie bei LaTeX-Tabellen immer"),
    (r"Gib deiner Prüfmaschinen-CSV-Datei den Cursor-Befehl", "Geben Sie Ihrer Prüfmaschinen-CSV-Datei den Cursor-Befehl"),
    (r"Nutze @Files oder @Folders im Chat, um dem Editor deine Messdaten-Formate", "Nutzen Sie @Files oder @Folders im Chat, um dem Editor Ihre Messdaten-Formate"),
    (r"Prüfe generierte mathematische Berechnungen immer", "Prüfen Sie generierte mathematische Berechnungen immer"),
    (r"Verabschiede dich von unübersichtlichen Excel-Tabellen", "Verabschieden Sie sich von unübersichtlichen Excel-Tabellen"),
    (r"damit sie in deiner gedruckten Thesis", "damit sie in Ihrer gedruckten Thesis"),
    (r"Baue als Highlight deiner Masterthesis", "Bauen Sie als Highlight Ihrer Masterthesis"),
    (r"Hoste deine App kostenfrei auf Streamlit Community Cloud und füge einen QR-Code direkt in die Einleitung deiner Thesis ein\.",
     "Hosten Sie Ihre App kostenfrei auf Streamlit Community Cloud und fügen Sie einen QR-Code direkt in die Einleitung Ihrer Thesis ein."),
    (r"Starte mit dem zentralen Paper Ihres Betreuers und identifiziere die 20 relevantesten Schwesterarbeiten",
     "Starten Sie mit dem zentralen Paper Ihres Betreuers und identifizieren Sie die 20 relevantesten Schwesterarbeiten"),
])

# 14. ki/LokaleKI.tsx
apply_replaces("src/modules/ki/LokaleKI.tsx", [
    (r"Klicke in der linken Seitenleiste auf das <strong>Lupen-Symbol \(Search\)</strong>\. Gib ins Suchfeld",
     "Klicken Sie in der linken Seitenleiste auf das <strong>Lupen-Symbol (Search)</strong>. Geben Sie ins Suchfeld"),
    (r"Wähle im Zweifel stets <strong>Q4_K_M</strong>", "Wählen Sie im Zweifel stets <strong>Q4_K_M</strong>"),
    (r"passt komplett in deinen VRAM", "passt komplett in Ihren VRAM"),
    (r"und wähle oben das heruntergeladene Modell aus\. Klappen Sie rechts die <em>Model Parameters</em> auf: Setze <strong>GPU Offload</strong>",
     "und wählen Sie oben das heruntergeladene Modell aus. Klappen Sie rechts die <em>Model Parameters</em> auf: Setzen Sie <strong>GPU Offload</strong>"),
    (r"<li>Klicke links auf das <strong>Doppelpfeil- / Server-Symbol", "<li>Klicken Sie links auf das <strong>Doppelpfeil- / Server-Symbol"),
    (r"<li>Klicke auf den grünen Button <strong>\"Start Server\"</strong>", "<li>Klicken Sie auf den grünen Button <strong>\"Start Server\"</strong>"),
])

# 15. ki/LlmPraxis.tsx
apply_replaces("src/modules/ki/LlmPraxis.tsx", [
    (r"geg_dgnb: 'Berechne U-Werte und H\\'T-Grenzwerte nach GEG 2024",
     "geg_dgnb: 'Berechnen Sie U-Werte und H\\'T-Grenzwerte nach dem Gebäudemodernisierungsgesetz (GModG, vormals GEG)"),
    (r"din_en_206: 'Prüfe Konformitätskriterien nach DIN EN 206", "din_en_206: 'Prüfen Sie Konformitätskriterien nach DIN EN 206"),
    (r"- Vergleiche Soll-Werte mit Ist-Werten", "- Vergleichen Sie Soll-Werte mit Ist-Werten"),
    (r"- Nutze bei numerischen Daten bevorzugt das Code-Interpreter-Modul", "- Nutzen Sie bei numerischen Daten bevorzugt das Code-Interpreter-Modul"),
    (r"- Gib Zwischenschritte und Formeln mit Einheiten an", "- Geben Sie Zwischenschritte und Formeln mit Einheiten an"),
    (r"Lade CSV-Rohdaten von Zugversuchen", "Laden Sie CSV-Rohdaten von Zugversuchen"),
    (r"verlassen deinen Büro-Rechner <strong>nicht</strong>", "verlassen Ihren Büro-Rechner <strong>nicht</strong>"),
    (r"ohne dass du jede Datei manuell ins Chatfenster ziehen müssen\.", "ohne dass Sie jede Datei manuell ins Chatfenster ziehen müssen."),
    (r"<strong>💡 Pro-Tipp für Claude Projects:</strong> Lade die <code className=\"font-mono\">CLAUDE\.md</code> direkt in die \"Project Knowledge\"\. So musst du in einzelnen Chats nie wieder erwähnen",
     "<strong>💡 Pro-Tipp für Claude Projects:</strong> Laden Sie die <code className=\"font-mono\">CLAUDE.md</code> direkt in die \"Project Knowledge\". So müssen Sie in einzelnen Chats nie wieder erwähnen"),
    (r"Wie du Echtzeit-Suchwerkzeuge mit gezielten Suchfiltern einsetzen", "Wie Sie Echtzeit-Suchwerkzeuge mit gezielten Suchfiltern einsetzen"),
    (r"direkt in deine Markdown-Berichte", "direkt in Ihre Markdown-Berichte"),
    (r"für dein Büro oder deine Masterarbeit\.", "für Ihr Büro oder Ihre Masterarbeit."),
    (r"Wie du <strong>Claude</strong> und <strong>ChatGPT</strong> durch", "Wie Sie <strong>Claude</strong> und <strong>ChatGPT</strong> durch"),
])

# 16. ki/HoaiPromptBibliothek.tsx
apply_replaces("src/modules/ki/HoaiPromptBibliothek.tsx", [
    (r"vor dem Absenden durch deine individuellen Projektparameter", "vor dem Absenden durch Ihre individuellen Projektparameter"),
])

# 17. ki/FehlerRechtEthik.tsx & RagDemonstrator.tsx & KiAnwendungsideen.tsx
apply_replaces("src/modules/ki/FehlerRechtEthik.tsx", [
    (r"Wähle einen Praxisfall:", "Wählen Sie einen Praxisfall:"),
])
apply_replaces("src/modules/ki/RagDemonstrator.tsx", [
    (r"Klicke auf ein Baubeispiel:", "Klicken Sie auf ein Baubeispiel:"),
])
apply_replaces("src/modules/ki/KiAnwendungsideen.tsx", [
    (r"Wähle unten eine bautechnische Aufgabenstellung", "Wählen Sie unten eine bautechnische Aufgabenstellung"),
])

# 18. components and other modules
apply_replaces("src/modules/MessenPruefen.tsx", [
    (r"Wähle ein Instrument aus, um dessen messtechnische Kenngrößen", "Wählen Sie ein Instrument aus, um dessen messtechnische Kenngrößen"),
    (r"Nutze den interaktiven Schusskreis", "Nutzen Sie den interaktiven Schusskreis"),
])

apply_replaces("src/modules/Dauerhaftigkeit.tsx", [
    (r"Wähle die Korrosivitätskategorie und simuliere den Schichtabtrag über Jahre:", "Wählen Sie die Korrosivitätskategorie und simulieren Sie den Schichtabtrag über Jahre:"),
    (r"Prüfe Metallunverträglichkeiten im Baubetrieb:", "Prüfen Sie Metallunverträglichkeiten im Baubetrieb:"),
    (r"Klicke die Einsatzkonditionen an, um die Gebrauchsklasse und die zulässigen natürlichen Dauerhaftigkeitsklassen nach DIN 68800-1 anzuzeigen\.",
     "Klicken Sie die Einsatzkonditionen an, um die Gebrauchsklasse und die zulässigen natürlichen Dauerhaftigkeitsklassen nach DIN 68800-1 anzuzeigen."),
])

apply_replaces("src/modules/ZfP.tsx", [
    (r"Wähle ein Prüfgerät aus, um detaillierte normative und bautechnische Spezifikationen",
     "Wählen Sie ein Prüfgerät aus, um detaillierte normative und bautechnische Spezifikationen"),
])

apply_replaces("src/modules/BpFarbenLacke.tsx", [
    (r"Wähle ein System aus, um eine vollständige Detailkarte", "Wählen Sie ein System aus, um eine vollständige Detailkarte"),
])

apply_replaces("src/modules/Analytik.tsx", [
    (r"Klicke auf Messpunkte im Bild, um die Elemente \(EDX\) anzuzeigen\.", "Klicken Sie auf Messpunkte im Bild, um die Elemente (EDX) anzuzeigen."),
    (r"Klicke auf das Messdiagramm oben", "Klicken Sie auf das Messdiagramm oben"),
])

apply_replaces("src/modules/Festigkeitsberechnungen.tsx", [
    (r"Vergleiche zwei Materialien hinsichtlich ihrer theoretischen Grenzen", "Vergleichen Sie zwei Materialien hinsichtlich ihrer theoretischen Grenzen"),
])

apply_replaces("src/modules/Statistik.tsx", [
    (r'Klicke links auf "15 Proben generieren"', 'Klicken Sie links auf "15 Proben generieren"'),
])

apply_replaces("src/modules/HistorischeBauprodukte.tsx", [
    (r"Wähle eine Epoche, um die damals typischerweise verwendeten Bauprodukte", "Wählen Sie eine Epoche, um die damals typischerweise verwendeten Bauprodukte"),
])

apply_replaces("src/modules/lca/TransportbetonLcaUebung.tsx", [
    (r"Lade das vollständige Übungsblatt mit lebenden Formeln direkt für Excel herunter\.", "Laden Sie das vollständige Übungsblatt mit lebenden Formeln direkt für Excel herunter."),
])

apply_replaces("src/components/LaborAuswertung.tsx", [
    (r"Klicke auf ein Kapitel, um die detaillierten", "Klicken Sie auf ein Kapitel, um die detaillierten"),
])

apply_replaces("src/components/DaemmungBerater.tsx", [
    (r"Setze auf \{recThickness\} cm", "Auf {recThickness} cm setzen"),
])

apply_replaces("src/components/ui/BaustoffProfil.tsx", [
    (r"Vermeide beim Dachaufbau stehendes Wasser an der Unterseite von Titanzinkblechen\. Setze strukturierte, diffusionsoffene Trennlagen/Strukturmatten ein",
     "Vermeiden Sie beim Dachaufbau stehendes Wasser an der Unterseite von Titanzinkblechen. Setzen Sie strukturierte, diffusionsoffene Trennlagen/Strukturmatten ein"),
])

apply_replaces("src/components/labor/BiegezugPruefung.tsx", [
    (r"Klicke links auf &quot;Biegetest Starten&quot;", "Klicken Sie links auf &quot;Biegetest Starten&quot;"),
])

apply_replaces("src/components/labor/UniversalPruefstand.tsx", [
    (r"Klicke links auf &quot;Test Starten&quot;", "Klicken Sie links auf &quot;Test Starten&quot;"),
])

apply_replaces("src/components/labor/Spaltzugversuch.tsx", [
    (r"Klicke auf &quot;Spaltversuch Starten&quot;", "Klicken Sie auf &quot;Spaltversuch Starten&quot;"),
])

apply_replaces("src/components/labor/SchmidtHammerSimulator.tsx", [
    (r"Klicke direkt auf die 9 Messpunkte, um den Schmidt-Hammer manuell auszulösen\.", "Klicken Sie direkt auf die 9 Messpunkte, um den Schmidt-Hammer manuell auszulösen."),
])

apply_replaces("src/components/quiz/QuizDashboard.tsx", [
    (r"Klicke auf ein Modul, um es direkt im Trainingsmodus zu öffnen\.", "Klicken Sie auf ein Modul, um es direkt im Trainingsmodus zu öffnen."),
])

print("Total files updated in this pass:", len(changes))
