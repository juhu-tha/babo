/** Virtuelles Modul des Vite-Plugins scripts/quizPool.ts (Fragenpool je Modul / Teilpakete) */
declare module 'virtual:quiz-pool' {
  type Roh = import('./quizModell').RohFrage[];
  /** Anzahl Fragen je moduleId (wie in quiz.json) */
  export const anzahlJeModul: Readonly<Record<string, number>>;
  /** Fragen eines Moduls nachladen */
  export const ladeModul: Readonly<Record<string, () => Promise<{ default: Roh }>>>;
  /** Teilpakete des Gesamtpools (aneinandergehängt = quiz.json in Originalreihenfolge) */
  export const ladeTeile: ReadonlyArray<() => Promise<{ default: Roh }>>;
}
