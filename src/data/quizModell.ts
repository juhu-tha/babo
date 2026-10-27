/**
 * Datenmodell des Fragenpools: Typen, Kategorien und Zuordnung (Cluster/Gruppe/Route).
 * Enthält bewusst KEINE Fragen – die liegen in src/data/quiz.json und werden im Browser
 * je Modul bzw. in Teilpaketen nachgeladen (src/data/quizLader.ts, Vite-Plugin scripts/quizPool.ts).
 * Den vollständigen Pool synchron gibt es nur für Tests und Skripte in src/data/quizData.ts.
 */
import { quizCluster, quizGruppe, quizRoute, type ClusterNummer } from './quizZuordnung';

export type QuizCategory = 
  | 'baustoffkunde'
  | 'bindemittel_beton'
  | 'metalle_holz'
  | 'dauerhaftigkeit_schaeden'
  | 'nachhaltigkeit'
  | 'baurecht_normung';

export interface KnowledgeGapInfo {
  topic: string;
  misconception: string;
  coreRule: string;
  actionableAdvice: string;
  targetModuleTab: string;
  targetModuleLabel: string;
}

export type Schwierigkeit = 'Basis' | 'Vertiefung' | 'Transfer';
export type BloomStufe = 'Erinnern' | 'Verstehen' | 'Anwenden' | 'Analysieren' | 'Bewerten' | 'Erschaffen';
export const SCHWIERIGKEITEN: readonly Schwierigkeit[] = ['Basis', 'Vertiefung', 'Transfer'];
export const BLOOM_STUFEN: readonly BloomStufe[] = ['Erinnern', 'Verstehen', 'Anwenden', 'Analysieren', 'Bewerten', 'Erschaffen'];

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  categoryLabel: string;
  /** abgeleitet aus der Modul-Registry (quizZuordnung.ts) */
  clusterId: ClusterNummer;
  clusterName: string;
  /** Menügruppe des zugehörigen Moduls (abgeleitet) */
  gruppe?: string;
  /** Route des zugehörigen Moduls (abgeleitet) */
  route?: string;
  moduleId: string;
  moduleTitle: string;
  topic: string;
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
  gapAnalysis: KnowledgeGapInfo;
  normRef?: string;
  /** Schwierigkeit (AP 3.2): Basis – Vertiefung – Transfer */
  difficulty?: Schwierigkeit;
  /** besonders prüfungsrelevant (früher Schwierigkeit „Klausur-Schwerpunkt“) */
  klausurrelevant?: boolean;
  /** Bloom-Stufe (AP 3.2) */
  bloom?: BloomStufe;
  /** Studienniveau: B = Bachelor, M = Master */
  niveau?: 'B' | 'M';
  /** Rückmeldung je Antwortoption (gleiche Reihenfolge wie options; bei der richtigen Antwort leer) */
  distraktorFeedback?: string[];
  /** Fachquelle der Frage (Norm, Lehrbuch mit Seite) */
  quelle?: string;
  /** fachliche Freigabe: geprüft von / geprüft am (AP 3.5) */
  reviewer?: string;
  reviewedAt?: string;
  verified?: boolean;
  /** technische Vorprüfung (zweites Augenpaar vor der Freigabe; ersetzt verified nicht) */
  vorpruefung?: { am: string; ergebnis: 'ok' | 'korrigiert' | 'fraglich'; hinweis?: string };
}

/** Etikett für Fragen ohne fachliche Freigabe (Selbsttest, Übungsaufgaben, Klausursimulator einheitlich) */
export const ETIKETT_UNGEPRUEFT = 'noch nicht fachlich freigegeben';

/** Fachlich freigegeben gilt eine Frage nur bei verified === true (fehlend oder false = ungeprüft). */
export function istFachlichFreigegeben(q: Pick<QuizQuestion, 'verified'>): boolean {
  return q.verified === true;
}

/** Anzahl der fachlich freigegebenen Fragen einer Liste */
export function anzahlFreigegeben(fragen: readonly Pick<QuizQuestion, 'verified'>[]): number {
  return fragen.filter(istFachlichFreigegeben).length;
}

export const QUIZ_CATEGORIES: { id: QuizCategory; label: string; icon: string }[] = [
  { id: 'baustoffkunde', label: 'Werkstoffmechanik & Physik', icon: 'Box' },
  { id: 'bindemittel_beton', label: 'Bindemittel & Betontechnologie', icon: 'Layers' },
  { id: 'metalle_holz', label: 'Metalle & Holzwerkstoffe', icon: 'TreePine' },
  { id: 'dauerhaftigkeit_schaeden', label: 'Dauerhaftigkeit & Schäden', icon: 'ShieldAlert' },
  { id: 'nachhaltigkeit', label: 'Zirkularität & Ökobilanzierung', icon: 'Leaf' },
  { id: 'baurecht_normung', label: 'Baurecht & Normenwesen', icon: 'FileText' },
];

/** Rohform einer Frage in src/data/quiz.json; Cluster, Gruppe und Route ergänzt mitZuordnung() */
export type RohFrage = Omit<QuizQuestion, 'clusterId' | 'clusterName' | 'gruppe' | 'route'> & Partial<Pick<QuizQuestion, 'clusterId' | 'clusterName'>>;
export function mitZuordnung(q: RohFrage): QuizQuestion {
  const c = quizCluster(q.moduleId);
  const route = quizRoute(q.moduleId);
  // Sprungziel der Wissenslücken-Analyse auf eine echte Route normalisieren (sonst tote Links)
  const ziel = q.gapAnalysis ? (quizRoute(q.gapAnalysis.targetModuleTab || q.moduleId) ?? route) : undefined;
  const gapAnalysis = q.gapAnalysis && ziel ? { ...q.gapAnalysis, targetModuleTab: ziel } : q.gapAnalysis;
  return { ...q, gapAnalysis, clusterId: c?.id ?? (q.clusterId as ClusterNummer) ?? 'I', clusterName: c?.name ?? q.clusterName ?? '', gruppe: quizGruppe(q.moduleId), route };
}
