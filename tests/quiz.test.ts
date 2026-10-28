// Konsistenz des Quizpools (Umsetzungsplan Phase 3, AP 3.1/3.2)
import fs from 'fs';
import path from 'path';
import { QUIZ_QUESTIONS, SCHWIERIGKEITEN, BLOOM_STUFEN } from '../src/data/quizData';
import { quizRoute } from '../src/data/quizZuordnung';
import { MODULE, MODUL_BY_ID, type ModulEintrag } from '../src/registry/modules';
import { grenzenFuer } from '../src/data/rechnerGrenzen';
import { AUFGABEN_QUIZ_GRUPPEN } from '../src/data/aufgabenQuizGruppen';
import { MODULTEST_IN_APP } from '../src/data/quizZuordnung';
import { teileFragenpool, fragenJeModul, QUIZ_TEILE } from '../scripts/quizPool';
import { TEILMODULE, teilmodulFamilie } from '../src/registry/teilmodule';

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
  // Überarbeitete Fragen (AP 3.3) tragen Bloom-Stufe, Niveau und Rückmeldungen; freigegebene Altfragen folgen mit der Freigabe
  if (!q.verified) pruefe(!!q.bloom && !!q.niveau && !!q.distraktorFeedback, `${q.id}: Bloom-Stufe, Niveau oder Rückmeldungen fehlen`);
  if (q.verified) pruefe(!!q.reviewer && /^\d{4}-\d{2}-\d{2}$/.test(q.reviewedAt ?? ''), `${q.id}: freigegeben ohne Prüfer oder Datum`);
  // 3c'. Technische Vorprüfung (optional): Datum, Ergebnis, bei „korrigiert“/„fraglich“ ein Hinweis
  if (q.vorpruefung !== undefined) {
    const v = q.vorpruefung;
    pruefe(/^\d{4}-\d{2}-\d{2}$/.test(v.am ?? ''), `${q.id}: vorpruefung.am ist kein Datum`);
    pruefe(['ok', 'korrigiert', 'fraglich'].includes(v.ergebnis), `${q.id}: vorpruefung.ergebnis „${v.ergebnis}“ unbekannt`);
    pruefe(v.ergebnis === 'ok' || !!v.hinweis?.trim(), `${q.id}: vorpruefung „${v.ergebnis}“ ohne Hinweis`);
    pruefe(Object.keys(v).every(k => ['am', 'ergebnis', 'hinweis'].includes(k)), `${q.id}: vorpruefung mit unbekanntem Feld`);
  }
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
// Richtige Antwort mindestens so lang wie jede andere (Gleichstand zählt mit) – Längenhinweis aus Sicht der Lernenden
const istLaengsteInkl = (q: typeof QUIZ_QUESTIONS[number]) => q.options.every(o => o.length <= q.options[q.correctIdx].length);
const anteilLaengsteInkl = QUIZ_QUESTIONS.filter(istLaengsteInkl).length / QUIZ_QUESTIONS.length;
// Spannweite der Optionslängen je Frage (längste/kürzeste)
const spannweite = (q: typeof QUIZ_QUESTIONS[number]) => Math.max(...q.options.map(o => o.length)) / Math.max(1, Math.min(...q.options.map(o => o.length)));
const zuWeit = QUIZ_QUESTIONS.filter(q => spannweite(q) > 1.2).length;
const ohneNormRef = QUIZ_QUESTIONS.filter(q => !q.normRef?.trim()).length;
// Stand 27.10. (Distraktoren angeglichen, normRef ergänzt): Rest „zuLang“ = 26 bereits freigegebene Fragen (Z23d);
// ohne normRef bleiben reine Grundlagen-/Rechenfragen ohne Normbezug (docs/pruefung/quiz-aenderungen-10-27.md)
const GRENZE = { laengste: 0.019, laengsteInkl: 0.274, zuLang: 26, zuWeit: 397, absolut: 10, ohneNormRef: 276 };
pruefe(anteilLaengste <= GRENZE.laengste + 1e-9, `Richtige Antwort ist in ${(anteilLaengste * 100).toFixed(1)} % die längste (Grenze ${GRENZE.laengste * 100} %)`);
pruefe(anteilLaengsteInkl <= GRENZE.laengsteInkl + 1e-9, `Richtige Antwort ist in ${(anteilLaengsteInkl * 100).toFixed(1)} % mindestens so lang wie alle anderen (Grenze ${(GRENZE.laengsteInkl * 100).toFixed(1)} %)`);
pruefe(zuLang <= GRENZE.zuLang, `${zuLang} Fragen mit Längenverhältnis > 1,2 (Grenze ${GRENZE.zuLang})`);
pruefe(zuWeit <= GRENZE.zuWeit, `${zuWeit} Fragen mit längster/kürzester Option > 1,2 (Grenze ${GRENZE.zuWeit})`);
pruefe(absolut <= GRENZE.absolut, `${absolut} Absolutwörter in Distraktoren (Grenze ${GRENZE.absolut})`);
pruefe(ohneNormRef <= GRENZE.ohneNormRef, `${ohneNormRef} Fragen ohne normRef (Grenze ${GRENZE.ohneNormRef})`);

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

