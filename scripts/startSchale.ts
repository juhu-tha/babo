/**
 * Vite-Plugin „start-schale“ (Umsetzungsplan Phase 5, AP 5.5 Nachtrag): setzt beim Build eine statische Schale der
 * Startseite (Rahmen und Begrüßungskarte, scripts/startschale.html) in <div id="root"> von dist/index.html.
 * Sie erscheint, sobald HTML und CSS da sind – ohne auf den Einstiegs-Chunk (≈ 100 kB gzip) zu warten; React
 * ersetzt sie beim ersten Rendern. Das Inline-Skript scripts/startschale-boot.js entfernt sie sofort, wenn sie
 * nicht dem ersten Bild entspräche (Modul-Direktlink, Umfrage, Englisch, Dunkelmodus, andere Seitenbreite).
 * Die Versionszeile kommt aus src/data/versionData.ts. Neu erzeugen: scripts/qa/startschale-erzeugen.mjs.
 */
import fs from 'fs';
import path from 'path';
import { build } from 'esbuild';
import type { Plugin } from 'vite';

export const ROOT_LEER = '<div id="root"></div>';

/** Schale mit eingesetzter Version und Boot-Skript (für Plugin und Test) */
export async function erzeugeSchale(wurzel = process.cwd()): Promise<string> {
  const schale = fs.readFileSync(path.resolve(wurzel, 'scripts/startschale.html'), 'utf8').trim();
  const boot = fs.readFileSync(path.resolve(wurzel, 'scripts/startschale-boot.js'), 'utf8');
  const ergebnis = await build({
    entryPoints: [path.resolve(wurzel, 'src/data/versionData.ts')],
    bundle: true, format: 'esm', platform: 'node', write: false, logLevel: 'silent',
  });
  const m = await import('data:text/javascript;base64,' + Buffer.from(ergebnis.outputFiles[0].text).toString('base64'));
  const v = m.CURRENT_VERSION as { version: string; date: string };
  const text = `${v.version} (${v.date})`.replace(/[&<>"]/g, c => `&#${c.charCodeAt(0)};`);
  return `<div id="root">${schale.replace('%BB_VERSION%', text)}</div>\n    <script>${boot}</script>`;
}

export function startSchalePlugin(wurzel = process.cwd()): Plugin {
  return {
    name: 'start-schale',
    apply: 'build',
    async transformIndexHtml(html) {
      if (!html.includes(ROOT_LEER)) throw new Error(`start-schale: ${ROOT_LEER} fehlt in index.html`);
      return html.replace(ROOT_LEER, await erzeugeSchale(wurzel));
    },
  };
}
