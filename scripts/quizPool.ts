/**
 * Vite-Plugin „quiz-pool“ (Umsetzungsplan Phase 5, AP 5.4): teilt den Fragenpool src/data/quiz.json
 * beim Build (und im Dev-Server) in kleine Chunks, ohne geteilte Dateien ins Repository zu legen.
 * quiz.json bleibt die einzige Quelle; Tests und Skripte lesen sie weiterhin direkt.
 *
 * Virtuelle Module:
 *   virtual:quiz-pool                       Index: Anzahl Fragen je moduleId + Lader (dynamische Importe)
 *   virtual:quiz-pool/quiz-modul-<id>       Fragen eines Moduls (Selbsttest ModulTest, wenige kB)
 *   virtual:quiz-pool/quiz-teil-<n>         Teilpaket n des Gesamtpools (globale Quiz-/Klausuransicht)
 * Die Teilpakete sind zusammenhängende Abschnitte von quiz.json; aneinandergehängt ergeben sie den
 * Pool in Originalreihenfolge. tests/quiz.test.ts prüft die Aufteilung (teileFragenpool).
 */
import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

export const QUIZ_POOL_ID = 'virtual:quiz-pool';
const AUFGELOEST = '\0' + QUIZ_POOL_ID;
/** Anzahl Teilpakete für den Gesamtpool: je ≈ 1/4 von ~380 kB gzip, deutlich unter der Chunk-Grenze */
export const QUIZ_TEILE = 4;

type Frage = { id: string; moduleId: string };

/** zusammenhängende Abschnitte mit möglichst gleicher Rohgröße (JSON) */
export function teileFragenpool<T>(fragen: readonly T[], teile = QUIZ_TEILE): T[][] {
  const groessen = fragen.map(f => JSON.stringify(f).length);
  const gesamt = groessen.reduce((s, n) => s + n, 0);
  const ergebnis: T[][] = [];
  let aktuell: T[] = [];
  let summe = 0;
  fragen.forEach((f, i) => {
    aktuell.push(f);
    summe += groessen[i];
    if (ergebnis.length < teile - 1 && summe >= (gesamt * (ergebnis.length + 1)) / teile) {
      ergebnis.push(aktuell);
      aktuell = [];
    }
  });
  if (aktuell.length || ergebnis.length === 0) ergebnis.push(aktuell);
  return ergebnis;
}

/** Fragen je moduleId (Reihenfolge wie in quiz.json) */
export function fragenJeModul<T extends Frage>(fragen: readonly T[]): Map<string, T[]> {
  const m = new Map<string, T[]>();
  for (const f of fragen) m.set(f.moduleId, [...(m.get(f.moduleId) ?? []), f]);
  return m;
}

const alsModul = (daten: unknown) => `export default JSON.parse(${JSON.stringify(JSON.stringify(daten))});\n`;

export function quizPoolPlugin(quelle = path.resolve(process.cwd(), 'src/data/quiz.json')): Plugin {
  let cache: Frage[] | undefined;
  const pool = () => (cache ??= JSON.parse(fs.readFileSync(quelle, 'utf8')) as Frage[]);
  return {
    name: 'quiz-pool',
    buildStart() { cache = undefined; },
    resolveId(id) {
      if (id === QUIZ_POOL_ID || id.startsWith(QUIZ_POOL_ID + '/')) return '\0' + id;
    },
    load(id) {
      if (id !== AUFGELOEST && !id.startsWith(AUFGELOEST + '/')) return;
      this.addWatchFile(quelle);
      const fragen = pool();
      if (id === AUFGELOEST) {
        const module = fragenJeModul(fragen);
        const anzahl = Object.fromEntries([...module].map(([m, f]) => [m, f.length]));
        const lader = [...module.keys()].map(m => `  ${JSON.stringify(m)}: () => import(${JSON.stringify(`${QUIZ_POOL_ID}/quiz-modul-${encodeURIComponent(m)}`)})`);
        const teile = teileFragenpool(fragen).map((_, i) => `  () => import("${QUIZ_POOL_ID}/quiz-teil-${i + 1}")`);
        return `export const anzahlJeModul = ${JSON.stringify(anzahl)};\n`
          + `export const ladeModul = {\n${lader.join(',\n')}\n};\n`
          + `export const ladeTeile = [\n${teile.join(',\n')}\n];\n`;
      }
      const rest = id.slice(AUFGELOEST.length + 1);
      const teil = /^quiz-teil-(\d+)$/.exec(rest);
      if (teil) return alsModul(teileFragenpool(fragen)[Number(teil[1]) - 1] ?? []);
      const modul = /^quiz-modul-(.+)$/.exec(rest);
      if (modul) return alsModul(fragenJeModul(fragen).get(decodeURIComponent(modul[1])) ?? []);
      this.error(`quiz-pool: unbekanntes Modul ${rest}`);
    },
    // Dev-Server: Änderung an quiz.json → Cache verwerfen, virtuelle Module neu laden
    handleHotUpdate(ctx) {
      if (path.resolve(ctx.file) !== quelle) return;
      cache = undefined;
      const betroffen = [...ctx.server.moduleGraph.idToModuleMap.values()].filter(m => m.id?.startsWith(AUFGELOEST));
      for (const m of betroffen) ctx.server.moduleGraph.invalidateModule(m);
      ctx.server.ws.send({ type: 'full-reload' });
      return [];
    },
  };
}
