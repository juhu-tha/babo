/**
 * Fragenpool im Browser nachladen (Umsetzungsplan Phase 5, AP 5.4).
 * Quelle bleibt src/data/quiz.json; das Vite-Plugin scripts/quizPool.ts stellt sie als kleine Chunks bereit:
 *   - je Modul (ModulTest lädt nur die Fragen seines Moduls, wenige kB)
 *   - in QUIZ_TEILE Teilpaketen (globale Quiz-/Klausuransicht und Fragenfreigabe laden den Gesamtpool parallel)
 * Ohne Fragen auskommende Angaben (Anzahl je Modul/Route, Cluster einer Menügruppe) kommen aus dem
 * kleinen Index und stehen synchron zur Verfügung.
 */
import { useEffect, useState } from 'react';
import { anzahlJeModul, ladeModul, ladeTeile } from 'virtual:quiz-pool';
import { mitZuordnung, type QuizQuestion } from './quizModell';
import { quizCluster, quizGruppe, quizRoute, type ClusterNummer } from './quizZuordnung';

/** Anzahl Fragen mit genau dieser moduleId (Selbsttest des Moduls) */
export function anzahlFragenModul(moduleId: string): number {
  return anzahlJeModul[moduleId] ?? 0;
}

/** Anzahl Fragen, deren abgeleitete Route moduleId ist (Lernziel-Kopfzeile) */
export function anzahlFragenRoute(route: string): number {
  let n = 0;
  for (const [m, k] of Object.entries(anzahlJeModul)) if (quizRoute(m) === route) n += k;
  return n;
}

/** Cluster (I–VI) aller Fragen der angegebenen Menügruppen, in Pool-Reihenfolge */
export function clusterDerGruppen(gruppen: readonly string[]): ClusterNummer[] {
  const ids = new Set<ClusterNummer>();
  for (const m of Object.keys(anzahlJeModul)) {
    const g = quizGruppe(m);
    if (g && gruppen.includes(g)) ids.add(quizCluster(m)?.id ?? 'I');
  }
  return [...ids];
}

const modulCache = new Map<string, Promise<QuizQuestion[]>>();
/** bereits geladene Modulfragen: bei erneutem Öffnen sofort verfügbar (kein Ladezustand) */
const modulGeladen = new Map<string, QuizQuestion[]>();
export function ladeModulFragen(moduleId: string): Promise<QuizQuestion[]> {
  const lade = ladeModul[moduleId];
  if (!lade) return Promise.resolve([]);
  let p = modulCache.get(moduleId);
  if (!p) {
    p = lade().then(m => { const f = m.default.map(mitZuordnung); modulGeladen.set(moduleId, f); return f; });
    p.catch(() => modulCache.delete(moduleId));
    modulCache.set(moduleId, p);
  }
  return p;
}

let alleCache: Promise<QuizQuestion[]> | undefined;
let alleGeladen: QuizQuestion[] | undefined;
/** Gesamtpool (alle Teilpakete parallel), Reihenfolge wie in quiz.json */
export function ladeAlleFragen(): Promise<QuizQuestion[]> {
  if (!alleCache) {
    alleCache = Promise.all(ladeTeile.map(t => t())).then(teile => (alleGeladen = teile.flatMap(t => t.default.map(mitZuordnung))));
    alleCache.catch(() => { alleCache = undefined; });
  }
  return alleCache;
}

function useGeladen(lade: (() => Promise<QuizQuestion[]>) | undefined, schluessel: string, sofort?: QuizQuestion[]): QuizQuestion[] | null {
  const [stand, setStand] = useState<{ k: string; f: QuizQuestion[] } | null>(sofort ? { k: schluessel, f: sofort } : null);
  useEffect(() => {
    if (!lade) return;
    let aktiv = true;
    lade().then(f => { if (aktiv) setStand({ k: schluessel, f }); }, e => console.error('Fragenpool konnte nicht geladen werden', e));
    return () => { aktiv = false; };
  }, [schluessel]);
  return stand?.k === schluessel ? stand.f : null;
}

/** Fragen eines Moduls; null, solange sie geladen werden (danach aus dem Cache sofort verfügbar) */
export function useModulFragen(moduleId: string): QuizQuestion[] | null {
  return useGeladen(() => ladeModulFragen(moduleId), moduleId, modulGeladen.get(moduleId));
}

/** Gesamtpool; null, solange er geladen wird (danach aus dem Cache sofort verfügbar) */
export function useAlleFragen(): QuizQuestion[] | null {
  return useGeladen(ladeAlleFragen, 'alle', alleGeladen);
}
