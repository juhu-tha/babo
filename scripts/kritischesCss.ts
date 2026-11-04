/**
 * Kritisches CSS der Startseiten-Schale (LCP Startseite 04.11.2026, docs/pruefung/perf-tbt-2026-11-04.md).
 *
 * Das erste Bild der Startseite ist die statische Schale (scripts/startSchale.ts). Sie brauchte bisher das ganze
 * Stylesheet (≈ 374 kB roh, 43 kB Brotli), das sich unter „Fast 3G“ die Bandbreite mit dem Einstiegs-Chunk teilt –
 * FCP/LCP ≈ 2,0 s lokal, 2,4–2,5 s live. Jetzt stehen in dist/index.html
 *   - im Kopf an der Stelle des Stylesheets die Regeln, die Elemente der Schale treffen können (<style data-bb-kritisch>),
 *   - das vollständige Stylesheet unverändert direkt hinter <div id="root"> (data-bb-spaet). Dort hält es nur den
 *     Parser an, nicht das Zeichnen der Schale davor; Skripte (auch der Einstieg) laufen erst, wenn es geladen ist –
 *     React rendert also nie ohne das volle CSS.
 * Die Auswahl ist großzügig (lieber eine Regel zu viel): Eine Regel entfällt nur, wenn jeder ihrer Selektoren eine
 * Klasse verlangt, die in der Schale nicht vorkommt (Klassen in :is()/:where()/:not()/:has() zählen nicht als Pflicht),
 * oder ein [class…]-Attributvergleich keinen Treffer haben kann. @font-face und @keyframes entfallen (die Schale
 * lädt keine Schrift und läuft ohne Animation); alles andere (@layer, @media, @supports, @property, Variablen,
 * Grundstile) bleibt in Originalreihenfolge. Prüfung: tests/kritischesCss.test.ts; im Browser (berechnete Stile
 * aller Elemente der Schale und Bildschirmfoto gleich, hell/dunkel, mobil/breit, alle Seitenbreiten) siehe Prüfbericht.
 *
 * Die vorgerenderten Modulseiten (scripts/vorrendern.ts) entstehen aus dist/index.html und stellen den alten Zustand
 * wieder her (kritischEntfernen): ihre Schale ist der Modulinhalt, für den die Auswahl nicht gilt.
 */
import type { OutputAsset, OutputBundle } from 'rollup';
import type { Plugin } from 'vite';
import { erzeugeSchale } from './startSchale';

export const KRITISCH_ATTR = 'data-bb-kritisch';
export const SPAET_ATTR = 'data-bb-spaet';
/** Klassen, die das Boot-Skript vor dem ersten Bild an <html> setzt (scripts/startschale-boot.js) */
export const HTML_KLASSEN = ['dark', 'bb-schale', 'bb-breite-standard', 'bb-breite-wide', 'bb-breite-full'];

type Knoten = { art: 'regel'; kopf: string; inhalt: string } | { art: 'anweisung'; text: string };

/** Oberste Ebene eines (minifizierten) Stylesheets in Regeln/@-Blöcke und Anweisungen zerlegen; Kommentare entfallen */
export function zerlegeCss(s: string): Knoten[] {
  const aus: Knoten[] = [];
  let i = 0;
  while (i < s.length) {
    while (i < s.length && /\s/.test(s[i])) i++;
    if (i >= s.length) break;
    if (s.startsWith('/*', i)) { const e = s.indexOf('*/', i + 2); i = e < 0 ? s.length : e + 2; continue; }
    let j = i, tiefe = 0, kopfEnde = -1;
    for (; j < s.length; j++) {
      const c = s[j];
      if (c === '"' || c === "'") { j++; while (j < s.length && s[j] !== c) { if (s[j] === '\\') j++; j++; } continue; }
      if (c === '\\') { j++; continue; }
      if (s.startsWith('/*', j)) { const e = s.indexOf('*/', j + 2); j = e < 0 ? s.length : e + 1; continue; }
      if (c === ';' && tiefe === 0) break;
      if (c === '{') { if (tiefe === 0) kopfEnde = j; tiefe++; } else if (c === '}') { tiefe--; if (tiefe === 0) break; }
    }
    if (kopfEnde < 0) aus.push({ art: 'anweisung', text: s.slice(i, j + 1).trim() });
    else aus.push({ art: 'regel', kopf: s.slice(i, kopfEnde).trim(), inhalt: s.slice(kopfEnde + 1, j) });
    i = j + 1;
  }
  return aus;
}

