// Jeder im Code verwendete Speicherschlüssel steht im Register der Datenschutzerklärung (AP 1.3)
import fs from 'fs';
import path from 'path';
import { SPEICHER_REGISTER } from '../src/data/speicherRegister';

function dateien(d: string): string[] {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap(e => {
    const p = path.join(d, e.name);
    return e.isDirectory() ? dateien(p) : /\.tsx?$/.test(e.name) ? [p] : [];
  });
}
const bekannt = new Set(SPEICHER_REGISTER.map(e => e.schluessel));
const fehler: string[] = [];
console.log('--- Test: Speicher-Register ---');
for (const f of dateien('src')) {
  if (f.endsWith('speicherRegister.ts')) continue;
  const s = fs.readFileSync(f, 'utf8');
  const konst = Object.fromEntries([...s.matchAll(/(\w+)\s*[:=]\s*'([a-z][a-z0-9_]+)'/g)].map(m => [m[1], m[2]]));
  for (const m of s.matchAll(/(?:localStorage|sessionStorage)\.(?:getItem|setItem|removeItem)\(\s*(?:'([^']+)'|"([^"]+)"|`([^`$]+)`|([A-Za-z_.]+))/g)) {
    let k = m[1] || m[2] || m[3];
    if (!k && m[4]) k = konst[m[4].split('.').pop() as string];
    if (!k) { fehler.push(`${f}: Schlüssel nicht auflösbar (${m[0]})`); continue; }
    if (!bekannt.has(k)) fehler.push(`${f}: Schlüssel „${k}“ fehlt im Speicher-Register`);
  }
  for (const m of s.matchAll(/document\.cookie\s*=\s*[`'"]([a-zA-Z_]+)=/g)) if (!bekannt.has(m[1])) fehler.push(`${f}: Cookie „${m[1]}“ fehlt im Register`);
}
const server = fs.readFileSync('server.ts', 'utf8');
for (const m of server.matchAll(/res\.cookie\(\s*"([^"]+)"/g)) if (!bekannt.has(m[1])) fehler.push(`server.ts: Cookie „${m[1]}“ fehlt im Register`);
if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log(`OK: ${bekannt.size} Einträge, alle verwendeten Schlüssel registriert`);
