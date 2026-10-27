// Vorrender-Plugin: Speicherentschärfung (Gutachten 27.10.2026 abends, Nr. 4)
import fs from 'fs';
import { kindNodeOptions, heapGrenzeMb, speicherFreigeben, VORGABE_HEAP_MB } from '../scripts/vorrendernPlugin';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: Vorrender-Plugin ---');

// 1. geerbte Heap-Grenze wird ersetzt, andere Optionen bleiben
pruefe(kindNodeOptions('--max-old-space-size=3072', 2048) === '--max-old-space-size=2048', 'geerbte Grenze nicht ersetzt');
pruefe(kindNodeOptions('--enable-source-maps --max_old_space_size=4096', 1536) === '--enable-source-maps --max-old-space-size=1536', 'andere Optionen gehen verloren');
pruefe(kindNodeOptions(undefined, 2048) === '--max-old-space-size=2048', 'ohne NODE_OPTIONS falsch');

// 2. Grenze aus der Umgebung: nur ganze Zahlen ≥ 256, sonst Vorgabe
pruefe(heapGrenzeMb('1024') === 1024, 'BB_VORRENDERN_HEAP_MB=1024 nicht übernommen');
for (const w of [undefined, '', 'abc', '100', '1.5', '-5']) pruefe(heapGrenzeMb(w) === VORGABE_HEAP_MB, `ungültiger Wert ${w} nicht abgefangen`);

// 3. Aufräumen läuft ohne Fehler und liefert Messwerte
const f = speicherFreigeben(process.cwd());
pruefe(f.vorher > 0 && f.nachher > 0 && f.heap > 0, 'Messwerte fehlen');
pruefe(f.gc, 'gc() ließ sich nicht freischalten');

// 4. Vorrendern läuft nach dem Ende von vite build (beforeExit), nicht mehr parallel in closeBundle
const src = fs.readFileSync('scripts/vorrendernPlugin.ts', 'utf8');
pruefe(/process\.once\('beforeExit'/.test(src), 'beforeExit-Aufruf fehlt');
pruefe(/process\.exitCode = 1/.test(src), 'Fehler im Vorrendern muss den Build scheitern lassen');

if (fehler.length) { fehler.forEach(x => console.log('FAIL', x)); process.exit(1); }
console.log(`OK: Vorrender-Plugin (Kind-Heap ${VORGABE_HEAP_MB} MB, Aufräumen ${Math.round(f.vorher / 2 ** 20)} → ${Math.round(f.nachher / 2 ** 20)} MB)`);
