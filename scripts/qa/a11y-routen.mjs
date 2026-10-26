#!/usr/bin/env node
/**
 * Routen, die von geänderten Dateien betroffen sind (für die a11y-Prüfung in Pull Requests)
 *
 * Liest die geänderten Pfade (git diff gegen --basis, Standard origin/main) und gibt die Modul-IDs aus,
 * deren Modulkomponente (src/routing/ModulInhalt.tsx) eine geänderte Datei direkt oder über Importe
 * einbindet. Dateien außerhalb von src/ (Skripte, Doku, Workflows) betreffen keine Route.
 *
 *   node scripts/qa/a11y-routen.mjs [--basis origin/main] [--max 80] [--dateien a,b]
 *     Ausgabe: kommagetrennte Modul-IDs (leer = keine Route betroffen) auf stdout, Begründung auf stderr.
 *     Über --max betroffene Routen → leere Ausgabe mit Hinweis (dann gilt die Stichprobe im Workflow).
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const ai = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : undefined; };
const BASIS = ai('--basis') ?? 'origin/main';
const MAX = Number(ai('--max') ?? 80);

const geaendert = (ai('--dateien')?.split(',') ?? execSync(`git diff --name-only ${BASIS}...HEAD`, { cwd: ROOT, encoding: 'utf8' }).split('\n'))
  .map(s => s.trim()).filter(Boolean).filter(f => f.startsWith('src/'));

// Importgraph über src/ (relative und '@/src/…'-Importe)
const dateien = [];
(function lauf(d) {
  for (const e of fs.readdirSync(path.join(ROOT, d), { withFileTypes: true })) {
    const p = `${d}/${e.name}`;
    if (e.isDirectory()) lauf(p);
    else if (/\.(tsx?|css|json)$/.test(e.name)) dateien.push(p);
  }
})('src');
const vorhanden = new Set(dateien);
const aufloesen = (von, spez) => {
  let basis;
  if (spez.startsWith('@/')) basis = spez.slice(2);
  else if (spez.startsWith('.')) basis = path.posix.normalize(path.posix.join(path.posix.dirname(von), spez));
  else return undefined;
  for (const k of [basis, `${basis}.ts`, `${basis}.tsx`, `${basis}/index.ts`, `${basis}/index.tsx`]) if (vorhanden.has(k)) return k;
  return undefined;
};
const importiertVon = new Map(); // Datei → Dateien, die sie importieren
for (const d of dateien) {
  if (!/\.tsx?$/.test(d)) continue;
  const q = fs.readFileSync(path.join(ROOT, d), 'utf8');
  for (const m of q.matchAll(/(?:from\s+|import\s*\(\s*|import\s+)['"]([^'"]+)['"]/g)) {
    const z = aufloesen(d, m[1]);
    if (z) { if (!importiertVon.has(z)) importiertVon.set(z, new Set()); importiertVon.get(z).add(d); }
  }
}

// Modulkomponenten: const Name = React.lazy(() => import('../modules/…')) und activeTab === 'id' && <Name
const inhalt = fs.readFileSync(path.join(ROOT, 'src/routing/ModulInhalt.tsx'), 'utf8');
const datei = new Map();
for (const m of inhalt.matchAll(/const (\w+) = React\.lazy\(\(\) => import\('([^']+)'\)\)/g)) datei.set(m[1], aufloesen('src/routing/ModulInhalt.tsx', m[2]));
const routenJeDatei = new Map();
for (const m of inhalt.matchAll(/activeTab === '([a-z0-9_-]+)' && <(\w+)/g)) {
  const f = datei.get(m[2]);
  if (!f) continue;
  if (!routenJeDatei.has(f)) routenJeDatei.set(f, new Set());
  routenJeDatei.get(f).add(m[1]);
}

// von jeder geänderten Datei aufwärts bis zu den Modulkomponenten (nicht über ModulInhalt hinaus)
const routen = new Set();
for (const g of geaendert) {
  const gesehen = new Set([g]);
  const stapel = [g];
  while (stapel.length) {
    const f = stapel.pop();
    for (const r of routenJeDatei.get(f) ?? []) routen.add(r);
    for (const v of importiertVon.get(f) ?? []) if (!gesehen.has(v) && v !== 'src/routing/ModulInhalt.tsx') { gesehen.add(v); stapel.push(v); }
  }
}
const liste = [...routen].sort();
console.error(`${geaendert.length} geänderte Dateien unter src/ → ${liste.length} betroffene Routen`);
if (liste.length > MAX) { console.error(`mehr als ${MAX} Routen (gemeinsame Bausteine geändert) – Stichprobe statt Einzelrouten`); process.stdout.write(''); }
else process.stdout.write(liste.join(','));