// 4b. Jede Frage erscheint in einem Selbsttest: <ModulTest moduleId="…"> in einer Komponente,
//     dynamisch in OekobilanzLCA (TEILE.moduleId) oder über MODULTEST_IN_APP unter dem Modul
const testIds = new Set<string>();
for (const rel of dateien.filter(f => f.endsWith('.tsx') && !f.endsWith('Admin.tsx'))) {
  const text = fs.readFileSync(path.join('src', rel), 'utf8');
  for (const m of text.matchAll(/<ModulTest[^>]*moduleId="([^"]+)"/g)) testIds.add(m[1]);
}
for (const m of fs.readFileSync('src/modules/OekobilanzLCA.tsx', 'utf8').matchAll(/moduleId: '([a-z0-9_]+)'/g)) testIds.add(m[1]);
for (const id of MODULTEST_IN_APP) {
  pruefe(MODUL_BY_ID.has(id), `MODULTEST_IN_APP: ${id} ist keine Route`);
  pruefe(!testIds.has(id), `MODULTEST_IN_APP: ${id} hat schon einen Selbsttest in der Komponente (doppelte Anzeige)`);
}
for (const id of new Set(QUIZ_QUESTIONS.map(q => q.moduleId))) {
  pruefe(testIds.has(id) || MODULTEST_IN_APP.has(id), `Fragen zu „${id}“ erscheinen in keinem Selbsttest`);
}

// 5. Jeder Aufgaben-Reiter mit Gruppenfilter hat Fragen
const gruppenMitFragen = new Set(QUIZ_QUESTIONS.map(q => q.gruppe));
for (const [tab, cfg] of Object.entries(AUFGABEN_QUIZ_GRUPPEN)) {
  for (const g of cfg.gruppen ?? []) pruefe(gruppenMitFragen.has(g), `${tab}: Gruppe „${g}“ ohne Fragen`);
}

// 6. Ratsche: Module mit weniger als 5 Fragen dürfen nicht mehr werden
const MAX_DUENN = 2; // nur noch die reinen Infoseiten beton_info, stahlbeton_info
// Teilmodule aufgeteilter Module zählen hier nicht, sie haben eine eigene Ratsche (7b, TEIL_UNTER_MINDEST)
const duenn = [...proModul].filter(([id, n]) => n < 5 && !teilmodulFamilie(id)).length;
pruefe(duenn <= MAX_DUENN, `${duenn} Module mit < 5 Fragen (Grenze ${MAX_DUENN})`);

