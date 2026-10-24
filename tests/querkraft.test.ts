// Rechenkern Querkraftbemessung (Umsetzungsplan Phase 4, AP 4.3)
import { bemesseQuerkraft, kappa1Vmin, type QuerkraftEingabe } from '../src/calc/querkraft';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
console.log('--- Test: Querkraft ---');

const basis: QuerkraftEingabe = { b: 30, h: 50, d1: 5, fck: 30, bewehrung: 'Stahl', fyk: 500, ftk: 3000, gammaFRP: 1.3, asl: 6, vEd: 250, theta: 40 };

// 1. Handrechnung (DIN EN 1992-1-1 + NA DE, 6.2): b/d = 30/45 cm, C30/37, B500, V_Ed = 250 kN, θ = 40°
//    z = 0,9·0,45 = 0,405 m; cot 40° = 1,1918; f_yd = 434,8 N/mm²
//    a_sw = 0,250 / (0,405 · 434,8 · 1,1918) = 11,91 cm²/m
//    V_Rd,max = 0,30·0,405·0,75·17,0 / (tan 40° + cot 40°) = 762,8 kN   (ν1 = 0,75·min(1; 1,1 − 30/500))
//    V_Rd,c: k = 1,667; ρ_l = 6/(30·45) = 0,444 %; 0,10·1,667·(100·0,00444·30)^(1/3)·0,135 = 53,4 kN
//            v_min = 0,0525/1,5·1,667^1,5·√30 = 0,4125 N/mm² → 55,7 kN maßgebend
const r = bemesseQuerkraft(basis);
pruefe(nahe(r.asw_req, 11.91, 2e-3), `a_sw ${r.asw_req}`);
pruefe(nahe(r.vRd_max, 762.8, 1e-3), `V_Rd,max ${r.vRd_max}`);
pruefe(nahe(r.vRd_c, 55.69, 2e-3), `V_Rd,c ${r.vRd_c}`);
pruefe(r.isVRdcExceeded && !r.isVRdMaxExceeded && r.asw_final === r.asw_req, 'Bügel erforderlich, Druckstrebe ok');
// ρ_w,min = 0,16·2,9/500 = 0,000928 → a_sw,min = 2,78 cm²/m
pruefe(nahe(r.asw_min, 0.16 * 2.9 / 500 * 0.30 * 1e4, 1e-6), `a_sw,min ${r.asw_min}`);

// 2. Grenzen und Identitäten
// θ = 45°: V_Rd,max = b·z·ν1·f_cd / 2
const r45 = bemesseQuerkraft({ ...basis, theta: 45 });
pruefe(nahe(r45.vRd_max, 0.30 * 0.405 * 0.75 * 17 / 2 * 1000, 1e-9), 'V_Rd,max bei 45°');
// κ1-Interpolation NA DE
pruefe(kappa1Vmin(600) === 0.0525 && kappa1Vmin(800) === 0.0375 && nahe(kappa1Vmin(700), 0.045, 1e-12), 'κ1 für v_min');
// große Längsbewehrung: ρ_l auf 2 % begrenzt
const rr = bemesseQuerkraft({ ...basis, asl: 100 });
pruefe(nahe(rr.vRd_c, 0.1 * (1 + Math.sqrt(200 / 450)) * Math.cbrt(100 * 0.02 * 30) * 0.135 * 1000, 1e-9), 'ρ_l ≤ 0,02');
// Kleine Querkraft: nur Mindestbewehrung
const rk = bemesseQuerkraft({ ...basis, vEd: 40 });
pruefe(!rk.isVRdcExceeded && rk.asw_final === rk.asw_min, 'nur Mindestbügel');
// Flaches θ bei hoher Querkraft → Hinweis aus (6.7aDE)
pruefe(bemesseQuerkraft({ ...basis, theta: 18.5, vEd: 600 }).hinweise.some(x => x.feld === 'cotTheta'), 'cot θ-Grenze');
// V_Rd,max überschritten
pruefe(bemesseQuerkraft({ ...basis, vEd: 900 }).isVRdMaxExceeded, 'V_Rd,max überschritten');

// 3. Unsinnige Eingaben
for (const u of [{ d1: 50 }, { b: 0 }, { h: -1 }, { fck: 0 }, { theta: 0 }, { theta: 90 }, { vEd: -1 }, { asl: -1 }, { vEd: NaN }] as Partial<QuerkraftEingabe>[]) {
  const ru = bemesseQuerkraft({ ...basis, ...u });
  pruefe([ru.asw_final, ru.vRd_c, ru.vRd_max].every(Number.isFinite) && ru.hinweise.some(x => x.stufe === 'fehler'), `${JSON.stringify(u)}`);
}
// 4. Fuzz
let seed = 7;
const z = (a: number, b: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (b - a) * (seed / 2147483648); };
for (let i = 0; i < 1000; i++) {
  const e: QuerkraftEingabe = { b: z(-5, 100), h: z(-5, 150), d1: z(-2, 30), fck: z(-5, 100), bewehrung: (['Stahl', 'GFK'] as const)[i % 2],
    fyk: z(-5, 700), ftk: z(-5, 2000), gammaFRP: z(-1, 2), asl: z(-5, 80), vEd: z(-100, 3000), theta: z(-10, 100) };
  const ru = bemesseQuerkraft(e);
  if (![ru.asw_final, ru.vRd_c, ru.vRd_max, ru.cot_theta_max].every(Number.isFinite)) { pruefe(false, `Fuzz ${JSON.stringify(e)}`); break; }
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Querkraft');
