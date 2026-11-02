// Rechenkern Durchstanzen (Umsetzungsplan Phase 4, AP 4.3)
import { bemesseDurchstanzen, type DurchstanzEingabe } from '../src/calc/durchstanzen';
import { keinErgebnis, zahlenPassen } from './hilfen/keinErgebnis';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
console.log('--- Test: Durchstanzen ---');

const basis: DurchstanzEingabe = { form: 'rund', vEd: 500, d: 200, c: 400, cx: 400, cy: 400, fck: 30, rhoL: 0.01, beta: 1.1 };

// 1. Handrechnung Innenstütze rund, c = 400 mm, d = 200 mm, C30/37, ρ_l = 1,0 %, V_Ed = 500 kN, β = 1,10
//    u0 = π·400 = 1256,6 mm; u0/d = 6,28 ≥ 4 → C_Rd,c = 0,18/1,5 = 0,12
//    u1 = π·(400 + 4·200) = 3769,9 mm; v_Ed = 1,1·500 000/(3769,9·200) = 0,7294 N/mm²
//    k = 1 + √(200/200) = 2,0; v_Rd,c = 0,12·2·(100·0,01·30)^(1/3) = 0,7457 N/mm²
//    v_min = 0,035·2^1,5·√30 = 0,5422 → nicht maßgebend; v_Ed < v_Rd,c → ohne Durchstanzbewehrung
const r = bemesseDurchstanzen(basis);
pruefe(nahe(r.u1, 3769.9, 1e-4), `u1 ${r.u1}`);
pruefe(nahe(r.vEd_stress, 0.7294, 1e-3), `v_Ed ${r.vEd_stress}`);
pruefe(nahe(r.vRdc, 0.7457, 1e-3), `v_Rd,c ${r.vRdc}`);
pruefe(!r.needsReinforcement && r.CRdc === 0.12, 'ohne Bewehrung, C_Rd,c = 0,12');

// 2. Kleine Stütze: u0/d < 4 → C_Rd,c abgemindert. c = 200 mm, d = 250 mm: u0/d = 2,513 → 0,12·(0,2513 + 0,6) = 0,1022
const rk = bemesseDurchstanzen({ ...basis, c: 200, d: 250 });
pruefe(nahe(rk.CRdc, 0.12 * (0.1 * Math.PI * 200 / 250 + 0.6), 1e-12), `C_Rd,c ${rk.CRdc}`);
// … die Abminderung gilt nach NA DE 6.4.4(1) nur für Innenstützen: Rand-/Eckstütze → C_Rd,c = 0,18/1,5 = 0,12
const rkRand = bemesseDurchstanzen({ ...basis, c: 200, d: 250, beta: 1.4, lage: 'rand' });
pruefe(rkRand.CRdc === 0.12 && rkRand.hinweise.some(x => x.feld === 'lage'), `C_Rd,c Randstütze ${rkRand.CRdc}`);
pruefe(bemesseDurchstanzen({ ...basis, c: 200, d: 250, beta: 1.5, lage: 'ecke' }).CRdc === 0.12, 'C_Rd,c Eckstütze');
pruefe(nahe(bemesseDurchstanzen({ ...basis, c: 200, d: 250, lage: 'innen' }).CRdc, rk.CRdc, 1e-12), 'C_Rd,c Innenstütze explizit');
// Rechteckstütze: u1 = 2(cx + cy) + 4πd
pruefe(nahe(bemesseDurchstanzen({ ...basis, form: 'rechteckig', cx: 300, cy: 500 }).u1, 1600 + 800 * Math.PI, 1e-12), 'u1 rechteckig');

