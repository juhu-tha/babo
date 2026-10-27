// Erkundungsaufträge „Ausprobieren“ (Umsetzungsplan Phase 3, AP 3.7) – jeder Rechner hat 2–3 Aufträge
import fs from 'fs';
import path from 'path';
import { MODULE, MODUL_BY_ID, type ModulEintrag } from '../src/registry/modules';
import { grenzenFuer } from '../src/data/rechnerGrenzen';
import { ERKUNDUNG, ERKUNDUNG_REITER, type Erkundung } from '../src/data/erkundung';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: Erkundungsaufträge ---');

const form = (id: string, e: Erkundung, min: number, max: number) => {
  pruefe(e.auftraege.length >= min && e.auftraege.length <= max, `${id}: ${e.auftraege.length} Aufträge (${min}–${max})`);
  for (const a of e.auftraege) {
    pruefe(/^Was erwarten Sie, wenn .+\?$/.test(a.frage), `${id}: Frage „${a.frage.slice(0, 40)}…“ ist keine Vorhersagefrage`);
    pruefe(a.aufloesung.length >= 60 && a.aufloesung.endsWith('.'), `${id}: Auflösung zu kurz oder ohne Punkt`);
    pruefe(!/\d\.\d/.test(a.frage + a.aufloesung + (a.hinweis ?? '')), `${id}: Dezimalpunkt statt Komma`);
  }
};

const rechner = (MODULE as readonly ModulEintrag[]).filter(m => m.baum?.typ === 'calculator' || grenzenFuer(m.id));
for (const m of rechner) pruefe(!!ERKUNDUNG[m.id], `${m.id}: Rechner ohne Erkundungsauftrag`);
for (const [id, e] of Object.entries(ERKUNDUNG)) {
  pruefe(MODUL_BY_ID.has(id), `${id}: keine Route`);
  form(id, e, 2, 3);
}
// Reiter-Aufträge (Z24): Schlüssel „<Modul>/<Reiter>“, genau 3 Aufträge, im Code des Reiters verwendet
const code = (fs.readdirSync('src/modules', { recursive: true }) as string[]).filter(f => f.endsWith('.tsx')).map(f => fs.readFileSync(path.join('src/modules', f), 'utf8')).join('\n');
for (const [schluessel, e] of Object.entries(ERKUNDUNG_REITER)) {
  const [modul, reiter] = schluessel.split('/');
  pruefe(MODUL_BY_ID.has(modul) && !!reiter, `${schluessel}: Modul unbekannt oder Reiter fehlt`);
  pruefe(code.includes(`ERKUNDUNG_REITER['${schluessel}']`), `${schluessel}: wird in keinem Reiter angezeigt`);
  form(schluessel, e, 3, 3);
}
if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log(`OK: ${Object.keys(ERKUNDUNG).length} Rechner mit Erkundungsauftrag (${rechner.length} Rechner-Module), ${Object.keys(ERKUNDUNG_REITER).length} Reiter`);
