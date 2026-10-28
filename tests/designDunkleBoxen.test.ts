// Ratsche Designgrundsatz „keine schwarzen Boxen“ (28.10.2026) – gleiche Logik wie scripts/qa/check-design.mjs
import { findeDunkle, pruefeDesign, GRENZE, AUSNAHMEN } from '../scripts/qa/check-design.mjs';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };

console.log('--- Test: Design – keine schwarzen Boxen ---');

// 1. Erkennung: dunkle Flächen ohne dark: zählen, dark:-Varianten, Tönungen < 50 % und helle Arbitrary-Farben nicht
const probe = [
  '<div className="bg-slate-900 text-white" />',                 // zählt
  '<div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />', // 3 Klassen
  '<button className="bg-white hover:bg-slate-800" />',          // hover zählt
  '<div className="bg-white dark:bg-slate-900" />',               // dark: zählt nicht
  '<div className="bg-black/10 bg-slate-800/20" />',              // Tönung zählt nicht
  '<div className="fixed inset-0 bg-black/60" />',               // deckendes Overlay zählt (Ausnahmeliste)
  '<div className="bg-[#1e293b] bg-[#f8fafc]" />',                // nur die dunkle
  '<span className="bg-text-main text-white" />',                // zählt
  '<span style={{ backgroundColor: \'#111827\' }} />',           // Inline-Stil zählt
  "datasets: [{ backgroundColor: '#1e293b' }]",                  // Diagrammdaten ohne style= zählen nicht
  '<p>bg-slate-900</p> ',                                        // Text in JSX zählt (wie Klassenname) – nur über Ausnahmeliste
].join('\n');
const t = findeDunkle(probe);
const klassen = t.map(x => x.klasse);
pruefe(t.length === 10, `Erkennung: 10 Treffer erwartet, ${t.length}: ${klassen.join(', ')}`);
pruefe(klassen.includes('hover:bg-slate-800'), 'hover:-Variante wird erkannt');
pruefe(!klassen.some(k => k.startsWith('dark:')), 'dark:-Varianten werden ignoriert');
pruefe(!klassen.includes('bg-black/10') && !klassen.includes('bg-slate-800/20'), 'Tönungen unter 50 % werden ignoriert');
pruefe(klassen.includes('bg-[#1e293b]') && !klassen.includes('bg-[#f8fafc]'), 'Arbitrary-Farbe nach Leuchtdichte');
pruefe(klassen.includes('style:#111827'), 'Inline-Stil wird erkannt');

// 2. Ausnahmeliste: jede Ausnahme hat Anzahl ≥ 1 und Begründung
for (const [s, [n, grund]] of Object.entries(AUSNAHMEN)) {
  pruefe(Number.isInteger(n) && n >= 1, `Ausnahme ${s}: Anzahl ${n}`);
  pruefe(typeof grund === 'string' && grund.length >= 8, `Ausnahme ${s}: Begründung fehlt`);
}

// 3. Ratsche: keine neuen dunklen Hintergründe außerhalb der Ausnahmeliste
const { alle, neu, veraltet } = pruefeDesign();
if (neu.length > GRENZE) {
  for (const x of neu) fehler.push(`${x.datei}:${x.zeile} ${x.klasse} – helle Gestaltung verwenden (docs/architektur.md, Design)`);
  fehler.push(`neue dunkle Hintergründe: ${neu.length} > Grenze ${GRENZE} (node scripts/qa/check-design.mjs --liste)`);
}
pruefe(veraltet.length === 0, `veraltete Ausnahmen (Anzahl senken): ${veraltet.join(', ')}`);

if (fehler.length) {
  for (const f of fehler) console.error(`FAIL: ${f}`);
  process.exit(1);
}
console.log(`OK: ${alle.length} dunkle Hintergründe, alle begründete Ausnahmen (Grenze ${GRENZE})`);
