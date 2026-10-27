// Inaktive Seiten (Schalter INAKTIVE_GRUPPEN in src/registry/modules.ts; Entscheidung 27.10.2026: Lernpfade nach
// Lehrveranstaltung abgeschaltet): keine inaktive Seite in Menü, Modulübersicht, Suche, Suchindex, Sitemap und
// vorgerenderten Seiten; Registry-Daten bleiben erhalten (tests/lernpfade.test.ts prüft die Lernpfade weiter).
import fs from 'fs';
import path from 'path';
import {
  MODULE, MODUL_BY_ID, INAKTIVE_GRUPPEN, INAKTIVE_MODULE, INAKTIVE_ADRESSEN, AKTIVE_MODULE, AKTIVE_ALIASE,
  AKTIVE_BAUM_GRUPPEN, NAV_TAB_GRUPPEN, TAB_ALIASES, TAB_DESCRIPTIONS, TAB_KEYWORDS, type ModulEintrag,
} from '../src/registry/modules';
import { MODUL_KERN, NAV_TAB_GRUPPEN as KERN_NAV, TAB_ALIASES as KERN_ALIASE } from '../src/registry/kern';
import { KERN_GRUPPEN } from '../src/registry/kernDaten';
import { inaktiveIds, suchindexRouten } from '../scripts/suchindex-routen.mjs';
import { erzeugeSitemap, sitemapEintraege } from '../scripts/gen-sitemap';
import { META_CLUSTERS } from '../src/data/metaClusters';

const fehler: string[] = [];
const pruefe = (ok: boolean, m: string) => { if (!ok) fehler.push(m); };
console.log('--- Test: inaktive Seiten (Lernpfade) ---');

const alle: readonly ModulEintrag[] = MODULE;
const inaktiv = [...INAKTIVE_MODULE];
const istInaktiv = (id: string) => INAKTIVE_MODULE.has(id);

// 0. Schalter: Lernpfade (Gruppe „Lehrveranstaltungen“) abgeschaltet → alle lv_-Seiten und die Übersicht inaktiv
const lernpfadeAus = INAKTIVE_GRUPPEN.includes('Lehrveranstaltungen');
if (lernpfadeAus) {
  for (const m of alle.filter(m => m.id.startsWith('lv_') || m.id === 'lehrveranstaltungen')) pruefe(istInaktiv(m.id), `${m.id}: trotz Schalter aktiv`);
  pruefe(inaktiv.length === 8, `erwartet 8 inaktive Lernpfad-Seiten, gefunden ${inaktiv.length}`);
  pruefe(INAKTIVE_ADRESSEN.includes('lernpfade'), 'Alias lernpfade fehlt in INAKTIVE_ADRESSEN');
}
pruefe(AKTIVE_MODULE.length + inaktiv.length === alle.length, 'aktive + inaktive ≠ alle Einträge');

// 1. Daten bleiben: Registry-Einträge und Baum-Angaben vorhanden
for (const id of inaktiv) pruefe(!!MODUL_BY_ID.get(id)?.baum, `${id}: Registry-Eintrag oder baum fehlt (Daten sollen erhalten bleiben)`);

// 2. Textauszug der Skripte (Suchindex, a11y, layout-mobil) = Registry
pruefe(inaktiveIds().join(',') === inaktiv.join(','), `inaktiveIds() (Text) ${inaktiveIds().join(',')} ≠ INAKTIVE_MODULE ${inaktiv.join(',')}`);

// 3. Menü/Seitenleiste (Registry und Einstiegs-Auszug), Gruppen
for (const nav of [NAV_TAB_GRUPPEN, KERN_NAV]) {
  for (const g of nav) {
    pruefe(!INAKTIVE_GRUPPEN.includes(g.name), `Menü: inaktive Gruppe ${g.name}`);
    for (const t of g.tabs) pruefe(!istInaktiv(t.id), `Menü: inaktive Seite ${t.id}`);
  }
}
for (const g of INAKTIVE_GRUPPEN) pruefe(!KERN_GRUPPEN.includes(g), `KERN_GRUPPEN: ${g}`);

// 4. Routing in der App: inaktive IDs und Aliase darauf unbekannt (→ Startseite)
for (const id of inaktiv) pruefe(!MODUL_KERN.has(id), `MODUL_KERN enthält ${id}`);
for (const [a, z] of Object.entries(KERN_ALIASE)) pruefe(!istInaktiv(z), `Alias ${a} → ${z} (inaktiv) im Einstieg`);
for (const [a, z] of Object.entries(TAB_ALIASES)) pruefe(istInaktiv(z) ? !(a in AKTIVE_ALIASE) && INAKTIVE_ADRESSEN.includes(a) : AKTIVE_ALIASE[a] === z, `Alias ${a}: falsch zugeordnet`);