/** Selektorliste an den Kommas der obersten Ebene teilen */
export function teileSelektoren(kopf: string): string[] {
  const t: string[] = [];
  let tiefe = 0, a = 0;
  for (let i = 0; i < kopf.length; i++) {
    const c = kopf[i];
    if (c === '\\') { i++; continue; }
    if (c === '"' || c === "'") { i++; while (i < kopf.length && kopf[i] !== c) { if (kopf[i] === '\\') i++; i++; } continue; }
    if (c === '(' || c === '[') tiefe++;
    else if (c === ')' || c === ']') tiefe--;
    else if (c === ',' && tiefe === 0) { t.push(kopf.slice(a, i)); a = i + 1; }
  }
  t.push(kopf.slice(a));
  return t.map(x => x.trim()).filter(Boolean);
}

const unesc = (t: string) => t.replace(/\\([0-9a-fA-F]{1,6}\s?|[\s\S])/g, (_m, x: string) =>
  /^[0-9a-fA-F]+\s?$/.test(x) ? String.fromCodePoint(parseInt(x, 16)) : x);

/** Selektor ohne den Inhalt funktionaler Pseudoklassen (:is(…), :where(…), :not(…), :has(…), :nth-child(…) …) */
function ohneFunktionen(sel: string): string {
  let aus = '', tiefe = 0;
  for (let i = 0; i < sel.length; i++) {
    const c = sel[i];
    if (c === '\\') { if (!tiefe) aus += c + (sel[i + 1] ?? ''); i++; continue; }
    if (c === '(') { tiefe++; continue; }
    if (c === ')') { tiefe--; continue; }
    if (!tiefe) aus += c;
  }
  return aus;
}

/** Kann der Selektor ein Element der Schale (oder <html>/<body>) treffen? Großzügig: im Zweifel ja. */
export function kannTreffen(sel: string, klassen: ReadonlySet<string>, klassenText: string): boolean {
  const kern = ohneFunktionen(sel);
  for (const m of kern.matchAll(/\.((?:\\[0-9a-fA-F]{1,6}\s?|\\[\s\S]|[\w-])+)/g)) if (!klassen.has(unesc(m[1]))) return false;
  // [class*=x] / [class^=x] / [class$=x] / [class~=x] / [class=x]: ohne Vorkommen im Klassentext kein Treffer
  for (const m of kern.matchAll(/\[class\s*([*^$~|]?=)\s*(?:"([^"]*)"|'([^']*)'|([^\]\s]+))\s*\]/g)) {
    const wert = unesc(m[2] ?? m[3] ?? m[4] ?? '');
    if (wert && !klassenText.includes(wert)) return false;
  }
  return true;
}

/** Regeln des Stylesheets, die Elemente mit diesen Klassen treffen können – in Originalreihenfolge */
export function kritischesCss(css: string, klassen: ReadonlySet<string>, klassenText = [...klassen].join(' ')): string {
  const filtere = (knoten: Knoten[]): string => {
    let out = '';
    for (const k of knoten) {
      if (k.art === 'anweisung') { out += k.text.endsWith(';') ? k.text : k.text + ';'; continue; }
      if (/^@(font-face|(-webkit-)?keyframes)\b/.test(k.kopf)) continue;
      if (k.kopf.startsWith('@property') || k.kopf.startsWith('@page')) { out += `${k.kopf}{${k.inhalt}}`; continue; }
      if (k.kopf.startsWith('@')) { const innen = filtere(zerlegeCss(k.inhalt)); if (innen) out += `${k.kopf}{${innen}}`; continue; }
      const sel = teileSelektoren(k.kopf).filter(s => kannTreffen(s, klassen, klassenText));
      if (sel.length) out += `${sel.join(',')}{${k.inhalt}}`;
    }
    return out;
  };
  return filtere(zerlegeCss(css));
}

const ENTITAETEN: Record<string, string> = { amp: '&', quot: '"', lt: '<', gt: '>', apos: "'" };
const entschluessele = (s: string) => s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e: string) =>
  e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : ENTITAETEN[e] ?? m);

