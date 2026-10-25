/**
 * Vollständiger Fragenpool, synchron – NUR für Tests (tests/*.test.ts) und Node-Skripte.
 * Browser-Code lädt Fragen über src/data/quizLader.ts (je Modul bzw. Teilpakete, siehe
 * docs/architektur.md); ein Import dieser Datei im Frontend zöge den ganzen Pool (~380 kB gzip)
 * in einen Chunk, tests/quiz.test.ts verhindert das.
 */
import rawQuizQuestions from './quiz.json';
import { mitZuordnung, type QuizQuestion, type RohFrage } from './quizModell';

export * from './quizModell';
export const QUIZ_QUESTIONS: QuizQuestion[] = (rawQuizQuestions as unknown as RohFrage[]).map(mitZuordnung);
export { questionsToCsv, parseCsvToQuestions } from '@/src/utils/quizCsv';
