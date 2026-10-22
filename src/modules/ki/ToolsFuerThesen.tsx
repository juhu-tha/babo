import React, { useState } from 'react';
import { 
  Search, 
  FileText, 
  Code, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Sparkles, 
  Sliders, 
  Terminal, 
  GraduationCap, 
  CheckSquare,
  Compass,
  FileCode2,
  FileCheck2,
  Table
} from 'lucide-react';
import { InlineMath } from 'react-katex';
import { FormulaText } from '@/src/components/ui/FormulaText';

interface ThesisTool {
  id: string;
  name: string;
  category: 'literatur' | 'schreiben' | 'coding';
  badge: string;
  badgeColor: string;
  url: string;
  pricing: string;
  summary: string;
  thesisWorkflow: string;
  proTip: string;
  caution: string;
}

const THESIS_TOOLS: ThesisTool[] = [
  // 1. Literatur & Research Mapping
  {
    id: 'elicit',
    name: 'Elicit',
    category: 'literatur',
    badge: 'Paper-Extraktion & Synthese',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    url: 'https://elicit.com',
    pricing: 'Freemium',
    summary: 'Durchsucht über 200 Millionen wissenschaftliche Publikationen und extrahiert automatisch strukturierte Tabellen zu Methodik, Stichprobengröße, Dosierungen und Messwerten.',
    thesisWorkflow: 'Perfekt für den Stand der Forschung: Erstelle eine Vergleichstabelle zu bestehenden Studien über z. B. "calcined clay concrete compressive strength" mit Spalten für w/z-Wert, Probenalter und Festigkeitsgewinn.',
    proTip: 'Nutzen Sie die Funktion "Extract data from PDFs", um eigene, manuell heruntergeladene Norm- und Tagungsbände als strukturierte Excel-Tabelle zu exportieren.',
    caution: 'Prüfen Sie immer die extrahierten Zahlen im Original-PDF nach, bevor Sie diese in Ihre Thesis übernehmen.'
  },
  {
    id: 'connected_papers',
    name: 'Connected Papers',
    category: 'literatur',
    badge: 'Visueller Zitationsgraph',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    url: 'https://www.connectedpapers.com',
    pricing: 'Freemium',
    summary: 'Erstellt interaktive zweidimensionale Zitationsgraphen basierend auf Co-Zitation und bibliografischer Kopplung. Identifiziert fundamentale Pionierarbeiten ("Prior Works") und aktuelle Ableger ("Derivative Works").',
    thesisWorkflow: 'Geben Sie ein Schlüsselpaper Ihres Betreuers oder ein Standardwerk ein, um innerhalb von Sekunden die 30 relevantesten Schwesterpublikationen und theoretischen Fundamente des Themas aufzudecken.',
    proTip: 'Die Clusterung zeigt oft verschiedene Denkschulen oder experimentelle Ansätze in verschiedenen Farben.',
    caution: 'Keine Volltextsuche; es werden ausschließlich paperspezifische Zitationsbeziehungen visualisiert.'
  },
  {
    id: 'research_rabbit',
    name: 'Research Rabbit',
    category: 'literatur',
    badge: 'Netzwerk & Autorensuche',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    url: 'https://www.researchrabbit.ai',
    pricing: 'Kostenfrei',
    summary: 'Oft als "Spotify für wissenschaftliche Papers" bezeichnet. Bietet unbegrenzte Sammlungen, Autoren-Kooperationsnetzwerke und automatisierte Benachrichtigungen bei neuen relevanten Publikationen.',
    thesisWorkflow: 'Legen Sie thematische Sammlungen für Ihre Thesen-Kapitel an (z. B. "Karbonatisierung", "Flugasche-Ersatz") und lassen Sie sich grafisch zeigen, welche Institute weltweit auf diesem Spezialgebiet federführend forschen.',
    proTip: 'Zotero-Integration: Synchronisieren Sie Ihre Zotero-Kollektionen per 1-Klick mit Research Rabbit.',
    caution: 'Verführt leicht zum extensiven "Browsen" – setzen Sie sich ein klares Zeitlimit für die Literaturrecherche.'
  },
  {
    id: 'consensus',
    name: 'Consensus',
    category: 'literatur',
    badge: 'Wissenschaftlicher Konsens',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    url: 'https://consensus.app',
    pricing: 'Freemium',
    summary: 'KI-Suchmaschine, die ausschließlich von Fachkollegen begutachtete (Peer-Reviewed) Studien durchsucht und die Kernbefunde mit einem evidenzbasierten "Consensus Meter" quantifiziert.',
    thesisWorkflow: 'Hervorragend zur Beantwortung von Kernhypothesen Ihrer Thesis, z. B. "Does superplasticizer dosage affect concrete shrinkage?" – Sie erhalten sofort eine Übersicht, ob die Studienlage überwiegend ja, nein oder gemischt ist.',
    proTip: 'Ideal für Einleitungs- und Diskussionsteile, um empirische Trends fundiert mit Zitationsbelegen abzusichern.',
    caution: 'Nicht für qualitative Einzelfallprüfungen oder deutsche Normen (DIN/VOB) geeignet, da primär englischsprachige Journal-Papers indexiert sind.'
  },
  {
    id: 'scite',
    name: 'Scite.ai',
    category: 'literatur',
    badge: 'Smart Citations',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    url: 'https://scite.ai',
    pricing: 'Uni-Lizenz / Freemium',
    summary: 'Klassifiziert Zitate in "Supporting" (Bestätigend), "Contrasting" (Widersprechend) oder "Mentioning" (Erwähnend) und zeigt den genauen Kontexttext aus dem zitierenden Paper an.',
    thesisWorkflow: 'Unverzichtbar zur Verifikation von Literaturwerten: Prüfen Sie, ob ein vielzitiertes Forschungsergebnis zu einem neuen Bindemittel in späteren Studien repliziert oder gar widerlegt wurde.',
    proTip: 'Zitieren Sie in der Diskussion Ihrer Thesis gezielt Arbeiten, die Ihre Laborergebnisse stützen oder widersprechende Randbedingungen diskutieren.',
    caution: 'Manche Hochschulen bieten Campuslizenzen; prüfen Sie den Zugang über Ihre Universitätsbibliothek.'
  },
  {
    id: 'deep_research',
    name: 'Deep Research (OpenAI / Gemini / Perplexity)',
    category: 'literatur',
    badge: 'Autonomes Web-Research',
    badgeColor: 'bg-shiraz/10 text-shiraz border-shiraz/20',
    url: 'https://perplexity.ai',
    pricing: 'Freemium',
    summary: 'Autonome KI-Agenten, die dutzende Webquellen, PDFs, technische Merkblätter und Tagungsbände nacheinander aufrufen, querlesen und in einem mehrseitigen, quellenbelegten Synthesebericht zusammenfassen.',
    thesisWorkflow: 'Eignet sich für komplexe bauphysikalische oder regulatorische Querschnittsfragen wie: "Vergleich der Anforderungen an Betonzusatzstoffe nach DIN EN 450-1 und ASTM C618 hinsichtlich Flugaschequalitäten".',
    proTip: 'Verlange im Prompt explizit: "Gib für jede Aussage die exakte PDF-Fundstelle oder den DOI-Link an".',
    caution: 'Erfordert strikte Quellenkontrolle; verlassen Sie sich nie blind auf die KI-Zusammenfassung bei normativen Grenzwerten.'
  },

  // 2. Schreiben, Synthese & LaTeX
  {
    id: 'notebooklm',
    name: 'Google NotebookLM',
    category: 'schreiben',
    badge: 'Quellentreue PDF-Analyse',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    url: 'https://notebooklm.google.com',
    pricing: 'Kostenfrei',
    summary: 'Arbeitet ausschließlich auf den von Ihnen hochgeladenen Dokumenten (Skripte, Dissertationen, DIN-Merkblätter, Laborberichte) und belegt jede Antwort mit anklickbaren Zitatstellen im Originaltext.',
    thesisWorkflow: 'Laden Sie alle 30 Kern-PDFs Ihrer Thesis hoch. Fragen Sie NotebookLM: "Welche Prüftemperaturen wurden in den Versuchsreihen von Quelle A im Vergleich zu Quelle B verwendet?" – Sie erhalten die präzise Antwort mit Zeilennachweis.',
    proTip: 'Nutzen Sie die Notiz-Funktion, um Gliederungsentwürfe schrittweise mit direkten Zitaten aus Ihrer Literaturbasis zu befüllen.',
    caution: 'Laden Sie keine vertraulichen Industriedaten oder noch unveröffentlichte Laborergebnisse ohne Rücksprache mit Betreuern hoch.'
  },
  {
    id: 'paperpal',
    name: 'Paperpal',
    category: 'schreiben',
    badge: 'Akademischer Schreibassistent',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    url: 'https://paperpal.com',
    pricing: 'Freemium',
    summary: 'Auf Millionen wissenschaftlicher Fachartikel trainiertes Tool zur Satzbau-, Grammatik- und Stilverbesserung. Entfernt informelle Sprache und formuliert Texte in präzises Fach-Englisch oder Fach-Deutsch um.',
    thesisWorkflow: 'Ideal für das Verfassen des englischen Abstracts oder einer englischsprachigen Masterthesis: Ersetzt vage Formulierungen durch etablierte ingenieurwissenschaftliche Fachtermini.',
    proTip: 'Verfügbar als Microsoft Word Add-in und Overleaf/LaTeX-Integration für unterbrechungsfreies Schreiben.',
    caution: 'Achten Sie darauf, dass bei Umformulierungen keine mathematischen Nuancen oder physikalische Kausalitäten verdreht werden.'
  },
  {
    id: 'deepl_write',
    name: 'DeepL Write',
    category: 'schreiben',
    badge: 'Stil- & Grammatikfeinschliff',
    badgeColor: 'bg-slate-50 text-slate-700 border-slate-200',
    url: 'https://www.deepl.com/write',
    pricing: 'Kostenfrei',
    summary: 'Vollwertiger deutscher und englischer Textoptimierer. Hilft dabei, Schachtelsätze aufzubrechen, Nominalstil abzufedern und passive Ingenieurformulierungen elegant und verständlich zu halten.',
    thesisWorkflow: 'Fügen Sie Ihre fertigen Rohkapitel abschnittsweise ein, um Rechtschreibfehler, Zeichensetzungsfehler und holprige Übergänge vor der Abgabe zu eliminieren.',
    proTip: 'Klicken Sie auf einzelne Wörter, um alternative Synonyme auszuwählen, die den Tonfall exakt treffen.',
    caution: 'Kopiere nicht unbesehen ganze Absätze ohne Nachlesen; Fachbegriffe wie "w/z-Wert" oder Formelkürzel werden manchmal unerwünscht verändert.'
  },
  {
    id: 'overleaf_copilot',
    name: 'Overleaf + LaTeX Copilots',
    category: 'schreiben',
    badge: 'Formelsatz & TikZ-Grafiken',
    badgeColor: 'bg-green-50 text-green-700 border-green-200',
    url: 'https://www.overleaf.com',
    pricing: 'Freemium / Uni-Lizenz',
    summary: 'Der weltweite Goldstandard für mathematisch-naturwissenschaftliche Abschlussarbeiten. Kombiniert mit KI lassen sich komplexe Tabellen, BibTeX-Einträge und Vektordiagramme in TikZ in Sekunden generieren.',
    thesisWorkflow: 'Bitte ein LLM: "Erstelle mir den LaTeX-Code für eine normgerechte Tabelle der Betondruckfestigkeiten nach DIN EN 206 mit Zentrierung und booktabs" – und füge den Code direkt in Overleaf ein.',
    proTip: 'Lassen Sie KI TikZ-Skripte für statische Systeme, Mohr’sche Spannungskreise oder Kristallstrukturen generieren – das spart Stunden manuellen Zeichnens.',
    caution: 'Prüfen Sie bei LaTeX-Tabellen immer, ob Dezimaltrennzeichen (Komma vs. Punkt) und SI-Einheiten korrekt mit dem siunitx-Paket gesetzt sind.'
  },
  {
    id: 'zotero',
    name: 'Zotero + Zotero-AI',
    category: 'schreiben',
    badge: 'Literaturverwaltung & Zitation',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    url: 'https://www.zotero.org',
    pricing: 'Kostenfrei (Open Source)',
    summary: 'Das führende freie Literaturverwaltungsprogramm. Mit Erweiterungen wie Zotero-GPT, Zotero-Claude oder BibTeX-AutoSync lassen sich Metadaten automatisch abrufen, Notizen zusammenfassen und Zitationsstile per Mausklick ändern.',
    thesisWorkflow: 'Erfasse alle Literaturstellen per Browser-Plugin mit einem Klick. Verwende Plugins zur automatischen PDF-Verschlagwortung und generiere fehlerfreie Quellenverzeichnisse nach DIN ISO 690 oder APA.',
    proTip: 'Integriere Zotero direkt mit Overleaf oder MS Word für automatische dynamische Zitation.',
    caution: 'Automatisch importierte Metadaten enthalten gelegentlich falsche Autoren- oder Tagungsband-Angaben; prüfe vor dem Binden Stichproben.'
  },

  // 3. Coding & Datenauswertung
  {
    id: 'cursor_claude',
    name: 'Cursor / Claude Code',
    category: 'coding',
    badge: 'KI-gestütztes Programmieren',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    url: 'https://www.cursor.com',
    pricing: 'Freemium',
    summary: 'Next-Generation Code-Editoren, die die gesamte Projektstruktur verstehen. Sie ermöglichen es Bauingenieuren ohne tiefgehende Informatik-Kenntnisse, professionelle Berechnungs- und Auswertungs-Tools in Python zu entwickeln.',
    thesisWorkflow: 'Geben Sie Ihrer Prüfmaschinen-CSV-Datei den Cursor-Befehl: "Schreibe ein Python-Skript, das die Kraft-Weg-Kurve einliest, die 0,2%-Dehngrenze und das E-Modul bestimmt und als hochauflösende Vektorgrafik speichert".',
    proTip: 'Nutzen Sie @Files oder @Folders im Chat, um dem Editor Ihre Messdaten-Formate direkt als Kontext mitzugeben.',
    caution: 'Prüfen Sie generierte mathematische Berechnungen immer an 2–3 Handrechnungen gegen, um Modellfehler auszuschließen.'
  },
  {
    id: 'python_datascience',
    name: 'Python (Pandas, NumPy, Matplotlib, SciPy)',
    category: 'coding',
    badge: 'Labor-Datenanalyse',
    badgeColor: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    url: 'https://jupyter.org',
    pricing: 'Kostenfrei (Open Source)',
    summary: 'Der wissenschaftliche Industriestandard für reproduzierbare Datenanalyse, nichtlineare Regressionen, Porengrößenverteilungen (MIP) und statistische Auswertungen im Baustofflabor.',
    thesisWorkflow: 'Verabschieden Sie sich von unübersichtlichen Excel-Tabellen: Ein sauberes Jupyter Notebook verarbeitet hunderte Prüfserien automatisiert und reproduzierbar in wenigen Millisekunden.',
    proTip: 'Exportiere Grafiken stets im Format SVG oder PDF (vektorbasiert) mit matplotlib, damit sie in Ihrer gedruckten Thesis gestochen scharf sind.',
    caution: 'Achten Sie darauf, dass alle verwendeten Bibliotheksversionen in einer requirements.txt festgehalten werden.'
  },
  {
    id: 'streamlit',
    name: 'Streamlit / Dash',
    category: 'coding',
    badge: 'Interaktive Web-Tools',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
    url: 'https://streamlit.io',
    pricing: 'Kostenfrei (Open Source)',
    summary: 'Verwandelt Python-Skripte mit wenigen Zeilen Code in interaktive Web-Applikationen mit Schiebereglern, Diagrammen und Download-Buttons für Prüfberichte.',
    thesisWorkflow: 'Bauen Sie als Highlight Ihrer Masterthesis ein interaktives Tool, in dem Prüfer oder Planer Mischungsparameter anpassen und die prognostizierten Festigkeiten oder CO₂-Bilanzen live berechnen können.',
    proTip: 'Hosten Sie Ihre App kostenfrei auf Streamlit Community Cloud und fügen Sie einen QR-Code direkt in die Einleitung Ihrer Thesis ein.',
    caution: 'Beschränke die Benutzeroberfläche auf die relevanten Kernparameter, um Prüfer nicht zu überfordern.'
  },
  {
    id: 'sympy_wolfram',
    name: 'SymPy & Wolfram Alpha via KI',
    category: 'coding',
    badge: 'Symbolische Mathematik & Einheiten',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    url: 'https://www.wolframalpha.com',
    pricing: 'Kostenfrei / Freemium',
    summary: 'Analytische Gleichungslöser, symbolische Integration, Differenzialgleichungslöser und automatische Einheitenprüfung für thermodynamische und mechanische Herleitungen.',
    thesisWorkflow: 'Lassen Sie sich bei komplexen mechanischen Gleichungen (z. B. Spannungsfunktionen bei anisotropen Werkstoffen oder instationäre Wärmeleitung) Zwischenschritte symbolisch auflösen und die Einheitendimensionen auf Konsistenz prüfen.',
    proTip: 'Kombiniere LLM-Prompts mit der Aufforderung: "Führe eine dimensionale Einheitenanalyse für jeden Schritt in SI-Basiseinheiten durch".',
    caution: 'Wolfram Alpha eignet sich hervorragend zur Gegenrechnung, ersetzt aber nicht das eigene Verständnis der baustatischen Randbedingungen.'
  }
];

