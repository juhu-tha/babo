/**
 * Mischt die Antwortoptionen einer Frage (Fisher-Yates) und passt correctIdx sowie distraktorFeedback an.
 * Gibt eine Kopie zurück; die Fragedaten in quiz.json bleiben unverändert.
 */
export function mischeAntworten<T extends { options: string[]; correctIdx: number; distraktorFeedback?: string[] }>(
  q: T,
  zufall: () => number = Math.random,
): T {
  const reihenfolge = q.options.map((_, i) => i);
  for (let i = reihenfolge.length - 1; i > 0; i--) {
    const j = Math.floor(zufall() * (i + 1));
    [reihenfolge[i], reihenfolge[j]] = [reihenfolge[j], reihenfolge[i]];
  }
  return {
    ...q,
    options: reihenfolge.map(i => q.options[i]),
    correctIdx: reihenfolge.indexOf(q.correctIdx),
    // Rückmeldungen je Option werden mitgemischt (AP 3.2)
    ...(q.distraktorFeedback ? { distraktorFeedback: reihenfolge.map(i => q.distraktorFeedback![i]) } : {}),
  };
}
