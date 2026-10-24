// Rechenkern Bodenmechanik (Umsetzungsplan Phase 4, AP 4.3/4.8)
import { erddruckRankine, konsolidierung, konsolidierungsgrad, mohrCoulomb, zustandsgrenzen } from '../src/calc/boden';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
console.log('--- Test: Boden ---');

// 1. Zustandsgrenzen: w = 25, w_L = 45, w_P = 20 → I_P = 25, I_c = 0,8 (steif); oberhalb A-Linie (14,6) → TM
const z = zustandsgrenzen(25, 45, 20);
pruefe(z.iP === 25 && z.iC === 0.8 && z.zustand === 'steif' && z.klasse.startsWith('TM'), JSON.stringify(z));
pruefe(zustandsgrenzen(20, 25, 20).klasse.startsWith('UL/TL'), 'Zwischenbereich I_P = 5');
pruefe(zustandsgrenzen(30, 60, 45).klasse.startsWith('UA'), 'unterhalb A-Linie, w_L > 50');
pruefe(zustandsgrenzen(50, 45, 20).zustand === 'flüssig', 'I_c < 0');
pruefe(zustandsgrenzen(25, 20, 30).hinweise.some(x => x.stufe === 'fehler'), 'w_P > w_L → Fehler (vorher I_c = 0 still)');

// 2. Mohr-Coulomb: σ₁,f = σ₃·tan²(45° + φ/2) + 2c·tan(45° + φ/2); φ = 30°, c = 10, σ₃ = 50 → 150 + 34,64 = 184,64 kN/m²
const m = mohrCoulomb(10, 30, 150, 50);
pruefe(nahe(m.sigma1_f, 184.64, 1e-4) && !m.isFailing, `σ1,f ${m.sigma1_f}`);
// Konsistenz: genau im Grenzzustand ist die Ausnutzung 1
pruefe(nahe(mohrCoulomb(10, 30, m.sigma1_f, 50).ausnutzung, 1, 1e-9), 'Grenzkreis berührt die Bruchgerade');
pruefe(mohrCoulomb(10, 30, 40, 50).hinweise.some(x => x.stufe === 'fehler'), 'σ1 < σ3 → Fehler');

// 3. Rankine φ = 30°: K_a = 1/3, K_p = 3, K_0 = 0,5; γ = 20, h = 5 → E_a = 0,5·20·25/3 = 83,33 kN/m
const e = erddruckRankine(30, 20, 5);
pruefe(nahe(e.k_a, 1 / 3, 1e-12) && nahe(e.k_p, 3, 1e-12) && nahe(e.k_0, 0.5, 1e-12) && nahe(e.E_a, 83.333, 1e-4), 'Rankine');

// 4. Konsolidierung: Terzaghi-Tabellenwerte U(T_v): 0,197 → 50 %; 0,848 → 90 %; 0,0491 → 25 %
pruefe(nahe(konsolidierungsgrad(0.197), 0.5, 0.005) && nahe(konsolidierungsgrad(0.848), 0.9, 0.003) && nahe(konsolidierungsgrad(0.0491), 0.25, 0.005), 'U(T_v)');
// h = 4 m zweiseitig, Δσ = 50, E_s = 5 MN/m², c_v = 2 m²/a → s = 40 mm; t_50 = 0,197·4/2 = 0,394 a
const k = konsolidierung(4, 50, 5, 2, 'zweiseitig');
pruefe(nahe(k.s_end, 40, 1e-12) && nahe(k.t_50, 0.394, 1e-9) && k.kurve.length === 51, 'Setzung');
// vorher Endlosschleife möglich bei c_v = 0 oder h = 0 → jetzt Fehler und leere Kurve
for (const [h, cv] of [[0, 2], [4, 0], [4, -1]]) { const r = konsolidierung(h, 50, 5, cv, 'einseitig'); pruefe(r.kurve.length === 0 && r.hinweise.some(x => x.stufe === 'fehler'), `h=${h}, cv=${cv}`); }

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Boden');
