// scripts/qa/metriken.mjs misst wie die maßgeblichen Prüfungen (Zwischen-Review 26.10.2026, Z2):
// Absolutwörter wie tests/quiz.test.ts, Lernziel-Abdeckung wie tests/lernziele.test.ts und – falls dist/
// gebaut ist – den Einstiegs-Chunk wie scripts/qa/check-bundle.mjs. Die Werte werden aus der Ausgabe der
// Prüfungen selbst gelesen, nicht nachgerechnet.
import fs from 'fs';
import { spawnSync } from 'child_process';
import { berechneMetriken } from '../scripts/qa/metriken.mjs';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: Metriken wie maßgebliche Prüfungen ---');

const lauf = (args: string[]) => {
  const r = spawnSync(process.execPath, args, { encoding: 'utf8' });
  return `${r.stdout}\n${r.stderr}`;
};
const m = berechneMetriken();

// Absolutwörter: „… Absolutwörter: 10“ in der OK-Zeile von tests/quiz.test.ts
const quiz = lauf(['--import', 'tsx', 'tests/quiz.test.ts']).match(/Absolutwörter: (\d+)/);
pruefe(!!quiz, 'tests/quiz.test.ts liefert keine Absolutwort-Zahl (Test rot oder Ausgabe geändert)');
if (quiz) pruefe(m.didaktik.quiz_absolutwoerter_distraktoren === Number(quiz[1]),
  `Absolutwörter: metriken ${m.didaktik.quiz_absolutwoerter_distraktoren}, tests/quiz.test.ts ${quiz[1]}`);

// Lernziele: „… 189/189 Fachmodule abgedeckt“ aus tests/lernziele.test.ts
const lz = lauf(['--import', 'tsx', 'tests/lernziele.test.ts']).match(/(\d+)\/(\d+) Fachmodule abgedeckt/);
pruefe(!!lz, 'tests/lernziele.test.ts liefert keine Abdeckung (Test rot oder Ausgabe geändert)');
if (lz) {
  pruefe(m.didaktik.mit_Lernzielen === Number(lz[1]), `Fachmodule mit Lernzielen: metriken ${m.didaktik.mit_Lernzielen}, Test ${lz[1]}`);
  pruefe(m.didaktik.fachmodule === Number(lz[2]), `Fachmodule: metriken ${m.didaktik.fachmodule}, Test ${lz[2]}`);
}

// Einstieg: „Einstieg …: 101,8 kB gzip“ aus scripts/qa/check-bundle.mjs (nur mit Build; in der CI laufen die
// Tests vor dem Build, dann entfällt dieser Teil)
let bundleText = 'ohne Build';
if (fs.existsSync('dist/index.html')) {
  const cb = lauf(['scripts/qa/check-bundle.mjs']).match(/Einstieg [^:]+: ([\d,]+) kB gzip/);
  pruefe(!!cb, 'check-bundle.mjs liefert keine Einstiegsgröße');
  pruefe(!!m.bundle, 'metriken.mjs findet dist/ nicht');
  if (cb && m.bundle) {
    pruefe(m.bundle.einstieg_gzip_kB === Number(cb[1].replace(',', '.')),
      `Einstieg: metriken ${m.bundle.einstieg_gzip_kB} kB, check-bundle ${cb[1]} kB`);
    bundleText = `Einstieg ${cb[1]} kB`;
  }
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log(`OK: Absolutwörter ${m.didaktik.quiz_absolutwoerter_distraktoren}, Lernziele ${m.didaktik.mit_Lernzielen}/${m.didaktik.fachmodule}, ${bundleText}`);