interface PromptPreset {
  id: string;
  title: string;
  targetChapter: string;
  scenario: string;
  promptText: string;
  sampleOutput: string;
}

const THESIS_PROMPTS: PromptPreset[] = [
  {
    id: 'expose',
    title: 'Exposé-Forschungsfragen & Hypothesen schärfen',
    targetChapter: 'Kapitel 1: Einleitung & Zielsetzung',
    scenario: 'Präzisierung des Themas, Formulierung klar prüfbarer wissenschaftlicher Hypothesen und Abgrenzung des Untersuchungsrahmens.',
    promptText: `Du bist ein habilitierter Universitätsprofessor und Erstprüfer für Baustoffkunde und Bauingenieurwesen.
Ich plane meine [Bachelorarbeit / Masterarbeit] zum folgenden Arbeitstitel:
"[HIER THEMA EINTRAGEN, z. B. Dauerhaftigkeit von klinkerarmen Betonen mit calciniertem Ton unter kombinierter Frost-Tausalz- und Karbonatisierungsbelastung]".

Bitte unterstütze mich bei der wissenschaftlichen Strukturierung:
1. Formuliere 1 übergeordnete Forschungsfrage (Hauptfrage) und 3 präzise, messbare Unterfragen.
2. Formuliere 3 wissenschaftliche Hypothesen (H1, H2, H3), die im experimentellen Laborteil falsifiziert oder verifiziert werden können.
3. Definiere 3 klare methodische Abgrenzungen (Delimitations), was explizit NICHT Gegenstand der Arbeit ist (zur Vermeidung von Überfrachtung).
4. Schlage eine methodische Gliederung mit Zeitplan (Meilensteine für 24 Wochen Bearbeitungszeit) vor.
Tonalität: Höchste akademische Präzision, ingenieurwissenschaftlicher Duktus, bezogen auf DIN EN 206 und gängige RILEM-Prüfmethoden.`,
    sampleOutput: `### Wissenschaftlicher Entwurf für das Exposé

#### 1. Forschungsfragen
* **Hauptfrage:** Wie beeinflusst der Substitutionsgrad von Portlandzementklinker durch calcinierte Tone (Metaton) das Gefüge und den Widerstand gegen kombinierten Frost-Tausalz-Angriff (XF4) im Vergleich zu Referenzbetonen mit CEM I?
* **Unterfrage 1:** Welche Veränderungen in der Porenradienverteilung (mittels Quecksilberdruckporosimetrie) treten bei 20 %, 35 % und 50 % Klinkersubstitution nach 28 und 91 Tagen Hydratation auf?
* **Unterfrage 2:** Welcher Zusammenhang besteht zwischen der Menge des gebildeten Monocarboaluminats und der kapillaren Sauggeschwindigkeit?
* **Unterfrage 3:** Kann durch die Zugabe eines synthetischen Luftporenbildners der kritische Abstandsfaktor (< 0,20 mm) in klinkerarmen Systemen dauerhaft stabilisiert werden?

#### 2. Prüfbare Hypothesen
* **H1:** Mit steigendem Gehalt an calciniertem Ton verfeinert sich das Kapillarporengefüge, wodurch die kapillare Wasseraufnahme um mindestens 25 % sinkt.
* **H2:** Aufgrund des verringerten Portlanditgehalts ($Ca(OH)_2$) sinkt die Pufferkapazität gegenüber Säureangriff, während der Chloridmigrationskoeffizient infolge von Aluminationen-Bindung um > 40 % abnimmt.
* **H3:** Die Abwitterung im CDF-Test nach DIN EN 12390-9 unterschreitet den Grenzwert von 1500 g/m² nur bei gezielter künstlicher Porenbildung.`
  },
  {
    id: 'python_parser',
    title: 'Python-Skript: Prüfmaschinen-CSV auswerten & plotten',
    targetChapter: 'Kapitel 4: Experimentelle Ergebnisse & Auswertung',
    scenario: 'Automatisiertes Einlesen von Rohdaten aus der Druckprüfmaschine, Glätten, Ermittlung des E-Moduls und druckreife Vektorgrafik.',
    promptText: `Schreibe ein vollständiges, sofort lauffähiges Python-Skript mit Pandas, NumPy und Matplotlib zur wissenschaftlichen Auswertung von Druckversuchsdaten für meine Thesis.

Anforderungen an das Skript:
1. Einlesen einer CSV-Datei mit den Spalten "Zeit_s", "Weg_mm", "Kraft_kN".
2. Geometrie des Probekörpers als Variablen: Zylinder d = 150 mm, h = 300 mm (oder Würfel a = 150 mm).
3. Berechnung der Spannung σ in N/mm² (MPa) und Dehnung ε in ‰.
4. Automatische Ermittlung:
   - Maximale Druckfestigkeit f_cm [N/mm²]
   - Sekanten-Elastizitätsmodul E_c zwischen 0,05 * f_cm und 0,33 * f_cm nach DIN EN 12390-13.
5. Erstellung eines gestochen scharfen Plots (Spannungs-Dehnungs-Diagramm) nach wissenschaftlichen Kriterien:
   - Schriftart sans-serif, Achsenbeschriftungen mit physikalischen Einheiten, Gitterlinien (subtil).
   - Hervorhebung des E-Modul-Anstiegs und des Scheitelpunkts f_cm.
   - Speicherung als hochauflösende Vektorgrafik (PDF und SVG) mit 300 dpi.
Ergänze den Code mit sauberen Kommentaren und Fehlerbehandlung bei fehlerhaften Kopfzeilen.`,
    sampleOutput: `\`\`\`python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# 1. Probenparameter definieren
PROBENTYP = "Zylinder"  # "Zylinder" oder "Wuerfel"
DURCHMESSER_MM = 150.0  # mm
HOEHE_MM = 300.0        # mm
QUERSCHNITT_MM2 = np.pi * (DURCHMESSER_MM / 2)**2

def evaluate_compression_test(csv_filepath, output_pdf="spannungs_dehnungs_kurve.pdf"):
    # 2. CSV-Daten einlesen (Trennzeichen & Header flexibel)
    df = pd.read_csv(csv_filepath, sep=";", decimal=",", skiprows=2)
    # Normierung der Spalten
    weg_mm = df["Weg_mm"].values
    kraft_kn = df["Kraft_kN"].values
    
    # 3. Mechanische Kennwerte berechnen
    spannung_mpa = (kraft_kn * 1000.0) / QUERSCHNITT_MM2
    dehnung_promille = (weg_mm / HOEHE_MM) * 1000.0  # ‰
    
    # Spitzenwert (Druckfestigkeit)
    idx_max = np.argmax(spannung_mpa)
    f_cm = spannung_mpa[idx_max]
    eps_at_fcm = dehnung_promille[idx_max]
    
    # 4. Sekanten-E-Modul nach DIN EN 12390-13 (0.05 bis 0.33 f_cm)
    sigma_1 = 0.05 * f_cm
    sigma_2 = 0.33 * f_cm
    idx_1 = np.where(spannung_mpa >= sigma_1)[0][0]
    idx_2 = np.where(spannung_mpa >= sigma_2)[0][0]
    
    e_modul_gpa = ((spannung_mpa[idx_2] - spannung_mpa[idx_1]) / 
                   ((dehnung_promille[idx_2] - dehnung_promille[idx_1]) / 1000.0)) / 1000.0
    
    # 5. Wissenschaftlicher Plot (Matplotlib)
    plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
    fig, ax = plt.subplots(figsize=(7, 4.5), dpi=300)
    
    ax.plot(dehnung_promille, spannung_mpa, color="#8B1538", lw=2, label="Spannungs-Dehnungs-Kurve")
    ax.plot([dehnung_promille[idx_1], dehnung_promille[idx_2]], 
            [spannung_mpa[idx_1], spannung_mpa[idx_2]], 
            color="#2563eb", ls="--", lw=1.5, label=f"E-Modul Sekante ({e_modul_gpa:.1f} GPa)")
    ax.scatter([eps_at_fcm], [f_cm], color="#dc2626", zorder=5, 
               label=f"$f_{{cm}} = {f_cm:.1f}$ MPa ($\\varepsilon = {eps_at_fcm:.2f}$ ‰)")
    
    ax.set_title(f"Druckversuch Beton ({PROBENTYP} $\\varnothing{DURCHMESSER_MM:.0f} \\times {HOEHE_MM:.0f}$ mm)", fontsize=11, fontweight="bold")
    ax.set_xlabel("Stauchung $\\varepsilon$ [‰]", fontsize=10)
    ax.set_ylabel("Druckspannung $\\sigma$ [N/mm²]", fontsize=10)
    ax.legend(frameon=True, facecolor="white", edgecolor="#cbd5e1", fontsize=9)
    plt.tight_layout()
    plt.savefig(output_pdf, format="pdf", bbox_inches="tight")
    print(f"Erfolgreich gespeichert: {output_pdf} | f_cm = {f_cm:.2f} MPa, E = {e_modul_gpa:.1f} GPa")

evaluate_compression_test("messdaten.csv")
\`\`\``
  },
  {
    id: 'literature_synthesis',
    title: 'Widersprüchliche Fachliteratur synthetisieren & vergleichen',
    targetChapter: 'Kapitel 2: Stand der Wissenschaft & Technik',
    scenario: 'Objektive Gegenüberstellung divergierender Studienbefunde und Ableitung der eigenen Forschungslücke.',
    promptText: `Du bist wissenschaftlicher Mitarbeiter an einem materialwissenschaftlichen Institut im Bauwesen.
Ich muss in meiner Abschlussarbeit den aktuellen Forschungsstand zu folgender Fragestellung zusammenfassen:
"[FRAGESTELLUNG EINGEBEN, z. B. 'Einfluss von Rezykliergranulaten (Typ 1) auf das Schwindverhalten von hochfestem Beton']".

Nachfolgend sind die Kernaussagen von 3 Studien, die teils widersprüchliche Resultate liefern:
Studie A (Müller et al., 2021): [Aussage / Werte]
Studie B (Zhang & Dupont, 2023): [Aussage / Werte]
Studie C (Schmidt et al., 2024): [Aussage / Werte]

Bitte erstelle für meine Thesis:
1. Eine vergleichende Synthese (ca. 250 Wörter) im sachlichen, unparteiischen akademischen Passiv-Stil.
2. Eine systematische Ursachenanalyse, warum diese Studien scheinbar divergieren (z. B. Vorfeuchtung der Gesteinskörnung, Mehlkornanteil, Porosität, Nachbehandlungsdauer).
3. Die präzise Definition der verbleibenden Forschungslücke ("Research Gap"), an der meine Thesis ansetzt.
Verwende exakte ingenieurwissenschaftliche Fachtermini und verzichte vollständig auf Floskeln.`,
    sampleOutput: `### Stand der Forschung: Einfluss rezyklierter Gesteinskörnungen auf das Schwinden

Die quantitative Auswirkung von Brechsand und grober rezyklierter Gesteinskörnung (Typ 1 nach DIN EN 12620) auf das Gesamtschwindmaß von Zementsteinmatrixen wird in der Fachliteratur kontrovers diskutiert. Während Müller et al. (2021) bei einer 50-prozentigen Substitution des Naturkorns eine Erhöhung des 91-Tage-Trocknungsschwindens um bis zu 38 % dokumentieren, stellen Zhang und Dupont (2023) bei identischem Nennsubstitutionsgrad lediglich einen Anstieg von 12 % fest. Schmidt et al. (2024) wiederum beobachten unter spezifischen klimatischen Randbedingungen sogar eine temporäre Schwindminderung in den ersten 14 Tagen.

Die Diskrepanz dieser experimentellen Befunde lässt sich primär auf die Feuchtekonditionierung der Rezyklate vor dem Mischprozess zurückführen:
* **Wasseraufnahmekinetik & Vorkonditionierung:** Vollständig vorgetränkte Rezyklate fungieren im Sinne eines internen Nachbehandlungsspeichers ("Internal Curing"), welcher die autogene Schwindverkürzung in der Frühphase signifikant kompensiert (Schmidt et al.).
* **Anhaftender Altmörtelanteil:** Bei Müller et al. wiesen die rezyklierten Körnungen einen Altmörtelanteil von 42 Vol.-% mit hoher Mikroporosität auf, was das E-Modul des Stützgerüsts drastisch absenkte und somit dem Schwindzug der Zementmatrix geringeren Verformungswiderstand entgegensetzte.

**Forschungslücke für die vorliegende Arbeit:**
Bisher fehlt eine systematische Korrelation zwischen dem dynamischen Sättigungsgrad ($S_w = 40\\% \\dots 90\\%$) vorbewässerter RC-Gesteinskörnungen und der Entkopplung von autogenem und kapillarem Trocknungsschwinden in klinkerreduzierten Hochleistungsbetonen.`
  },
  {
    id: 'abstract_dual',
    title: 'Zweisprachiges Abstract formulieren (DE / EN)',
    targetChapter: 'Vorspann: Abstract / Kurzfassung',
    scenario: 'Kompakte, prägnante Zusammenfassung (200–250 Wörter) nach dem wissenschaftlichen IMRAD-Format (Introduction, Methods, Results, and Discussion).',
    promptText: `Du bist Chefredakteur einer renommierten Fachzeitschrift für Werkstoffe im Bauwesen (z. B. "Cement and Concrete Research").
Erstelle für meine [Bachelorarbeit / Masterarbeit] ein druckreifes, zweisprachiges Abstract (Deutsch und britisches Englisch) basierend auf folgenden Eckdaten meiner Arbeit:

1. Problemstellung & Motivation: [z. B. Hohe CO2-Emissionen der Klinkerherstellung erfordern neue Puzzolane]
2. Methodik & Untersuchungsumfang: [z. B. 48 Probekörper, Druckprüfung nach 2, 7, 28, 91 Tagen, MIP-Porosimetrie, XRD]
3. Hauptergebnisse & quantitative Kennwerte: [z. B. f_cm nach 28d lag bei 48,3 MPa, Porosität sank um 14 %, CO2 sank um 32 %]
4. Fazit & Relevanz für die Baupraxis: [z. B. Eignung für Expositionsklasse XC3 bei Einhaltung von w/z = 0,45]

Formatiere die Antwort mit klaren Absätzen für Einleitung, Methodik, Ergebnisse und Schlussfolgerung. Max. 250 Wörter pro Sprache. Ergänze jeweils 5 relevante Fach-Keywords.`,
    sampleOutput: `### Kurzfassung (Deutsch)
Die Dekarbonisierung der zementgebundenen Baustoffindustrie erfordert den verstärkten Einsatz alternativer Puzzolane zur Klinkersubstitution. Die vorliegende Masterarbeit untersucht das Potenzial calcinierter Tone als reaktive Bindemittelkomponente in Normalbetonen der Festigkeitsklasse C30/37. Im Rahmen eines systematischen Laborprogramms wurden 48 zylindrische Probekörper mit Substitutionsgraden von 0 bis 40 Masse-% hergestellt und nach 2, 7, 28 sowie 91 Tagen auf ihre mechanischen und mikrostrukturellen Eigenschaften geprüft. Die Phasenentwicklung und Gefügeveränderungen wurden mittels Quecksilberdruckporosimetrie (MIP) und Röntgenbeugung (XRD) quantifiziert.

Die Versuchsergebnisse belegen, dass bei einem Substitutionsgrad von 25 Masse-% eine 28-Tage-Druckfestigkeit von 48,3 N/mm² erzielt wird, was dem Niveau der reinen Portlandzement-Referenz entspricht. Die Gesamtporosität reduzierte sich infolge puzzolanischer C-A-S-H-Phasenbildung um 14,2 %, während der wirksame Chloridmigrationskoeffizient signifikant abnahm. Bei Einhaltung eines maximalen w/z-Wertes von 0,45 wird eine Treibhauspotenzial-Reduktion (GWP) von 32 % gegenüber konventionellen Rezepturen erreicht. Die Ergebnisse bestätigen die Eignung der Mischungen für Außenbauteile der Expositionsklassen XC3 und XD1.

**Schlagwörter:** Calcinierter Ton, Klinkersubstitution, Druckfestigkeit, Quecksilberdruckporosimetrie, CO₂-Reduktion, Dauerhaftigkeit.

---

### Abstract (English)
Decarbonising the cementitious building materials sector necessitates the accelerated utilization of supplementary cementitious materials. This Master's thesis investigates the efficacy of calcined clays as reactive binder components in normal-weight concrete conforming to strength class C30/37. In an experimental laboratory campaign, 48 cylindrical specimens with clinker replacement ratios ranging from 0 to 40 wt.% were cast and tested for mechanical performance and microstructural evolution at 2, 7, 28, and 91 days. Microstructural modifications were quantified via mercury intrusion porosimetry (MIP) and X-ray diffraction (XRD).

Experimental findings demonstrate that a 25 wt.% calcined clay substitution yields a 28-day compressive strength of 48,3 MPa, matching the reference mix with pure Portland cement. Total capillary porosity decreased by 14,2% due to pozzolanic C-A-S-H phase precipitation, accompanied by a substantial reduction in chloride migration. Adhering to a maximum w/c ratio of 0.45 achieves a 32% reduction in global warming potential (GWP) relative to standard mixtures. These findings confirm the operational viability of metakaolin-blended concrete for structural elements in exposure classes XC3 and XD1.

**Keywords:** Calcined clay, Clinker substitution, Compressive strength, Mercury intrusion porosimetry, Decarbonisation, Durability.`
  }
];

