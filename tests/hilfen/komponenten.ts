// Gemeinsame Hilfen für Komponententests (AP 5.6) – ohne Testing Library/Vitest:
// Rendern per react-dom/server, Prüfungen auf dem erzeugten HTML.
//
// react-katex liegt nur als UMD-Bundle vor; Node-ESM erkennt daraus keine benannten Exporte
// (InlineMath, BlockMath). Ein kleiner Lade-Hook liefert ein ESM-Gegenstück. Deshalb importieren
// die Testdateien Komponenten erst NACH diesem Modul per `await import(...)`.
import { register, createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const basis = pathToFileURL(process.cwd() + '/package.json').href;
const hook = `
const SHIM = 'babo-shim:react-katex';
export async function resolve(spec, ctx, next) {
  if (spec === 'react-katex') return { url: SHIM, shortCircuit: true };
  return next(spec, ctx);
}
export async function load(url, ctx, next) {
  if (url === SHIM) return { format: 'module', shortCircuit: true, source:
    "import { createRequire } from 'node:module';" +
    "const m = createRequire(" + ${JSON.stringify(JSON.stringify(basis))} + ")('react-katex');" +
    "export const InlineMath = m.InlineMath; export const BlockMath = m.BlockMath; export default m;" };
  return next(url, ctx);
}`;
register('data:text/javascript,' + encodeURIComponent(hook));
// Sicherstellen, dass das CJS-Bundle auflösbar ist (sonst früh und verständlich scheitern)
createRequire(basis).resolve('react-katex');

// Minimaler Speicher-Stub: Kontexte lesen localStorage (in try/catch); window bleibt bewusst undefiniert,
// damit TabProvider/LanguageProvider wie beim Server-Rendern ohne Hash/Browser-API starten.
if (typeof (globalThis as { localStorage?: unknown }).localStorage === 'undefined') {
  const speicher = new Map<string, string>();
  (globalThis as { localStorage?: unknown }).localStorage = {
    getItem: (k: string) => speicher.get(k) ?? null,
    setItem: (k: string, v: string) => { speicher.set(k, String(v)); },
    removeItem: (k: string) => { speicher.delete(k); },
    clear: () => speicher.clear(),
  };
}

const { TabProvider } = await import('../../src/contexts/TabContext');
const { LanguageProvider } = await import('../../src/contexts/LanguageContext');

export const h = React.createElement;

/** Rendert ein Element wie in der App (LanguageProvider › TabProvider) zu statischem HTML. */
export function rendere(el: React.ReactElement): string {
  return renderToStaticMarkup(h(LanguageProvider, null, h(TabProvider, null, el)));
}

/** Reiner Text ohne Tags, Leerraum zusammengefasst */
export const text = (html: string) => html
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ').trim();
/** Leerraum zusammenfassen (für Vergleiche mit Datentexten) */
export const kompakt = (s: string) => s.replace(/\s+/g, ' ').trim();

/** Anzahl der Vorkommen eines Musters */
export const anzahl = (html: string, muster: RegExp) => (html.match(new RegExp(muster.source, muster.flags.includes('g') ? muster.flags : muster.flags + 'g')) ?? []).length;

export function sicher(bedingung: unknown, meldung: string): asserts bedingung {
  if (!bedingung) throw new Error(meldung);
}

/** Kleiner Testläufer im Stil der übrigen tests/*.test.ts: FAIL-Zeilen und Exit-Code 1 bei Fehlern. */
export function testlauf(titel: string) {
  console.log(`--- Test: ${titel} ---`);
  const fehler: string[] = [];
  let anzahlTests = 0;
  return {
    test(name: string, fn: () => void) {
      anzahlTests++;
      try { fn(); } catch (e) { fehler.push(`${name}: ${(e as Error).message}`); }
    },
    ende() {
      if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); console.log(`FAIL: ${fehler.length} von ${anzahlTests} Tests`); process.exit(1); }
      console.log(`OK: ${anzahlTests} Komponententests (${titel})`);
    },
  };
}
