export interface VersionItem {
  version: string;
  date: string;
  title: string;
  badge: 'major' | 'minor' | 'patch';
  changes: string[];
}

export const VERSION_HISTORY: VersionItem[] = [
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