// 2b. Rand- und Eckstützen (Entscheidung P-2, 28.10.2026): u₁ nach EC2 Bild 6.15, β nach NA DE 6.4.3(6).
//     Handrechnung im eigenen Skript (Abschnittslängen einzeln aufsummiert), d = 200 mm, C30/37, ρ_l = 1 %:
//     R1 Rand rechteckig 400/400 bündig, V = 300 kN: u₁ = 400 + 2·400 + 2·π·200 = 2456,6 mm; v_Ed = 1,4·300 000/(2456,6·200) = 0,8548
//        → v_Rd,c = 0,7457 < v_Ed < 1,044 → A_sw = (0,8548 − 0,75·0,7457)·2456,6·200/600 = 242,0 mm²
const r1 = bemesseDurchstanzen({ ...basis, form: 'rechteckig', lage: 'rand', beta: undefined, vEd: 300 });
pruefe(nahe(r1.u1, 2456.6, 1e-4) && r1.beta === 1.4, `R1 u1 ${r1.u1}, β ${r1.beta}`);
pruefe(nahe(r1.vEd_stress, 0.8548, 1e-3) && nahe(r1.asw_req_ring, 242.0, 2e-3), `R1 v_Ed ${r1.vEd_stress}, A_sw ${r1.asw_req_ring}`);
pruefe(nahe(r1.u1Voll, 1600 + 800 * Math.PI, 1e-12), 'R1 voller Rundschnitt zum Vergleich');
//     R2 Rand rund c = 400, a = 100 mm: u₁ = π·(200 + 400) + 2·(100 + 200) = 2485,0 mm; v_Ed = 0,8451
const r2 = bemesseDurchstanzen({ ...basis, lage: 'rand', beta: undefined, aRand: 100, vEd: 300 });
pruefe(nahe(r2.u1, 2485.0, 1e-4) && nahe(r2.vEd_stress, 0.8451, 1e-3), `R2 u1 ${r2.u1}, v_Ed ${r2.vEd_stress}`);
//     E1 Ecke rund c = 400 bündig, V = 200 kN: u₁ = π/2·600 + 2·200 = 1342,5 mm; v_Ed = 1,5·200 000/(1342,5·200) = 1,1173 > v_Rd,max
const e1 = bemesseDurchstanzen({ ...basis, lage: 'ecke', beta: undefined, vEd: 200 });
pruefe(nahe(e1.u1, 1342.5, 1e-4) && e1.beta === 1.5 && e1.isOverloaded, `E1 u1 ${e1.u1}`);
//     E2 Ecke rechteckig 300/500 bündig: u₁ = 300 + 500 + π·200 = 1428,3 mm; u₀ = min(3d; c_x + c_y) = 600 mm
const e2 = bemesseDurchstanzen({ ...basis, form: 'rechteckig', cx: 300, cy: 500, lage: 'ecke', beta: undefined, vEd: 200 });
pruefe(nahe(e2.u1, 1428.3, 1e-4) && nahe(e2.u0, 600, 1e-12) && nahe(e2.vEd_stress, 1.0502, 1e-3), `E2 u1 ${e2.u1}, u0 ${e2.u0}`);
//     großer Randabstand: der volle Rundschnitt ist kürzer und damit maßgebend (6.4.2(4))
const rWeit = bemesseDurchstanzen({ ...basis, lage: 'rand', beta: undefined, aRand: 2000 });
pruefe(nahe(rWeit.u1, rWeit.u1Voll, 1e-12), 'voller Rundschnitt bei großem Randabstand');
//     ausdrücklich angegebenes β hat Vorrang
pruefe(bemesseDurchstanzen({ ...basis, lage: 'rand', beta: 1.2 }).beta === 1.2, 'β-Vorgabe');
pruefe(bemesseDurchstanzen({ ...basis, lage: 'rand', aRand: -5 }).hinweise.some(x => x.stufe === 'fehler'), 'negativer Randabstand');

// 3. Bewehrungsbereich: V_Ed = 650 kN → v_Ed = 0,9483 > v_Rd,c, < 1,4·v_Rd,c = 1,044
//    A_sw je Reihe = (0,9483 − 0,75·0,7457)·3769,9·200/(2·300) = 489,6 mm²  (f_ywd,ef = 250 + 0,25·200 = 300)
const rb = bemesseDurchstanzen({ ...basis, vEd: 650 });
pruefe(rb.needsReinforcement && !rb.isOverloaded, 'Bewehrung erforderlich');
pruefe(nahe(rb.asw_req_ring, (1.1 * 650000 / (3769.91 * 200) - 0.75 * 0.74573) * 3769.91 * 200 / 600, 2e-3), `A_sw ${rb.asw_req_ring}`);
pruefe(rb.hinweise.some(x => x.feld === 'asw'), 'Hinweis κ_sw');
// Überlastung
pruefe(bemesseDurchstanzen({ ...basis, vEd: 900 }).isOverloaded, 'v_Rd,max überschritten');
// ρ_l-Begrenzung 0,5·f_cd/f_yd = 0,5·17/434,8 = 0,01955
pruefe(nahe(bemesseDurchstanzen({ ...basis, rhoL: 0.03 }).rhoL_eff, 0.5 * 17 / (500 / 1.15), 1e-12), 'ρ_l-Grenze');

// 4. Unsinnige Eingaben
for (const u of [{ d: 0 }, { c: 0 }, { vEd: -5 }, { fck: 0 }, { rhoL: -0.01 }, { beta: 0.5 }, { d: NaN }] as Partial<DurchstanzEingabe>[]) {
  const ru = bemesseDurchstanzen({ ...basis, ...u });
  pruefe(keinErgebnis([ru.vRdc, ru.vEd_stress, ru.asw_req_ring]) && ru.hinweise.some(x => x.stufe === 'fehler'), JSON.stringify(u));
}
let seed = 11;
const z = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
for (let i = 0; i < 1000; i++) {
  const ru = bemesseDurchstanzen({ form: i % 2 ? 'rund' : 'rechteckig', vEd: z(-100, 5000), d: z(-10, 1000), c: z(-10, 1200), cx: z(-10, 1200), cy: z(-10, 1200), fck: z(-5, 90), rhoL: z(-0.01, 0.05), beta: i % 4 ? z(0, 2) : undefined, lage: (['innen', 'rand', 'ecke'] as const)[i % 3], aRand: z(-50, 1500) });
  if (!zahlenPassen(ru, [ru.vRdc, ru.vEd_stress, ru.asw_req_ring, ru.vRdMax, ru.u1])) { pruefe(false, `Fuzz ${i}`); break; }
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Durchstanzen');