export default function ToolsFuerThesen() {
  const [activeSubTab, setActiveSubTab] = useState<'literatur' | 'schreiben' | 'coding' | 'integritaet' | 'prompts'>('literatur');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'literatur' | 'schreiben' | 'coding'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Custom Prompt Builder State
  const [activePromptId, setActivePromptId] = useState<string>('expose');
  const [customTopic, setCustomTopic] = useState<string>('Klinkerreduzierte Betone mit calcinierten Tonen');
  const [customMaterial, setCustomMaterial] = useState<string>('C30/37 XC4/XF1 mit CEM II/C-M');
  const [customTesting, setCustomTesting] = useState<string>('Druckfestigkeit 28d, CDF-Frosttest, MIP');
  const [promptCopied, setPromptCopied] = useState<boolean>(false);

  const filteredTools = THESIS_TOOLS.filter(t => categoryFilter === 'all' || t.category === categoryFilter);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const currentPrompt = THESIS_PROMPTS.find(p => p.id === activePromptId) || THESIS_PROMPTS[0];

  // Dynamic Prompt with customized inputs
  const dynamicPromptString = currentPrompt.promptText
    .replace(/\[HIER THEMA EINTRAGEN.*?\]/g, customTopic)
    .replace(/\[FRAGESTELLUNG EINGEBEN.*?\]/g, `Einfluss von ${customMaterial} auf ${customTesting}`)
    .replace(/\[z\. B\. Hohe CO2-Emissionen.*?\]/g, `Hohe Emissionen erfordern ${customMaterial}`)
    .replace(/\[z\. B\. 48 Probekörper.*?\]/g, `Laborprogramm mit ${customTesting}`)
    .replace(/\[z\. B\. f_cm nach 28d lag bei 48,3 MPa.*?\]/g, `Gute Festigkeit und Dauerhaftigkeit bei ${customTopic}`);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* INTRO HERO BANNER */}
      <div className="bg-gradient-to-br from-shiraz/5 via-white to-off-white p-6 rounded-2xl border border-shiraz/20 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-shiraz/10 text-shiraz text-xs font-bold font-mono">
            <GraduationCap size={14} /> Akademischer Werkzeugkasten für Abschlussarbeiten
          </div>
          <h3 className="text-xl font-bold text-text-main">
            Tools &amp; Workflows für Bachelor- und Masterthesen im Bauwesen
          </h3>
          <p className="text-sm text-text-main/80 leading-relaxed">
            Wissenschaftliches Arbeiten im Bauingenieurwesen erfordert heute mehr als manuelles Durchforsten von Bibliotheksregalen: 
            Von KI-gestützter <strong>Literatur-Synthese (Elicit, Connected Papers)</strong> über <strong>quellentreue Textarbeit (NotebookLM, Overleaf)</strong> bis hin zur <strong>automatisierten Datenauswertung von Prüfmaschinen (Python, Cursor)</strong>. 
            Nutzen Sie diese Werkzeuge als Effizienz-Katalysator – unter strikter Einhaltung der <strong>wissenschaftlichen Integrität</strong>.
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-home-grau/30 shadow-xs shrink-0 text-center w-full md:w-auto">
          <div className="text-xs text-text-main/70 font-semibold uppercase tracking-wider mb-1">Empfohlener Stack</div>
          <div className="text-lg font-black text-shiraz font-mono">Top-12 Tools</div>
          <div className="text-[11px] text-text-main/60 mt-0.5">Kuratierte Ingenieur-Auswahl</div>
        </div>
      </div>

      {/* SUB-TABS NAVIGATION */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-home-grau/20">
        <button
          onClick={() => setActiveSubTab('literatur')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
            activeSubTab === 'literatur'
              ? 'bg-shiraz text-white border-shiraz shadow-sm'
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
          }`}
        >
          <Search size={15} /> 1. Literatur &amp; Research Mapping
        </button>

        <button
          onClick={() => setActiveSubTab('schreiben')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
            activeSubTab === 'schreiben'
              ? 'bg-shiraz text-white border-shiraz shadow-sm'
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
          }`}
        >
          <FileText size={15} /> 2. Schreiben, Synthese &amp; LaTeX
        </button>

        <button
          onClick={() => setActiveSubTab('coding')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
            activeSubTab === 'coding'
              ? 'bg-shiraz text-white border-shiraz shadow-sm'
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
          }`}
        >
          <Code size={15} /> 3. Tools programmieren &amp; Datenanalyse
        </button>

        <button
          onClick={() => setActiveSubTab('prompts')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
            activeSubTab === 'prompts'
              ? 'bg-shiraz text-white border-shiraz shadow-sm'
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
          }`}
        >
          <Sparkles size={15} /> 4. Thesis-Prompt-Labor
        </button>

        <button
          onClick={() => setActiveSubTab('integritaet')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
            activeSubTab === 'integritaet'
              ? 'bg-shiraz text-white border-shiraz shadow-sm'
              : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
          }`}
        >
          <CheckSquare size={15} /> 5. Integrität &amp; KI-Deklaration
        </button>
      </div>

      {/* 1. LITERATUR & RESEARCH MAPPING */}
      {activeSubTab === 'literatur' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <Search className="text-shiraz w-4 h-4" /> Systematische Literaturrecherche &amp; Paper-Mapping
              </h4>
              <p className="text-xs text-text-main/75 leading-relaxed">
                Kombiniere Zitationsgraphen (Connected Papers / Research Rabbit) zur Entdeckung von Ursprungswerken mit KI-Extraktoren (Elicit), um Prüfdaten hunderter Studien ohne manuelles Blättern zu vergleichen.
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-mono bg-white px-3 py-1.5 rounded-lg border border-home-grau/25 text-shiraz font-bold shrink-0">
              6 Spezial-Tools
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {THESIS_TOOLS.filter(t => t.category === 'literatur').map(tool => (
              <div key={tool.id} className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-shiraz/40 transition-all">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                    <a 
                      href={tool.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-text-main/40 hover:text-shiraz transition-colors p-1"
                      title="Website öffnen"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>

                  <div>
                    <h4 className="font-bold text-base text-text-main">{tool.name}</h4>
                    <span className="text-[10px] font-mono text-text-main/50 block mt-0.5">Lizenz: {tool.pricing}</span>
                  </div>

                  <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                    {tool.summary}
                  </p>

                  <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-1.5 text-xs">
                    <span className="text-[10px] font-bold text-shiraz uppercase tracking-wider block">
                      Thesis-Einsatz:
                    </span>
                    <p className="text-text-main/80 leading-relaxed text-[11px]">
                      {tool.thesisWorkflow}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-home-grau/20 space-y-2 text-[11px]">
                  <div className="text-emerald-700 flex items-start gap-1">
                    <span className="font-bold shrink-0">Tipp:</span>
                    <span>{tool.proTip}</span>
                  </div>
                  <div className="text-amber-800 flex items-start gap-1">
                    <span className="font-bold shrink-0">Achtung:</span>
                    <span>{tool.caution}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Workflow Diagram Box */}
          <div className="p-5 bg-white rounded-2xl border border-home-grau/30 space-y-3">
            <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
              <Compass className="text-shiraz w-4 h-4" /> Der perfekte 4-Stufen-Literaturworkflow für Ihre Thesis
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25 space-y-1">
                <span className="font-mono font-bold text-shiraz text-xs">Schritt 1: Entdecken</span>
                <h5 className="font-bold text-text-main">Connected Papers</h5>
                <p className="text-text-main/70 text-[11px] leading-relaxed">
                  Starten Sie mit dem zentralen Paper Ihres Betreuers und identifizieren Sie die 20 relevantesten Schwesterarbeiten.
                </p>
              </div>
              <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25 space-y-1">
                <span className="font-mono font-bold text-shiraz text-xs">Schritt 2: Extrahieren</span>
                <h5 className="font-bold text-text-main">Elicit &amp; Scite.ai</h5>
                <p className="text-text-main/70 text-[11px] leading-relaxed">
                  Ziehe Dosierungen, w/z-Werte und Festigkeitsdaten in eine strukturierte Vergleichstabelle heraus.
                </p>
              </div>
              <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25 space-y-1">
                <span className="font-mono font-bold text-shiraz text-xs">Schritt 3: Konsolidieren</span>
                <h5 className="font-bold text-text-main">Zotero + Zotero-AI</h5>
                <p className="text-text-main/70 text-[11px] leading-relaxed">
                  Speichere alle Volltext-PDFs ab und lass BibTeX-Schlüssel für LaTeX automatisch anlegen.
                </p>
              </div>
              <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25 space-y-1">
                <span className="font-mono font-bold text-shiraz text-xs">Schritt 4: Verifizieren</span>
                <h5 className="font-bold text-text-main">NotebookLM</h5>
                <p className="text-text-main/70 text-[11px] leading-relaxed">
                  Befragen Sie ausschließlich Ihre gesammelten PDFs zu spezifischen Versuchsrandbedingungen mit exaktem Seitennachweis.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SCHREIBEN, SYNTHESE & LATEX */}
      {activeSubTab === 'schreiben' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <FileText className="text-shiraz w-4 h-4" /> Wissenschaftliches Formulieren, Synthese &amp; LaTeX
              </h4>
              <p className="text-xs text-text-main/75 leading-relaxed">
                Sparen Sie hunderte Stunden Formatierungsaufwand. Nutzen Sie KI zur Eliminierung von Schachtelsätzen, zur Übersetzung von Fachbegriffen und zur automatischen Generierung von normgerechten LaTeX-Tabellen nach DIN 1338.
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-mono bg-white px-3 py-1.5 rounded-lg border border-home-grau/25 text-shiraz font-bold shrink-0">
              5 Schreibwerkzeuge
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {THESIS_TOOLS.filter(t => t.category === 'schreiben').map(tool => (
              <div key={tool.id} className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-shiraz/40 transition-all">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                    <a 
                      href={tool.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-text-main/40 hover:text-shiraz transition-colors p-1"
                      title="Website öffnen"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>

                  <div>
                    <h4 className="font-bold text-base text-text-main">{tool.name}</h4>
                    <span className="text-[10px] font-mono text-text-main/50 block mt-0.5">Lizenz: {tool.pricing}</span>
                  </div>

                  <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                    {tool.summary}
                  </p>

                  <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-1.5 text-xs">
                    <span className="text-[10px] font-bold text-shiraz uppercase tracking-wider block">
                      Thesis-Einsatz:
                    </span>
                    <p className="text-text-main/80 leading-relaxed text-[11px]">
                      {tool.thesisWorkflow}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-home-grau/20 space-y-2 text-[11px]">
                  <div className="text-emerald-700 flex items-start gap-1">
                    <span className="font-bold shrink-0">Tipp:</span>
                    <span>{tool.proTip}</span>
                  </div>
                  <div className="text-amber-800 flex items-start gap-1">
                    <span className="font-bold shrink-0">Achtung:</span>
                    <span>{tool.caution}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* LaTeX Tip Box */}
          <div className="p-5 bg-white rounded-2xl border border-home-grau/30 space-y-3">
            <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
              <FileCode2 className="text-shiraz w-4 h-4" /> Best Practice: Tabellen- &amp; Formelgenerierung für Overleaf
            </h4>
            <p className="text-xs text-text-main/80 leading-relaxed">
              Statt mühsam Tabellenspalten von Hand auszurichten, können Sie KI-Assistenten bitten, Rohdaten aus Excel direkt in perfekten LaTeX-Code mit dem Paket <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-shiraz">booktabs</code> und <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-shiraz">siunitx</code> zu transformieren:
            </p>
            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto">
              <pre>{`% Empfohlener LaTeX-Prompt für Tabellen:
