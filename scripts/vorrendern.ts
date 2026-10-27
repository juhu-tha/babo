/**
 * Vorrendern der Modulseiten (Z52, Entscheidung 26.10.2026).
 *
 * Läuft nach `vite build` (scripts/vorrendernPlugin.ts → closeBundle, startet dieses Skript mit tsx; einzeln:
 * `npx tsx scripts/vorrendern.ts`). Ablauf:
 *   1. Vite-SSR-Build von scripts/vorrendern-eintrag.tsx nach dist/.vorrendern (gleiche Plugins wie der Client).
 *   2. Je Modul der Registry die App mit react-dom/server rendern (renderToPipeableStream, onAllReady).
 *   3. Anfang behalten: Rahmen, Modulkopf (Prüfvermerk, Lernziele, Kurzfassung, Erkundung, Hinweise) und den
 *      ersten Abschnitt des Inhalts (Budget BUDGET); Menüeinträge und Fußzeile kommen erst mit React.
 *   4. In dist/index.html statt der Startseiten-Schale einsetzen, Titel/Beschreibung/kanonische Adresse je Modul
 *      setzen → dist/modul/<id>.html; Liste, Aliase und inaktive Adressen → dist/modul/routen.json (für server.ts).
 * Die Seite ist wie die Startseiten-Schale `inert` und nur sichtbar, wenn scripts/startschale-boot.js sie zur
 * Adresse und den Einstellungen passend findet; React ersetzt sie (src/main.tsx wartet dafür die Chunks ab).
 * Abschalten (z. B. für schnelle Probe-Builds): BB_OHNE_VORRENDERN=1.
 */
import fs from 'fs';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';
import { erzeugeSchale, KOPF_ANKER } from './startSchale';
import { zerlege, zusammensetzen, kuerze, finde, attr, maskiere, type Knoten, type Budget } from './vorrendernHtml';
import { modulPfad } from '../src/routing/pfad';

/** Umfang des vorgerenderten Inhalts nach dem Modulkopf (Zeichen sichtbarer Text bzw. HTML-Bytes) */
export const BUDGET: Budget = { text: 2500, bytes: 80_000 };
export const BASIS_URL = 'https://baustoffboard.de';
export const ROUTEN_DATEI = 'routen.json';

type Element = Extract<Knoten, { art: 'element' }>;
const istElement = (k: Knoten): k is Element => k.art === 'element';

function entferne(knoten: Knoten[], weg: (el: Element) => boolean): Knoten[] {
  return knoten.filter(k => !(istElement(k) && weg(k))).map(k => (istElement(k) ? { ...k, kinder: entferne(k.kinder, weg) } : k));
}

/**
 * Aus dem App-HTML (react-dom/server, Modus `vorrendern`) die statische Modulseite machen.
 * In #module-content stehen vor den Suspense-Grenzen die Druckkopf-Elemente, dann <!--$-->Modulkopf<!--/$-->
 * und <!--$-->Modulinhalt<!--/$-->. Eine Grenze mit Fehler (<!--$!-->) wird ausgelassen.
 */
