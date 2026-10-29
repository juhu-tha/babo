// Version und Stand automatisch (Gutachten 29.10.2026, 4.1/4.6): Version aus package.json, Stand = Build-Datum,
// sitemap lastmod beim Build, kein festes Versions-/Datumsliteral in sichtbaren Texten.
import fs from 'fs';
import { APP_VERSION, STAND_ISO, STAND_DE, isoZuDe, tagIso } from '../src/data/stand';
import { mitLastmod } from '../scripts/sitemapStand';
import { erzeugeSitemap } from '../scripts/gen-sitemap';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };

console.log('--- Test: Version und Stand automatisch ---');

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pruefe(APP_VERSION === `v${pkg.version}`, `APP_VERSION ${APP_VERSION} ≠ package.json ${pkg.version}`);
pruefe(/^\d{4}-\d{2}-\d{2}$/.test(STAND_ISO), `STAND_ISO-Format: ${STAND_ISO}`);
pruefe(STAND_DE === isoZuDe(STAND_ISO) && /^\d{2}\.\d{2}\.\d{4}$/.test(STAND_DE), `STAND_DE-Format: ${STAND_DE}`);
pruefe(isoZuDe('2026-10-29') === '29.10.2026', 'isoZuDe');
// Europe/Berlin: 23:30 UTC am 28.10. ist dort schon der 29.10. (MEZ), 21:30 UTC am 1.7. ist der 1.7. (MESZ 23:30)
pruefe(tagIso(new Date('2026-10-28T23:30:00Z')) === '2026-10-29', 'tagIso MEZ');
pruefe(tagIso(new Date('2026-07-01T21:30:00Z')) === '2026-07-01', 'tagIso MESZ');
if (!process.env.BB_STAND) pruefe(STAND_ISO === tagIso(), 'ohne Build gilt der heutige Tag');

// Sitemap: Quelldatei ohne lastmod, Build setzt es je URL
const roh = erzeugeSitemap();
pruefe(!roh.includes('<lastmod>'), 'public/sitemap.xml soll kein festes lastmod enthalten');
const mit = mitLastmod(roh, '2026-10-29');
const anzLoc = (roh.match(/<loc>/g) ?? []).length;
pruefe(anzLoc > 100 && (mit.match(/<lastmod>2026-10-29<\/lastmod>/g) ?? []).length === anzLoc, 'lastmod nicht an jeder URL');
pruefe(/<loc>https:\/\/baustoffboard\.de\/<\/loc>\n    <lastmod>2026-10-29<\/lastmod>\n    <changefreq>/.test(mit), 'lastmod-Position/Einzug');
pruefe(mitLastmod(mit, '2026-11-02') === mitLastmod(roh, '2026-11-02'), 'vorhandenes lastmod wird ersetzt');
let wirft = false; try { mitLastmod(roh, '29.10.2026'); } catch { wirft = true; }
pruefe(wirft, 'ungültiges Datum muss abgewiesen werden');

// keine handgepflegte Versionsnummer in sichtbaren Texten (außer Änderungsverlauf)
const sichtbar = ['src/modules/Startseite.tsx', 'src/modules/Versionen.tsx', 'src/modules/ForschungTransfer.tsx', 'src/lib/pdfExport.ts', 'content/forschungtransfer/ForschungTransfer.json', 'scripts/startschale.html'];
for (const f of sichtbar) {
  const t = fs.readFileSync(f, 'utf8');
  pruefe(!/(?<![\w.-])v\d+\.\d+\.\d+|Version \d/.test(t), `${f}: festes Versionsliteral`);
  pruefe(!t.includes('TT.MM.JJJJ'), `${f}: Platzhalter TT.MM.JJJJ statt Abrufdatum`);
}
const schale = fs.readFileSync('scripts/startschale.html', 'utf8');
pruefe(!/\d{2}\.\d{2}\.\d{4}/.test(schale), 'startschale.html mit festem Datum');
pruefe(schale.includes('%BB_DATUM%') && schale.includes('%BB_VNR%'), 'startschale.html ohne Platzhalter %BB_DATUM%/%BB_VNR%');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log(`PASS: Version ${APP_VERSION}, Stand ${STAND_DE}; Sitemap ${anzLoc} URLs mit Build-lastmod.`);
