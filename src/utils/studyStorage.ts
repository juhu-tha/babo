// Local storage helper for student learning progress, exam results and bookmarks

export interface KlausurResult {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  percent: number;
  grade: string;
  passed: boolean;
  durationMinutes: number;
  timeSpentSeconds: number;
  categoryScores: Record<string, { correct: number; total: number; percent: number }>;
}

const STORAGE_KEYS = {
  STUDY_PHASE: 'tha_study_phase',
  BOOKMARKS: 'tha_bookmarked_tabs',
  BLOOM_COMPLETED: 'tha_bloom_completed',
  KLAUSUR_HISTORY: 'tha_klausur_history',
  LAB_PROTOCOLS: 'tha_lab_protocols_history',
  QUIZ_HISTORY: 'tha_quiz_session_history',
  QUIZ_ACTIVE_GAPS: 'tha_quiz_active_gaps',
};

export interface QuizGapItem {
  questionId: string;
  topic: string;
  moduleId: string;
  moduleTitle: string;
  targetModuleTab: string;
  clusterId: string;
  clusterName: string;
  misconception: string;
  coreRule: string;
  actionableAdvice: string;
  date: string;
}

export interface QuizSessionResult {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  percent: number;
  grade: string;
  passed: boolean;
  clusterScores: Record<string, { correct: number; total: number; percent: number }>;
  gaps: QuizGapItem[];
}

export const getStoredStudyPhase = (): 'all' | 'sem12' | 'sem34' | 'sem5plus' => {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.STUDY_PHASE);
    if (val === 'sem12' || val === 'sem34' || val === 'sem5plus') return val;
    return 'all';
  } catch {
    return 'all';
  }
};

export const setStoredStudyPhase = (phase: 'all' | 'sem12' | 'sem34' | 'sem5plus'): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDY_PHASE, phase);
  } catch (e) {
    console.warn('Could not save study phase to localStorage', e);
  }
};

export const getStoredBookmarks = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const toggleStoredBookmark = (tabId: string): string[] => {
  try {
    const current = getStoredBookmarks();
    const updated = current.includes(tabId)
      ? current.filter(id => id !== tabId)
      : [...current, tabId];
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

export const getBloomCompleted = (moduleId: string): boolean => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BLOOM_COMPLETED);
    const list: string[] = raw ? JSON.parse(raw) : [];
    return list.includes(moduleId);
  } catch {
    return false;
  }
};

export const setBloomCompleted = (moduleId: string, completed: boolean): void => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BLOOM_COMPLETED);
    let list: string[] = raw ? JSON.parse(raw) : [];
    if (completed && !list.includes(moduleId)) {
      list.push(moduleId);
    } else if (!completed) {
      list = list.filter(id => id !== moduleId);
    }
    localStorage.setItem(STORAGE_KEYS.BLOOM_COMPLETED, JSON.stringify(list));
  } catch (e) {
    console.warn('Could not save bloom status', e);
  }
};

export const getKlausurHistory = (): KlausurResult[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.KLAUSUR_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveKlausurResult = (result: KlausurResult): void => {
  try {
    const history = getKlausurHistory();
    const updated = [result, ...history].slice(0, 20); // Keep last 20
    localStorage.setItem(STORAGE_KEYS.KLAUSUR_HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Could not save exam result', e);
  }
};

export const getStoredLabProtocols = (): any[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LAB_PROTOCOLS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveStoredLabProtocol = (protocol: any): void => {
  try {
    const history = getStoredLabProtocols();
    const updated = [protocol, ...history.filter((p: any) => p.id !== protocol.id)].slice(0, 30);
    localStorage.setItem(STORAGE_KEYS.LAB_PROTOCOLS, JSON.stringify(updated));
  } catch (e) {
    console.warn('Could not save lab protocol', e);
  }
};

export const clearStoredLabProtocols = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.LAB_PROTOCOLS);
  } catch (e) {
    console.warn('Could not clear lab protocols', e);
  }
};

export const getQuizSessionHistory = (): QuizSessionResult[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveQuizSessionResult = (result: QuizSessionResult): void => {
  try {
    const history = getQuizSessionHistory();
    const updated = [result, ...history].slice(0, 30);
    localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(updated));

    // Update active knowledge gaps
    if (result.gaps && result.gaps.length > 0) {
      const existingGaps = getStoredKnowledgeGaps();
      const map = new Map<string, QuizGapItem>();
      existingGaps.forEach(g => map.set(g.questionId, g));
      result.gaps.forEach(g => map.set(g.questionId, g));
      localStorage.setItem(STORAGE_KEYS.QUIZ_ACTIVE_GAPS, JSON.stringify(Array.from(map.values())));
    }
  } catch (e) {
    console.warn('Could not save quiz session result', e);
  }
};

export const getStoredKnowledgeGaps = (): QuizGapItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUIZ_ACTIVE_GAPS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const removeStoredKnowledgeGap = (questionId: string): void => {
  try {
    const gaps = getStoredKnowledgeGaps().filter(g => g.questionId !== questionId);
    localStorage.setItem(STORAGE_KEYS.QUIZ_ACTIVE_GAPS, JSON.stringify(gaps));
  } catch (e) {
    console.warn('Could not remove knowledge gap', e);
  }
};

export const clearStoredKnowledgeGaps = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.QUIZ_ACTIVE_GAPS);
  } catch (e) {
    console.warn('Could not clear knowledge gaps', e);
  }
};


