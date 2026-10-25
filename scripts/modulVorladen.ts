/**
 * Vite-Plugin „modul-vorladen“ (Umsetzungsplan Phase 5, AP 5.5): Beim Direktaufruf einer Modulseite
 * (baustoffboard.de/#glas) lädt der Browser sonst nacheinander index.html → Einstieg → ModulInhalt →
 * Modul-Chunk → dessen Abhängigkeiten. Das Plugin schreibt beim Build eine Karte „Modul-ID → Chunks“
 * als JSON-Datenblock in index.html; das Inline-Skript scripts/vorladen-boot.js liest den URL-Hash und
 * setzt sofort <link rel="modulepreload"> für ModulInhalt, ModulKopf, die Kopfdaten und den Modul-Chunk
 * samt statischer Importe – parallel zum Einstiegs-Chunk statt danach. server.ts erlaubt das Inline-Skript
 * in der CSP über seinen SHA-256-Hash (inlineSkriptHashes).
 *
 * Die Zuordnung Modul-ID → Komponente wird aus src/routing/ModulInhalt.tsx gelesen
 * (tests/modulVorladen.test.ts prüft, dass jede dort verdrahtete ID erfasst wird).
 */
import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';
import type { OutputBundle, OutputChunk } from 'rollup';

export interface Zuordnung {
  /** Komponente → Importpfad (relativ zu src/routing) */
  lazy: Map<string, string>;
  /** Modul-ID → Komponente */
  tabs: Map<string, string>;
  /** activeTab.startsWith(präfix) → Komponente */
  praefixe: Array<[string, string]>;
}

