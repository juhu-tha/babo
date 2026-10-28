// Aufgeteilte lange Module (src/registry/teilmodule.ts, 28.10.2026: Module über 10 000 Wörter in Teilmodule)
import fs from 'node:fs';
import { MODULE, MODUL_BY_ID, TAB_ALIASES, BAUM_GRUPPEN, type ModulEintrag } from '../src/registry/modules';
import { TEILMODULE, teilmodulFamilie } from '../src/registry/teilmodule';
import { KURZFASSUNG, KURZFASSUNG_PFLICHT } from '../src/data/kurzfassung';
import { LERNZIELE } from '../src/data/lernziele';
import { PRUEFVERMERKE } from '../src/data/pruefvermerke';
import { ansichtWoerter } from './hilfen/fliesstext';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: Teilmodule ---');

/** Obergrenze je Teilmodul (Ansichtsumfang wie tests/kurzfassung.test.ts) */
const MAX_WOERTER_TEIL = 10000;
/** begründete Überschreitung (Ratsche: Wert darf nicht steigen) – der Katalog zeigt je ein Verfahren aus 14 Datensätzen;
 *  die Zählung erfasst alle Datensätze und die mit Teil 1 geteilten Diagnosedaten (diagnoseData.ts) vollständig */
const UEBER_GRENZE: Readonly<Record<string, number>> = { pruefverfahren_katalog: 10400 };
const aliase: Readonly<Record<string, string>> = TAB_ALIASES;
const routing = fs.readFileSync('src/routing/ModulInhalt.tsx', 'utf8');
const alleIds = new Set((MODULE as readonly ModulEintrag[]).map(m => m.id));

const gesehen = new Set<string>();
for (const f of TEILMODULE) {
  // 1. alte ID ist nur noch Alias und leitet auf Teil 1 weiter
  pruefe(!alleIds.has(f.stamm), `${f.stamm}: ist noch Modul-ID (soll Alias sein)`);
  pruefe(aliase[f.stamm] === f.teile[0], `${f.stamm}: Alias zeigt auf ${aliase[f.stamm]}, erwartet ${f.teile[0]}`);
  pruefe(f.teile.length >= 2 && f.teile.length <= 3, `${f.stamm}: ${f.teile.length} Teile (2–3)`);
  const baum = BAUM_GRUPPEN.find(g => (g.knoten as readonly string[]).includes(f.teile[0]));
  const komponenten = new Set<string>();
  const bereiche: string[][] = [];
  const kf = KURZFASSUNG[f.teile[0]];
  for (const id of f.teile) {
    pruefe(!gesehen.has(id), `${id}: in mehreren Familien`);
    gesehen.add(id);
    const m = MODUL_BY_ID.get(id);
    // 2. jedes Teil ist eine vollwertige Route: Menü, Modulübersicht (gleiche Gruppe), Lernziele, Prüfvermerk
    pruefe(!!m?.gruppe && !!m?.baum && !!m?.meta && !!m?.suche?.length, `${id}: Registry-Eintrag unvollständig (gruppe, baum, meta, suche)`);
    pruefe(!!baum && (baum.knoten as readonly string[]).includes(id), `${id}: nicht in derselben Baumgruppe wie ${f.teile[0]}`);
    pruefe(!!LERNZIELE[id], `${id}: keine Lernziele`);
    pruefe(!!PRUEFVERMERKE[id], `${id}: kein Prüfvermerk-Eintrag`);
    // 3. gemeinsame Kurzfassung
    pruefe(!!KURZFASSUNG[id] && KURZFASSUNG[id] === kf, `${id}: Kurzfassung nicht gemeinsam mit ${f.teile[0]}`);
    pruefe(KURZFASSUNG_PFLICHT.includes(id), `${id}: fehlt in KURZFASSUNG_PFLICHT`);
    // 4. Darstellung über die Komponente des Stammmoduls mit eigenen Reitern
    const z = routing.match(new RegExp(`activeTab === '${id}' && <(\\w+) bereiche=\\{\\[([^\\]]+)\\]\\} />`));
    pruefe(!!z, `${id}: keine Route der Form <Komponente bereiche={[…]} /> in ModulInhalt.tsx`);
    if (z) { komponenten.add(z[1]); bereiche.push([...z[2].matchAll(/'([a-z_]+)'/g)].map(x => x[1])); }
    // 5. Umfang je Teil unter der Aufteilungsschwelle (Reitergliederung prüft tests/kurzfassung.test.ts)
    const a = ansichtWoerter(id);
    pruefe(a.woerter <= (UEBER_GRENZE[id] ?? MAX_WOERTER_TEIL), `${id}: ${a.woerter} Wörter (> ${UEBER_GRENZE[id] ?? MAX_WOERTER_TEIL})`);
  }
  pruefe(komponenten.size === 1, `${f.stamm}: Teile nutzen verschiedene Komponenten (${[...komponenten].join(', ')})`);
  // 6. Reiter überschneidungsfrei; die Zuordnung Reiter → Teilmodul in der Komponente stimmt mit ModulInhalt überein
  const flach = bereiche.flat();
  pruefe(new Set(flach).size === flach.length, `${f.stamm}: Reiter mehrfach vergeben (${flach.join(', ')})`);
  const datei = `src/modules/${[...komponenten][0]}.tsx`;
  if (fs.existsSync(datei)) {
    const quelle = fs.readFileSync(datei, 'utf8');
    const karte = quelle.match(/_TEIL: Readonly<Record<\w+, TabId>> = \{([\s\S]*?)\};/);
    pruefe(!!karte, `${datei}: Zuordnung Reiter → Teilmodul (…_TEIL) fehlt`);
    if (karte) {
      const paare = [...karte[1].matchAll(/(\w+): '([a-z_]+)'/g)].map(x => [x[1], x[2]] as const);
      pruefe(paare.length === flach.length, `${datei}: ${paare.length} Reiter in der Zuordnung, ${flach.length} in ModulInhalt.tsx`);
      for (const [r, ziel] of paare) pruefe(bereiche[f.teile.indexOf(ziel)]?.includes(r), `${datei}: Reiter ${r} → ${ziel}, in ModulInhalt.tsx anders zugeordnet`);
    }
  }
}
pruefe(teilmodulFamilie('spannbeton_kennwerte')?.stamm === 'spannbeton' && !teilmodulFamilie('beton_info'), 'teilmodulFamilie liefert falsche Familie');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log(`OK: ${TEILMODULE.length} aufgeteilte Module, ${gesehen.size} Teilmodule`);
