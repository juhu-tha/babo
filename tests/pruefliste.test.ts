// Quiz-Prüflisten (docs/pruefung/quiz-cluster-*.md): aktuell gehalten mit scripts/pruefliste.ts,
// Kopfzahlen = Admin-Audit (kein Hinweis „veraltet“), alle auffälligen und alle neuen Fragen aufgeführt.
import fs from 'fs';
import { erzeugePrueflisten, vorhandeneEntscheidungen, hinweisTexte, fnv1a, STICHPROBE } from '../scripts/pruefliste';
import { offenePruefhinweise, prueflistenKopf, istAuffaellig, NEU_SEIT_26_10, type Frage } from '../scripts/auditDaten';
import { quizCluster } from '../src/data/quizZuordnung';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: Quiz-Prüflisten ---');

const quizVorher = fs.readFileSync('src/data/quiz.json', 'utf8');
const listen = erzeugePrueflisten();
pruefe(fs.readFileSync('src/data/quiz.json', 'utf8') === quizVorher, 'Generator hat quiz.json verändert');

// 1. Dateien = Generator-Ausgabe (aktuell gehalten)
for (const l of listen) {
  const ist = fs.existsSync(l.datei) ? fs.readFileSync(l.datei, 'utf8') : '';
  pruefe(ist === l.inhalt, `${l.datei} veraltet → npx tsx scripts/pruefliste.ts`);
}

// 2. Kopfzahlen = unabhängige Zählung (gleiche Regel wie Admin-Audit)
const fragen: (Frage & { question: string })[] = JSON.parse(quizVorher);
const hinweise = offenePruefhinweise(fs.readFileSync('docs/quiz-pruefhinweise.md', 'utf8'));
let summe = 0;
for (const l of listen) {
  const f = fragen.filter(q => quizCluster(q.moduleId)?.id === l.cluster);
  const auff = f.filter(q => istAuffaellig(q, hinweise));
  summe += f.length;
  const kopf = prueflistenKopf(l.inhalt);
  pruefe(!!kopf && kopf.gesamt === f.length && kopf.auffaellig === auff.length, `Cluster ${l.cluster}: Kopfzahlen ${JSON.stringify(kopf)} ≠ ${auff.length}/${f.length}`);
  for (const q of auff) pruefe(l.inhalt.includes(`### ${q.id} · `), `Cluster ${l.cluster}: auffällige Frage ${q.id} fehlt`);
  const b = l.inhalt.split('## B. ')[1]?.split('## C. ')[0] ?? '';
  const stichprobe = [...b.matchAll(/^### (\S+) · /gm)].map(m => m[1]);
  pruefe(stichprobe.length === Math.min(STICHPROBE, f.length - auff.length), `Cluster ${l.cluster}: Stichprobe hat ${stichprobe.length} Fragen`);
  for (const id of stichprobe) pruefe(!auff.some(q => q.id === id), `Cluster ${l.cluster}: Stichprobe enthält auffällige Frage ${id}`);
  const c = l.inhalt.split('## C. ')[1] ?? '';
  pruefe([...c.matchAll(/^### /gm)].length === STICHPROBE, `Cluster ${l.cluster}: Lernziel-Stichprobe ≠ ${STICHPROBE} Module`);
}
pruefe(summe === fragen.length, `Prüflisten decken ${summe} von ${fragen.length} Fragen ab`);

// 3. Neue Fragen seit 26.10. (Z24, #190/#191: 30; Teilmodul-Aufstockung qt_* vom 29.10.: 14; Modul ec_kennwerte qt_eckennwerte_* vom 02.11.: 7; Historische Kennwerte qt_hk13791_* vom 02.11.: 4): alle erfasst und, solange nicht freigegeben, aufgeführt
const neu = fragen.filter(q => NEU_SEIT_26_10.test(q.id));
pruefe(neu.length === 55, `NEU_SEIT_26_10 trifft ${neu.length} statt 55 Fragen`);
const alle = listen.map(l => l.inhalt).join('\n');
for (const q of neu) if (q.verified !== true) pruefe(alle.includes(`### ${q.id} · `), `neue Frage ${q.id} fehlt in den Prüflisten`);

// 4. Hilfsfunktionen
const t = hinweisTexte('Bereits korrigiert: q_a_1 – bitte bestätigen.\n- [ ] **q_b_2, qz24_c_3**: Text X\n- [x] **q_d_4**: erledigt\nAbgleich der oben genannten Normausgaben mit DIN Media:\n\n- q_b_2 – DIN 1: bestätigt\n<!-- ende -->\n- q_e_5 – nicht im Abgleich');
pruefe(t.pruef.get('q_a_1')?.[0] === 'bereits korrigiert – bitte bestätigen.', 'hinweisTexte: Bereits korrigiert');
pruefe(t.pruef.get('qz24_c_3')?.[0] === 'Text X' && !t.pruef.has('q_d_4'), 'hinweisTexte: offene Punkte');
pruefe(t.normen.get('q_b_2')?.[0] === 'DIN 1: bestätigt' && !t.normen.has('q_e_5'), 'hinweisTexte: Normenabgleich');
const k = vorhandeneEntscheidungen('## A\n\n### q_x_1 · M\n\n- x\n- [x] ok\n- [ ] ändern: …\n\n### q_x_2 · M\n\n- [ ] ok\n- [x] ändern: Antwort kürzen\n  zweite Zeile\n\n### q_x_3 · M\n\n- [ ] ok\n- [ ] ändern: …\n');
pruefe(k.get('q_x_1')?.[0] === '- [x] ok', 'Kreuze: ok übernommen');
pruefe(k.get('q_x_2')?.length === 3 && k.get('q_x_2')?.[2] === '  zweite Zeile', 'Kreuze: Änderungswunsch mit Folgezeile übernommen');
pruefe(!k.has('q_x_3'), 'Kreuze: leerer Block nicht übernommen');
pruefe(fnv1a('') === 0x811c9dc5 && fnv1a('a') === 0xe40c292c, 'fnv1a: Referenzwerte');

if (fehler.length) {
  for (const f of fehler) console.error(`FAIL: ${f}`);
  process.exit(1);
}
console.log(`OK: ${listen.length} Prüflisten aktuell, ${listen.reduce((s, l) => s + l.auffaellig, 0)} auffällige Fragen, ${neu.length} neue Fragen erfasst`);
