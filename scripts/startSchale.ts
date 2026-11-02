/**
 * Vite-Plugin „start-schale“ (Umsetzungsplan Phase 5, AP 5.5 Nachtrag): setzt beim Build eine statische Schale der
 * Startseite (Rahmen und Begrüßungskarte, scripts/startschale.html) in <div id="root"> von dist/index.html.
 * Sie erscheint, sobald HTML und CSS da sind – ohne auf den Einstiegs-Chunk (≈ 100 kB gzip) zu warten; React
 * ersetzt sie beim ersten Rendern. Sichtbar ist sie nur, wenn das Inline-Skript scripts/startschale-boot.js
 * (Anfang von <head>) die Klasse bb-schale setzt – nicht bei Modul-Direktlink, Umfrage oder Englisch, weil das
 * erste Bild von React dann anders aussähe. Im Dunkelmodus und in jeder Seitenbreite steht sie seit 02.11.2026 auch:
 * Ihr Markup ist dafür gleich (Farben über dark:-Klassen, Breite über breite-standard:/breite-full:; die Klassen
 * dark und bb-breite-* setzt das Boot-Skript vor dem ersten Bild).
 * Die Versionszeile kommt aus src/data/stand.ts (Version aus package.json, Stand = Build-Datum über BB_STAND). Neu erzeugen: scripts/qa/startschale-erzeugen.mjs.
 */
import fs from 'fs';
import path from 'path';
import { build } from 'esbuild';
import type { Plugin } from 'vite';

export const ROOT_LEER = '<div id="root"></div>';
export const KOPF_ANKER = '<meta charset="UTF-8" />';
/** Schale standardmäßig ausgeblendet; nur mit html.bb-schale sichtbar (vor dem ersten Bild entschieden) */
export const SCHALE_STIL = '[data-schale]{display:none}html.bb-schale [data-schale]{display:block}';

/** Kopf- und Wurzelteil der Schale mit eingesetzter Version (für Plugin und Test) */
export async function erzeugeSchale(wurzel = process.cwd()): Promise<{ kopf: string; root: string }> {
  const schale = fs.readFileSync(path.resolve(wurzel, 'scripts/startschale.html'), 'utf8').trim();
  const boot = fs.readFileSync(path.resolve(wurzel, 'scripts/startschale-boot.js'), 'utf8');
  const ergebnis = await build({
    entryPoints: [path.resolve(wurzel, 'src/data/stand.ts')],
    bundle: true, format: 'esm', platform: 'node', write: false, logLevel: 'silent',
  });
  const m = await import('data:text/javascript;base64,' + Buffer.from(ergebnis.outputFiles[0].text).toString('base64'));
  const esc = (s: string) => s.replace(/[&<>"]/g, c => `&#${c.charCodeAt(0)};`);
  const vnr = esc(m.APP_VERSION as string), datum = esc(m.STAND_DE as string);
  const text = `${vnr} (${datum})`;
  return {
    kopf: `\n    <script>${boot}</script>\n    <style>${SCHALE_STIL}</style>`,
    // inert: nicht bedienbar, bis React die Schale ersetzt
    root: `<div id="root"><div data-schale inert>${schale.replace('%BB_VERSION%', text).replaceAll('%BB_DATUM%', datum).replace('%BB_VNR%', vnr)}</div></div>`,
  };
}

export function startSchalePlugin(wurzel = process.cwd()): Plugin {
  return {
    name: 'start-schale',
    apply: 'build',
    async transformIndexHtml(html) {
      if (!html.includes(ROOT_LEER) || !html.includes(KOPF_ANKER)) throw new Error(`start-schale: ${ROOT_LEER} oder ${KOPF_ANKER} fehlt in index.html`);
      const { kopf, root } = await erzeugeSchale(wurzel);
      return html.replace(KOPF_ANKER, KOPF_ANKER + kopf).replace(ROOT_LEER, root);
    },
  };
}
