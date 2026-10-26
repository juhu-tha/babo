// Pfad-Routing und Vorrendern (Z52): Pfadregeln (src/routing/pfad.ts) und ihre Kopien in den Inline-Skripten,
// HTML-Werkzeuge (scripts/vorrendernHtml.ts), Zuschnitt der Modulseite und Einsetzen in dist/index.html
// (scripts/vorrendern.ts), alte Hash-Links in Registry-Ausgaben.
import fs from 'fs';
import { modulPfad, tabAusPfad, tabAusHash } from '../src/routing/pfad';
import { zerlege, zusammensetzen, kuerze, textLaenge } from '../scripts/vorrendernHtml';
import { modulSchale, baueSeite } from '../scripts/vorrendern';
import { KOPF_ANKER } from '../scripts/startSchale';
import { erzeugeSitemap } from '../scripts/gen-sitemap';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };

console.log('--- Test: Pfad-Routing und Vorrendern ---');

// 1. Pfadregeln
pruefe(modulPfad('start') === '/' && modulPfad('glas') === '/modul/glas' && modulPfad('wu-bauwerke') === '/modul/wu-bauwerke', 'modulPfad');
pruefe(tabAusPfad('/') === 'start' && tabAusPfad('/index.html') === 'start', 'tabAusPfad Startseite');
pruefe(tabAusPfad('/modul/glas') === 'glas' && tabAusPfad('/modul/Glas/') === 'glas' && tabAusPfad('/modul/wu-bauwerke') === 'wu-bauwerke', 'tabAusPfad Modul');
pruefe(tabAusPfad('/modul/') === null && tabAusPfad('/modul/a/b') === null && tabAusPfad('/assets/x.js') === null && tabAusPfad('/modul/%E0%A4%A') === null, 'tabAusPfad ungültig');
pruefe(tabAusHash('#Glas') === 'glas' && tabAusHash('') === null && tabAusHash('#') === null, 'tabAusHash');
for (const id of ['glas', 'oekobilanz_lca', 'wu-bauwerke']) pruefe(tabAusPfad(modulPfad(id)) === id, `Hin und zurück: ${id}`);
// Inline-Skripte (vor dem Einstiegs-Chunk) verwenden dieselbe Pfadregel
for (const f of ['scripts/startschale-boot.js', 'scripts/vorladen-boot.js']) {
  pruefe(fs.readFileSync(f, 'utf8').includes('/^\\/modul\\/([^/]+)\\/?$/'), `${f}: Pfadregel weicht von src/routing/pfad.ts ab`);
}

// 2. HTML-Werkzeuge: Rundlauf und Zuschnitt
const probe = '<div class="a"><p>Hallo &amp; <b>Welt</b></p><img src="x.png" alt="x"/><svg viewBox="0 0 1 1"><path d="M0 0"></path></svg><!-- --><style>.a>b{color:red}</style></div><br/>';
pruefe(zusammensetzen(zerlege(probe)) === probe, `Rundlauf: ${zusammensetzen(zerlege(probe))}`);
pruefe(textLaenge(zerlege('<p>ab &amp; c</p>')) === 6, 'textLaenge mit Entity');
let wirft = false;
try { zerlege('<div><p>offen</div>'); } catch { wirft = true; }
pruefe(wirft, 'falsch verschachteltes HTML wird nicht erkannt');
const lang = zerlege(`<section><h2>Erster</h2><p>${'a'.repeat(50)}</p><p>${'b'.repeat(50)}</p></section><section><h2>Zweiter</h2></section>`);
const k = zusammensetzen(kuerze(lang, { text: 70, bytes: 10_000 }).knoten);
pruefe(k.includes('Erster') && k.includes('aaaa') && !k.includes('bbbb') && !k.includes('Zweiter') && k.endsWith('</section>'), `kuerze schneidet falsch: ${k}`);
pruefe(zusammensetzen(kuerze(lang, { text: 10_000, bytes: 10_000 }).knoten) === zusammensetzen(lang), 'kuerze mit großem Budget verändert');
pruefe(zusammensetzen(kuerze(lang, { text: 10_000, bytes: 60 }).knoten).length <= 120, 'Byte-Budget wirkt nicht');

// 3. Modulseite aus App-HTML (Aufbau wie App.tsx im Modus vorrendern)
const app = '<link rel="preload" href="/x"/><div class="min-h-screen"><aside><nav class="flex-1"><button>Menü</button></nav></aside><main><h1 class="sr-only">Glas – BaustoffBoard</h1><div><div id="module-content" class="pb-8">'
  + '<div class="hidden print:block">Druck</div><!--$--><p role="note">Prüfung ausstehend</p><section aria-label="Lernziele"><li>Lernziel 1</li></section><!--/$-->'
  + `<!--$--><div class="space-y-8"><section><h2>Erster Abschnitt</h2><p>${'x'.repeat(3000)}</p></section><section><h2>Zweiter Abschnitt</h2></section></div><!--/$-->`
  + '</div><footer>Fuß</footer></div></main></div><!--$--><!--/$--><script>$RT=1</script>';
