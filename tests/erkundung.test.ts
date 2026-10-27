// Erkundungsaufträge „Ausprobieren“ (Umsetzungsplan Phase 3, AP 3.7) – jeder Rechner hat 2–3 Aufträge
import { MODULE, MODUL_BY_ID, type ModulEintrag } from '../src/registry/modules';
import { grenzenFuer } from '../src/data/rechnerGrenzen';
import { ERKUNDUNG } from '../src/data/erkundung';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: Erkundungsaufträge ---');

const rechner = (MODULE as readonly ModulEintrag[]).filter(m => m.baum?.typ === 'calculator' || grenzenFuer(m.id));
for (const m of rechner) pruefe(!!ERKUNDUNG[m.id], `${m.id}: Rechner ohne Erkundungsauftrag`);
for (const [id, e] of Object.entries(ERKUNDUNG)) {
  pruefe(MODUL_BY_ID.has(id), `${id}: keine Route`);
  pruefe(e.auftraege.length >= 2 && e.auftraege.length <= 3, `${id}: ${e.auftraege.length} Aufträge (2–3)`);
  // Z24: zusätzliche Aufträge je neuem Reiter (Feld „reiter“, Anzeige im Modulkopf mit Reiterkennzeichnung), genau 3 je Reiter
  for (const r of e.reiter ?? []) pruefe(r.reiter.trim().length > 0 && r.auftraege.length === 3, `${id}/${r.reiter}: ${r.auftraege.length} Aufträge (3 verlangt)`);
  for (const a of [...e.auftraege, ...(e.reiter ?? []).flatMap(r => r.auftraege)]) {
    pruefe(/^Was erwarten Sie, wenn .+\?$/.test(a.frage), `${id}: Frage „${a.frage.slice(0, 40)}…“ ist keine Vorhersagefrage`);
    pruefe(a.aufloesung.length >= 60 && a.aufloesung.endsWith('.'), `${id}: Auflösung zu kurz oder ohne Punkt`);
    pruefe(!/\d\.\d/.test(a.frage + a.aufloesung + (a.hinweis ?? '')), `${id}: Dezimalpunkt statt Komma`);
  }
}
if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log(`OK: ${Object.keys(ERKUNDUNG).length} Rechner mit Erkundungsauftrag (${rechner.length} Rechner-Module)`);
