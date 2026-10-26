// Lernpfade „Lehrveranstaltungen“ (Umsetzungsplan Phase 6, AP 6.1) – Aufbau und Verweise
import fs from 'fs';
import { MODUL_BY_ID, BAUM_GRUPPEN } from '../src/registry/modules';
import { LERNPFADE, ENTWURF_HINWEIS, moduleDesLernpfads, terminKennung } from '../src/data/lernpfade';
import { KI_UEBUNGEN } from '../src/data/kiUebungen';
import { istFachmodul } from '../src/data/pruefvermerke';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: Lernpfade ---');

// 1. IDs eindeutig; jede Lehrveranstaltung ist eine Seite der Gruppe „Lehrveranstaltungen“ und kein Fachmodul
const ids = LERNPFADE.map(l => l.id);
pruefe(new Set(ids).size === ids.length, `Doppelte Lernpfad-IDs: ${ids.filter((x, i) => ids.indexOf(x) !== i).join(', ')}`);
const knoten = new Set<string>(BAUM_GRUPPEN.find(g => g.id === 'grp_lehrveranstaltungen')?.knoten ?? []);
pruefe(knoten.has('lehrveranstaltungen'), 'Übersichtsseite lehrveranstaltungen fehlt in der Modulübersicht');
const routing = fs.readFileSync('src/routing/ModulInhalt.tsx', 'utf8');
for (const l of LERNPFADE) {
  const m = MODUL_BY_ID.get(l.id);
  pruefe(!!m, `${l.id}: keine Seite in der Registry`);
  pruefe(m?.gruppe === 'Lehrveranstaltungen', `${l.id}: nicht in der Menügruppe „Lehrveranstaltungen“`);
  pruefe(knoten.has(l.id), `${l.id}: fehlt in BAUM_GRUPPEN (grp_lehrveranstaltungen)`);
  pruefe(!istFachmodul(m), `${l.id}: wird als Fachmodul gezählt (braucht dann einen Prüfvermerk)`);
  pruefe(routing.includes(`'${l.id}'`), `${l.id}: keine Route in ModulInhalt.tsx`);
  pruefe(l.titel.trim().length >= 3 && l.studiengang.trim() !== '' && l.semester.trim() !== '' && l.umfang.trim() !== '', `${l.id}: Kopfangaben unvollständig`);
  pruefe(l.status === 'entwurf' || l.status === 'freigegeben', `${l.id}: Status ${l.status} ungültig`);

  // 2. Termine: Nummern eindeutig und lückenlos, jeder Termin mit ≥ 1 existierendem Modul
  const nrn = l.termine.map(t => t.nr);
  pruefe(l.termine.length > 0, `${l.id}: keine Termine`);
  pruefe(new Set(nrn).size === nrn.length, `${l.id}: Terminnummern doppelt`);
  pruefe(nrn.every((n, i) => n === nrn[0] + i) && (nrn[0] === 0 || nrn[0] === 1), `${l.id}: Terminnummern nicht fortlaufend ab 0 bzw. 1`);
  for (const t of l.termine) {
    const k = terminKennung(l, t);
    pruefe(t.titel.trim().length >= 5, `${l.id} ${k}: Titel fehlt`);
    pruefe(t.module.length >= 1, `${l.id} ${k}: kein Modul zugeordnet`);
    pruefe(new Set(t.module).size === t.module.length, `${l.id} ${k}: Modul doppelt zugeordnet`);
    for (const mid of t.module) {
      pruefe(MODUL_BY_ID.has(mid), `${l.id} ${k}: Modul ${mid} existiert nicht in der Registry`);
      pruefe(!mid.startsWith('lv_') && mid !== 'lehrveranstaltungen', `${l.id} ${k}: Lernpfad verweist auf Lernpfad ${mid}`);
    }
    if (t.datum !== undefined) pruefe(/^\d{4}-\d{2}-\d{2}$/.test(t.datum), `${l.id} ${k}: Datum ${t.datum} nicht JJJJ-MM-TT`);
    if (l.status === 'entwurf') pruefe(t.datum === undefined, `${l.id} ${k}: Entwurf mit Datum – Daten erst nach Freigabe eintragen`);
    if (t.uebung) {
      pruefe(KI_UEBUNGEN.some(u => u.id === t.uebung), `${l.id} ${k}: Übung ${t.uebung} fehlt in kiUebungen.ts`);
      pruefe(t.module.includes('ki_uebungen'), `${l.id} ${k}: Übung verlinkt, aber Modul ki_uebungen nicht zugeordnet`);
    }
  }
}

// 3. Vorgaben je Lehrveranstaltung
const lp = (id: string) => LERNPFADE.find(l => l.id === id);
const aryc = lp('lv_aryc');
pruefe(aryc?.termine.length === 14 && aryc.termine[0].nr === 0 && terminKennung(aryc, aryc.termine[13]) === 'ARYC-13', 'A.RYC: 14 Termine ARYC-00 bis ARYC-13 verlangt');
const wpf = lp('lv_wpf_nachhaltiges_bauen');
pruefe(wpf?.termine.length === 12, 'WPF Nachhaltiges Bauen: 12 Termine verlangt');
pruefe((wpf?.termine.filter(t => /extern/i.test(t.titel) && !!t.hinweis).length ?? 0) === 2, 'WPF Nachhaltiges Bauen: genau 2 Platzhalter für externe Referent:innen');
const ki = lp('lv_ki_master');
pruefe(ki?.termine.reduce((s, t) => s + (t.ue ?? 0), 0) === 24, 'KI-Master: Grundlagenteil muss 24 UE umfassen');
pruefe(ki?.termine.length !== undefined && ki.termine.length <= 12, 'KI-Master: höchstens 12 Termine');
for (const u of KI_UEBUNGEN) pruefe(!!ki?.termine.some(t => t.uebung === u.id), `KI-Master: Übung ${u.id} keinem Block zugeordnet`);
pruefe(/Gastvortr/i.test(ki?.hinweis ?? ''), 'KI-Master: Platzhalter-Hinweis zu den Gastvorträgen fehlt');
pruefe(/MFH Augsburg-Nord/.test(lp('lv_vnhb')?.hinweis ?? ''), 'VNHB: Fallbeispiel MFH Augsburg-Nord fehlt');
pruefe(!!lp('lv_zert_ausbau_bestand')?.termine.some(t => t.module.some(m => m.startsWith('weiter_'))), 'Zertifikat Ausbau und Bestand: Bezug zu Weiter@THA fehlt');
pruefe(ENTWURF_HINWEIS === 'Entwurf – Terminplan durch Prof. Huber noch nicht freigegeben', 'Entwurfs-Hinweis geändert');

// 4. Daten nicht im Einstieg: nur die Lernpfad-Seite (lazy) importiert lernpfade.ts
const quellen = (dir: string): string[] => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? quellen(`${dir}/${e.name}`) : /\.tsx?$/.test(e.name) ? [`${dir}/${e.name}`] : []);
const nutzer = quellen('src').filter(f => f !== 'src/data/lernpfade.ts' && /from '[^']*data\/lernpfade'/.test(fs.readFileSync(f, 'utf8')));
pruefe(nutzer.length === 1 && nutzer[0] === 'src/modules/Lehrveranstaltungen.tsx', `lernpfade.ts wird außerhalb der Lernpfad-Seite importiert: ${nutzer.join(', ')}`);

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log(`OK: ${LERNPFADE.length} Lernpfade, ${LERNPFADE.reduce((s, l) => s + l.termine.length, 0)} Termine, ${new Set(LERNPFADE.flatMap(moduleDesLernpfads)).size} verschiedene Module`);