const { html: schale, hinweise } = modulSchale(app, { text: 2000, bytes: 50_000 });
pruefe(hinweise.length === 0, `Hinweise: ${hinweise.join('; ')}`);
pruefe(schale.startsWith('<div class="min-h-screen">') && !schale.includes('<script') && !schale.includes('<link'), 'Schale: Rahmen falsch oder Skript/Link übernommen');
pruefe(schale.includes('Lernziel 1') && schale.includes('Prüfung ausstehend') && schale.includes('Erster Abschnitt'), 'Schale ohne Modulkopf bzw. ersten Abschnitt');
pruefe(!schale.includes('Zweiter Abschnitt') && !schale.includes('<footer') && !schale.includes('Menü'), 'Schale enthält Zweiten Abschnitt, Fußzeile oder Menüeinträge');
pruefe(!schale.includes('<!--$-->'), 'Suspense-Marker übernommen');
const fehlerApp = app.replace('<!--$--><div class="space-y-8">', '<!--$!--><template data-msg="x"></template><div class="space-y-8">');
const mitFehler = modulSchale(fehlerApp);
pruefe(mitFehler.hinweise.some(h => h.includes('Modulinhalt')) && mitFehler.html.includes('Lernziel 1') && !mitFehler.html.includes('Erster Abschnitt'), 'Fehlergrenze im Modulinhalt nicht ausgelassen');

// 4. Einsetzen in dist/index.html
const startRoot = '<div id="root"><div data-schale inert><p>Start</p></div></div>';
const vorlage = `<!doctype html><html><head>${KOPF_ANKER}<script>boot()</script><title>Alt</title><meta name="description" content="alt" /><link rel="canonical" href="https://baustoffboard.de/" />`
  + '<meta property="og:url" content="https://baustoffboard.de/" /><meta property="og:title" content="Alt" /><meta property="og:description" content="alt" />'
  + `<meta name="twitter:url" content="https://baustoffboard.de/" /><meta name="twitter:title" content="Alt" /><meta name="twitter:description" content="alt" /></head><body>${startRoot}<script src="/a.js"></script></body></html>`;
const seite = baueSeite(vorlage, startRoot, { id: 'glas', label: 'Glas & Co', meta: 'Bauglas "ESG"' }, '<div>X $& $1</div>');
pruefe(seite.includes(`${KOPF_ANKER}\n    <meta name="bb-vorgerendert" content="glas" /><script>boot()</script>`), 'Kennung nicht vor dem Boot-Skript');
pruefe(seite.includes('<div id="root"><div data-schale inert><div>X $& $1</div></div></div>') && !seite.includes('<p>Start</p>'), 'Schale nicht (wörtlich) eingesetzt');
pruefe(seite.includes('<title>BaustoffBoard THA - Glas &amp; Co</title>') && seite.includes('<link rel="canonical" href="https://baustoffboard.de/modul/glas"'), 'Titel/kanonische Adresse');
pruefe(seite.includes('<meta name="description" content="Bauglas &quot;ESG&quot;"') && seite.includes('<meta name="twitter:url" content="https://baustoffboard.de/modul/glas"'), 'Beschreibung/Twitter');
wirft = false;
try { baueSeite(vorlage.replace(startRoot, '<div id="root"></div>'), startRoot, { id: 'glas', label: 'Glas' }, ''); } catch { wirft = true; }
pruefe(wirft, 'fehlende Startseiten-Schale wird nicht erkannt');

// 5. keine alten Hash-Links mehr in Sitemap und index.html (Crawler sehen nur echte Pfade)
pruefe(!/baustoffboard\.de\/#/.test(erzeugeSitemap()) && erzeugeSitemap().includes('https://baustoffboard.de/modul/glas<'), 'Sitemap mit Hash-Links');
const index = fs.readFileSync('index.html', 'utf8');
pruefe(!/baustoffboard(\.tha)?\.de\/#[a-z]/.test(index) && !/href="#[a-z]/.test(index), 'index.html mit Hash-Links');

if (fehler.length) {
  for (const f of fehler) console.error(`FAIL: ${f}`);
  process.exit(1);
}
console.log('OK: Pfadregeln, HTML-Zuschnitt, Seitenaufbau, Sitemap');
