/**
 * Vite-Plugin „registry-kern“ (Umsetzungsplan Phase 5, AP 5.5 Nachtrag): ersetzt beim Build die Auszüge der
 * Modul-Registry durch ihre vorab ausgewerteten Daten (JSON):
 *   src/registry/kernDaten.ts   id, label, icon, gruppe, Titel/Typ – Menü, Kopfzeile, Routing (im Einstieg)
 *   src/registry/metaDaten.ts   Meta-Beschreibungen (nach dem Laden der Seite nachgeladen)
 *   src/registry/suchDaten.ts   Suchbegriffe der Menüsuche (bei der ersten Suche nachgeladen)
 * Damit importiert der Einstieg src/registry/modules.ts (135 kB roh) nicht mehr; ausgewertet wird sie nur noch
 * für die Modulübersicht. Quelle bleibt modules.ts; im Dev-Server und in Tests gelten die Dateien selbst
 * (gleiche Exporte), tests/registryKern.test.ts prüft die Gleichheit.
 */
import path from 'path';
import { build } from 'esbuild';
import type { Plugin } from 'vite';

export const AUSZUEGE = ['src/registry/kernDaten.ts', 'src/registry/metaDaten.ts', 'src/registry/suchDaten.ts'];

/** Alle Exporte einer Auszugsdatei (per esbuild gebündelt und ausgewertet; nur Daten, keine Funktionen) */
export async function ladeAuszug(datei: string, wurzel = process.cwd()): Promise<{ werte: Record<string, unknown>; dateien: string[] }> {
  const ergebnis = await build({
    entryPoints: [path.resolve(wurzel, datei)],
    bundle: true, format: 'esm', platform: 'node', write: false, metafile: true, logLevel: 'silent',
  });
  const m = await import('data:text/javascript;base64,' + Buffer.from(ergebnis.outputFiles[0].text).toString('base64'));
  const dateien = Object.keys(ergebnis.metafile!.inputs).map(f => path.resolve(process.cwd(), f));
  return { werte: { ...m }, dateien };
}

export function registryKernPlugin(wurzel = process.cwd()): Plugin {
  const ziele = new Set(AUSZUEGE.map(d => path.resolve(wurzel, d)));
  return {
    name: 'registry-kern',
    apply: 'build',
    enforce: 'pre',
    async load(id) {
      const datei = path.resolve(id.split('?')[0]);
      if (!ziele.has(datei)) return;
      const { werte, dateien } = await ladeAuszug(datei, wurzel);
      for (const f of dateien) this.addWatchFile(f);
      return Object.entries(werte).map(([k, v]) => {
        if (typeof v === 'function') this.error(`registry-kern: ${path.relative(wurzel, datei)} exportiert Funktion ${k}`);
        return `export const ${k} = /*#__PURE__*/ JSON.parse(${JSON.stringify(JSON.stringify(v))});`;
      }).join('\n') + '\n';
    },
  };
}