export function modulSchale(appHtml: string, budget: Budget = BUDGET): { html: string; hinweise: string[] } {
  const hinweise: string[] = [];
  const app = zerlege(appHtml).find(k => istElement(k) && k.tag === 'div') as Element | undefined;
  if (!app) throw new Error('modulSchale: kein App-Element');
  const inhalt = finde([app], el => attr(el, 'id') === 'module-content');
  if (!inhalt) throw new Error('modulSchale: #module-content fehlt');

  // Suspense-Grenzen der obersten Ebene in #module-content
  const vor: Knoten[] = [];
  const grenzen: Array<{ fehler: boolean; kinder: Knoten[] }> = [];
  let tiefe = 0;
  for (const k of inhalt.kinder) {
    if (k.art === 'roh' && /^<!--\$[!?]?-->$/.test(k.text)) {
      if (tiefe++ === 0) { grenzen.push({ fehler: k.text !== '<!--$-->', kinder: [] }); continue; }
    } else if (k.art === 'roh' && k.text === '<!--/$-->') {
      if (--tiefe === 0) continue;
    }
    if (tiefe === 0) vor.push(k); else grenzen[grenzen.length - 1].kinder.push(k);
  }
  if (grenzen.length !== 2) throw new Error(`modulSchale: ${grenzen.length} statt 2 Suspense-Grenzen in #module-content`);
  const [kopf, modul] = grenzen;
  if (kopf.fehler) hinweise.push('Modulkopf nicht vorgerendert');
  let inhaltKnoten: Knoten[] = [];
  if (modul.fehler) hinweise.push('Modulinhalt nicht vorgerendert (Fehler beim Rendern in Node)');
  else {
    inhaltKnoten = kuerze(modul.kinder, budget).knoten;
    if (!inhaltKnoten.some(istElement)) hinweise.push('Modulinhalt leer');
  }
  inhalt.kinder = [...vor, ...(kopf.fehler ? [] : kopf.kinder), ...inhaltKnoten];

  // Menüeinträge (je Nutzer verschieden: Favoriten, zuletzt besucht) und Fußzeile kommen mit React
  const seitenleiste = finde([app], el => el.tag === 'aside');
  const nav = seitenleiste && finde(seitenleiste.kinder, el => el.tag === 'nav');
  if (nav) nav.kinder = [];
  const [rahmen] = entferne([app], el => el.tag === 'footer');
  return { html: zusammensetzen([rahmen]), hinweise };
}

export interface RouteInfo { id: string; label: string; titel?: string; meta?: string }

const ersetze = (html: string, muster: RegExp, neu: string, name: string): string => {
  if (!muster.test(html)) throw new Error(`baueSeite: ${name} fehlt in dist/index.html`);
  return html.replace(muster, () => neu);
};