/** Klassen (einzeln und als Text aller class-Attribute) eines HTML-Ausschnitts, dazu die Klassen an <html> */
export function klassenAus(html: string): { klassen: Set<string>; text: string } {
  const klassen = new Set<string>(HTML_KLASSEN);
  const texte: string[] = [...HTML_KLASSEN];
  for (const m of html.matchAll(/\sclass="([^"]*)"/g)) {
    const wert = entschluessele(m[1]);
    texte.push(wert);
    for (const k of wert.split(/\s+/)) if (k) klassen.add(k);
  }
  return { klassen, text: texte.join('\n') };
}

const LINK = /<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/;

/** dist/index.html: Stylesheet im Kopf durch das kritische CSS ersetzen und hinter die Schale (rootHtml) stellen */
export function kritischEinsetzen(html: string, rootHtml: string, cssVon: (href: string) => string | undefined): string {
  const kopfEnde = html.indexOf('</head>');
  const link = LINK.exec(html.slice(0, kopfEnde));
  if (!link) throw new Error('kritisches-css: kein Stylesheet im Kopf von index.html');
  if ([...html.slice(0, kopfEnde).matchAll(new RegExp(LINK, 'g'))].length !== 1) throw new Error('kritisches-css: mehr als ein Stylesheet im Kopf');
  const css = cssVon(link[1]);
  if (css === undefined) throw new Error(`kritisches-css: ${link[1]} nicht im Bundle`);
  const wo = html.indexOf(rootHtml);
  if (wo < 0) throw new Error('kritisches-css: Startseiten-Schale nicht in index.html');
  const { klassen, text } = klassenAus(html.slice(wo, wo + rootHtml.length) + (/<html[^>]*>/.exec(html)?.[0] ?? '') + (/<body[^>]*>/.exec(html)?.[0] ?? ''));
  const krit = kritischesCss(css, klassen, text).replace(/<\/style/gi, '<\\/style');
  const spaet = link[0].replace(/>$/, ` ${SPAET_ATTR}>`);
  const ende = wo + rootHtml.length;
  const mitSpaet = html.slice(0, ende) + `\n    ${spaet}` + html.slice(ende);
  return mitSpaet.slice(0, link.index) + `<style ${KRITISCH_ATTR}>${krit}</style>` + mitSpaet.slice(link.index + link[0].length);
}

/** Umkehrung für die vorgerenderten Modulseiten: Stylesheet wieder an seine Stelle im Kopf, kritisches CSS weg */
export function kritischEntfernen(html: string): string {
  const stil = new RegExp(`<style ${KRITISCH_ATTR}>[\\s\\S]*?</style>`).exec(html);
  const spaet = new RegExp(`\\n\\s*(<link rel="stylesheet"[^>]*) ${SPAET_ATTR}>`).exec(html);
  if (!stil && !spaet) return html;
  if (!stil || !spaet) throw new Error('kritisches-css: kritisches CSS und spätes Stylesheet nur zusammen');
  const ohne = html.slice(0, spaet.index) + html.slice(spaet.index + spaet[0].length);
  const s = ohne.indexOf(stil[0]);
  return ohne.slice(0, s) + spaet[1] + '>' + ohne.slice(s + stil[0].length);
}

export function kritischesCssPlugin(wurzel = process.cwd()): Plugin {
  let basis = '/';
  return {
    name: 'kritisches-css',
    apply: 'build',
    configResolved(c) { basis = c.base; },
    transformIndexHtml: {
      order: 'post',
      async handler(html, ctx) {
        const bundle = ctx.bundle as OutputBundle | undefined;
        if (!bundle) return;
        const { root } = await erzeugeSchale(wurzel);
        return kritischEinsetzen(html, root, href => {
          const a = bundle[href.startsWith(basis) ? href.slice(basis.length) : href] as OutputAsset | undefined;
          if (!a || a.type !== 'asset') return undefined;
          return typeof a.source === 'string' ? a.source : Buffer.from(a.source).toString('utf8');
        });
      },
    },
  };
}
