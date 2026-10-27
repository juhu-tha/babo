// Ladezeit (Umsetzungsplan Phase 5, AP 5.5): Kopfdaten je Modul, Vorlade-Karte, Vorlade-Skript
import fs from 'fs';
import vm from 'vm';
import path from 'path';
import { ladeKopfdaten } from '../scripts/modulKopf';
import { leseZuordnung } from '../scripts/modulVorladen';
import { MODULE } from '../src/registry/modules';
import { LERNZIELE } from '../src/data/lernziele';
import { KURZFASSUNG } from '../src/data/kurzfassung';
import { ERKUNDUNG } from '../src/data/erkundung';
import { grenzenFuer } from '../src/data/rechnerGrenzen';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };

console.log('--- Test: Ladezeit (Kopfdaten, Vorladen) ---');

// 1. virtual:modul-kopf liefert je Modul genau die Einträge der Datendateien (einzige Quelle)
const { eintraege, dateien } = await ladeKopfdaten();
const ids = new Set([...MODULE.map(m => m.id), ...Object.keys(LERNZIELE), ...Object.keys(KURZFASSUNG), ...Object.keys(ERKUNDUNG)]);
for (const id of ids) {
  const e = eintraege.get(id) ?? {};
  const gleich = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
  pruefe(gleich(e.lernziele, LERNZIELE[id]), `${id}: Lernziele weichen ab`);
  pruefe(gleich(e.kurzfassung, KURZFASSUNG[id]), `${id}: Kurzfassung weicht ab`);
  pruefe(gleich(e.erkundung, ERKUNDUNG[id]), `${id}: Erkundung weicht ab`);
  pruefe(gleich(e.grenzen, grenzenFuer(id)), `${id}: Rechner-Grenzen weichen ab`);
}
pruefe(!eintraege.has('start'), 'Startseite hat Kopfdaten');
pruefe(['lernziele', 'kurzfassung', 'erkundung', 'rechnerGrenzen'].every(n => dateien.includes(path.resolve(`src/data/${n}.ts`))), `Datendateien nicht als Abhängigkeit erfasst (Watch): ${dateien.join(', ')}`);
pruefe(dateien.every(d => fs.existsSync(d)), `Watch-Pfade existieren nicht: ${dateien.filter(d => !fs.existsSync(d)).join(', ')}`);

// 2. Vorlade-Karte: jede in ModulInhalt.tsx verdrahtete ID wird einer React.lazy-Komponente zugeordnet
const quelltext = fs.readFileSync('src/routing/ModulInhalt.tsx', 'utf8');
const z = leseZuordnung(quelltext);
const verdrahtet = new Set([...quelltext.matchAll(/activeTab === '([^']+)'/g)].map(m => m[1]));
for (const id of verdrahtet) pruefe(z.tabs.has(id), `${id}: keine Zuordnung in der Vorlade-Karte`);
for (const [id, k] of z.tabs) pruefe(z.lazy.has(k), `${id}: Komponente ${k} ist kein React.lazy-Import`);
pruefe(z.praefixe.some(([p]) => p === 'aufgaben'), 'Präfix aufgaben* fehlt');
// stichprobenartig: Zuordnung nicht durch Props innerhalb der JSX-Ausdrücke verfälscht
pruefe(z.tabs.get('biegebemessung') === 'Stahlbetonbemessung', `biegebemessung → ${z.tabs.get('biegebemessung')}`);
pruefe(z.tabs.get('faserverbund') === 'Kombinationen', `faserverbund → ${z.tabs.get('faserverbund')}`);
pruefe(z.tabs.get('glas') === 'Glas', `glas → ${z.tabs.get('glas')}`);

// 3. Vorlade-Skript (Browser-Code) mit einer Attrappe von document/location ausführen
const boot = fs.readFileSync('scripts/vorladen-boot.js', 'utf8');
function fuehreAus(hash: string, karte: unknown, pathname = '/') {
  const links: Array<Record<string, string>> = [];
  const document = {
    getElementById: (id: string) => (id === 'modul-vorladen' ? { textContent: JSON.stringify(karte) } : null),
    querySelector: () => null,
    createElement: () => ({} as Record<string, string>),
    head: { appendChild: (l: Record<string, string>) => links.push(l) },
  };
  vm.runInNewContext(boot, { document, location: { hash, pathname } });
  return links;
}
const karte = { b: '/assets/', d: ['ModulInhalt.js', 'ModulKopf.js', 'Glas.js', 'icons.js', 'kopf-glas.js', 'Startseite.js', 'Aufgaben.js', 'app.css'], i: [0], k: [1], c: [[2, 3, 7], [5, 3], [6]], t: { glas: 0, start: 1 }, p: [['aufgaben', 2]], h: { glas: 4 } };
const glas = fuehreAus('#glas', karte);
pruefe(JSON.stringify(glas.map(l => l.href)) === JSON.stringify(['/assets/ModulInhalt.js', '/assets/ModulKopf.js', '/assets/Glas.js', '/assets/icons.js', '/assets/app.css', '/assets/kopf-glas.js']), `#glas: ${glas.map(l => l.href).join(', ')}`);
// Pfad-Routing (Z52): /modul/glas lädt dasselbe vor wie der alte Hash-Link
pruefe(JSON.stringify(fuehreAus('', karte, '/modul/glas').map(l => l.href)) === JSON.stringify(glas.map(l => l.href)), '/modul/glas lädt anders vor als #glas');
pruefe(fuehreAus('#holz', karte, '/modul/glas').some(l => l.href === '/assets/Glas.js'), 'Pfad geht vor Hash (Anker im Modul)');
pruefe(glas.find(l => l.href.endsWith('.css'))?.rel === 'preload' && glas.find(l => l.href.endsWith('.css'))?.as === 'style', 'CSS nicht als preload/style');
pruefe(glas.filter(l => l.href.endsWith('.js')).every(l => l.rel === 'modulepreload'), 'JS nicht als modulepreload');
const start = fuehreAus('', karte);
pruefe(JSON.stringify(start.map(l => l.href)) === JSON.stringify(['/assets/ModulInhalt.js', '/assets/Startseite.js', '/assets/icons.js']), `Startseite: ${start.map(l => l.href).join(', ')}`);
pruefe(fuehreAus('#Aufgaben_Quiz', karte).some(l => l.href === '/assets/Aufgaben.js'), 'Präfix aufgaben* (Groß-/Kleinschreibung) nicht vorgeladen');
pruefe(fuehreAus('#gibt_es_nicht', karte).length === 0 && fuehreAus('#constructor', karte).length === 0, 'unbekannte ID lädt etwas vor');

if (fehler.length) {
  for (const f of fehler) console.error(`FAIL: ${f}`);
  process.exit(1);
}
console.log(`OK: ${eintraege.size} Module mit Kopfdaten, ${z.tabs.size} IDs in der Vorlade-Karte`);
