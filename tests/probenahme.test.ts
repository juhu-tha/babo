// Rechenkern Probenahme LAGA PN 98 (Runde 5): Tabelle 2 (Probenzahl je Untersuchungseinheit) und Tabelle 3 (Mindestvolumen)
import { pn98Probenzahl, pn98Plan, pn98Mindestvolumen } from '../src/calc/probenahme';
import { zahlenPassen } from './hilfen/keinErgebnis';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: Probenahme LAGA PN 98 ---');

// 1. Tabelle 2 (öffentlich: umwelt-online.de, „PN 98 – Probenahme aus festen und stichfesten Abfällen“ Teil 2)
//    V | EP | MP | Sammelproben | LP
const TAB2: [number, number, number, number, number][] = [
  [30, 8, 2, 0, 2], [60, 12, 3, 0, 3], [100, 16, 4, 0, 4], [150, 20, 5, 0, 5], [200, 24, 6, 0, 6], [300, 28, 7, 0, 7],
  [400, 32, 8, 0, 8], [500, 36, 9, 0, 9], [600, 40, 10, 0, 10], [700, 44, 11, 1, 11], [800, 48, 12, 1, 11], [900, 52, 13, 1, 11],
  [1000, 56, 14, 2, 12], [1100, 60, 15, 2, 12], [1200, 64, 16, 2, 12],
];
for (const [v, ep, mp, sp, lp] of TAB2) {
  const r = pn98Probenzahl(v);
  pruefe(r.einzelproben === ep && r.mischproben === mp && r.sammelproben === sp && r.laborproben === lp, `Tab. 2 ${v} m³: ${JSON.stringify(r)}`);
}
// Zwischenwerte: 31 m³ → Stufe „bis 60“; 601 m³ → angefangene 100 m³
pruefe(pn98Probenzahl(31).mischproben === 3 && pn98Probenzahl(601).mischproben === 11 && pn98Probenzahl(601).laborproben === 11, 'Zwischenwerte');
pruefe(pn98Probenzahl(1).mischproben === 2 && pn98Probenzahl(0).mischproben === 0, 'Kleinstmengen');

// 2. Untersuchungseinheiten (Z22): 6 000 m³ bei höchstens 3 000 m³ je UE → 2 UE à 3 000 m³;
//    je UE: MP = 10 + ⌈2 400/100⌉ = 34, EP = 136, LP = 10 + ⌈2 400/300⌉ = 18; gesamt 68 MP, 272 EP, 36 LP
//    (bisher wurde Tab. 2 einmal auf das Gesamtvolumen angewendet: 64 MP)
const plan = pn98Plan({ volumenM3: 6000, maxUeM3: 3000 });
pruefe(plan.einheiten === 2 && plan.volumenJeUe === 3000 && plan.jeUe.mischproben === 34 && plan.gesamt.mischproben === 68 && plan.gesamt.einzelproben === 272 && plan.gesamt.laborproben === 36, `Plan ${JSON.stringify(plan.gesamt)}`);
pruefe(plan.hinweise.some(h => h.feld === 'volumen'), 'über 1 200 m³ je UE → Hinweis');
const klein = pn98Plan({ volumenM3: 120, maxUeM3: 3000 });
pruefe(klein.einheiten === 1 && klein.gesamt.mischproben === 5 && klein.gesamt.einzelproben === 20, 'Standard 120 m³');
pruefe(pn98Plan({ volumenM3: 0, maxUeM3: 3000 }).hinweise.some(h => h.stufe === 'fehler'), 'V = 0 → Fehler');

// 3. Tabelle 3: Mindestvolumen nach Größtkorn
pruefe(pn98Mindestvolumen(2).einzelL === 0.5 && pn98Mindestvolumen(16).einzelL === 1 && pn98Mindestvolumen(32).einzelL === 2 && pn98Mindestvolumen(63).einzelL === 5 && pn98Mindestvolumen(63).laborL === 10, 'Tab. 3');
pruefe(pn98Mindestvolumen(20).laborL === 2 && pn98Mindestvolumen(50).laborL === 4 && pn98Mindestvolumen(125).stueck, 'Tab. 3 Grenzen');

// 4. Fuzz: Monotonie und Endlichkeit
let vorher = 0;
for (let v = 1; v <= 5000; v += 7) {
  const r = pn98Probenzahl(v);
  pruefe(r.mischproben >= vorher && r.einzelproben === 4 * r.mischproben && Number.isFinite(r.laborproben), `Monotonie ${v}`);
  vorher = r.mischproben;
}
let seed = 11;
const z = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
for (let i = 0; i < 1000; i++) {
  const p = pn98Plan({ volumenM3: z(-100, 20000), maxUeM3: z(-100, 5000) });
  if (!zahlenPassen(p, [p.einheiten, p.volumenJeUe, p.gesamt.einzelproben, p.gesamt.laborproben])) { pruefe(false, `Fuzz ${i}`); break; }
}

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log('OK: Probenahme LAGA PN 98');
