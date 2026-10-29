// Redaktionsmodell (Umsetzungsplan Phase 6, AP 6.6): jedes Fachmodul hat einen Prüfvermerk
import fs from 'node:fs';
import path from 'node:path';
import { MODUL_BY_ID } from '../src/registry/modules';
import { FACHMODULE, PRUEFVERMERKE, datumDe, istFachmodul, pruefvermerkFuer } from '../src/data/pruefvermerke';
import { clusterVon } from '../src/data/modulCluster';
import { PATEN_JE_CLUSTER, CLUSTER_NAMEN } from '../src/data/paten';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: Prüfvermerke ---');

// 1. Jedes Fachmodul hat einen expliziten Eintrag
const fehlend = FACHMODULE.filter(m => !PRUEFVERMERKE[m.id]).map(m => m.id);
pruefe(fehlend.length === 0, `Fachmodule ohne Prüfvermerk (in src/data/pruefvermerke.ts mit { status: 'offen' } eintragen): ${fehlend.join(', ')}`);
pruefe(FACHMODULE.length >= 100, `nur ${FACHMODULE.length} Fachmodule erkannt – Definition istFachmodul prüfen`);

// 2. Einträge sind gültig und gehören zu Fachmodulen
const ISO = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const heute = new Date().toISOString().slice(0, 10);
for (const [id, v] of Object.entries(PRUEFVERMERKE)) {
  pruefe(MODUL_BY_ID.has(id), `${id}: kein Modul in der Registry`);
  pruefe(istFachmodul(MODUL_BY_ID.get(id)), `${id}: kein Fachmodul (Eintrag entfernen)`);
  pruefe(['geprueft', 'offen', 're-review'].includes(v.status), `${id}: Status ${v.status} ungültig`);
  if (v.status !== 'offen') {
    pruefe(!!v.am && ISO.test(v.am) && v.am <= heute, `${id}: Prüfdatum fehlt, ist kein JJJJ-MM-TT oder liegt in der Zukunft`);
    // 'geprueft' darf passiv ohne Namen sein (Entscheidung 28.10.2026); 're-review' braucht die zuletzt prüfende Person
    if (v.status === 're-review' || v.von !== undefined) pruefe(!!v.von && v.von.trim().length >= 3, `${id}: prüfende Person fehlt oder ist zu kurz`);
    if (v.von) pruefe(!/claude/i.test(v.von), `${id}: kein Assistenzname als Prüfer`);
  } else {
    pruefe(!v.von && !v.am, `${id}: Status offen, aber Prüfdatum/-person eingetragen`);
  }
  for (const p of v.offenePunkte ?? []) pruefe(p.trim().length >= 5, `${id}: leerer offener Punkt`);
  pruefe(clusterVon(id) !== '', `${id}: keinem Cluster der Modulübersicht zugeordnet`);
}

// 2b. Jede Freigabe ist in einer Befundliste belegt (Abschnitt „Freigabe TT.MM.JJJJ“ in docs/pruefung/module-tranche-<n>.md,
//     Modul-ID vor „Nicht freigegeben“ genannt; Verfahren der Freigaben 28.10. und 29.10.2026)
const pruefDir = path.join(process.cwd(), 'docs/pruefung');
const belegt = new Map<string, Set<string>>(); // Datum (ISO) → Modul-IDs
for (const datei of fs.readdirSync(pruefDir).filter(d => /^module-tranche-\d+\.md$/.test(d))) {
  const text = fs.readFileSync(path.join(pruefDir, datei), 'utf8');
  for (const m of text.matchAll(/^## Freigabe (\d{2})\.(\d{2})\.(\d{4})(?: \(Nachtrag\))?\n([\s\S]*?)(?=^## |(?![\s\S]))/gm)) {
    const iso = `${m[3]}-${m[2]}-${m[1]}`;
    const frei = m[4].split(/^Nicht freigegeben/m)[0];
    const ids = belegt.get(iso) ?? new Set<string>();
    for (const t of frei.matchAll(/`([a-z0-9_]+)`/g)) ids.add(t[1]);
    belegt.set(iso, ids);
  }
}
for (const [id, v] of Object.entries(PRUEFVERMERKE)) {
  if (v.status !== 'geprueft' || !v.am) continue;
  pruefe(belegt.get(v.am)?.has(id) === true, `${id}: Freigabe am ${v.am} ohne Beleg im Abschnitt „Freigabe ${datumDe(v.am)}“ einer Befundliste (docs/pruefung/module-tranche-<n>.md)`);
}

// 3. Anzeige-Logik
pruefe(pruefvermerkFuer('start') === undefined && pruefvermerkFuer('impressum') === undefined, 'Nicht-Fachmodule bekommen einen Prüfvermerk');
pruefe(!istFachmodul(MODUL_BY_ID.get('forschung_transfer')) && pruefvermerkFuer('forschung_transfer') === undefined, 'forschung_transfer (Info-Seite) wird als Fachmodul gezählt');
pruefe(pruefvermerkFuer('ki_uebungen')?.status === 'offen', 'ki_uebungen: Prüfvermerk fehlt');
pruefe(datumDe('2026-11-03') === '03.11.2026', 'datumDe formatiert falsch');

// 4. Paten-Zuordnung: alle Cluster vorhanden, Platzhalter erlaubt
for (const nr of Object.keys(CLUSTER_NAMEN)) pruefe(nr in PATEN_JE_CLUSTER, `Cluster ${nr} fehlt in PATEN_JE_CLUSTER`);
for (const [nr, p] of Object.entries(PATEN_JE_CLUSTER)) pruefe(p.pate === p.pate.trim(), `Cluster ${nr}: Leerzeichen am Rand des Namens`);

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
const n = (s: string) => Object.values(PRUEFVERMERKE).filter(v => v.status === s).length;
console.log(`OK: ${FACHMODULE.length} Fachmodule mit Prüfvermerk (${n('geprueft')} geprüft, ${n('re-review')} Nachprüfung, ${n('offen')} offen)`);
