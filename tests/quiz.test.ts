// Konsistenz des Quizpools (Umsetzungsplan Phase 3, AP 3.1/3.2)
import fs from 'fs';
import path from 'path';
import { QUIZ_QUESTIONS, SCHWIERIGKEITEN, BLOOM_STUFEN } from '../src/data/quizData';
import { quizRoute } from '../src/data/quizZuordnung';
import { MODUL_BY_ID } from '../src/registry/modules';
import { AUFGABEN_QUIZ_GRUPPEN } from '../src/data/aufgabenQuizGruppen';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };

console.log('--- Test: Quizpool ---');

// 1. IDs eindeutig
const ids = QUIZ_QUESTIONS.map(q => q.id);
pruefe(new Set(ids).size === ids.length, `Doppelte Fragen-IDs: ${ids.filter((x, i) => ids.indexOf(x) !== i).join(', ')}`);

const ERLAUBT = new Set<string>(SCHWIERIGKEITEN);
for (const q of QUIZ_QUESTIONS) {
  // 2. Jede Frage ist einem echten Modul, einer Menügruppe und einem Cluster zugeordnet
  const route = quizRoute(q.moduleId);
  pruefe(!!route && MODUL_BY_ID.has(route), `${q.id}: moduleId „${q.moduleId}“ führt zu keinem Modul`);
  pruefe(!!q.gruppe, `${q.id}: keine Menügruppe`);
  pruefe(!q.gapAnalysis || MODUL_BY_ID.has(q.gapAnalysis.targetModuleTab), `${q.id}: Sprungziel „${q.gapAnalysis?.targetModuleTab}“ ist keine Route`);
  pruefe(/^(I|II|III|IV|V|VI)$/.test(q.clusterId), `${q.id}: ungültiger Cluster ${q.clusterId}`);
  // 3. Antwortoptionen
  pruefe(Array.isArray(q.options) && q.options.length >= 3, `${q.id}: weniger als 3 Optionen`);
  pruefe(new Set(q.options.map(o => o.trim().toLowerCase())).size === q.options.length, `${q.id}: doppelte Optionen`);
  pruefe(Number.isInteger(q.correctIdx) && q.correctIdx >= 0 && q.correctIdx < q.options.length, `${q.id}: correctIdx außerhalb`);
  pruefe(ERLAUBT.has(q.difficulty), `${q.id}: Schwierigkeit „${q.difficulty}“ nicht erlaubt`);
  pruefe(!!q.question?.trim() && !!q.explanation?.trim(), `${q.id}: Frage oder Erklärung leer`);
  // 3b. Schema-Erweiterung (AP 3.2)
  if (q.bloom !== undefined) pruefe((BLOOM_STUFEN as readonly string[]).includes(q.bloom), `${q.id}: Bloom-Stufe „${q.bloom}“ unbekannt`);
  if (q.niveau !== undefined) pruefe(q.niveau === 'B' || q.niveau === 'M', `${q.id}: Niveau muss B oder M sein`);
  if (q.distraktorFeedback !== undefined) {
    pruefe(q.distraktorFeedback.length === q.options.length, `${q.id}: distraktorFeedback braucht einen Eintrag je Option`);
    q.distraktorFeedback.forEach((f, i) => pruefe(i === q.correctIdx ? f === '' : f.trim().length > 10, `${q.id}: Feedback zu Option ${i + 1} ${i === q.correctIdx ? 'muss leer sein' : 'fehlt'}`));
  }
  if (q.verified) pruefe(!!q.reviewer && /^\d{4}-\d{2}-\d{2}$/.test(q.reviewedAt ?? ''), `${q.id}: freigegeben ohne Prüfer oder Datum`);
}

// 3c. Qualität der Antwortoptionen (AP 3.3) – Ratschen, Ziel: ≤ 30 % / 0 / ≤ 5
const istLaengste = (q: typeof QUIZ_QUESTIONS[number]) => q.options.every((o, i) => i === q.correctIdx || o.length < q.options[q.correctIdx].length);
const anteilLaengste = QUIZ_QUESTIONS.filter(istLaengste).length / QUIZ_QUESTIONS.length;
const laengenVerhaeltnis = (q: typeof QUIZ_QUESTIONS[number]) => {
  const andere = q.options.filter((_, i) => i !== q.correctIdx);
  return q.options[q.correctIdx].length / (andere.reduce((a, o) => a + o.length, 0) / andere.length);
};
const zuLang = QUIZ_QUESTIONS.filter(q => laengenVerhaeltnis(q) > 1.2).length;
const ABSOLUT = /\b(immer|nie|niemals|ausschließlich|grundsätzlich|stets|keinerlei|sämtliche)\b/gi;
const absolut = QUIZ_QUESTIONS.reduce((a, q) => a + q.options.filter((_, i) => i !== q.correctIdx).reduce((b, o) => b + (o.match(ABSOLUT)?.length ?? 0), 0), 0);
const GRENZE = { laengste: 0.534, zuLang: 234, absolut: 37 };
pruefe(anteilLaengste <= GRENZE.laengste + 1e-9, `Richtige Antwort ist in ${(anteilLaengste * 100).toFixed(1)} % die längste (Grenze ${GRENZE.laengste * 100} %)`);
pruefe(zuLang <= GRENZE.zuLang, `${zuLang} Fragen mit Längenverhältnis > 1,2 (Grenze ${GRENZE.zuLang})`);
pruefe(absolut <= GRENZE.absolut, `${absolut} Absolutwörter in Distraktoren (Grenze ${GRENZE.absolut})`);

// 4. Jeder <ModulTest moduleId="…"> im Code hat Fragen
const proModul = new Map<string, number>();
for (const q of QUIZ_QUESTIONS) proModul.set(q.moduleId, (proModul.get(q.moduleId) ?? 0) + 1);
const dateien = fs.readdirSync('src', { recursive: true }) as string[];
for (const rel of dateien.filter(f => f.endsWith('.tsx') && !f.endsWith('Admin.tsx'))) {
  const text = fs.readFileSync(path.join('src', rel), 'utf8');
  for (const m of text.matchAll(/<ModulTest[^>]*moduleId="([^"]+)"/g)) {
    pruefe((proModul.get(m[1]) ?? 0) > 0, `${rel}: <ModulTest moduleId="${m[1]}"> ohne Fragen`);
  }
}

// 5. Jeder Aufgaben-Reiter mit Gruppenfilter hat Fragen
const gruppenMitFragen = new Set(QUIZ_QUESTIONS.map(q => q.gruppe));
for (const [tab, cfg] of Object.entries(AUFGABEN_QUIZ_GRUPPEN)) {
  for (const g of cfg.gruppen ?? []) pruefe(gruppenMitFragen.has(g), `${tab}: Gruppe „${g}“ ohne Fragen`);
}

// 6. Ratsche: Module mit weniger als 5 Fragen dürfen nicht mehr werden
const MAX_DUENN = 153;
const duenn = [...proModul.values()].filter(n => n < 5).length;
pruefe(duenn <= MAX_DUENN, `${duenn} Module mit < 5 Fragen (Grenze ${MAX_DUENN})`);

if (fehler.length) {
  for (const f of fehler) console.error(`FAIL: ${f}`);
  process.exit(1);
}
console.log(`OK: ${QUIZ_QUESTIONS.length} Fragen, ${proModul.size} Module, ${duenn} davon mit < 5 Fragen; längste richtig ${(anteilLaengste * 100).toFixed(1)} %, Verhältnis > 1,2: ${zuLang}, Absolutwörter: ${absolut}`);
