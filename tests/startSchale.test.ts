// Startseiten-Schale (Umsetzungsplan Phase 5, AP 5.5 Nachtrag): Schale passt noch zum Quelltext, Boot-Skript
// entfernt sie in allen Fällen, in denen das erste Bild von React anders aussähe.
import fs from 'fs';
import vm from 'vm';
import { erzeugeSchale, KOPF_ANKER, SCHALE_STIL } from '../scripts/startSchale';
import { APP_VERSION, STAND_DE } from '../src/data/stand';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };

console.log('--- Test: Startseiten-Schale ---');

const roh = fs.readFileSync('scripts/startschale.html', 'utf8');
const quellen = ['src/App.tsx', 'src/modules/Startseite.tsx', 'src/components/navigation/LanguageSwitcher.tsx', 'src/components/a11y/AccessibilityToolbar.tsx']
  .map(f => fs.readFileSync(f, 'utf8')).join('\n');
const alleQuellen = (function lies(d: string): string {
  return fs.readdirSync(d, { withFileTypes: true }).map(e => e.isDirectory() ? lies(`${d}/${e.name}`) : /\.tsx?$/.test(e.name) ? fs.readFileSync(`${d}/${e.name}`, 'utf8') : '').join('\n');
})('src');

// 1. Texte der Begrüßung stehen so in Startseite.tsx
const start = fs.readFileSync('src/modules/Startseite.tsx', 'utf8');
for (const t of ['Willkommen im BaustoffBoard', 'Interaktive Lern- und Wissensplattform für Baustoffkunde, Werkstoffmechanik, Bauen im Bestand, Kreislaufwirtschaft, Nachhaltiges Bauen &amp; Co.', 'Prof. Dr.-Ing. Jürgen Huber - TH Augsburg']) {
  pruefe(roh.includes(t), `Schale ohne Text: ${t}`);
  pruefe(start.includes(t.replace('&amp;', '&')), `Startseite.tsx ohne Text (Schale neu erzeugen): ${t}`);
}
pruefe(roh.includes('%BB_VERSION%'), 'Platzhalter %BB_VERSION% fehlt');

