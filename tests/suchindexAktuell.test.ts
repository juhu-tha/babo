// Volltextindex aktuell: public/suchindex.json enthält genau die indexierbaren Registry-Module
// (neue Module ohne Neuerzeugung des Index wären in der Suche unauffindbar).
import fs from 'fs';
import { MODULE, type ModulEintrag } from '../src/registry/modules';
import { registryIds, suchindexRouten } from '../scripts/suchindex-routen.mjs';

const fehler: string[] = [];
const pruefe = (ok: boolean, m: string) => { if (!ok) fehler.push(m); };
console.log('--- Test: Suchindex aktuell ---');
const alle: readonly ModulEintrag[] = MODULE;

// Der Textauszug der Skripte (Generator, a11y.mjs) findet jede Registry-ID – sonst fehlen Module stillschweigend
const textIds = registryIds();
pruefe(textIds.join(',') === alle.map(m => m.id).join(','),
  `Registry-Textauszug weicht von MODULE ab (Einrückung/Format?): fehlt ${alle.map(m => m.id).filter(id => !textIds.includes(id)).join(', ') || '–'}`);

const index: { id: string; h: string[]; w: string }[] = JSON.parse(fs.readFileSync('public/suchindex.json', 'utf8')).module;
const imIndex = new Set(index.map(e => e.id));
const soll = suchindexRouten();
const fehlt = soll.filter(id => !imIndex.has(id));
const ueberzaehlig = [...imIndex].filter(id => !soll.includes(id));
const hinweis = 'Index neu erzeugen: npx vite build && npx vite preview & node scripts/gen-suchindex.mjs';
pruefe(!fehlt.length, `Im Suchindex fehlen ${fehlt.length} Module: ${fehlt.join(', ')} → ${hinweis}`);
pruefe(!ueberzaehlig.length, `Suchindex enthält entfernte Module: ${ueberzaehlig.join(', ')} → ${hinweis}`);
for (const e of index) pruefe(e.w.length > 0, `${e.id}: Indexeintrag ohne Wörter`);

if (fehler.length) { fehler.forEach(f => console.error('FAIL: ' + f)); process.exit(1); }
console.log(`OK: ${index.length} Module im Suchindex`);
