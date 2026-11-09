#!/usr/bin/env node
/**
 * dist/404.html für den statischen Betrieb (Vercel, vercel.json buildCommand; Gesamtgutachten 03.11.2026, 3.1/3.4).
 *
 * Aus dist/index.html (App mit Startseiten-Schale) wird die 404-Seite: gleiche App, gleiche Inline-Skripte (CSP-Hashes
 * unverändert, kein neues Inline-Skript), aber
 *  - <title> und og:/twitter:title „Seite nicht gefunden – BaustoffBoard THA“,
 *  - <meta name="robots" content="noindex">,
 *  - <noscript>-Ersatzinhalt mit Hinweis „Seite nicht gefunden“ und Links (Startseite, Modulübersicht) statt des
 *    Startseiten-Textes.
 * Die Startseiten-Schale bleibt im Markup, wird aber nie eingeblendet: scripts/startschale-boot.js zeigt sie nur unter
 * „/“, und „/“ liefert Vercel nie als 404. Mit JavaScript zeigt die App selbst den Hinweis (SeiteNichtGefunden).
 *
 *   node scripts/seite404.mjs [dist]        schreibt <dist>/404.html (Standard: dist)
 * tests/seiteNichtGefunden.test.ts prüft erzeuge404().
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const TITEL_404 = 'Seite nicht gefunden – BaustoffBoard THA';

const NOSCRIPT_404 = `<noscript>
      <main>
        <h1>Seite nicht gefunden</h1>
        <p>Unter dieser Adresse gibt es keine Seite des BaustoffBoards. Das Modul wurde vielleicht umbenannt, zusammengelegt oder abgeschaltet.</p>
        <p><a href="/">Zur Startseite</a> · <a href="/modul/modulstruktur">Zur Modulübersicht</a></p>
      </main>
    </noscript>`;

function ersetze(s, re, neu, was) {
  if (!re.test(s)) throw new Error(`404.html: ${was} nicht gefunden`);
  return s.replace(re, neu);
}

/** 404-Fassung einer gebauten index.html */
export function erzeuge404(html) {
  let s = html;
  s = ersetze(s, /<title>[\s\S]*?<\/title>/, `<title>${TITEL_404}</title>`, '<title>');
  s = ersetze(s, /<meta name="robots" content="[^"]*"\s*\/?>/, '<meta name="robots" content="noindex" />', 'meta robots');
  s = s.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${TITEL_404}$2`);
  s = s.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${TITEL_404}$2`);
  // Ersatzinhalt: das <noscript>-Element vor </noscript> (nicht das Wort „<noscript>“ im HTML-Kommentar davor)
  const ende = s.indexOf('</noscript>');
  const anfang = ende < 0 ? -1 : s.lastIndexOf('<noscript>', ende);
  if (anfang < 0) throw new Error('404.html: <noscript> nicht gefunden');
  s = s.slice(0, anfang) + NOSCRIPT_404 + s.slice(ende + '</noscript>'.length);
  return s;
}

const istHaupt = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (istHaupt) {
  const dist = path.resolve(process.argv[2] ?? 'dist');
  const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
  fs.writeFileSync(path.join(dist, '404.html'), erzeuge404(html));
  console.log(`404.html geschrieben (${path.join(dist, '404.html')})`);
}
