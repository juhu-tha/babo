// Rechenkern Holzbau EC 5 (Umsetzungsplan Phase 4, AP 4.3)
import { bemesseDruckstab, bemesseQuerdruck, knickbeiwert, KMOD, EULER_BETA, type DruckstabEingabe, holzschraube, KERN_VERHAELTNIS_SCHRAUBE } from '../src/calc/holzbau';
import { keinErgebnis, zahlenPassen } from './hilfen/keinErgebnis';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
console.log('--- Test: Holzbau ---');

// 1. Knickbeiwerte k_c für C24 (f_c,0,k = 21, E_0,05 = 7400, β_c = 0,2), von Hand mit (6.25)–(6.29) gerechnet und
//    auf 0,01 gerundet: λ = 50 → 0,80; λ = 100 → 0,31; λ = 150 → 0,14. Literaturtabelle mit Seitenangabe: TODO (Bibliothek, AP 4.3)
const lrel = (lam: number) => (lam / Math.PI) * Math.sqrt(21 / 7400);
for (const [lam, kc] of [[50, 0.80], [100, 0.31], [150, 0.14]]) {
  const ist = knickbeiwert(lrel(lam), false);
  pruefe(Math.abs(ist - kc) <= 0.006, `k_c(λ=${lam}) = ${ist.toFixed(3)} vs ${kc}`);
}
// Handrechnung λ = 100: λ_rel = 1,6957; k = 0,5·(1 + 0,2·1,3957 + 1,6957²) = 2,0772; k_c = 1/(2,0772 + √(2,0772² − 1,6957²)) = 0,3052
pruefe(nahe(knickbeiwert(lrel(100), false), 0.3052, 1e-3), 'k_c Handrechnung');
pruefe(knickbeiwert(0.3, false) === 1 && knickbeiwert(0.2, true) === 1, 'k_c = 1 für λ_rel ≤ 0,3');
pruefe(knickbeiwert(1.2, true) > knickbeiwert(1.2, false), 'BSH (β_c = 0,1) günstiger');
// 2. Tabellen
pruefe(KMOD[1].mtl === 0.8 && KMOD[3].stnd === 0.5 && KMOD[3].sfs === 0.9, 'k_mod Tab. 3.1');
pruefe(EULER_BETA[1] === 2 && EULER_BETA[2] === 1 && EULER_BETA[3] === 0.7 && EULER_BETA[4] === 0.5, 'Euler-Fälle 1–4');

// 3. Druckstab C24 120/160, l = 3 m, Euler-Fall 2, NKL 1, mittel: f_c,0,d = 0,8·21/1,3 = 12,92 N/mm²
//    λ_z = 3000/(120/√12) = 86,6 → λ_rel = 1,4685 → k_c = 0,3948 → F_c,Rd = 0,3948·19 200·12,92 = 97,9 kN
const basis: DruckstabEingabe = { b: 120, h: 160, laenge: 3, eulerFall: 2, nEd: 50, fc0k: 21, E005: 7400, brettschichtholz: false, nkl: 1, kled: 'mtl' };
const r = bemesseDruckstab(basis);
pruefe(nahe(r.lambda_z, 86.60, 1e-3), `λ ${r.lambda_z}`);
pruefe(nahe(r.F_c_R_d_kN, 0.8 * 21 / 1.3 * 19200 * knickbeiwert((86.6025 / Math.PI) * Math.sqrt(21 / 7400), false) / 1000, 1e-4), `F_c,Rd ${r.F_c_R_d_kN}`);
pruefe(nahe(bemesseDruckstab({ ...basis, eulerFall: 1 }).l_ef, 6000, 1e-12), 'Kragarm l_ef = 2l');

