// Registry-Auszug für den Einstieg (Umsetzungsplan Phase 5, AP 5.5 Nachtrag): gleiche Daten wie modules.ts,
// und der statische Importgraph des Einstiegs (src/main.tsx) erreicht modules.ts nicht.
import fs from 'fs';
import path from 'path';
import { ladeAuszug, AUSZUEGE } from '../scripts/registryKern';
import { MODULE, TAB_ALIASES, NAV_TAB_GRUPPEN, TAB_DESCRIPTIONS, TAB_KEYWORDS, type ModulEintrag } from '../src/registry/modules';
import { MODUL_KERN, TAB_ALIASES as KERN_ALIASE, NAV_TAB_GRUPPEN as KERN_NAV } from '../src/registry/kern';
import { KERN_ZEILEN, KERN_ALIASE as ZEILEN_ALIASE, KERN_GRUPPEN } from '../src/registry/kernDaten';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const gleich = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

console.log('--- Test: Registry-Kern ---');

// 1. Build-Daten (Plugin) = Quelldaten
const erwartet: Record<string, Record<string, unknown>> = {
  'src/registry/kernDaten.ts': { KERN_ZEILEN, KERN_ALIASE: ZEILEN_ALIASE, KERN_GRUPPEN },
  'src/registry/metaDaten.ts': { TAB_DESCRIPTIONS },
  'src/registry/suchDaten.ts': { TAB_KEYWORDS },
};
pruefe(gleich(Object.keys(erwartet), AUSZUEGE), `Auszüge: ${AUSZUEGE.join(', ')}`);
for (const datei of AUSZUEGE) {
  const { werte, dateien } = await ladeAuszug(datei);
  pruefe(gleich(Object.keys(werte).sort(), Object.keys(erwartet[datei] ?? {}).sort()), `${datei}: Exporte ${Object.keys(werte).join(', ')}`);
  for (const [k, v] of Object.entries(erwartet[datei] ?? {})) pruefe(gleich(werte[k], v), `${datei}: ${k} (Build) weicht ab`);
  pruefe(dateien.includes(path.resolve('src/registry/modules.ts')), `${datei}: modules.ts nicht als Abhängigkeit erfasst`);
}

// 2. Auszug = Registry
const alle: readonly ModulEintrag[] = MODULE;
pruefe(MODUL_KERN.size === alle.length, `Anzahl ${MODUL_KERN.size} ≠ ${alle.length}`);
for (const m of alle) {
  const k = MODUL_KERN.get(m.id);
  pruefe(!!k && k.label === m.label && k.icon === m.icon && k.gruppe === m.gruppe && k.titel === m.baum?.titel && k.typ === m.baum?.typ, `${m.id}: Auszug weicht ab`);
}
pruefe(gleich(KERN_ALIASE, TAB_ALIASES), 'TAB_ALIASES weichen ab');
pruefe(gleich(KERN_NAV, NAV_TAB_GRUPPEN), 'NAV_TAB_GRUPPEN weichen ab');

// 3. Statischer Importgraph ab src/main.tsx ohne modules.ts (sonst wäre die volle Registry wieder im Einstieg)
const aufloesen = (von: string, spez: string): string | undefined => {
  const basis = spez.startsWith('@/') ? path.resolve(spez.slice(2)) : spez.startsWith('.') ? path.resolve(path.dirname(von), spez) : undefined;
  if (!basis) return undefined;
  for (const e of ['', '.ts', '.tsx', '/index.ts', '/index.tsx']) if (fs.existsSync(basis + e) && fs.statSync(basis + e).isFile()) return basis + e;
  return undefined;
};
const gesehen = new Set<string>();
const offen = [path.resolve('src/main.tsx')];
const weg = new Map<string, string>();
const reg = path.resolve('src/registry/modules.ts');
const regImporteure: string[] = [];
while (offen.length) {
  const f = offen.pop()!;
  if (gesehen.has(f)) continue;
  gesehen.add(f);
  if (!/\.tsx?$/.test(f)) continue;
  const code = fs.readFileSync(f, 'utf8');
  for (const m of code.matchAll(/^\s*(?:import|export)\s+(?!type\b)(?:[^'";]*?\sfrom\s+)?['"]([^'"]+)['"]/gm)) {
    const z = aufloesen(f, m[1]);
    if (z === reg) regImporteure.push(f);
    if (z && !gesehen.has(z)) { if (!weg.has(z)) weg.set(z, f); offen.push(z); }
  }
}
const kette = (z: string) => { const k = [z]; while (weg.has(k[0])) k.unshift(weg.get(k[0])!); return k.map(x => path.relative('.', x)).join(' → '); };
// die Auszüge importieren modules.ts nur im Quelltext; im Build ersetzt das Plugin sie
const fremd = regImporteure.filter(f => !AUSZUEGE.map(d => path.resolve(d)).includes(f));
pruefe(fremd.length === 0, `Einstieg importiert modules.ts statisch: ${fremd.map(kette).join('; ')}`);

if (fehler.length) {
  for (const f of fehler) console.error(`FAIL: ${f}`);
  process.exit(1);
}
console.log(`OK: ${MODUL_KERN.size} Module im Auszug, ${gesehen.size} Dateien im Einstiegsgraph`);
