import rawQuizQuestions from './quiz.json';

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
  clusterId: 'I' | 'II' | 'III' | 'IV' | 'V';
  clusterName: string;
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
export const QUIZ_QUESTIONS: QuizQuestion[] = rawQuizQuestions as QuizQuestion[];

export { questionsToCsv, parseCsvToQuestions } from '@/src/utils/quizCsv';
