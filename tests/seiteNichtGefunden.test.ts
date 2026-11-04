// Hinweis „Seite nicht gefunden“ (Gesamtgutachten 03.11.2026, 3.1/3.4): unbekannte Adressen zeigen nicht mehr
// kommentarlos die Startseite. (1) Erkennung der Adresse, (2) ähnliche Module, (3) Komponente, (4) App-Einbindung,
// (5) dist/404.html (scripts/seite404.mjs) ohne neues Inline-Skript, (6) Vorrendern unberührt.
import fs from 'node:fs';
import { h, rendere, text, sicher, testlauf } from './hilfen/komponenten';
const { unbekannteAdresse } = await import('../src/contexts/TabContext');
const { default: SeiteNichtGefunden, aehnlicheModule } = await import('../src/components/navigation/SeiteNichtGefunden');
const { erzeuge404, TITEL_404 } = await import('../scripts/seite404.mjs');
const { INAKTIVE_MODULE } = await import('../src/registry/modules');

const t = testlauf('Seite nicht gefunden');
const ort = (pathname: string, hash = '') => ({ pathname, hash });

t.test('unbekannte Adresse erkennen', () => {
  sicher(unbekannteAdresse(ort('/modul/gibtsnicht_xyz')) === 'gibtsnicht_xyz', 'unbekannte Modul-ID');
  sicher(unbekannteAdresse(ort('/foo/bar')) === '/foo/bar', 'unbekannter Pfad');
  sicher(unbekannteAdresse(ort('/modul/')) === '/modul/', 'Modulpfad ohne ID');
  for (const p of ['/', '/index.html', '/modul/glas', '/modul/Glas', '/modul/glas.html', '/modul/stahlbeton', '/modul/start'])
    sicher(unbekannteAdresse(ort(p)) === null, `bekannte Adresse ${p} gilt als unbekannt`);
  sicher(unbekannteAdresse(ort('/', '#abschnitt')) === null && unbekannteAdresse(ort('/', '#glas')) === null, 'Hash-Anker und alte Hash-Links');
  const inaktiv = [...INAKTIVE_MODULE][0];
  sicher(!!inaktiv && unbekannteAdresse(ort('/modul/' + inaktiv)) === inaktiv, 'abgeschaltete Seite zeigt den Hinweis');
});

t.test('ähnliche Module', () => {
  const ids = (a: string) => aehnlicheModule(a).map(m => m.id);
  sicher(ids('glaser').includes('feuchteschutz'), `glaser → feuchteschutz (${ids('glaser')})`);
  sicher(ids('stahlbetn_bemessung').includes('stahlbeton_bemessung'), `Tippfehler (${ids('stahlbetn_bemessung')})`);
  sicher(ids('/modul/mischung').includes('mischungsberechnung'), `Teilwort (${ids('/modul/mischung')})`);
  sicher(ids('qqqxyz').length === 0 && ids('x').length === 0, 'nichts Ähnliches → leer');
  sicher(aehnlicheModule('beton').length <= 5, 'höchstens 5 Vorschläge');
});

t.test('Komponente: Überschrift, Adresse, Vorschläge, Suche, Links', () => {
  const html = rendere(h(SeiteNichtGefunden, { adresse: 'glaser' }));
  const s = text(html);
  sicher(/<h2[^>]*>Seite nicht gefunden<\/h2>/.test(html), 'Überschrift h2 „Seite nicht gefunden“');
  sicher(s.includes('/modul/glaser'), 'Adresse genannt');
  sicher(s.includes('Meinten Sie') && s.includes('Feuchteschutz'), 'Vorschlag Feuchteschutz');
  sicher(/<label[^>]*for="([^"]+)"[\s\S]*?<input[^>]*id="\1"[^>]*type="search"/.test(html), 'Suchfeld mit Beschriftung');
  sicher(s.includes('Zur Startseite') && s.includes('Zur Modulübersicht'), 'Links Startseite/Modulübersicht');
  sicher(!/<script/i.test(html), 'kein Skript im Markup');
});

t.test('App: Hinweis statt Startseite, Adresse bleibt, Titel, noindex', () => {
  const app = fs.readFileSync('src/App.tsx', 'utf8');
  sicher(/\) : nichtGefunden !== null \? \(\s*<React\.Suspense/.test(app) && app.includes('<SeiteNichtGefunden adresse={nichtGefunden} />'), 'App rendert SeiteNichtGefunden statt Modulinhalt');
  sicher(app.includes("'Seite nicht gefunden – BaustoffBoard'") && app.includes("'Seite nicht gefunden – BaustoffBoard THA'") && app.includes("'noindex'"), 'h1, Fenstertitel, noindex');
  sicher(/React\.lazy\(\(\) => import\('\.\/components\/navigation\/SeiteNichtGefunden'\)\)/.test(app), 'nur bei Bedarf geladen');
  const ctx = fs.readFileSync('src/contexts/TabContext.tsx', 'utf8');
  sicher(/if \(nichtGefunden !== null\) \{ ersterLauf\.current = false; return; \}/.test(ctx), 'Adresse wird nicht auf „/“ umgeschrieben');
  sicher(/startTab \? null : nichtGefundenFuerAdresse\(\)/.test(ctx), 'Vorrendern (startTab) ohne Hinweis');
});

t.test('404.html: Titel, noindex, Ersatzinhalt, keine neuen Inline-Skripte', () => {
  const quelle = fs.readFileSync('index.html', 'utf8');
  const s = erzeuge404(quelle);
  sicher(s.includes(`<title>${TITEL_404}</title>`) && s.includes('<meta name="robots" content="noindex" />') && !s.includes('index, follow'), 'Titel und noindex');
  sicher(/<noscript>[\s\S]*<h1>Seite nicht gefunden<\/h1>[\s\S]*href="\/modul\/modulstruktur"[\s\S]*<\/noscript>/.test(s), 'Ersatzinhalt ohne JavaScript');
  sicher((s.match(/id="root"/g) ?? []).length === 1 && s.indexOf('-->', s.indexOf('Fallback-Inhalt')) < s.indexOf('<noscript>\n      <main>'), 'Kommentar vor <noscript> bleibt geschlossen, #root bleibt erhalten');
  sicher(!/<!--(?:(?!-->)[\s\S])*id="root"/.test(s), '#root nicht in einem Kommentar');
  const inline = (x: string) => (x.match(/<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/g) ?? []).join('\n');
  sicher(inline(s) === inline(quelle), 'Inline-Skripte unverändert (CSP-Hashes)');
  const k = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  sicher(/&& node scripts\/seite404\.mjs$/.test(k.buildCommand), 'vercel.json erzeugt 404.html mit scripts/seite404.mjs');
  if (fs.existsSync('dist/404.html') && fs.existsSync('dist/index.html')) {
    const d = fs.readFileSync('dist/404.html', 'utf8');
    sicher(d === erzeuge404(fs.readFileSync('dist/index.html', 'utf8')), 'dist/404.html entspricht dist/index.html + erzeuge404');
  }
});

t.test('Server: unbekannter Pfad 404, Startseite 200', () => {
  const srv = fs.readFileSync('server.ts', 'utf8');
  sicher(/res\.status\(tabAusPfad\(req\.path\) === null \? 404 : 200\)/.test(srv), 'Server-Fallback mit Status 404');
});

t.ende();
