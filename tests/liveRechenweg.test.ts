// Live-Rechenweg (Umsetzungsplan Phase 3, AP 3.7): Herleitungsboxen, die mit den aktuellen Eingaben rechnen
import fs from 'fs';
import path from 'path';

console.log('--- Test: Live-Rechenweg ---');
const fehler: string[] = [];
const dateien = (fs.readdirSync('src', { recursive: true }) as string[]).filter(f => f.endsWith('.tsx'));
let live = 0;
for (const rel of dateien) {
  const text = fs.readFileSync(path.join('src', rel), 'utf8');
  for (const m of text.matchAll(/<FormulaDerivationBox\b([\s\S]*?)\/>/g)) {
    if (!/\blive\b/.test(m[1].split('schritte')[0] + (m[1].match(/\blive(=\{true\})?\s*$/m)?.[0] ?? ''))) continue;
    live++;
    // Ein Live-Rechenweg muss Eingabewerte einsetzen (Template mit ${…})
    if (!m[1].includes('${')) fehler.push(`${rel}: live-Box ohne eingesetzte Werte`);
  }
}
const MIN_LIVE = 0; // Ratsche, Ziel ≥ 20
if (live < MIN_LIVE) fehler.push(`nur ${live} Live-Rechenwege (mindestens ${MIN_LIVE})`);
if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log(`OK: ${live} Live-Rechenwege`);
