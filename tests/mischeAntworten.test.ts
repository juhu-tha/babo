import { mischeAntworten } from '../src/utils/mischeAntworten';

let fail = 0;
const ok = (c: boolean, m: string) => { if (!c) { fail++; console.log('FAIL', m); } };
const q = { id: 'x', options: ['a', 'b', 'c', 'd'], correctIdx: 2 };
for (let n = 0; n < 200; n++) {
  const m = mischeAntworten(q);
  ok(m.options[m.correctIdx] === 'c', 'richtige Antwort bleibt richtig');
  ok([...m.options].sort().join() === 'a,b,c,d', 'alle Optionen erhalten');
}
ok(q.options.join() === 'a,b,c,d' && q.correctIdx === 2, 'Original unverändert');
const pos = new Set<number>();
for (let n = 0; n < 200; n++) pos.add(mischeAntworten(q).correctIdx);
ok(pos.size === 4, 'richtige Antwort wandert über alle Positionen');
if (fail) process.exit(1);
console.log('ok');
