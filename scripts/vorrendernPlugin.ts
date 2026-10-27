/**
 * Vite-Plugin „vorrendern“ (Z52): startet nach dem Client-Build (closeBundle) scripts/vorrendern.ts mit tsx in
 * eigenem Prozess. package.json bleibt unverändert (`npm run build` = vite build && esbuild server.ts …).
 * Eigene Datei, damit vite.config.ts das Skript selbst nicht lädt (es baut seinerseits mit dieser Konfiguration).
 */
import path from 'path';
import { createRequire } from 'module';
import { spawnSync } from 'child_process';
import type { Plugin } from 'vite';

/** Nicht im SSR-Build des Skripts selbst (BB_VORRENDERN) und nicht mit BB_OHNE_VORRENDERN=1 */
export function vorrendernPlugin(wurzel = process.cwd()): Plugin {
  return {
    name: 'vorrendern',
    apply: (_c, env) => env.command === 'build' && !env.isSsrBuild && !process.env.BB_VORRENDERN && process.env.BB_OHNE_VORRENDERN !== '1',
    closeBundle: {
      sequential: true,
      order: 'post',
      handler() {
        const tsx = createRequire(path.join(wurzel, 'package.json')).resolve('tsx/cli');
        const lauf = spawnSync(process.execPath, [tsx, path.join(wurzel, 'scripts/vorrendern.ts')], { cwd: wurzel, stdio: 'inherit', env: process.env });
        if (lauf.status !== 0) throw new Error(`vorrendern: Skript endete mit Code ${lauf.status}`);
      },
    },
  };
}

