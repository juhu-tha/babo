// KaTeX in Template-Strings: \; \, \! verlieren ohne doppelten Backslash ihre Wirkung (aus „\;“ wird „;“).
// String.raw`…` ist ausgenommen.
import fs from 'fs';
import path from 'path';

console.log('--- Test: KaTeX-Escapes in Template-Strings ---');
const fehler: string[] = [];
const dateien = (fs.readdirSync('src', { recursive: true }) as string[]).filter(f => /\.tsx?$/.test(f));
for (const rel of dateien) {
  const text = fs.readFileSync(path.join('src', rel), 'utf8');
  const teile = text.split('`');
  for (let i = 1; i < teile.length; i += 2) {
    if (teile[i - 1].endsWith('String.raw')) continue;
    for (const m of teile[i].matchAll(/(?<!\\)\\([;,!:> ])/g)) {
      fehler.push(`${rel}: „${teile[i].slice(Math.max(0, m.index! - 25), m.index! + 8).replace(/\n/g, ' ')}“`);
    }
  }
}
if (fehler.length) { for (const f of fehler) console.error(`FAIL: einfacher Backslash in Template-String ${f}`); process.exit(1); }
console.log('OK: keine verlorenen KaTeX-Abstände');