/** liest React.lazy-Deklarationen und die JSX-Bedingungen aus ModulInhalt.tsx */
export function leseZuordnung(quelltext: string): Zuordnung {
  const lazy = new Map<string, string>();
  for (const m of quelltext.matchAll(/const (\w+) = React\.lazy\(\(\) => import\('([^']+)'\)/g)) lazy.set(m[1], m[2]);
  const rumpf = quelltext.slice(quelltext.indexOf('export function ModulInhalt'));
  const tabs = new Map<string, string>();
  const praefixe: Array<[string, string]> = [];
  // je JSX-Ausdruck {Bedingung && <Komponente …>}: IDs vor dem ersten Komponenten-Tag gehören zur Bedingung
  for (const block of rumpf.split(/\n\s*\{(?=\(?\(?activeTab)/).slice(1)) {
    const tag = /<([A-Z]\w*)/.exec(block);
    if (!tag) continue;
    const bedingung = block.slice(0, tag.index);
    for (const m of bedingung.matchAll(/===\s*'([^']+)'/g)) if (!tabs.has(m[1])) tabs.set(m[1], tag[1]);
    for (const m of bedingung.matchAll(/activeTab\.startsWith\('([^']+)'\)/g)) praefixe.push([m[1], tag[1]]);
  }
  return { lazy, tabs, praefixe };
}

export function modulVorladenPlugin(wurzel = process.cwd()): Plugin {
  const routing = path.resolve(wurzel, 'src/routing');
  let basis = '/';
  let assetsDir = 'assets';
  return {
    name: 'modul-vorladen',
    apply: 'build',
    configResolved(c) { basis = c.base; assetsDir = c.build.assetsDir; },
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const bundle = ctx.bundle as OutputBundle | undefined;
        if (!bundle) return;
        const chunks = Object.values(bundle).filter((c): c is OutputChunk => c.type === 'chunk');
        const nachModul = new Map<string, OutputChunk>();
        for (const c of chunks) if (c.facadeModuleId) nachModul.set(c.facadeModuleId.split('?')[0], c);
        const einstieg = chunks.find(c => c.isEntry);
        // bereits über index.html geladen (Einstieg + statische Importe) → nicht erneut aufführen
        const geladen = new Set<string>();
        const statisch = (c: OutputChunk | undefined, ziel: Set<string>) => {
          const offen = c ? [c.fileName] : [];
          while (offen.length) {
            const f = offen.pop()!;
            if (ziel.has(f)) continue;
            ziel.add(f);
            const k = bundle[f];
            if (k?.type === 'chunk') {
              offen.push(...k.imports);
              for (const css of (k as OutputChunk & { viteMetadata?: { importedCss: Set<string> } }).viteMetadata?.importedCss ?? []) ziel.add(css);
            }
          }
          return ziel;
        };
        statisch(einstieg, geladen);
        const dateien: string[] = [];
        const index = new Map<string, number>();
        const liste = (c: OutputChunk | undefined) => [...statisch(c, new Set())].filter(f => !geladen.has(f)).map(f => {
          if (!index.has(f)) { index.set(f, dateien.length); dateien.push(f); }
          return index.get(f)!;
        });
        const datei = (rel: string) => {
          const p = path.resolve(routing, rel);
          for (const e of ['.tsx', '.ts', '/index.tsx', '/index.ts']) if (nachModul.has(p + e)) return nachModul.get(p + e);
          return nachModul.get(p);
        };
        const z = leseZuordnung(fs.readFileSync(path.join(routing, 'ModulInhalt.tsx'), 'utf8'));
        // je Komponente eine Liste (mehrere IDs teilen sich oft eine Komponente, z. B. ki_*)
        const komponenten: number[][] = [];
        const kompIndex = new Map<string, number>();
        const fuer = (name: string) => {
          if (!kompIndex.has(name)) {
            const rel = z.lazy.get(name);
            kompIndex.set(name, komponenten.length);
            komponenten.push(rel ? liste(datei(rel)) : []);
          }
          return kompIndex.get(name)!;
        };
        const kopf: Record<string, number> = {};
        const KOPF = '\0virtual:modul-kopf/kopf-';
        for (const [modul, c] of nachModul) {
          if (!modul.startsWith(KOPF)) continue;
          const k = liste(c);
          if (k.length === 1) kopf[decodeURIComponent(modul.slice(KOPF.length))] = k[0];
        }
        // erst alle Listen bilden (füllt dateien), dann die Karte zusammensetzen
        const inhalt = liste(datei('./ModulInhalt'));
        const modulKopf = liste(datei('./ModulKopf'));
        const t = Object.fromEntries([...z.tabs].map(([id, name]) => [id, fuer(name)]));
        const p = z.praefixe.map(([praefix, name]) => [praefix, fuer(name)]);
        const karte = {
          b: basis + assetsDir + '/',
          d: dateien.map(f => f.startsWith(assetsDir + '/') ? f.slice(assetsDir.length + 1) : '../' + f),
          // jede Modulseite: Inhaltsverteiler; Fachmodule zusätzlich Modulkopf (+ eigene Kopfdaten h)
          i: inhalt, k: modulKopf, c: komponenten, t, p, h: kopf,
        };
        const json = JSON.stringify(karte).replace(/</g, '\\u003c');
        // direkt hinter das Einstiegs-<script type="module">, vor das Stylesheet: Ein Inline-Skript hinter einem
        // ladenden Stylesheet liefe erst nach dem CSS. Steht es weiter vorn, belegen die Modul-Chunks die
        // 6 HTTP/1.1-Verbindungen vor dem Einstieg (modulepreload ignoriert fetchpriority).
        const boot = fs.readFileSync(path.join(wurzel, 'scripts/vorladen-boot.js'), 'utf8').trim();
        const einfuegen = `\n    <script type="application/json" id="modul-vorladen">${json}</script>\n    <script>${boot}</script>`;
        const einstiegTag = /<script type="module"[^>]*\ssrc="[^"]*"[^>]*><\/script>/.exec(html);
        if (!einstiegTag) throw new Error('modul-vorladen: Einstiegs-<script type="module"> fehlt in index.html');
        const ende = einstiegTag.index + einstiegTag[0].length;
        return html.slice(0, ende) + einfuegen + html.slice(ende);
      },
    },
  };
}

/**
 * manualChunks: Bausteine, die (fast) jede Fachmodulseite braucht, in einem Chunk „modul-basis“ bündeln
 * (Modulkopf, Fußzeile/Quellen, Selbsttest, Formeln), Icons außerhalb des Einstiegs in „icons“. Vorher waren
 * das 20–30 Kleinst-Chunks je Seite; unter HTTP/1.1 (6 Verbindungen) und hoher Latenz kostet jeder Abruf eine Runde.
 * Rollup zieht in einen manuellen Chunk auch dessen noch nicht zugeordnete Abhängigkeiten – auch solche des
 * Einstiegs (React, Registry …). Deshalb kommt der statische Graph des Einstiegs geschlossen in den Chunk
 * „app“ (statischer Import des Einstiegs, per modulepreload im HTML parallel geladen); der Einstiegs-Chunk
 * selbst enthält dann nur main.tsx.
 */
const MODUL_BASIS: RegExp[] = [
  /\/src\/routing\/(ModulKopf\.tsx|modulKopfDaten\.ts)$/,
  /\/src\/components\/ui\/(ModuleFooter|FormulaText|FormulaDerivationBox|ModulLernziele|ErkundungsAuftrag|ModulKurzfassung|CalculatorDisclaimerBanner)\.tsx$/,
  /\/src\/components\/quiz\/ModulTest\.tsx$/,
  /\/src\/data\/quizLader\.ts$/,
  /\/src\/utils\/mischeAntworten\.ts$/,
  /\/src\/lib\/(utils\.ts|katexBedarf\.tsx|chartBedarf\.tsx|chartJsBedarf\.ts|chartSetup\.ts)$/,
  /\/src\/components\/ui\/(Slider|InfoTooltip|EingabeHinweise)\.tsx$/,
];

type ModulInfo = { importedIds: readonly string[]; isEntry: boolean; code: string | null } | null;
const SAMMEL_EXPORT = /\/lucide-react\/dist\/esm\/lucide-react\.js$/;
const ICON = /\/lucide-react\/dist\/esm\/icons\/([^/]+)\.js$/;

export function modulBasisChunks() {
  let einstieg: Set<string> | undefined;
  let einstiegIcons: Set<string> | undefined;
  return (id: string, { getModuleInfo, getModuleIds }: { getModuleInfo: (id: string) => ModulInfo; getModuleIds: () => IterableIterator<string> }) => {
    if (!einstieg || !einstiegIcons) {
      einstieg = new Set();
      const alle = [...getModuleIds()];
      const offen = alle.filter(m => getModuleInfo(m)?.isEntry);
      while (offen.length) {
        const m = offen.pop()!;
        if (einstieg.has(m)) continue;
        einstieg.add(m);
        // vom Sammel-Export nicht in die Icons verzweigen (er re-exportiert alle)
        const sammel = SAMMEL_EXPORT.test(m);
        offen.push(...(getModuleInfo(m)?.importedIds ?? []).filter(d => !sammel || !ICON.test(d)));
      }
      // Icons, die der Einstieg nutzt: benannte Importe aus 'lucide-react' → Datei laut Sammel-Export
      const sammel = alle.find(m => SAMMEL_EXPORT.test(m));
      const datei = new Map<string, string>();
      for (const z of ((sammel && getModuleInfo(sammel)?.code) || '').matchAll(/export \{([^}]*)\} from '\.\/icons\/([^']+)\.js'/g))
        for (const n of z[1].split(',')) datei.set(n.trim().split(/\s+as\s+/).pop()!, z[2]);
      einstiegIcons = new Set();
      for (const m of einstieg) {
        for (const imp of (getModuleInfo(m)?.code ?? '').matchAll(/import\s*\{([^}]*)\}\s*from\s*["']lucide-react["']/g))
          for (const n of imp[1].split(',')) { const f = datei.get(n.trim().split(/\s+as\s+/)[0]); if (f) einstiegIcons.add(f); }
      }
    }
    const icon = ICON.exec(id)?.[1];
    if (icon) {
      // Einstiegs-Icons in „app“, alle übrigen gemeinsam in „icons“ (~11 kB gzip statt bis zu 15 Kleinst-Chunks
      // je Seite). Explizit zuordnen: sonst zöge Rollup sie über den Sammel-Export (Abhängigkeit von „app“) nach „app“.
      return einstiegIcons.has(icon) ? 'app' : 'icons';
    }
    if (einstieg.has(id)) return getModuleInfo(id)?.isEntry || /\.css($|\?)/.test(id) ? undefined : 'app';
    if (MODUL_BASIS.some(r => r.test(id))) return 'modul-basis';
  };
}