/** vollständige HTML-Datei einer Modulseite aus dist/index.html */
export function baueSeite(vorlage: string, startRoot: string, route: RouteInfo, schale: string): string {
  if (!vorlage.includes(startRoot)) throw new Error('baueSeite: Startseiten-Schale nicht in dist/index.html gefunden');
  const titel = maskiere(`BaustoffBoard THA - ${route.label}`);
  const url = maskiere(BASIS_URL + modulPfad(route.id));
  let s = vorlage.replace(startRoot, () => `<div id="root"><div data-schale inert>${schale}</div></div>`);
  // vor dem Inline-Skript startschale-boot.js (direkt hinter <meta charset>), das die Kennung liest
  s = s.replace(KOPF_ANKER, () => `${KOPF_ANKER}\n    <meta name="bb-vorgerendert" content="${maskiere(route.id)}" />`);
  s = ersetze(s, /<title>[\s\S]*?<\/title>/, `<title>${titel}</title>`, '<title>');
  s = ersetze(s, /<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${url}"`, 'canonical');
  s = ersetze(s, /<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${url}"`, 'og:url');
  s = ersetze(s, /<meta name="twitter:url" content="[^"]*"/, `<meta name="twitter:url" content="${url}"`, 'twitter:url');
  s = ersetze(s, /<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${titel}"`, 'og:title');
  s = ersetze(s, /<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${titel}"`, 'twitter:title');
  if (route.meta) {
    const b = maskiere(route.meta);
    s = ersetze(s, /<meta name="description" content="[^"]*"/, `<meta name="description" content="${b}"`, 'description');
    s = ersetze(s, /<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${b}"`, 'og:description');
    s = ersetze(s, /<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${b}"`, 'twitter:description');
  }
  return s;
}

interface Eintrag {
  routen: () => RouteInfo[];
  aliase: Readonly<Record<string, string>>;
  bekannt: readonly string[];
  inaktiv: readonly string[];
  rendere: (id: string) => Promise<{ html: string; fehler: string[] }>;
}

export async function vorrendern({ wurzel = process.cwd(), dist = path.join(wurzel, 'dist'), nur }: { wurzel?: string; dist?: string; nur?: string[] } = {}) {
  const start = Date.now();
  const ssrDir = path.join(dist, '.vorrendern');
  const { build } = await import('vite');
  process.env.BB_VORRENDERN = '1';
  await build({
    root: wurzel,
    configFile: path.join(wurzel, 'vite.config.ts'),
    logLevel: 'warn',
    build: {
      ssr: path.join(wurzel, 'scripts/vorrendern-eintrag.tsx'),
      outDir: ssrDir, emptyOutDir: true, copyPublicDir: false, minify: false, reportCompressedSize: false,
    },
  });
  // Browser-Speicher wie bei einem Erstbesuch (leer); window bleibt undefiniert (Server-Zweige der Komponenten)
  const speicher = (): Storage => {
    const m = new Map<string, string>();
    return { get length() { return m.size; }, clear: () => m.clear(), getItem: k => m.get(k) ?? null, key: i => [...m.keys()][i] ?? null, removeItem: k => { m.delete(k); }, setItem: (k, v) => { m.set(k, String(v)); } };
  };
  const g = globalThis as { localStorage?: Storage; sessionStorage?: Storage };
  g.localStorage ??= speicher();
  g.sessionStorage ??= speicher();
  const eintrag = await import(pathToFileURL(path.join(ssrDir, 'vorrendern-eintrag.js')).href) as Eintrag;
  const vorlage = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
  const { root: startRoot } = await erzeugeSchale(wurzel);
  const zielDir = path.join(dist, 'modul');
  fs.rmSync(zielDir, { recursive: true, force: true });
  fs.mkdirSync(zielDir, { recursive: true });

  const ids: string[] = [];
  const meldungen: string[] = [];
  let bytes = 0;
  for (const r of eintrag.routen()) {
    if (nur && !nur.includes(r.id)) continue;
    if (!/^[a-z0-9_-]+$/.test(r.id)) { meldungen.push(`${r.id}: ungültige ID für einen Dateinamen`); continue; }
    try {
      const { html, fehler } = await eintrag.rendere(r.id);
      if (process.env.BB_VORRENDERN_ROH) fs.writeFileSync(path.join(process.env.BB_VORRENDERN_ROH, `${r.id}.roh.html`), html);
      const { html: schale, hinweise } = modulSchale(html);
      const seite = baueSeite(vorlage, startRoot, r, schale);
      fs.writeFileSync(path.join(zielDir, `${r.id}.html`), seite);
      ids.push(r.id);
      bytes += seite.length;
      if (hinweise.length) meldungen.push(`${r.id}: ${hinweise.join('; ')}${fehler.length ? ` – ${fehler[0].slice(0, 160)}` : ''}`);
      if (process.env.BB_VORRENDERN_AUSFUEHRLICH) for (const f of fehler) console.log(`  ${r.id} ! ${f}`);
    } catch (f) {
      meldungen.push(`${r.id}: nicht vorgerendert – ${(f instanceof Error ? f.message : String(f)).slice(0, 200)}`);
    }
  }
  fs.writeFileSync(path.join(zielDir, ROUTEN_DATEI), JSON.stringify({ ids, bekannt: eintrag.bekannt, aliase: eintrag.aliase, inaktiv: eintrag.inaktiv }) + '\n');
  fs.rmSync(ssrDir, { recursive: true, force: true });
  const s = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`vorrendern: ${ids.length} Modulseiten nach dist/modul/ (Ø ${(bytes / Math.max(1, ids.length) / 1024).toFixed(0)} kB) in ${s} s`);
  for (const m of meldungen) console.log(`  · ${m}`);
  return { ids, meldungen };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const i = process.argv.indexOf('--nur');
  vorrendern({ nur: i > 0 ? process.argv[i + 1].split(',') : undefined }).then(
    () => process.exit(0),
    f => { console.error(f); process.exit(1); },
  );
}
