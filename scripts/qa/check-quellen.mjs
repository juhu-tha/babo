// Prüft Quellen- und Sprachregeln (AP 1): keine generischen Normlinks, kein beuth.de,
// keine absoluten Rechtsaussagen (gerichtsfest/unanfechtbar), keine Du-Imperative in UI-Texten.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const ROOT = new URL('../../src', import.meta.url).pathname;
const SKIP = ['ki/LlmPraxis', 'ki/LokaleKI', 'ki/ToolsFuerThesen', 'NormenLinkMonitor'];
const RULES = [
  { name: 'generischer Normlink', re: /(['"])https?:\/\/(www\.)?(dinmedia\.de|beuth\.de)\/?\1/g },
  { name: 'beuth.de-Link', re: /https?:\/\/(www\.)?beuth\.de/g },
  { name: 'absolute Rechtsaussage', re: /\b(gerichtsfest\w*|unanfechtbar\w*)\b/gi },
  { name: 'Du-Imperativ', re: /(^|[>"'`]\s*|[.!?:]\s+)(Betrachte|Simuliere|Wähle|Verwende|Klicke|Nutze|Prüfe|Gib|Vergleiche|Erstelle|Bestimme|Ziehe) (?!Sie\b)/g },
];
const files = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : /\.tsx?$/.test(f) && files.push(p); } })(ROOT);
// ausgelagerte Fachtexte (AP 5.3)
const CONTENT = new URL('../../content', import.meta.url).pathname;
try { (function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : f.endsWith('.json') && files.push(p); } })(CONTENT); } catch { /* kein content/ */ }
let errors = 0;
for (const f of files) {
  if (SKIP.some(s => f.includes(s))) continue;
  // in JSON gilt ein maskiertes Anführungszeichen (\") als Zitat – wie &quot; im TSX
  const lines = readFileSync(f, 'utf8').split('\n').map(l => f.endsWith('.json') ? l.replace(/\\"/g, '„') : l);
  lines.forEach((l, i) => {
    if (/^\s*(\/\/|\*)/.test(l) || l.includes('console.')) return;
    for (const r of RULES) { r.re.lastIndex = 0; if (r.re.test(l)) { errors++; console.log(`${f.replace(ROOT, 'src').replace(CONTENT, 'content')}:${i + 1}  ${r.name}: ${l.trim().slice(0, 110)}`); } }
  });
}
console.log(errors ? `\n${errors} Verstöße` : `${files.length} Dateien geprüft, 0 Verstöße.`);
if (errors) process.exit(1);
// Normenstand (Phase 0, AP 0.5): einheitliche Ausgaben in allen Modul-Fußzeilen
await import('./check-normen.mjs');
