// Stabilitätsgrößen (src/calc/stabilitaet.ts) – eigene Tests (Zwischen-Review Z4)
import { EULER_BETA } from '../src/calc/stabilitaet';
import { EULER_BETA as EULER_BETA_HOLZ } from '../src/calc/holzbau';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
console.log('--- Test: Stabilität ---');

// 1. Tabellenwerte der vier Euler-Fälle (arabische Nummerierung)
pruefe(Object.keys(EULER_BETA).join(',') === '1,2,3,4', `genau die Fälle 1–4 (${Object.keys(EULER_BETA)})`);
pruefe(EULER_BETA[1] === 2.0 && EULER_BETA[2] === 1.0 && EULER_BETA[3] === 0.7 && EULER_BETA[4] === 0.5, 'β = 2,0 / 1,0 / 0,7 / 0,5');
pruefe(EULER_BETA[1] > EULER_BETA[2] && EULER_BETA[2] > EULER_BETA[3] && EULER_BETA[3] > EULER_BETA[4], 'mehr Einspannung → kleineres β');
pruefe(EULER_BETA_HOLZ === EULER_BETA, 'Holzbau nutzt dieselbe Tabelle (kein zweiter Satz Werte)');

// 2. Herleitung aus der Knickgleichung EI·w'''' + N·w'' = 0 mit k = √(N/EI): kleinster Eigenwert k·L
//    Fall 1 Kragarm: cos(kL) = 0 → kL = π/2 → β = π/(kL) = 2
//    Fall 2 gelenkig–gelenkig: sin(kL) = 0 → kL = π → β = 1
//    Fall 3 eingespannt–gelenkig: tan(kL) = kL → kL = 4,4934 → β = 0,6992 ≈ 0,7
//    Fall 4 eingespannt–eingespannt: kL = 2π → β = 0,5
let x = 4.5; // Newton für f(x) = tan x − x im Intervall (π, 3π/2), f'(x) = tan² x
for (let i = 0; i < 50; i++) x -= (Math.tan(x) - x) / Math.tan(x) ** 2;
pruefe(nahe(x, 4.4934, 1e-4), `Eigenwert Fall 3 kL = ${x.toFixed(4)}`);
pruefe(EULER_BETA[1] === Math.PI / (Math.PI / 2) && EULER_BETA[2] === Math.PI / Math.PI && EULER_BETA[4] === Math.PI / (2 * Math.PI), 'Fälle 1, 2, 4 exakt');
pruefe(Math.abs(EULER_BETA[3] - Math.PI / x) < 0.001, `Fall 3: β = 0,7 vs. π/4,4934 = ${(Math.PI / x).toFixed(4)} (gerundet)`);

// 3. Handrechnung Euler-Knicklast N_cr = π²·E·I / (β·L)²
//    Stahlstütze IPE 200: E = 210 000 N/mm², I_z = 142·10⁴ mm⁴, L = 3,00 m
//    Fall 2: N_cr = π²·210 000·1 420 000 / 3 000² = 327,0 kN
//    Fall 1: ÷ 2,0² = 81,8 kN; Fall 3: ÷ 0,7² = 667,4 kN; Fall 4: × 4 = 1 308,1 kN
const ncr = (fall: 1 | 2 | 3 | 4, E: number, I: number, L: number) => Math.PI ** 2 * E * I / (EULER_BETA[fall] * L) ** 2;
const soll: Record<1 | 2 | 3 | 4, number> = { 1: 81.75e3, 2: 327.0e3, 3: 667.4e3, 4: 1308.1e3 };
for (const fall of [1, 2, 3, 4] as const) {
  const n = ncr(fall, 210000, 142e4, 3000);
  pruefe(nahe(n, soll[fall], 1e-3), `Fall ${fall}: N_cr = ${(n / 1000).toFixed(1)} kN (soll ${(soll[fall] / 1000).toFixed(1)} kN)`);
}
//    Knicklänge L_cr = β·L und Verhältnis zu Fall 2 = 1/β²
pruefe(nahe(EULER_BETA[3] * 3000, 2100, 1e-12), 'L_cr Fall 3 bei L = 3 m: 2,10 m');
pruefe(nahe(ncr(4, 1, 1, 1) / ncr(2, 1, 1, 1), 4, 1e-12) && nahe(ncr(1, 1, 1, 1) / ncr(2, 1, 1, 1), 0.25, 1e-12), 'Fall 4 = 4 × Fall 2, Fall 1 = ¼ × Fall 2');

// 4. Schlankheit λ = L_cr / i (Rechteck b × h = 100 × 100 mm, i = h/√12 = 28,87 mm, L = 2,5 m, Fall 2): λ = 86,6
pruefe(nahe(EULER_BETA[2] * 2500 / (100 / Math.sqrt(12)), 86.6, 1e-3), 'Schlankheit Rechteckquerschnitt');

// 5. Randfälle: unbekannter Fall liefert undefined (Aufrufer müssen auf 1–4 einschränken)
const lose = EULER_BETA as Readonly<Record<number, number | undefined>>;
pruefe(lose[0] === undefined && lose[5] === undefined, 'Fall 0 und 5 nicht definiert');
pruefe(Number.isNaN(ncr(5 as 1, 210000, 142e4, 3000)), 'ungültiger Fall ergibt NaN statt einer Zahl');
pruefe(ncr(2, 210000, 142e4, 0) === Infinity, 'L = 0 → N_cr unendlich (Eingabe vorher mit muss() ausschließen)');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Euler-Fälle 1–4, Herleitung, N_cr-Handrechnung');
