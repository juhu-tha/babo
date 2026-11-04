// Kritisches CSS der Startseiten-Schale (LCP Startseite 04.11.2026, scripts/kritischesCss.ts): Auswahl großzügig und
// in Originalreihenfolge, Einsetzen und Entfernen umkehrbar, gebaute Seiten (falls dist/ vorhanden) richtig aufgebaut.
import fs from 'fs';
import path from 'path';
import { kannTreffen, kritischesCss, kritischEinsetzen, kritischEntfernen, klassenAus, zerlegeCss, KRITISCH_ATTR, SPAET_ATTR } from '../scripts/kritischesCss';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };

console.log('--- Test: kritisches CSS der Startseiten-Schale ---');

// 1. Selektoren
const k = new Set(['flex', 'md:flex', 'dark:bg-slate-900', 'w-[52vw]', 'text-home-grau', 'dark', 'group', 'group-hover:text-shiraz']);
const text = [...k].join(' ');
const fall = (sel: string, soll: boolean) => pruefe(kannTreffen(sel, k, text) === soll, `kannTreffen(${sel}) ≠ ${soll}`);
fall('.flex', true);
fall('.grid', false);
fall('.md\\:flex', true);
fall('.w-\\[52vw\\]', true);
fall('.dark\\:bg-slate-900:where(.dark, .dark *)', true);
fall('.dark\\:bg-slate-800:where(.dark, .dark *)', false);
fall('html:not(.dark) :is(.text-home-grau,.text-home-grau\\/30)', true); // Klassen in :is()/:not() nicht Pflicht
fall('#module-content .flex:not(.flex-col):not(.flex-nowrap)', true);
fall('.group:hover .group-hover\\:text-shiraz', true);
fall('*,:before,:after', true);
fall('html,:host', true);
fall('.dark [class*=bg-emerald-50]', false); // kein Element mit „bg-emerald-50“
fall('.dark [class*=bg-slate]', true);
fall('[data-schale]', true);
fall('.katex .mord', false);

// 2. Auswahl und Reihenfolge
const css = '/*! Kopf */@layer theme{:root{--a:1}}@layer base{*{margin:0}.katex{font:1em}}@font-face{font-family:X;src:url(x.woff2)}'
  + '@keyframes spin{to{transform:rotate(1turn)}}@property --tw-x{syntax:"*";inherits:false}'
  + '.flex{display:flex}.grid{display:grid}@media (min-width:48rem){.md\\:flex{display:flex}.md\\:grid{display:grid}}'
  + '@supports (color:color-mix(in lab,red,red)){.grid\\/50{color:red}}.a,.flex>p{color:blue}.x{content:"}{"}';
const krit = kritischesCss(css, k, text);
pruefe(krit === '@layer theme{:root{--a:1}}@layer base{*{margin:0}}@property --tw-x{syntax:"*";inherits:false}.flex{display:flex}@media (min-width:48rem){.md\\:flex{display:flex}}.flex>p{color:blue}', `Auswahl: ${krit}`);
pruefe(zerlegeCss('@layer a,b;.x{y:1}').length === 2, 'Anweisung @layer a,b; als eigener Knoten');
pruefe(kritischesCss('@layer a,b;.flex{y:1}', k).startsWith('@layer a,b;'), '@layer-Reihenfolge bleibt');

// 3. Klassen aus HTML (Entitäten), <html>-Klassen immer dabei
const kl = klassenAus('<div class="a &amp; [&amp;>p]:m-0"><span class="b"></span></div>');
pruefe(kl.klassen.has('[&>p]:m-0') && kl.klassen.has('b') && kl.klassen.has('bb-schale') && kl.klassen.has('dark'), 'klassenAus');

// 4. Einsetzen und Entfernen
const root = '<div id="root"><div data-schale inert><div class="flex md:flex">Hallo</div></div></div>';
const html = `<!doctype html>\n<html lang="de">\n  <head>\n    <script type="module" crossorigin src="/assets/app.js"></script>\n    <link rel="stylesheet" crossorigin href="/assets/app.css">\n  </head>\n  <body>\n    ${root}\n  </body>\n</html>\n`;
const mit = kritischEinsetzen(html, root, href => (href === '/assets/app.css' ? css : undefined));
const kopf = mit.slice(0, mit.indexOf('</head>'));
pruefe(kopf.includes(`<style ${KRITISCH_ATTR}>`) && !/<link rel="stylesheet"/.test(kopf), 'Kopf: kritisches CSS statt Stylesheet');
pruefe(mit.includes(`${root}\n    <link rel="stylesheet" crossorigin href="/assets/app.css" ${SPAET_ATTR}>`), 'Stylesheet direkt hinter der Schale');
pruefe(!mit.includes('.grid{'), 'nicht benötigte Regel im kritischen CSS');
pruefe(kritischEntfernen(mit) === html, 'kritischEntfernen stellt den alten Zustand her');
pruefe(kritischEntfernen(html) === html, 'kritischEntfernen ohne kritisches CSS unverändert');
let geworfen = false;
try { kritischEinsetzen(html.replace('<link rel="stylesheet" crossorigin href="/assets/app.css">', ''), root, () => css); } catch { geworfen = true; }
pruefe(geworfen, 'ohne Stylesheet im Kopf: Fehler statt stiller Seite');
const mitEnde = kritischEinsetzen(html, root, () => '.flex{x:"</style>"}');
pruefe(!/<\/style>"/.test(mitEnde), '</style> im CSS maskiert');

// 5. Gebaute Seiten (nur, wenn dist/ vorhanden): Startseite mit, Modulseiten ohne kritisches CSS
const dist = path.resolve('dist');
if (fs.existsSync(path.join(dist, 'index.html')) && fs.existsSync(path.join(dist, 'modul'))) {
  const index = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
  const ende = index.indexOf('</head>');
  pruefe(index.indexOf(`<style ${KRITISCH_ATTR}>`) > 0 && index.indexOf(`<style ${KRITISCH_ATTR}>`) < ende, 'dist/index.html: kritisches CSS im Kopf');
  pruefe(!/<link rel="stylesheet"/.test(index.slice(0, ende)), 'dist/index.html: kein Stylesheet im Kopf');
  const spaet = index.indexOf(SPAET_ATTR);
  pruefe(spaet > index.indexOf('<div id="root">'), 'dist/index.html: Stylesheet hinter #root');
  const seite = fs.readdirSync(path.join(dist, 'modul')).find(f => f.endsWith('.html') && f !== 'admin.html');
  if (seite) {
    const m = fs.readFileSync(path.join(dist, 'modul', seite), 'utf8');
    pruefe(!m.includes(KRITISCH_ATTR) && !m.includes(SPAET_ATTR) && /<link rel="stylesheet"/.test(m.slice(0, m.indexOf('</head>'))), `dist/modul/${seite}: Stylesheet im Kopf wie bisher`);
  }
}

if (fehler.length) { for (const f of fehler) console.log('FAIL', f); process.exit(1); }
console.log('Alle Prüfungen bestanden.');
