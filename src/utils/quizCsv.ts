/**
 * Utility for CSV Export and Import of Quiz Questions according to P26.
 */
import type { ClusterNummer } from '@/src/data/quizZuordnung';
import { QuizQuestion, KnowledgeGapInfo, QuizCategory, type Schwierigkeit } from '@/src/data/quizData';

export function questionsToCsv(questions: QuizQuestion[]): string {
  const headers = [
    'id',
    'category',
    'categoryLabel',
    'clusterId',
    'clusterName',
    'moduleId',
    'moduleTitle',
    'topic',
    'difficulty',
    'normRef',
    'question',
    'options',
    'correctIdx',
    'explanation',
    'gap_topic',
    'gap_misconception',
    'gap_coreRule',
    'gap_actionableAdvice',
    'gap_targetModuleTab',
    'gap_targetModuleLabel',
    'reviewer',
    'reviewedAt',
    'verified'
  ];

  const escapeCell = (val: unknown): string => {
    if (val === undefined || val === null) return '';
    const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = questions.map(q => {
    return [
      escapeCell(q.id),
      escapeCell(q.category),
      escapeCell(q.categoryLabel),
      escapeCell(q.clusterId),
      escapeCell(q.clusterName),
      escapeCell(q.moduleId),
      escapeCell(q.moduleTitle),
      escapeCell(q.topic),
      escapeCell(q.difficulty || ''),
      escapeCell(q.normRef || ''),
      escapeCell(q.question),
      escapeCell(q.options.join(' | ')),
      escapeCell(q.correctIdx),
      escapeCell(q.explanation),
      escapeCell(q.gapAnalysis?.topic || ''),
      escapeCell(q.gapAnalysis?.misconception || ''),
      escapeCell(q.gapAnalysis?.coreRule || ''),
      escapeCell(q.gapAnalysis?.actionableAdvice || ''),
      escapeCell(q.gapAnalysis?.targetModuleTab || ''),
      escapeCell(q.gapAnalysis?.targetModuleLabel || ''),
      escapeCell(q.reviewer || ''),
      escapeCell(q.reviewedAt || ''),
      escapeCell(q.verified !== false ? 'true' : 'false')
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

export function parseCsvToQuestions(csvText: string): QuizQuestion[] {
  // Simple robust CSV parser supporting multiline fields and quotes
  const lines: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++; // skip next quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',' || char === ';') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\n' || char === '\r') {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        currentRow.push(currentField.trim());
        if (currentRow.some(c => c.length > 0)) {
          lines.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(c => c.length > 0)) {
      lines.push(currentRow);
    }
  }

  if (lines.length < 2) return [];

  const headers = lines[0].map(h => h.toLowerCase().replace(/[^a-z0-9_]/g, ''));
  const questions: QuizQuestion[] = [];

  for (let r = 1; r < lines.length; r++) {
    const row = lines[r];
    const getVal = (col: string): string => {
      const idx = headers.indexOf(col);
      return idx >= 0 && idx < row.length ? row[idx] : '';
    };

    const id = getVal('id') || `q_csv_${r}`;
    const questionText = getVal('question');
    if (!questionText) continue;

    const rawOptions = getVal('options');
    let options: string[] = [];
    if (rawOptions.startsWith('[') && rawOptions.endsWith(']')) {
      try {
        options = JSON.parse(rawOptions);
      } catch (e) {
        options = rawOptions.split('|').map(s => s.trim());
      }
    } else {
      options = rawOptions.split('|').map(s => s.trim()).filter(Boolean);
    }

    if (options.length === 0) {
      options = ['Antwort A', 'Antwort B', 'Antwort C', 'Antwort D'];
    }

    const correctIdx = parseInt(getVal('correctidx') || '0', 10) || 0;
    const category = (getVal('category') || 'baustoffkunde') as QuizCategory;
    const clusterId = (getVal('clusterid') || 'I') as ClusterNummer;

    const gapAnalysis: KnowledgeGapInfo = {
      topic: getVal('gap_topic') || getVal('topic') || 'Fachgrundlagen',
      misconception: getVal('gap_misconception') || 'Fehlendes Detailverständnis',
      coreRule: getVal('gap_corerule') || 'Fachliteratur und Normvorgaben beachten.',
      actionableAdvice: getVal('gap_actionableadvice') || 'Modulinhalt wiederholen.',
      targetModuleTab: getVal('gap_targetmoduletab') || getVal('moduleid') || 'start',
      targetModuleLabel: getVal('gap_targetmodulelabel') || getVal('moduletitle') || 'Fachmodul'
    };

    questions.push({
      id,
      category,
      categoryLabel: getVal('categorylabel') || 'Fachgebiet',
      clusterId,
      clusterName: getVal('clustername') || `Cluster ${clusterId}`,
      moduleId: getVal('moduleid') || 'allgemein',
      moduleTitle: getVal('moduletitle') || 'Allgemein',
      topic: getVal('topic') || 'Allgemein',
      difficulty: (getVal('difficulty') as Schwierigkeit | '') || 'Basis',
      normRef: getVal('normref') || undefined,
      question: questionText,
      options,
      correctIdx,
      explanation: getVal('explanation') || 'Fachliche Erklärung folgt.',
      gapAnalysis,
      reviewer: getVal('reviewer') || 'Prof. Dr.-Ing. Jürgen Huber',
      reviewedAt: getVal('reviewedat') || new Date().toISOString().slice(0, 10),
      verified: getVal('verified') !== 'false'
    });
  }

  return questions;
}