"Erstelle mir eine barrierefreie, elegante LaTeX-Tabelle mit booktabs für folgende Prüfserie:
Rezeptur, Zement [kg/m³], w/z-Wert [-], Druckfestigkeit 28d [N/mm²], E-Modul [GPa].
Richte die Dezimalzahlen mit dem siunitx-Paket S-Spalten am Komma aus. Keine vertikalen Linien!"`}</pre>
            </div>
          </div>
        </div>
      )}

      {/* 3. TOOLS PROGRAMMIEREN & DATENANALYSE */}
      {activeSubTab === 'coding' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <Code className="text-shiraz w-4 h-4" /> Vibe Coding &amp; Wissenschaftliche Datenpipelines
              </h4>
              <p className="text-xs text-text-main/75 leading-relaxed">
                Als Bauingenieur müssen Sie kein Vollzeit-Programmierer sein. Mit KI-Code-Editoren (Cursor, Claude Code) und Python-Skripten automatisieren Sie die Auswertung von Prüfmaschinen und bauen interaktive Rechner für Ihre Masterthesis.
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-mono bg-white px-3 py-1.5 rounded-lg border border-home-grau/25 text-shiraz font-bold shrink-0">
              4 Coding-Tools
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            {THESIS_TOOLS.filter(t => t.category === 'coding').map(tool => (
              <div key={tool.id} className="bg-white p-5 rounded-2xl border border-home-grau/30 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-shiraz/40 transition-all">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                    <a 
                      href={tool.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-text-main/40 hover:text-shiraz transition-colors p-1"
                      title="Website öffnen"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>

                  <div>
                    <h4 className="font-bold text-base text-text-main">{tool.name}</h4>
                    <span className="text-[10px] font-mono text-text-main/50 block mt-0.5">Lizenz: {tool.pricing}</span>
                  </div>

                  <p className="text-xs text-text-main/80 leading-relaxed font-normal">
                    {tool.summary}
                  </p>

                  <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-1.5 text-xs">
                    <span className="text-[10px] font-bold text-shiraz uppercase tracking-wider block">
                      Thesis-Einsatz:
                    </span>
                    <p className="text-text-main/80 leading-relaxed text-[11px]">
                      {tool.thesisWorkflow}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-home-grau/20 space-y-2 text-[11px]">
                  <div className="text-emerald-700 flex items-start gap-1">
                    <span className="font-bold shrink-0">Tipp:</span>
                    <span>{tool.proTip}</span>
                  </div>
                  <div className="text-amber-800 flex items-start gap-1">
                    <span className="font-bold shrink-0">Achtung:</span>
                    <span>{tool.caution}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Practical Example Architecture */}
          <div className="p-5 bg-white rounded-2xl border border-home-grau/30 space-y-4">
            <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
              <Terminal className="text-shiraz w-4 h-4" /> Typische Python-Aufgaben in Baustoff-Thesen
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                <span className="font-bold text-shiraz text-xs block">1. Rohdaten-Parsing</span>
                <p className="text-text-main/80 leading-relaxed">
                  Einlesen von CSV/TXT-Exporten aus Zwick/Roell, Form+Test oder Toni Technik Prüfmaschinen. Automatische Erkennung von Nullpunkt, Vorlast und Bruchlast.
                </p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                <span className="font-bold text-shiraz text-xs block">2. Statistische Auswertung</span>
                <p className="text-text-main/80 leading-relaxed">
                  Berechnung von Mittelwert <InlineMath math="f_{cm}" />, Standardabweichung <InlineMath math="s" />, Variationskoeffizient <InlineMath math="v" /> und charakteristischer Festigkeit <InlineMath math="f_{ck} = f_{cm} - 1{,}64 \cdot s" /> nach DIN EN 206.
                </p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
                <span className="font-bold text-shiraz text-xs block">3. Interaktives Streamlit-Tool</span>
                <p className="text-text-main/80 leading-relaxed">
                  Bereitstellung des Berechnungsverfahrens als Web-Applikation. Prüfer können im Kolloquium live Parameter anpassen und Ergebnisse nachvollziehen.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. THESIS-PROMPT-LABOR */}
      {activeSubTab === 'prompts' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <Sparkles className="text-shiraz w-4 h-4" /> Interaktives Thesis-Prompt-Labor
              </h4>
              <p className="text-xs text-text-main/75 leading-relaxed">
                Wählen Sie ein wissenschaftliches Thesen-Szenario, passen Sie Ihre Themen-Parameter an und kopieren Sie den fertig optimierten Prompt für ChatGPT, Claude oder Gemini.
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-mono bg-white px-3 py-1.5 rounded-lg border border-home-grau/25 text-shiraz font-bold shrink-0">
              4 Praxisszenarien
            </div>
          </div>

          {/* Scenario Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {THESIS_PROMPTS.map(p => (
              <button
                key={p.id}
                onClick={() => setActivePromptId(p.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  activePromptId === p.id
                    ? 'bg-shiraz/5 border-shiraz shadow-xs text-text-main'
                    : 'bg-white border-home-grau/30 hover:border-shiraz/40 text-text-main/80'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-shiraz block uppercase mb-1">
                    {p.targetChapter}
                  </span>
                  <h5 className="font-bold text-xs text-text-main leading-snug">{p.title}</h5>
                </div>
                <div className="text-[11px] text-text-main/60 line-clamp-2">
                  {p.scenario}
                </div>
              </button>
            ))}
          </div>

          {/* Parameters Customizer */}
          <div className="p-5 bg-white rounded-2xl border border-home-grau/30 space-y-4">
            <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
              <Sliders className="text-shiraz w-4 h-4" /> Parameter für Ihre Thesis anpassen
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-main block">Thesis-Thema / Fragestellung:</label>
                <input 
                  type="text" 
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-home-grau/30 bg-off-white text-text-main focus:outline-none focus:border-shiraz"
                  placeholder="z. B. Rezyklatbeton mit Calciumsilikathydrat-Impfung"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-main block">Untersuchte Baustoffe / Klassen:</label>
                <input 
                  type="text" 
                  value={customMaterial}
                  onChange={(e) => setCustomMaterial(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-home-grau/30 bg-off-white text-text-main focus:outline-none focus:border-shiraz"
                  placeholder="z. B. C30/37 mit RC-Gesteinskörnung Typ 1"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-main block">Prüfmethoden &amp; Kenngrößen:</label>
                <input 
                  type="text" 
                  value={customTesting}
                  onChange={(e) => setCustomTesting(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-home-grau/30 bg-off-white text-text-main focus:outline-none focus:border-shiraz"
                  placeholder="z. B. Druckfestigkeit, E-Modul, Schwindmaß nach DIN 1048"
                />
              </div>
            </div>
          </div>

          {/* Generated Prompt Box */}
          <div className="p-5 bg-white rounded-2xl border border-home-grau/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-home-grau/20">
              <div>
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider block font-mono">
                  Generierter Prompt für: {currentPrompt.title}
                </span>
                <p className="text-xs text-text-main/70">{currentPrompt.targetChapter}</p>
              </div>

              <button
                onClick={() => handleCopyText(dynamicPromptString, 'prompt_labor')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
                  copiedId === 'prompt_labor'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-shiraz text-white border-shiraz hover:bg-shiraz/90'
                }`}
              >
                {copiedId === 'prompt_labor' ? (
                  <>
                    <CheckCircle2 size={15} /> In die Zwischenablage kopiert!
                  </>
                ) : (
                  <>
                    <Copy size={15} /> Prompt kopieren
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {dynamicPromptString}
            </div>

            {/* Collapsible Sample Output */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-text-main/80 flex items-center gap-1.5">
                <FileCheck2 size={14} className="text-shiraz" /> Erwartetes Antwortmuster des LLMs (Vorschau):
              </span>
              <div className="bg-off-white p-4 rounded-xl border border-home-grau/20 text-xs text-text-main/80 whitespace-pre-wrap font-sans leading-relaxed">
                <FormulaText text={currentPrompt.sampleOutput} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. INTEGRITÄT & KI-DEKLARATION */}
      {activeSubTab === 'integritaet' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-off-white p-4 rounded-xl border border-home-grau/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <CheckSquare className="text-shiraz w-4 h-4" /> Wissenschaftliche Integrität, Prüfungsrecht &amp; KI-Deklaration
              </h4>
              <p className="text-xs text-text-main/75 leading-relaxed">
                Die Nutzung von KI-Tools ist an den meisten Hochschulen (z. B. TH Augsburg, TU München, RWTH Aachen) als Hilfsmittel zulässig – <strong>sofern sie transparent deklariert wird</strong>. Hier finden Sie Richtlinien, Vorlagen für den Anhang und die Ehrenwörtliche Erklärung.
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-mono bg-white px-3 py-1.5 rounded-lg border border-home-grau/25 text-shiraz font-bold shrink-0">
              Rechtlich belastbar
            </div>
          </div>

          {/* The 5 Golden Rules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl border border-home-grau/30 space-y-2">
              <span className="w-6 h-6 rounded-full bg-shiraz/10 text-shiraz font-mono font-bold flex items-center justify-center text-xs">1</span>
              <h5 className="font-bold text-sm text-text-main">Vollständige Transparenz</h5>
              <p className="text-xs text-text-main/75 leading-relaxed">
                Deklarieren Sie im Anhang Ihrer Thesis tabellarisch alle verwendeten KI-Tools, den genauen Verwendungszweck (z. B. Sprachpolitur, Python-Skript) und typische Prompts.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-home-grau/30 space-y-2">
              <span className="w-6 h-6 rounded-full bg-shiraz/10 text-shiraz font-mono font-bold flex items-center justify-center text-xs">2</span>
              <h5 className="font-bold text-sm text-text-main">Keine Fake-Zitate (Anti-Halluzination)</h5>
              <p className="text-xs text-text-main/75 leading-relaxed">
                Zitieren Sie niemals eine Quelle, die Ihnen eine KI nennt, ohne das Original-PDF mit eigenem Auge auf DOI, Seitenzahl und Autoren geprüft zu haben.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-home-grau/30 space-y-2">
              <span className="w-6 h-6 rounded-full bg-shiraz/10 text-shiraz font-mono font-bold flex items-center justify-center text-xs">3</span>
              <h5 className="font-bold text-sm text-text-main">Eigene wissenschaftliche Leistung</h5>
              <p className="text-xs text-text-main/75 leading-relaxed">
                Die Interpretation der Messergebnisse, die Diskussion der Baustoffmechanik und die Schlussfolgerungen müssen zwingend von Ihnen selbst stammen. KI darf nur formulieren und berechnen helfen.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-home-grau/30 space-y-2">
              <span className="w-6 h-6 rounded-full bg-shiraz/10 text-shiraz font-mono font-bold flex items-center justify-center text-xs">4</span>
              <h5 className="font-bold text-sm text-text-main">Datenschutz bei Industriekooperationen</h5>
              <p className="text-xs text-text-main/75 leading-relaxed">
                Wird Ihre Thesis in Kooperation mit einem Baukonzern oder Prüflabor verfasst, dürfen vertrauliche Rezepturen, Kosten oder Patente niemals in öffentliche Cloud-LLMs hochgeladen werden.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-home-grau/30 space-y-2">
              <span className="w-6 h-6 rounded-full bg-shiraz/10 text-shiraz font-mono font-bold flex items-center justify-center text-xs">5</span>
              <h5 className="font-bold text-sm text-text-main">Eigenverantwortung für Fehler</h5>
              <p className="text-xs text-text-main/75 leading-relaxed">
                Rechenfehler, fehlerhafte Einheiten oder falsche Normenbezüge in Ihrer Arbeit können nicht auf das KI-Modell geschoben werden. Sie tragen die volle Autorenverantwortung.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-home-grau/30 space-y-2">
              <span className="w-6 h-6 rounded-full bg-shiraz/10 text-shiraz font-mono font-bold flex items-center justify-center text-xs">6</span>
              <h5 className="font-bold text-sm text-text-main">Prüfungsordnung beachten</h5>
              <p className="text-xs text-text-main/75 leading-relaxed">
                Informieren Sie sich vor der Anmeldung über die spezifische Handreichung Ihrer Fakultät (z. B. "Richtlinie zur Verwendung generativer KI-Systeme bei Prüfungsleistungen").
              </p>
            </div>
          </div>

          {/* Copyable Declaration Matrix Table */}
          <div className="p-5 bg-white rounded-2xl border border-home-grau/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-home-grau/20">
              <div>
                <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                  <Table className="text-shiraz w-4 h-4" /> Muster-Deklarationsmatrix für den Anhang der Thesis
                </h4>
                <p className="text-xs text-text-main/70">
                  Fügen Sie diese Tabelle in den Anhang Ihrer Bachelor- oder Masterarbeit ein, um Prüfern maximale Transparenz zu bieten.
                </p>
              </div>

              <button
                onClick={() => handleCopyText(`| Werkzeug / KI-Modell | Version / Anbieter | Kapitel / Bereich | Konkreter Verwendungszweck |
|---|---|---|---|
| Elicit | elicit.com | Kap. 2 (Stand der Forschung) | Auffinden von Fachartikeln und Extraktion von Festigkeitskennwerten |
| Connected Papers | connectedpapers.com | Kap. 2 (Literaturrecherche) | Visualisierung von Zitationsbeziehungen und Ursprungswerken |
| DeepL Write | deepl.com | Gesamtes Dokument | Stilistische Glättung und Beseitigung von Grammatikfehlern |
| Overleaf Writefull | overleaf.com | Gesamtes Dokument | Akademische Formulierungskontrolle im LaTeX-Quellcode |
| Cursor (z. B. mit Claude) | cursor.com | Kap. 4 (Auswertung) | Erstellung eines Python-Skripts zum Einlesen der Prüfmaschinen-CSV-Daten |
| Google NotebookLM | notebooklm.google.com | Kap. 2 & 5 (Diskussion) | Quellenbasierter Abgleich mit hochgeladenen DIN-Normen |`, 'matrix')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer shrink-0 ${
                  copiedId === 'matrix'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-text-main border-home-grau/30 hover:border-shiraz hover:bg-off-white'
                }`}
              >
                {copiedId === 'matrix' ? (
                  <>
                    <CheckCircle2 size={15} className="text-white" /> Markdown kopiert!
                  </>
                ) : (
                  <>
                    <Copy size={15} /> Tabelle als Markdown kopieren
                  </>
                )}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-home-grau/30 bg-off-white text-text-main font-bold">
                    <th className="p-3">Werkzeug / KI-Modell</th>
                    <th className="p-3">Version / Anbieter</th>
                    <th className="p-3">Kapitel / Bereich</th>
                    <th className="p-3">Konkreter Verwendungszweck</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-text-main/80 font-normal">
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-shiraz">Elicit</td>
                    <td className="p-3 font-mono text-[11px]">elicit.com</td>
                    <td className="p-3">Kap. 2 (Stand der Forschung)</td>
                    <td className="p-3">Auffinden relevanter Primärquellen und tabellarische Extraktion von Festigkeitswerten</td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-shiraz">Connected Papers</td>
                    <td className="p-3 font-mono text-[11px]">connectedpapers.com</td>
                    <td className="p-3">Kap. 2 (Literatur)</td>
                    <td className="p-3">Erstellung von Zitationsgraphen zur Entdeckung von Ursprungswerken</td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-shiraz">DeepL Write</td>
                    <td className="p-3 font-mono text-[11px]">DeepL SE</td>
                    <td className="p-3">Gesamtes Dokument</td>
                    <td className="p-3">Stilistischer Feinschliff, Eliminierung von Schachtelsätzen im deutschen Fließtext</td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-shiraz">Cursor (z. B. mit Claude)</td>
                    <td className="p-3 font-mono text-[11px]">Anysphere / Anthropic</td>
                    <td className="p-3">Kap. 4 (Versuchsauswertung)</td>
                    <td className="p-3">Generierung des Python-Matplotlib-Skripts zum Plotten der Prüfmaschinen-CSV-Rohdaten</td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-shiraz">Google NotebookLM</td>
                    <td className="p-3 font-mono text-[11px]">Google LLC</td>
                    <td className="p-3">Kap. 3 &amp; 5 (Methodik)</td>
                    <td className="p-3">Gegenprüfung von Prüfnormen-Zitaten mit direktem Verweis auf hochgeladene PDFs</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Ehrenwörtliche Erklärung Mustertext */}
          <div className="p-5 bg-white rounded-2xl border border-home-grau/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-home-grau/20">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <FileCheck2 className="text-shiraz w-4 h-4" /> Mustertext: Ergänzung zur Ehrenwörtlichen Erklärung
              </h4>
              <button
                onClick={() => handleCopyText(`Ergänzung zur Eigenständigkeitserklärung bezüglich der Nutzung von generativer Künstlicher Intelligenz:

Ich versichere, dass ich die vorliegende Arbeit selbstständig verfasst und keine anderen als die angegebenen Hilfsmittel verwendet habe. 

Im Rahmen der Literaturrecherche, der sprachlichen Überarbeitung und der datenanalytischen Skripterstellung kamen softwaregestützte Systeme künstlicher Intelligenz (u. a. Elicit, DeepL Write, Cursor) zum Einsatz. Art und Umfang der Nutzung sind in der im Anhang (Abschnitt X) beigefügten Deklarationsmatrix vollständig offengelegt. Die intellektuelle Konzeption, die wissenschaftliche Interpretation der Laborergebnisse sowie alle gezogenen Schlussfolgerungen wurden von mir eigenverantwortlich und persönlich erbracht.`, 'erklaerung')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-xs cursor-pointer ${
                  copiedId === 'erklaerung'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-text-main border-home-grau/30 hover:border-shiraz'
                }`}
              >
                {copiedId === 'erklaerung' ? (
                  <>
                    <CheckCircle2 size={14} className="text-white" /> Kopiert!
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Text kopieren
                  </>
                )}
              </button>
            </div>

            <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 text-xs text-text-main/80 leading-relaxed font-serif italic">
              "Ich versichere, dass ich die vorliegende Arbeit selbstständig verfasst und keine anderen als die angegebenen Hilfsmittel verwendet habe. Im Rahmen der Literaturrecherche, der sprachlichen Überarbeitung und der datenanalytischen Skripterstellung kamen softwaregestützte Systeme künstlicher Intelligenz (u. a. Elicit, DeepL Write, Cursor) zum Einsatz. Art und Umfang der Nutzung sind in der im Anhang beigefügten Deklarationsmatrix vollständig offengelegt. Die wissenschaftliche Interpretation aller Laborergebnisse sowie alle gezogenen Schlussfolgerungen wurden von mir persönlich erbracht."
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
