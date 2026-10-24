import rawQuizQuestions from './quiz.json';
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
  difficulty?: 'Basis' | 'Fortgeschritten' | 'Klausur-Schwerpunkt';
  /** Bloom-Stufe (AP 3.2) */
  bloom?: 'Erinnern' | 'Verstehen' | 'Anwenden' | 'Analysieren' | 'Bewerten' | 'Erschaffen';
  reviewer?: string;
  reviewedAt?: string;
  verified?: boolean;
}

export const QUIZ_CATEGORIES: { id: QuizCategory; label: string; icon: string }[] = [
  { id: 'baustoffkunde', label: 'Werkstoffmechanik & Physik', icon: 'Box' },
  { id: 'bindemittel_beton', label: 'Bindemittel & Betontechnologie', icon: 'Layers' },
  { id: 'metalle_holz', label: 'Metalle & Holzwerkstoffe', icon: 'TreePine' },
  { id: 'dauerhaftigkeit_schaeden', label: 'Dauerhaftigkeit & Schäden', icon: 'ShieldAlert' },
  { id: 'nachhaltigkeit', label: 'Zirkularität & Ökobilanzierung', icon: 'Leaf' },
  { id: 'baurecht_normung', label: 'Baurecht & Normenwesen', icon: 'FileText' },
];

/**
 * Question pool loaded directly from central JSON store (P26).
 */
type RohFrage = Omit<QuizQuestion, 'clusterId' | 'clusterName' | 'gruppe' | 'route'> & Partial<Pick<QuizQuestion, 'clusterId' | 'clusterName'>>;
export function mitZuordnung(q: RohFrage): QuizQuestion {
  const c = quizCluster(q.moduleId);
  const route = quizRoute(q.moduleId);
  // Sprungziel der Wissenslücken-Analyse auf eine echte Route normalisieren (sonst tote Links)
  const ziel = q.gapAnalysis ? (quizRoute(q.gapAnalysis.targetModuleTab || q.moduleId) ?? route) : undefined;
  const gapAnalysis = q.gapAnalysis && ziel ? { ...q.gapAnalysis, targetModuleTab: ziel } : q.gapAnalysis;
  return { ...q, gapAnalysis, clusterId: c?.id ?? (q.clusterId as ClusterNummer) ?? 'I', clusterName: c?.name ?? q.clusterName ?? '', gruppe: quizGruppe(q.moduleId), route };
}
export const QUIZ_QUESTIONS: QuizQuestion[] = (rawQuizQuestions as unknown as RohFrage[]).map(mitZuordnung);

export { questionsToCsv, parseCsvToQuestions } from '@/src/utils/quizCsv';