// 4. Querdruck Schwelle C24, b = 100, l = 120 + 2·30: σ = 30 000/18 000 = 1,667; Grenze 1,25·0,8·2,5/1,3 = 1,923
const q = bemesseQuerdruck({ F: 30, b: 100, l: 120, fall: 'schwelle', ueberstand: true, fc90k: 2.5, art: 'nadelvollholz', nkl: 1, kled: 'mtl' });
pruefe(nahe(q.sigma_c90d, 1.6667, 1e-4) && nahe(q.stressLimit, 1.9231, 1e-4) && !q.isUnsafe, 'Querdruck');

// 5. Unsinnige Eingaben und Fuzz
for (const u of [{ b: 0 }, { laenge: 0 }, { nEd: -1 }, { E005: 0 }, { h: NaN }] as Partial<DruckstabEingabe>[]) {
  const ru = bemesseDruckstab({ ...basis, ...u });
  pruefe(keinErgebnis([ru.F_c_R_d_kN, ru.k_cz, ru.utilization]) && ru.hinweise.some(x => x.stufe === 'fehler'), JSON.stringify(u));
}
let seed = 17;
const z = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
for (let i = 0; i < 1000; i++) {
  const ru = bemesseDruckstab({ b: z(-10, 400), h: z(-10, 600), laenge: z(-1, 15), eulerFall: ((i % 4) + 1) as 1 | 2 | 3 | 4, nEd: z(-50, 2000), fc0k: z(-5, 35), E005: z(-100, 12000), brettschichtholz: i % 2 === 0, nkl: ((i % 3) + 1) as 1 | 2 | 3, kled: 'mtl' });
  if (!zahlenPassen(ru, [ru.F_c_R_d_kN, ru.k_cz, ru.utilization, ru.lambda_rel_z])) { pruefe(false, `Fuzz ${i}: ${JSON.stringify(ru)}`); break; }
}

// Holzschraube: Eingabe Kerndurchmesser d₁ (Entscheidung 29.10.2026), d_ef = 1,1·d₁; leer → Lehrwert 0,65·d
{
  const basis = { rhok: 350, d: 8, lef: 80, alpha: 90, n: 4, nkl: 1 as const, kled: 'mtl' as const };
  const leer = holzschraube(basis);
  const lehr = holzschraube({ ...basis, dKern: KERN_VERHAELTNIS_SCHRAUBE * 8 });
  pruefe(Math.abs(leer.d_kern - 5.2) < 1e-12 && Math.abs(leer.d_ef - 5.72) < 1e-12 && leer.lochleibungNach === 'nagel', `Schraube leer: d₁ ${leer.d_kern}, d_ef ${leer.d_ef}`);
  pruefe(leer.F_v_Rk_single_N === lehr.F_v_Rk_single_N, 'Schraube: leer gleich Lehrwert 0,65·d');
  const k56 = holzschraube({ ...basis, dKern: 5.6 });
  pruefe(Math.abs(k56.d_ef - 6.16) < 1e-12 && k56.lochleibungNach === 'bolzen', `Schraube d₁ 5,6: d_ef ${k56.d_ef} → Bolzen`);
  // Handrechnung d_ef 6,16 mm: f_h,k = 0,082·(1 − 0,0616)·350 = 26,93 N/mm²
  pruefe(Math.abs(k56.f_h_k - 0.082 * (1 - 0.0616) * 350) < 1e-9, `Schraube d₁ 5,6: f_h,k ${k56.f_h_k}`);
  pruefe(k56.F_ax_Rk_single_N === leer.F_ax_Rk_single_N, 'Herausziehen unabhängig von d₁');
  pruefe(holzschraube({ ...basis, dKern: 8 }).hinweise.some(h => h.feld === 'dKern' && h.stufe === 'fehler'), 'd₁ ≥ d abgelehnt');
  pruefe(holzschraube({ ...basis, dKern: 4.4 }).hinweise.some(h => h.feld === 'dKern' && h.stufe === 'warnung'), 'd₁/d < 0,6 Warnung');
  pruefe(holzschraube({ ...basis, dKern: NaN }).hinweise.some(h => h.stufe === 'fehler'), 'd₁ NaN abgelehnt');
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Holzbau');
