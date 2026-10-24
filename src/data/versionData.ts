export interface VersionItem {
  version: string;
  date: string;
  title: string;
  badge: 'major' | 'minor' | 'patch';
  changes: string[];
}

export const VERSION_HISTORY: VersionItem[] = [
  {
    version: 'v3.26.1',
    date: '24.10.2026',
    title: 'Geprüfte Rechenkerne Wärmeschutz und Mischungsberechnung',
    badge: 'patch',
    changes: [
      'Wärmeschutz: U-Wert nach DIN EN ISO 6946, Sättigungsdampfdruck und Taupunkt nach DIN 4108-3 als gemeinsamer, getesteter Rechenkern für Bauphysik und Feuchteschutz; ungültige Schichten (z. B. λ = 0) werden gemeldet.',
      'Korrektur Kellerdecke gegen unbeheizten Keller: Wärmeübergangswiderstand außen R_se = 0,17 m²K/W statt 0,04 m²K/W.',
      'Mischungsberechnung: Stoffraumrechnung, Zugabewasser und (w/z)_eq als getesteter Rechenkern; die fünf geprüften Beispielmischungen laufen als Regressionstest mit.',
      'Korrektur Beispiel 5 (VDZ B20): Rohdichte der Gesteinskörnung 2,60 kg/dm³ wird beim Laden übernommen; Oberflächen- und Zugabewasser (13,3 / 161,7 L/m³) sowie Feuchtmasse 4/8 rechnerisch berichtigt.'
    ]
  },
  {
    version: 'v3.26.0',
    date: '24.10.2026',
    title: 'Umsetzungsplan „sehr gut“ Phasen 0–4: Qualitätssicherung, Recht, Barrierefreiheit, Selbsttests & geprüfte Rechenkerne',
    badge: 'minor',
    changes: [
      'Qualitätssicherung & Architektur (Phase 0): Automatische Prüfung jeder Änderung (Typprüfung, Tests, Formel-, Quellen-, Normen- und Zahlenformat-Checks, Build); zentrale Modul-Registry (src/registry/modules.ts) für Menü, Suche, Sitemap und Icons; zentrale Materialkennwerte (EC2 Tab. 3.1) und einheitlicher Normenstand.',
      'Recht & Datenschutz (Phase 1): Neu gefasste Datenschutzerklärung mit vollständigem Speicherregister, Erklärung zur Barrierefreiheit, aktualisiertes Impressum; KI-Assistent nur nach Einwilligung, mit Kennzeichnung, Herkunftsprüfung und Tageslimit; Sicherheits-Header (CSP); Haftungshinweis an allen Rechnern; Vorlesungsbereich ohne Passwort öffentlich zugänglich.',
      'Barrierefreiheit & Bedienung (Phase 2): 0 Verstöße in der automatischen WCAG-Prüfung über alle Module (vorher 2 889 betroffene Elemente), Sprunglink, korrekte Überschriften, Kontraste in Hell- und Dunkelmodus, Tastaturbedienung der Reiter; mobile Darstellung ohne abgeschnittene Inhalte; Volltextsuche über alle Modulinhalte; Startseite mit Themen-Einstieg und „Zuletzt besucht“.',
      'Selbsttests (Phase 3): Cluster-, Gruppen- und Modulzuordnung aller 427 Quizfragen aus der Registry abgeleitet (128 Fehlzuordnungen korrigiert); Sprungziele der Wissenslücken-Analyse führen immer auf ein existierendes Modul; Aufgaben-Reiter starten ein Themen-Quiz der passenden Menügruppen; Klausursimulator weist eine Orientierungsnote (keine Prüfungsleistung) aus.',
      'Begriffs-Styleguide (Phase 3): Einheitlich Wasserzementwert / w/z-Wert, Gesteinskörnung statt Zuschlag (DIN EN 12620), Euler-Fall 1–4 und Sie-Form in allen Lerntipps; automatische Prüfung der Regeln (docs/begriffe.md).',
      'Geprüfte Rechenkerne (Phase 4): Biegung, Querkraft, Stütze, Durchstanzen, Verankerung, Rissbreite und Holzbau (Knicken, Querdruck) als getestete Funktionen in src/calc/ mit Handrechnungen, unabhängigen Vergleichsmodellen und je 1 000 Zufallseingaben; unzulässige Eingaben werden sichtbar gemeldet statt still ersetzt.',
      'Fachliche Korrekturen in den Rechnern: Druckbewehrung mit σ_s2 = min(E_s·ε_s2; f_yd) und A_s,max = 0,04·A_c; nichtmetallische Bewehrung linear-elastisch; Stütze M_Ed = max(M_0Ed + N·e_i; N·e_0) und A_s,max = 0,09·A_c; Rissbreite mit h_c,ef = min{2,5(h − d); (h − x)/3; h/2}; Durchstanzen ρ_l ≤ 0,5·f_cd/f_yd; einheitliche Nummerierung der Euler-Fälle im Holzbau-Rechner; zuvor bereits Mauerwerk, v_min, Relaxation und LCA-Kennzeichnung.'
    ]
  },
  {
    version: 'v3.25.0',
    date: '23.10.2026',
    title: 'Neues Modul Werkstoff-Kombinationen (Cluster II), Schichtaufbau- & Verbund-Kalkulator',
    badge: 'minor',
    changes: [
      'Neues Fachmodul Werkstoff-Kombinationen (kombinationen): Umfassende didaktische Aufbereitung im Cluster II (Materialien & Produkte) mit Schwerpunkt auf Funktionsschichten der Gebäudehülle (Tragen, Dämmen, Schützen), Verbundwerkstoffe (Stahlbeton, CFK/GFK/Textilbeton, Sandwichquerschnitte, VSG) und funktionelle Schutzschichten.',
      'Interaktiver Wandaufbau- & Schichtkalkulator: Dynamische Berechnung von Wärmedurchlasswiderständen, U-Werten nach DIN EN ISO 6946 und diffusionsäquivalenten Luftschichtdicken (sd) nach DIN 4108-3 inklusive bauphysikalischer Glaser-Feuchte-Ampel.',
      'Schutzschichtsysteme & Grenzflächenmechanik: Differenzierung nach DIN EN 1504-2 (Hydrophobierung, Imprägnierung, Versiegelung, OS 1–11), Korrosionsschutz nach DIN EN ISO 12944 (C1 bis CX, kathodischer Schutz) sowie Haftzugprüfung im Abreißversuch nach DIN EN 1542.',
      'Didaktischer 4-Stufen-Lehrpfad: Integration des interaktiven Selbsttests (ModulTest) mit neu verfassten Fachprüfungsfragen in quiz.json und Begründungsfeedback sowie einklappbarer FormulaDerivationBox.'
    ]
  },
  {
    version: 'v3.24.0',
    date: '22.10.2026',
    title: 'Master-Audit 2026: Gesamtrevision AP 1–19, Wissenspool-Ausbau & Rechner-Stabilität',
    badge: 'minor',
    changes: [
      'Didaktik- & Prüfungs-Offensive (AP 18/19): Ausbau des zentralen Prüfungsfragenpools von 26 auf 233 Fachfragen inkl. balancierter Antwortverteilung und dynamischer Zufallsmischung (mischeAntworten); Ausstattung von 80 Fachmodulen mit strukturierten Selbsttests (ModulTest) und 178 einklappbaren Rechenbeispielen (FormulaDerivationBox).',
      'Berechnungs- & Formelpräzision (AP 2/5/6): Durchgängige Implementierung der formatDeZahl-Formatierung (DIN 1333, deutsches Dezimalkomma), NaN- und Nulldivisionsschutz für alle interaktiven Rechnerwerkzeuge sowie fehlerfreie Validierung von 3.103 KaTeX-Formeln.',
      'Normen- & Rechtsaktualisierung (AP 1/3/7/11/14): Bereinigung und Umstellung von 749 Normenverweisen auf das verifizierte DIN-Media-Suchschema; Einarbeitung aktueller Regelwerke wie DIN 1076:2026-01 (Ingenieurbauwerke), DIN EN 15978:2026-09 (Gebäudeökobilanz), GefStoffV 2024, EU-KI-Verordnung (Digital Omnibus) sowie GModG/GEG.',
      'Chart.js- & Performance-Härtung: Zentrale Chart.js-Registrierung (chartSetup.ts) zur Vermeidung redundanter Re-Registrierungen und Verhinderung von Canvas-Rendering-Kollisionen bei Diagrammaufrufen.'
    ]
  },
  {
    version: 'v3.23.2',
    date: '20.10.2026',
    title: 'PDF-Export & Drucksystem mit akademischer Kopf- und Fußzeile',
    badge: 'patch',
    changes: [
      'PDF-Export-Kopfzeile: Automatische Einbindung des Hinweises „Ausschließlich für akademische Lehrzwecke!“ auf jeder einzelnen generierten Druck- und PDF-Seite.',
      'PDF-Export-Fußzeile: Durchgängiges Druckband mit „BaustoffBoard · Prof. Dr.-Ing. Jürgen Huber · TH Augsburg · [DATUM] · [VERSION]“ unter Angabe des tagesaktuellen Druckdatums und der Revisionsnummer.',
      'Drucksystem-Harmonisierung: Gleichzeitige Verankerung in der programmgesteuerten PDF-Engine (jsPDF) sowie im CSS-Paged-Media-Drucklayout (@media print).'
    ]
  },
  {
    version: 'v3.23.1',
    date: '20.10.2026',
    title: 'Favoriten-Fokus auf Feedback-Modul & Vereinheitlichung der Fußnote',
    badge: 'patch',
    changes: [
      'Favoriten-Standardisierung: Beim App-Start ist standardmäßig und ausnahmslos nur noch das Feedback-Modul in den Favoriten hinterlegt, um Nutzerrückmeldungen und Qualitätskontrolle unmittelbar im Blickfeld zu halten.',
      'Harmonisierung der Fußnote: Bereinigung der globalen Fußzeile auf die prägnante und einheitliche Institutszeile „BaustoffBoard · Prof. Dr.-Ing. Jürgen Huber · TH Augsburg“ ohne redundante Menü-Dopplungen.',
      'UI-Hygiene & Layout-Stabilität: Vollständige Bereinigung veralteter lokaler Speichereinträge im Browser-Cache und Verankerung der rechtlichen Pflichtangaben im standardisierten ModuleFooter.'
    ]
  },
  {
    version: 'v3.23.0',
    date: '20.10.2026',
    title: 'Systemweit einklappbare Formelherleitungen, AP 10 Dauerhaftigkeit & Prüfungsfragen-Ausbau',
    badge: 'minor',
    changes: [
      'UI-Architektur & Didaktik: Systemweite Umstellung aller Formelherleitungen (FormulaDerivationBox) auf standardmäßig eingeklappten Zustand für ein aufgeräumtes Leselayout – per Mausklick jederzeit individuell auf- und zuklappbar.',
      'Dauerhaftigkeit & Korrosionsschutz (AP 10): Normative Schärfung der Expositionsklassen (DIN 1045-2:2023-08, c_nom = 55 mm für XD3), PREN-Lochfraßformel für Edelstähle, Holzschutz nach DIN 68800-1 bis -4 sowie DAfStb-Alkali-Richtlinie.',
      'Aufgaben- & Prüfungsbestand: Integration von 14 neuen Fachprüfungsfragen in quiz.json und Ausbau praxisnaher Berechnungsaufgaben zu Fick-II-Chloriddiffusion, Betondeckungsnachweisen und Hausschwamm-Sanierung.'
    ]
  }
];

export const CURRENT_VERSION: VersionItem = VERSION_HISTORY[0];
export const CURRENT_VERSION_NUMBER: string = VERSION_HISTORY[0].version;
export const CURRENT_RELEASE_DATE: string = VERSION_HISTORY[0].date;
