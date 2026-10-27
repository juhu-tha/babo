/**
 * Gemeinsame Typen des Admin-Bereichs „Audit“ (Gutachten, Zulieferungen, Umsetzungsplan).
 * Die statischen Teile liegen in src/data/audit/*.ts und werden per Pull Request gepflegt;
 * Zählungen aus dem Quelltext erzeugt scripts/auditDaten.ts (virtual:audit-daten).
 */

/** Bearbeitungsstand eines Punkts (Maßnahme, Zulieferung, Arbeitspaket) */
export type AuditStatus = 'offen' | 'in_arbeit' | 'wartet' | 'entschieden' | 'zurueckgestellt' | 'erledigt';

/** Anzeigetext je Status – die Anzeige zeigt immer Text, nie nur eine Farbe */
export const AUDIT_STATUS_TEXT: Readonly<Record<AuditStatus, string>> = {
  offen: 'offen',
  in_arbeit: 'in Arbeit',
  wartet: 'wartet auf Prof. Huber',
  entschieden: 'entschieden',
  zurueckgestellt: 'zurückgestellt',
  erledigt: 'erledigt',
};

/** Filter der Zulieferungen: welche Status zu „offen“, „wartet auf mich“ und „erledigt“ zählen */
export type ZulieferFilter = 'alle' | 'offen' | 'wartet' | 'erledigt';
export const ZULIEFER_FILTER: Readonly<Record<Exclude<ZulieferFilter, 'alle'>, readonly AuditStatus[]>> = {
  offen: ['offen', 'in_arbeit', 'zurueckgestellt'],
  wartet: ['wartet'],
  erledigt: ['erledigt', 'entschieden'],
};

export function passtFilter(status: AuditStatus, filter: ZulieferFilter): boolean {
  return filter === 'alle' || ZULIEFER_FILTER[filter].includes(status);
}

export interface Notenkategorie {
  kategorie: string;
  /** Note 1,0–5,0 (Dezimalpunkt im Code, Anzeige mit Komma) */
  note: number;
  begruendung: string;
}

export interface Massnahme {
  nr: number;
  titel: string;
  status: AuditStatus;
  /** betroffene Kategorie(n) bzw. erwartete Wirkung */
  wirkung?: string;
  /** Hinweis zum Stand (z. B. wer zuliefern muss) */
  hinweis?: string;
}

export interface Gutachten {
  /** ISO-Datum JJJJ-MM-TT */
  datum: string;
  grundlage: string;
  ziel: string;
  kategorien: readonly Notenkategorie[];
  massnahmen: readonly Massnahme[];
}

export interface Zulieferung {
  nr: string;
  gegenstand: string;
  stand: string;
  status: AuditStatus;
  /** Statustext der Quelle, wenn er mehr sagt als der Status (z. B. „wartet auf Upload“) */
  statusText?: string;
  /** verknüpfte Pull Requests */
  prs?: readonly number[];
  /** verknüpfte Dateien im Repository */
  dateien?: readonly string[];
}

export interface Arbeitspaket {
  ap: string;
  titel: string;
  status: AuditStatus;
  hinweis?: string;
}

export interface Phase {
  nr: number;
  titel: string;
  aps: readonly Arbeitspaket[];
}

// ---------------------------------------------------------------- erzeugte Daten (scripts/auditDaten.ts → virtual:audit-daten)
export interface FFundstelle { datei: string; zeile: number; kontext: string }
export interface FGruppe { fachgebiet: string; eintraege: FFundstelle[] }
export interface QuizClusterZaehlung {
  cluster: string;
  name: string;
  gesamt: number;
  /** Vorprüfung „korrigiert“ oder „fraglich“ bzw. offener Prüfhinweis in docs/quiz-pruefhinweise.md */
  auffaellig: number;
  korrigiert: number;
  fraglich: number;
  mitPruefhinweis: number;
  verified: number;
  datei: string | null;
  /** Kopfzahlen der Prüfliste („umfasst N Fragen … M auffällige Fragen“), falls lesbar */
  liste: { gesamt: number; auffaellig: number; stand: string } | null;
}
export interface Zeilenbereich { bereich: string; ordner: string; dateien: number; zeilen: number }
export interface AuditDaten {
  erzeugtAm: string;
  fFreigabe: { gesamt: number; dateien: number; gruppen: FGruppe[]; ordner: string[] };
  quiz: { gesamt: number; verified: number; ohneCluster: number; cluster: QuizClusterZaehlung[] };
  kennzahlen: {
    module: number; fachmodule: number; fachmoduleGeprueft: number; fachmoduleOffen: number;
    rechenkerne: number; testdateien: number; quizfragen: number; quizVerified: number; inhaltsdateien: number;
    quelldateien: number; zeilenGesamt: number; bereiche: Zeilenbereich[];
    bundle: { stand: string | null; einstiegGzipKB: number | null; grenzeKB: number | null };
  };
  pakete: { name: string; version: string }[];
}
