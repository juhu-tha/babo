/**
 * Vite-Plugin „vorrendern“ (Z52): startet nach dem Client-Build scripts/vorrendern.ts mit tsx in eigenem Prozess.
 * package.json bleibt unverändert (`npm run build` = vite build && esbuild server.ts …).
 * Eigene Datei, damit vite.config.ts das Skript selbst nicht lädt (es baut seinerseits mit dieser Konfiguration).
 *
 * Speicher (Gutachten 27.10.2026 abends, Nr. 4): Früher lief das Kind direkt in closeBundle, während der
 * Vite-Prozess noch den ganzen Build im Speicher hielt (gemessen: Vite 2,7 GB RSS, davon nach gc() noch 1,8 GB
 * belegt, + esbuild-Dienst 0,4 GB + Kind 1,7 GB ≈ 4,7 GB gleichzeitig). Jetzt
 *   1. merkt closeBundle das Vorrendern nur vor; es läuft im Ereignis `beforeExit` des Vite-Prozesses, also
 *      nachdem `vite build` fertig ist und der Build-Zustand nicht mehr erreichbar ist (die Vite-CLI beendet
 *      sich bei Erfolg ohne process.exit, daher kommt `beforeExit` sicher),
 *   2. beendet der Vite-Prozess vorher den esbuild-Dienst von Vite und räumt einmal vollständig auf
 *      (gc() über --expose-gc zur Laufzeit),
 *   3. bekommt das Kind eine eigene, begrenzte Heap-Grenze (BB_VORRENDERN_HEAP_MB, Vorgabe VORGABE_HEAP_MB)
 *      statt der geerbten NODE_OPTIONS-Grenze – reicht sie nicht, endet das Kind mit einer klaren
 *      „heap out of memory“-Meldung statt eines SIGKILL des ganzen Builds,
 *   4. wird der Speicherstand vor/nach dem Aufräumen ausgegeben (Nachweis im Build-Log).
 * Schlägt das Vorrendern fehl, endet `vite build` mit Code 1 (der esbuild-Schritt hinter `&&` läuft dann nicht).
 * BB_VORRENDERN_SOFORT=1: altes Verhalten (direkt in closeBundle), z. B. wenn Vite programmatisch aufgerufen wird.
 */
import path from 'path';
import v8 from 'v8';
import vm from 'vm';
import { createRequire } from 'module';
import { spawnSync } from 'child_process';
import type { Plugin } from 'vite';

/** Heap-Grenze des Vorrender-Kindprozesses in MB (gemessene Spitze und Begründung: docs/architektur.md) */
export const VORGABE_HEAP_MB = 2048;

const mb = (n: number) => `${Math.round(n / 1024 / 1024)} MB`;

export interface Freigabe { vorher: number; nachher: number; heap: number; heapReserviert: number; extern: number; gc: boolean; esbuild: boolean }

/**
 * Vor dem Kindprozess Speicher des Vite-Prozesses freigeben:
 *  - esbuild-Dienst von Vite beenden (eigener Prozess, gemessen ≈ 0,4 GB; startet bei Bedarf neu),
 *  - einmal vollständig aufräumen (gc ist ohne --expose-gc nicht da, lässt sich aber zur Laufzeit freischalten).
 */
export function speicherFreigeben(wurzel: string): Freigabe {
  const vorher = process.memoryUsage().rss;
  let esbuild = false;
  try {
    const ausVite = createRequire(createRequire(path.join(wurzel, 'package.json')).resolve('vite/package.json'));
    const eb = ausVite('esbuild') as { stop?: () => unknown };
    if (typeof eb.stop === 'function') { eb.stop(); esbuild = true; }
  } catch {
    // esbuild nicht auffindbar: weiter ohne
  }
  let gc = false;
  try {
    v8.setFlagsFromString('--expose-gc');
    // flavor 'last-resort': mehrfache, verdichtende Vollbereinigung, danach gibt V8 freie Seiten zurück
    const f = vm.runInNewContext('gc') as ((o?: { type: 'major'; execution: 'sync'; flavor: 'last-resort' }) => void) | undefined;
    if (typeof f === 'function') { f({ type: 'major', execution: 'sync', flavor: 'last-resort' }); gc = true; }
  } catch {
    // ohne gc weiter
  }
  const m = process.memoryUsage();
  return { vorher, nachher: m.rss, heap: m.heapUsed, heapReserviert: m.heapTotal, extern: m.external, gc, esbuild };
}

/** NODE_OPTIONS fürs Kind: geerbte --max-old-space-size ersetzen, Rest behalten */
export function kindNodeOptions(geerbt: string | undefined, heapMb: number): string {
  const rest = (geerbt ?? '').split(/\s+/).filter(o => o && !/^--max[-_]old[-_]space[-_]size(=|$)/.test(o));
  return [...rest, `--max-old-space-size=${heapMb}`].join(' ');
}

/** Heap-Grenze aus BB_VORRENDERN_HEAP_MB (ganze Zahl ≥ 256), sonst Vorgabe */
export function heapGrenzeMb(wert: string | undefined): number {
  const n = Number(wert);
  return Number.isInteger(n) && n >= 256 ? n : VORGABE_HEAP_MB;
}

/** Vorrendern im Kindprozess; wirft bei Fehler */
function vorrendern(wurzel: string): void {
  const tsx = createRequire(path.join(wurzel, 'package.json')).resolve('tsx/cli');
  const f = speicherFreigeben(wurzel);
  const heapMb = heapGrenzeMb(process.env.BB_VORRENDERN_HEAP_MB);
  console.log(`vorrendern: Vite-Prozess RSS ${mb(f.vorher)} → ${mb(f.nachher)} (Heap belegt ${mb(f.heap)} von ${mb(f.heapReserviert)}, extern ${mb(f.extern)}; gc ${f.gc ? 'ja' : 'nein'}, esbuild-Dienst ${f.esbuild ? 'beendet' : 'unverändert'}); Kind mit max. ${heapMb} MB Heap`);
  const env = { ...process.env, NODE_OPTIONS: kindNodeOptions(process.env.NODE_OPTIONS, heapMb) };
  const lauf = spawnSync(process.execPath, [tsx, path.join(wurzel, 'scripts/vorrendern.ts')], { cwd: wurzel, stdio: 'inherit', env });
  if (lauf.status !== 0) throw new Error(`vorrendern: Skript endete mit Code ${lauf.status}${lauf.signal ? ` (Signal ${lauf.signal})` : ''}`);
}

/** Nicht im SSR-Build des Skripts selbst (BB_VORRENDERN) und nicht mit BB_OHNE_VORRENDERN=1 */
export function vorrendernPlugin(wurzel = process.cwd()): Plugin {
  let vorgemerkt = false;
  return {
    name: 'vorrendern',
    apply: (_c, env) => env.command === 'build' && !env.isSsrBuild && !process.env.BB_VORRENDERN && process.env.BB_OHNE_VORRENDERN !== '1',
    closeBundle: {
      sequential: true,
      order: 'post',
      handler() {
        if (process.env.BB_VORRENDERN_SOFORT === '1') { vorrendern(wurzel); return; }
        if (vorgemerkt) return;
        vorgemerkt = true;
        console.log('vorrendern: vorgemerkt – läuft nach dem Ende von vite build (beforeExit)');
        process.once('beforeExit', () => {
          try {
            vorrendern(wurzel);
          } catch (e) {
            console.error(e instanceof Error ? e.message : e);
            process.exitCode = 1;
          }
        });
      },
    },
  };
}