// 5. Modulübersicht (Baum)
for (const g of AKTIVE_BAUM_GRUPPEN) {
  pruefe(g.knoten.length > 0, `Baumgruppe ${g.id} leer`);
  for (const id of g.knoten) pruefe(!istInaktiv(id), `Baum ${g.id}: inaktive Seite ${id}`);
}
if (lernpfadeAus) pruefe(!AKTIVE_BAUM_GRUPPEN.some(g => g.id === 'grp_lehrveranstaltungen'), 'Baumgruppe grp_lehrveranstaltungen sichtbar');

// 6. Menüsuche und Meta-Beschreibungen
for (const id of inaktiv) pruefe(!(id in TAB_KEYWORDS) && !(id in TAB_DESCRIPTIONS), `${id}: Suchbegriffe oder Meta-Beschreibung im Auszug`);

// 7. Volltext-Suchindex
const index: { id: string }[] = JSON.parse(fs.readFileSync('public/suchindex.json', 'utf8')).module;
for (const e of index) pruefe(!istInaktiv(e.id), `Suchindex enthält ${e.id}`);
for (const id of suchindexRouten()) pruefe(!istInaktiv(id), `suchindexRouten enthält ${id}`);

// 8. Sitemap (Generator und Datei)
const sitemapDatei = fs.readFileSync('public/sitemap.xml', 'utf8');
for (const id of INAKTIVE_ADRESSEN) {
  pruefe(!erzeugeSitemap().includes(`/modul/${id}<`) && !sitemapDatei.includes(`/modul/${id}<`), `Sitemap enthält /modul/${id}`);
}
pruefe(!sitemapEintraege().some(m => istInaktiv(m.id)), 'sitemapEintraege enthält inaktive Seiten');

// 9. Vorrendern: Routenliste aus AKTIVE_MODULE; nach einem Build zusätzlich dist/modul/ prüfen
const eintragQuelle = fs.readFileSync('scripts/vorrendern-eintrag.tsx', 'utf8');
pruefe(/return AKTIVE_MODULE\s*\n?\s*\.filter/.test(eintragQuelle), 'scripts/vorrendern-eintrag.tsx: routen() nicht aus AKTIVE_MODULE');
pruefe(/inaktiv: readonly string\[\] = INAKTIVE_ADRESSEN/.test(eintragQuelle), 'scripts/vorrendern-eintrag.tsx: inaktive Adressen fehlen');
const routenDatei = path.join('dist', 'modul', 'routen.json');
if (fs.existsSync(routenDatei)) {
  const r = JSON.parse(fs.readFileSync(routenDatei, 'utf8')) as { ids: string[]; bekannt: string[]; aliase: Record<string, string>; inaktiv?: string[] };
  for (const id of inaktiv) {
    pruefe(!r.ids.includes(id) && !r.bekannt.includes(id), `dist/modul/routen.json: ${id} als Route`);
    pruefe(!fs.existsSync(path.join('dist', 'modul', `${id}.html`)), `dist/modul/${id}.html vorgerendert`);
  }
  for (const a of INAKTIVE_ADRESSEN) pruefe(!!r.inaktiv?.includes(a) && !(a in r.aliase), `dist/modul/routen.json: ${a} nicht als inaktiv geführt`);
} else {
  console.log('  (dist/modul/routen.json fehlt – vorgerenderte Seiten nur nach einem Build geprüft)');
}

// 10. Startseite: Cluster-Kurztext und Link auf die Lernpfade folgen dem Schalter
const studium = META_CLUSTERS.find(c => c.id === 'studium');
pruefe(!!studium && /Lernpfade/.test(studium.shortDesc) === !lernpfadeAus, 'Cluster VI: Kurztext „Lernpfade“ passt nicht zum Schalter');
const start = fs.readFileSync('src/modules/Startseite.tsx', 'utf8');
pruefe(/MODUL_KERN\.has\('lehrveranstaltungen'\) && \(/.test(start), 'Startseite: Lernpfad-Link nicht an den Schalter gebunden');

// 11. Server: inaktive Adressen → 404-Hinweisseite (kein Weiterleiten, keine Ladeschleife)
const server = fs.readFileSync('server.ts', 'utf8');
pruefe(/r\?\.inaktiv\.has\(id\)[\s\S]{0,200}status\(404\)/.test(server), 'server.ts: inaktive Adressen ohne 404-Hinweisseite');

if (fehler.length) { fehler.forEach(f => console.error('FAIL: ' + f)); process.exit(1); }
console.log(`OK: ${inaktiv.length} inaktive Seiten (${INAKTIVE_GRUPPEN.join(', ') || '–'}), ${INAKTIVE_ADRESSEN.length - inaktiv.length} Aliase, ${AKTIVE_MODULE.length} aktive`);
