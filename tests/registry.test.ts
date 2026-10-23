// Konsistenz der zentralen Modul-Registry (Umsetzungsplan Phase 0, AP 0.4)
import fs from 'fs';
import { MODULE, NAV_GRUPPEN, TAB_ALIASES, BAUM_GRUPPEN, MODUL_BY_ID, type ModulEintrag } from '../src/registry/modules';
import { ICONS } from '../src/registry/icons';
import { erzeugeSitemap } from '../scripts/gen-sitemap';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const alle: readonly ModulEintrag[] = MODULE;

console.log('--- Test: Modul-Registry ---');

// 1. IDs eindeutig und wohlgeformt
const ids = alle.map(m => m.id);
pruefe(new Set(ids).size === ids.length, `Doppelte IDs: ${ids.filter((x, i) => ids.indexOf(x) !== i).join(', ')}`);
for (const id of ids) pruefe(/^[a-z0-9_-]+$/.test(id), `Ungültige ID: ${id}`);

// 2. Menüeinträge: gültige Gruppe, Meta-Beschreibung (außer Admin/Trenner)
const gruppen = new Set<string>(NAV_GRUPPEN);
for (const m of alle) {
  if (m.gruppe) pruefe(gruppen.has(m.gruppe), `${m.id}: unbekannte Gruppe ${m.gruppe}`);
  const inhalt = !m.id.startsWith('divider_') && m.id !== 'admin';
  if (m.gruppe && inhalt) pruefe(!!m.meta, `${m.id}: Meta-Beschreibung fehlt`);
  if (m.meta) pruefe(m.meta.length >= 50 && m.meta.length <= 320, `${m.id}: Meta-Beschreibung ${m.meta.length} Zeichen (50–320)`);
  pruefe(m.icon in ICONS, `${m.id}: Icon ${m.icon} fehlt in icons.ts`);
  if (m.baum) pruefe(m.baum.icon in ICONS, `${m.id}: Baum-Icon ${m.baum.icon} fehlt in icons.ts`);
}
for (const g of NAV_GRUPPEN) pruefe(alle.some(m => m.gruppe === g), `Menügruppe ohne Einträge: ${g}`);

// 3. Aliase zeigen auf existierende Module und überdecken keine Modul-ID
for (const [alias, ziel] of Object.entries(TAB_ALIASES)) {
  pruefe(MODUL_BY_ID.has(ziel), `Alias ${alias} → ${ziel}: Ziel existiert nicht`);
  pruefe(!MODUL_BY_ID.has(alias), `Alias ${alias} ist zugleich Modul-ID`);
}

// 4. Modulübersicht: jeder Knoten existiert, hat baum-Angaben und steht genau einmal im Baum
const imBaum = BAUM_GRUPPEN.flatMap(g => [...g.knoten] as string[]);
pruefe(new Set(imBaum).size === imBaum.length, 'Knoten mehrfach in der Modulübersicht');
for (const id of imBaum) pruefe(!!MODUL_BY_ID.get(id)?.baum, `Baum-Knoten ${id}: Modul fehlt oder ohne baum`);
for (const m of alle) if (m.baum) pruefe(imBaum.includes(m.id), `${m.id}: hat baum-Angaben, steht aber in keiner BAUM_GRUPPE`);
const cluster = new Set([...fs.readFileSync('src/modules/Modulstruktur.tsx', 'utf8').matchAll(/^\s{4}id: '([a-z0-9_]+)',$/gm)].map(x => x[1]));
for (const g of BAUM_GRUPPEN) pruefe(cluster.has(g.cluster), `Baumgruppe ${g.id}: Cluster ${g.cluster} fehlt in Modulstruktur.tsx`);

// 5. Darstellung: jedes Modul (außer Trenner) ist in App.tsx verdrahtet
const app = fs.readFileSync('src/App.tsx', 'utf8');
for (const m of alle) {
  if (m.id.startsWith('divider_')) continue;
  const verdrahtet = app.includes(`'${m.id}'`) || (m.id.startsWith('aufgaben') && app.includes("activeTab.startsWith('aufgaben')"));
  pruefe(verdrahtet, `${m.id}: keine Darstellung in App.tsx`);
}

// 6. Keine zweite ID-Liste mehr außerhalb der Registry
const tabCtx = fs.readFileSync('src/contexts/TabContext.tsx', 'utf8');
pruefe(!/export type TabId =\s*\n?\s*\|/.test(tabCtx), 'TabContext.tsx enthält wieder eine eigene ID-Liste');
pruefe(!/const tabGroups = \[/.test(app), 'App.tsx enthält wieder eine eigene Menüliste');
pruefe(!fs.existsSync('src/components/routing/ClusterContentRouter.tsx'), 'Ungenutzter ClusterContentRouter wieder vorhanden');

// 7. Sitemap ist aktuell
pruefe(fs.readFileSync('public/sitemap.xml', 'utf8') === erzeugeSitemap(), 'public/sitemap.xml veraltet → npm run gen:sitemap');

if (fehler.length) {
  for (const f of fehler) console.error(`FAIL: ${f}`);
  process.exit(1);
}
console.log(`OK: ${alle.length} Module, ${Object.keys(TAB_ALIASES).length} Aliase, ${imBaum.length} Baumknoten`);