// 2. jede Klasse der Schale kommt noch im Quelltext vor (sonst Schale mit scripts/qa/startschale-erzeugen.mjs neu erzeugen)
const klassen = new Set([...roh.matchAll(/class="([^"]*)"/g)].flatMap(m => m[1].split(/\s+/)).filter(Boolean));
const fehlend = [...klassen].filter(k => !k.startsWith('lucide') && !alleQuellen.includes(k)); // lucide-* setzt die Icon-Bibliothek
pruefe(fehlend.length === 0, `Klassen der Schale nicht mehr im Quelltext: ${fehlend.join(' ')}`);
// Rahmen: die tragenden Klassenlisten stehen wörtlich in App.tsx bzw. Startseite.tsx
for (const k of ['min-h-screen bg-off-white dark:bg-slate-950 text-text-main dark:text-slate-100 flex font-sans', 'flex items-center justify-between h-14', 'bg-white p-8 rounded-2xl shadow-sm border border-home-grau/30 text-center flex flex-col items-center', 'text-lg text-text-main/80 mb-6 max-w-2xl'])
  pruefe(roh.includes(`class="${k}`) && quellen.includes(k), `Rahmenklasse weicht ab: ${k}`);

// 3. eingesetzte Version und Boot-Skript
const { kopf, root: html } = await erzeugeSchale();
pruefe(html.includes(`Version ${APP_VERSION} (${STAND_DE})`), 'Version nicht eingesetzt');
pruefe(html.startsWith('<div id="root"><div data-schale inert>') && !html.includes('<script'), 'Aufbau der Schale (Wurzel)');
pruefe(kopf.includes('<script>') && !kopf.includes('<script src') && kopf.includes(`<style>${SCHALE_STIL}</style>`), 'Aufbau der Schale (Kopf)');
// Kopfteil steht im Build vor jedem Stylesheet (sonst würde das Skript erst nach dem CSS laufen)
const index = fs.readFileSync('index.html', 'utf8');
pruefe(index.includes(KOPF_ANKER) && !/<link[^>]*stylesheet|<style/.test(index.slice(0, index.indexOf(KOPF_ANKER))), 'Kopfanker fehlt oder Stylesheet davor in index.html');

// 4. Boot-Skript: Schale nur auf der Startseite mit Standardeinstellungen
const boot = fs.readFileSync('scripts/startschale-boot.js', 'utf8');
// pfad/seite: Adresse und Inhalt der Datei (<meta name="bb-vorgerendert">, Modulseiten aus scripts/vorrendern.ts, Z52)
function laufe(hash: string, search: string, speicher: Record<string, string> | null, pathname = '/', seite?: string, systemDunkel = false, nurHell = false): 'behalten' | 'entfernt' {
  const klassen = new Set<string>();
  // speicher null: Zugriff auf localStorage wirft (gesperrter Speicher)
  const ls = { getItem: (k: string) => { if (speicher === null) throw new Error('gesperrt'); return k in speicher ? speicher[k] : null; } };
  const meta = seite === undefined ? null : { getAttribute: (n: string) => (n === 'content' ? seite : null), hasAttribute: (n: string) => n === 'data-nur-hell' && nurHell };
  const document = { documentElement: { classList: { add: (k: string) => klassen.add(k) } }, querySelector: (q: string) => (q === 'meta[name="bb-vorgerendert"]' ? meta : null) };
  vm.runInNewContext(boot, { document, location: { hash, search, pathname }, window: { localStorage: ls, matchMedia: (q: string) => ({ matches: systemDunkel && q.includes('dark') }) }, decodeURIComponent });
  letzteDunkel = klassen.has('dark');
  return klassen.has('bb-schale') ? 'behalten' : 'entfernt';
}
let letzteDunkel = false;
pruefe(laufe('', '', {}) === 'behalten', 'Startseite ohne Hash: Schale fehlt');
pruefe(laufe('#start', '', { baustoffboard_screen_width: 'wide' }) === 'behalten', '#start: Schale fehlt');
pruefe(laufe('#glas', '', {}) === 'entfernt', '#glas: Schale bleibt');
pruefe(laufe('', '?poll=abc', {}) === 'entfernt', 'Umfrage: Schale bleibt');
pruefe(laufe('', '', { baustoffboard_lang: 'en' }) === 'entfernt', 'Englisch: Schale bleibt');
// Dunkelmodus (02.11.2026): Schale steht auch dunkel (Markup hell = dunkel), Klasse dark vor dem ersten Bild
pruefe(laufe('', '', { theme: 'dark' }) === 'behalten' && letzteDunkel, 'Dunkelmodus: Schale fehlt oder kein dark');
// Systemeinstellung dunkel (Gutachten 29.10.2026): gilt ohne eigene Wahl; eigene Wahl „hell“ hat Vorrang
pruefe(laufe('', '', {}, '/', undefined, true) === 'behalten' && letzteDunkel, 'System dunkel: Schale fehlt oder kein dark');
pruefe(laufe('', '', { theme: 'light' }, '/', undefined, true) === 'behalten' && !letzteDunkel, 'System dunkel, Wahl hell: Schale fehlt oder dark gesetzt');
pruefe(laufe('', '', {}, '/', undefined, false) === 'behalten' && !letzteDunkel, 'System hell: dark gesetzt');
pruefe(laufe('', '', { baustoffboard_screen_width: 'full' }) === 'entfernt', 'Vollbreite: Schale bleibt');
pruefe(laufe('', '', { baustoffboard_fluid_width: 'false' }) === 'entfernt', 'alte Breiten-Einstellung: Schale bleibt');
// Modulseiten (Z52): nur die zur Adresse passende vorgerenderte Datei zeigen
pruefe(laufe('', '', {}, '/modul/glas', 'glas') === 'behalten', '/modul/glas: vorgerenderte Seite fehlt');
pruefe(laufe('', '', {}, '/modul/Glas/', 'glas') === 'behalten', '/modul/Glas/: Groß-/Kleinschreibung, Schrägstrich');
pruefe(laufe('#abschnitt', '', {}, '/modul/glas', 'glas') === 'behalten', '/modul/glas#abschnitt: Anker blendet Seite aus');
pruefe(laufe('', '', {}, '/modul/glas') === 'entfernt', '/modul/glas mit index.html (Start-Schale): Schale bleibt');
pruefe(laufe('', '', {}, '/modul/glas', 'holz') === 'entfernt', 'falsche Modulseite: Schale bleibt');
pruefe(laufe('', '', {}, '/', 'glas') === 'entfernt', 'Modulseite unter /: Schale bleibt');
pruefe(laufe('', '', { theme: 'dark' }, '/modul/glas', 'glas') === 'behalten' && letzteDunkel, 'Modulseite im Dunkelmodus: Schale fehlt');
// Modulseite, deren Markup dunkel abweicht (scripts/vorrendern.ts, data-nur-hell): nur hell
pruefe(laufe('', '', { theme: 'dark' }, '/modul/glas', 'glas', false, true) === 'entfernt' && letzteDunkel, 'data-nur-hell im Dunkelmodus: Schale bleibt');
pruefe(laufe('', '', {}, '/modul/glas', 'glas', true, true) === 'entfernt', 'data-nur-hell, System dunkel: Schale bleibt');
pruefe(laufe('', '', {}, '/modul/glas', 'glas', false, true) === 'behalten', 'data-nur-hell im Hellmodus: Schale fehlt');
// gesperrter Speicher: ohne Schale, aber Systemeinstellung dunkel greift trotzdem vor dem ersten Bild
pruefe(laufe('', '', null, '/', undefined, true) === 'entfernt' && letzteDunkel, 'Speicher gesperrt: Schale bleibt oder kein dark');
pruefe(laufe('', '?poll=x', {}, '/modul/glas', 'glas') === 'entfernt', 'Modulseite mit Umfrage: Schale bleibt');

if (fehler.length) {
  for (const f of fehler) console.error(`FAIL: ${f}`);
  process.exit(1);
}
console.log(`OK: Schale ${roh.length} Zeichen, ${klassen.size} Klassen`);
