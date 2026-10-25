// Startseiten-Schale (Umsetzungsplan Phase 5, AP 5.5 Nachtrag): Schale passt noch zum Quelltext, Boot-Skript
// entfernt sie in allen Fällen, in denen das erste Bild von React anders aussähe.
import fs from 'fs';
import vm from 'vm';
import { erzeugeSchale, KOPF_ANKER, SCHALE_STIL } from '../scripts/startSchale';
import { CURRENT_VERSION } from '../src/data/versionData';

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
pruefe(html.includes(`Version ${CURRENT_VERSION.version} (${CURRENT_VERSION.date})`), 'Version nicht eingesetzt');
pruefe(html.startsWith('<div id="root"><div data-schale inert>') && !html.includes('<script'), 'Aufbau der Schale (Wurzel)');
pruefe(kopf.includes('<script>') && !kopf.includes('<script src') && kopf.includes(`<style>${SCHALE_STIL}</style>`), 'Aufbau der Schale (Kopf)');
// Kopfteil steht im Build vor jedem Stylesheet (sonst würde das Skript erst nach dem CSS laufen)
const index = fs.readFileSync('index.html', 'utf8');
pruefe(index.includes(KOPF_ANKER) && !/<link[^>]*stylesheet|<style/.test(index.slice(0, index.indexOf(KOPF_ANKER))), 'Kopfanker fehlt oder Stylesheet davor in index.html');

// 4. Boot-Skript: Schale nur auf der Startseite mit Standardeinstellungen
const boot = fs.readFileSync('scripts/startschale-boot.js', 'utf8');
function laufe(hash: string, search: string, speicher: Record<string, string>): 'behalten' | 'entfernt' {
  const klassen = new Set<string>();
  const ls = { getItem: (k: string) => (k in speicher ? speicher[k] : null) };
  vm.runInNewContext(boot, { document: { documentElement: { classList: { add: (k: string) => klassen.add(k) } } }, location: { hash, search }, window: { localStorage: ls }, decodeURIComponent });
  return klassen.has('bb-schale') ? 'behalten' : 'entfernt';
}
pruefe(laufe('', '', {}) === 'behalten', 'Startseite ohne Hash: Schale fehlt');
pruefe(laufe('#start', '', { baustoffboard_screen_width: 'wide' }) === 'behalten', '#start: Schale fehlt');
pruefe(laufe('#glas', '', {}) === 'entfernt', '#glas: Schale bleibt');
pruefe(laufe('', '?poll=abc', {}) === 'entfernt', 'Umfrage: Schale bleibt');
pruefe(laufe('', '', { baustoffboard_lang: 'en' }) === 'entfernt', 'Englisch: Schale bleibt');
pruefe(laufe('', '', { theme: 'dark' }) === 'entfernt', 'Dunkelmodus: Schale bleibt');
pruefe(laufe('', '', { baustoffboard_screen_width: 'full' }) === 'entfernt', 'Vollbreite: Schale bleibt');
pruefe(laufe('', '', { baustoffboard_fluid_width: 'false' }) === 'entfernt', 'alte Breiten-Einstellung: Schale bleibt');

if (fehler.length) {
  for (const f of fehler) console.error(`FAIL: ${f}`);
  process.exit(1);
}
console.log(`OK: Schale ${roh.length} Zeichen, ${klassen.size} Klassen`);
