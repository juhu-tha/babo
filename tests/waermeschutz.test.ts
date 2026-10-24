// Rechenkern Wärmeschutz (Umsetzungsplan Phase 4, AP 4.3)
import { psat, taupunkt, temperaturBeiPsat, temperaturverlauf, uebergang, uWert, type Schicht } from '../src/calc/waermeschutz';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
console.log('--- Test: Wärmeschutz ---');

// 1. Sättigungsdampfdruck gegen die Tabellenwerte der DIN 4108-3 (Anhang, Pa):
//    20 °C: 2337; 10 °C: 1228; 0 °C: 611; −5 °C: 401; −10 °C: 260
for (const [t, p] of [[20, 2337], [10, 1228], [0, 611], [-5, 401], [-10, 260]]) pruefe(nahe(psat(t), p, 0.004), `p_sat(${t}) = ${psat(t).toFixed(0)}`);

// Taupunkt nach DIN 4108-3: 20 °C / 50 % → 9,3 °C; 20 °C / 60 % → 12,0 °C; Umkehrung exakt
pruefe(Math.abs(taupunkt(20, 50) - 9.3) < 0.05 && Math.abs(taupunkt(20, 60) - 12.0) < 0.05, `θ_s ${taupunkt(20, 50)} / ${taupunkt(20, 60)}`);
for (const th of [-15, -5, 0.5, 12, 25]) pruefe(Math.abs(temperaturBeiPsat(psat(th)) - th) < 1e-9, `Umkehrung ${th}`);
pruefe(Number.isNaN(temperaturBeiPsat(0)), 'p = 0 → NaN');

// 2. U-Wert Handrechnung: 15 mm Gipsputz (0,35) + 240 mm HLZ (0,42) + 160 mm EPS (0,035) + 20 mm Zementputz (1,0)
//    R_T = 0,13 + 0,0429 + 0,5714 + 4,5714 + 0,0200 + 0,04 = 5,3757 m²K/W → U = 0,1860 W/(m²K)
const wand: Schicht[] = [{ d: 0.015, lambda: 0.35 }, { d: 0.24, lambda: 0.42 }, { d: 0.16, lambda: 0.035 }, { d: 0.02, lambda: 1.0 }];
const { Rsi, Rse } = uebergang('wall');
const u = uWert(wand, Rsi, Rse);
pruefe(nahe(u.R_T, 5.3757, 1e-4) && nahe(u.U, 0.18602, 1e-4), `U ${u.U}`);
// Temperaturverlauf: Oberflächentemperatur innen θ_si = 20 − 0,186·25·0,13 = 19,40 °C; letzte Grenze = θ_se
const t = temperaturverlauf(wand, Rsi, Rse, 20, -5);
pruefe(nahe(t[0], 20 - u.U * 25 * 0.13, 1e-12) && nahe(t[t.length - 1], -5 + u.U * 25 * 0.04, 1e-9), 'Temperaturverlauf');
// Übergangswiderstände ISO 6946: Kellerdecke gegen unbeheizten Keller R_si auf beiden Seiten
pruefe(uebergang('basement').Rse === 0.17 && uebergang('flat_roof').Rsi === 0.10, 'R_si/R_se');

// 3. Unsinnige Eingaben
for (const s of [[{ d: 0.1, lambda: 0 }], [{ d: 0, lambda: 0.04 }], [{ d: 0.1, lambda: -1 }], [], [{ d: NaN, lambda: 1 }], [{ d: 0.1, lambda: 1, mu: 0 }]] as Schicht[][]) {
  const r = uWert(s, Rsi, Rse);
  pruefe(!r.gueltig && r.hinweise.some(x => x.stufe === 'fehler'), JSON.stringify(s));
}
let seed = 19;
const z = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
for (let i = 0; i < 1000; i++) {
  const s = Array.from({ length: 1 + (i % 6) }, () => ({ d: z(-0.05, 0.5), lambda: z(-0.1, 3) }));
  const r = uWert(s, Rsi, Rse);
  if (r.gueltig && !(Number.isFinite(r.U) && r.U > 0)) { pruefe(false, `Fuzz ${JSON.stringify(s)}`); break; }
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Wärmeschutz');
