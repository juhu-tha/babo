// Jeder Rechner nennt seine Annahmen und Grenzen (Umsetzungsplan Phase 4, AP 4.11)
import { MODULE, type ModulEintrag } from '../src/registry/modules';
import { RECHNER_GRENZEN, grenzenFuer } from '../src/data/rechnerGrenzen';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: Rechnergrenzen ---');

const rechner = (MODULE as readonly ModulEintrag[]).filter(m => m.baum?.typ === 'calculator');
for (const m of rechner) {
  const g = grenzenFuer(m.id);
  pruefe(!!g, `${m.id}: kein Eintrag in src/data/rechnerGrenzen.ts`);
  if (g && g.rechnet !== false) pruefe(g.grenzen.length >= 2, `${m.id}: weniger als 2 Grenzen`);
}
for (const [id, g] of Object.entries(RECHNER_GRENZEN)) {
  pruefe(g.kurz.trim().length > 20, `${id}: Kurzbeschreibung fehlt`);
  for (const x of g.grenzen) pruefe(x.length <= 220, `${id}: Eintrag zu lang (${x.length} Zeichen)`);
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log(`OK: ${rechner.length} Rechner, ${Object.keys(RECHNER_GRENZEN).length} Einträge`);
