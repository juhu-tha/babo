// ZfP-Modul, Reiter „DGZfP-Richtlinien“: Übersicht nur mit belegten Angaben (Kennung, Titel, Ausgabe, Beleg)
import fs from 'fs';
import inhalt from '../content/zfp/DgzfpTab.json';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: DGZfP-Übersicht ---');

const doks = inhalt.daten['DgzfpTab.dokumente'];
pruefe(doks.length >= 5, `nur ${doks.length} Dokumente`);
pruefe(new Set(doks.map(d => d.kennung + d.titel)).size === doks.length, 'Einträge doppelt');
for (const d of doks) {
  pruefe(!!d.kennung && d.titel.length >= 10 && !!d.zweck && !!d.ausgabe, `${d.kennung}: Angabe fehlt`);
  pruefe(/^(B \d{2}|B-LF \d{2}( Anhang \d)?|– \(nicht bestätigt\))$/.test(d.kennung), `${d.kennung}: Kennung nicht im Schema B nn / B-LF nn`);
  // Ausgabe als JJJJ-MM oder JJJJ, sonst ausdrücklich als Arbeitsstand gekennzeichnet
  pruefe(/^\d{4}(-\d{2})?\b/.test(d.ausgabe) || /in (Überarbeitung|Erstellung)/.test(d.ausgabe), `${d.kennung}: Ausgabe „${d.ausgabe}“ ohne Datum oder Stand`);
  // jeder Beleg muss in der Quellenliste stehen
  for (const b of d.quelle.split(';').map(s => s.trim())) {
    const kern = b.replace(/ \d{4}$/, '').split(/[/ ]/)[0];
    pruefe(inhalt.texte.quellen.includes(kern), `${d.kennung}: Beleg „${b}“ fehlt in der Quellenliste`);
  }
}
// Eingebunden im Modul ZfP, kein leerer Reiter mehr
const zfp = fs.readFileSync('src/modules/ZfP.tsx', 'utf8');
pruefe(zfp.includes('<DgzfpTab />'), 'Reiter DGZfP zeigt die Übersicht nicht');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log(`OK: ${doks.length} DGZfP-Dokumente`);