// 7. Abdeckung der Fachmodule (AP 3.4): je Route ≥ 6 Fragen, Rechner-Module mit Rechenfrage, Spannbeton ≥ 10, Pool ≥ 850
const OHNE = new Set(['Allgemein', 'Infos & Quellen', 'Studium THA', 'Weiter@THA', 'Vorlesungen', 'Lehrveranstaltungen', 'Übungsaufgaben', 'Thesen & Projekte', 'Kuriositäten']);
const fach = (MODULE as readonly ModulEintrag[]).filter(m => (m.baum?.typ === 'standard' || m.baum?.typ === 'calculator') && !OHNE.has(m.gruppe ?? ''));
const proRoute = new Map<string, typeof QUIZ_QUESTIONS>();
for (const q of QUIZ_QUESTIONS) { const r = quizRoute(q.moduleId); if (r) proRoute.set(r, [...(proRoute.get(r) ?? []), q]); }
const mindestFragen = (stamm: string) => (stamm === 'spannbeton' ? 10 : 6);
const istRechenfrage = (q: (typeof QUIZ_QUESTIONS)[number]) => q.bloom === 'Anwenden' && /\d/.test(q.question);
for (const m of fach) {
  if (teilmodulFamilie(m.id)) continue; // Teilmodule: Familienregel unten
  const qs = proRoute.get(m.id) ?? [];
  pruefe(qs.length >= mindestFragen(m.id), `${m.id}: nur ${qs.length} Fragen`);
  if (m.baum?.typ === 'calculator' || grenzenFuer(m.id)) pruefe(qs.some(istRechenfrage), `${m.id}: Rechner-Modul ohne Rechenfrage`);
}
// 7b. Aufgeteilte Module (src/registry/teilmodule.ts, 28.10.2026): Die Fragen des früheren Moduls wurden ohne neue
//     Fragen auf die Teile verteilt. Mindestzahl (Spannbeton 10) und Rechenfrage gelten für die Familie; je Teil
//     mindestens 1 Frage. Teile unter 6 Fragen stehen in TEIL_UNTER_MINDEST (Ratsche: Liste darf nur kürzer werden;
//     Aufstockung offen, docs/entwuerfe/lange-module-aufteilung.md).
const MINDEST_TEIL = 6;
const TEIL_UNTER_MINDEST: ReadonlySet<string> = new Set(['spannbeton_kennwerte', 'bauwerksdiagnose', 'pruefverfahren_katalog', 'zfp']);
for (const f of TEILMODULE) {
  const jeTeil = f.teile.map(id => proRoute.get(id) ?? []);
  const alle = jeTeil.flat();
  pruefe(!MODUL_BY_ID.has(f.stamm), `Teilmodule: Stammmodul ${f.stamm} ist noch eine Route (soll Alias sein)`);
  pruefe(alle.length >= mindestFragen(f.stamm), `${f.stamm} (Teilmodule): nur ${alle.length} Fragen`);
  pruefe(alle.some(istRechenfrage), `${f.stamm} (Teilmodule): keine Rechenfrage`);
  f.teile.forEach((id, i) => {
    pruefe(jeTeil[i].length >= 1, `${id}: keine Fragen (Teilmodul)`);
    const unter = jeTeil[i].length < MINDEST_TEIL;
    pruefe(!unter || TEIL_UNTER_MINDEST.has(id), `${id}: ${jeTeil[i].length} Fragen – unter ${MINDEST_TEIL}, nicht in TEIL_UNTER_MINDEST`);
    pruefe(unter || !TEIL_UNTER_MINDEST.has(id), `${id}: hat jetzt ${jeTeil[i].length} Fragen – aus TEIL_UNTER_MINDEST streichen (Ratsche)`);
  });
}
pruefe(QUIZ_QUESTIONS.length >= 850, `nur ${QUIZ_QUESTIONS.length} Fragen (≥ 850 verlangt)`);

// 9. Aufteilung für den Browser (AP 5.4, Vite-Plugin scripts/quizPool.ts): Teilpakete ergeben zusammen
//    genau quiz.json in Originalreihenfolge, keins ist leer; Modulpakete decken jede Frage genau einmal ab.
const roh = JSON.parse(fs.readFileSync('src/data/quiz.json', 'utf8')) as { id: string; moduleId: string }[];
const teile = teileFragenpool(roh);
pruefe(teile.length === QUIZ_TEILE && teile.every(t => t.length > 0), `Teilpakete: ${teile.map(t => t.length).join('/')}`);
pruefe(JSON.stringify(teile.flat()) === JSON.stringify(roh), 'Teilpakete ergeben nicht quiz.json');
const groesste = Math.max(...teile.map(t => JSON.stringify(t).length));
pruefe(groesste < 0.4 * JSON.stringify(roh).length, `Teilpaket zu groß: ${groesste} Zeichen`);
const jeModul = fragenJeModul(roh);
pruefe([...jeModul.values()].reduce((s, f) => s + f.length, 0) === roh.length, 'Modulpakete decken nicht jede Frage genau einmal ab');
// Browser-Code lädt Fragen nur über src/data/quizLader.ts – nie quizData.ts/quiz.json direkt (sonst ein ~380-kB-Chunk)
const quellen = (dir: string): string[] => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? quellen(path.join(dir, e.name)) : /\.tsx?$/.test(e.name) ? [path.join(dir, e.name)] : []);
for (const datei of quellen('src')) {
  if (datei.endsWith(path.join('data', 'quizData.ts'))) continue;
  const text = fs.readFileSync(datei, 'utf8');
  pruefe(!/from ['"][^'"]*\/(quizData|quiz\.json)['"]/.test(text), `${datei}: importiert quizData/quiz.json – im Browser quizLader.ts verwenden`);
}

if (fehler.length) {
  for (const f of fehler) console.error(`FAIL: ${f}`);
  process.exit(1);
}
console.log(`OK: ${QUIZ_QUESTIONS.length} Fragen, ${proModul.size} Module, ${duenn} davon mit < 5 Fragen; längste richtig ${(anteilLaengste * 100).toFixed(1)} % (inkl. Gleichstand ${(anteilLaengsteInkl * 100).toFixed(1)} %), Verhältnis > 1,2: ${zuLang}, Spannweite > 1,2: ${zuWeit}, Absolutwörter: ${absolut}, ohne normRef: ${ohneNormRef}`);
