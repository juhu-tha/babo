// Rechenkern Querkraftbemessung (Umsetzungsplan Phase 4, AP 4.3)
import { bemesseQuerkraft, kappa1Vmin, zMaxNA, QUERKRAFT_CVL_STANDARD, type QuerkraftEingabe } from '../src/calc/querkraft';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
console.log('--- Test: Querkraft ---');

const basis: QuerkraftEingabe = { b: 30, h: 50, d1: 5, fck: 30, bewehrung: 'Stahl', fyk: 500, ftk: 3000, gammaFRP: 1.3, asl: 6, vEd: 250, theta: 40 };

// 1. Handrechnung (DIN EN 1992-1-1 + NA DE, 6.2): b/d = 30/45 cm, C30/37, B500, V_Ed = 250 kN, θ = 40°
//    Hebelarm nach NA DE, NCI zu 6.2.3(1) (Prüfamt-Tipp 15/04, LBV Brandenburg), c_v,l = 3,5 cm (Standard):
//    z = min(0,9·45 = 40,5; max(45 − 3,5 − 3 = 38,5; 45 − 7 = 38,0)) = 38,5 cm (maßgebend d − c_v,l − 30 mm)
//    cot 40° = 1,1918; f_yd = 434,8 N/mm²
//    a_sw = 0,250 / (0,385 · 434,8 · 1,1918) = 12,53 cm²/m
//    V_Rd,max = 0,30·0,385·0,75·17,0 / (tan 40° + cot 40°) = 725,1 kN   (ν1 = 0,75·min(1; 1,1 − 30/500))
//    V_Rd,c (ohne z): k = 1,667; ρ_l = 6/(30·45) = 0,444 %; 0,10·1,667·(100·0,00444·30)^(1/3)·0,135 = 53,4 kN
//            v_min = 0,0525/1,5·1,667^1,5·√30 = 0,4125 N/mm² → 55,7 kN maßgebend
const r = bemesseQuerkraft(basis);
pruefe(nahe(r.z, 38.5, 1e-12) && r.zMassgebend === 'd − c_v,l − 30 mm' && r.cvl === QUERKRAFT_CVL_STANDARD && QUERKRAFT_CVL_STANDARD === 3.5, `z ${r.z} ${r.zMassgebend}`);
pruefe(nahe(r.z09d, 40.5, 1e-12) && nahe(r.zMaxNA, 38.5, 1e-12), 'z-Zwischenwerte');
pruefe(nahe(r.asw_req, 12.53, 2e-3), `a_sw ${r.asw_req}`);
pruefe(nahe(r.vRd_max, 725.1, 1e-3), `V_Rd,max ${r.vRd_max}`);
pruefe(nahe(r.vRd_c, 55.69, 2e-3), `V_Rd,c ${r.vRd_c}`);
pruefe(r.isVRdcExceeded && !r.isVRdMaxExceeded && r.asw_final === r.asw_req, 'Bügel erforderlich, Druckstrebe ok');
// ρ_w,min = 0,16·2,9/500 = 0,000928 → a_sw,min = 2,78 cm²/m
pruefe(nahe(r.asw_min, 0.16 * 2.9 / 500 * 0.30 * 1e4, 1e-6), `a_sw,min ${r.asw_min}`);

// 2. Grenzen und Identitäten
// θ = 45°: V_Rd,max = b·z·ν1·f_cd / 2
const r45 = bemesseQuerkraft({ ...basis, theta: 45 });
pruefe(nahe(r45.vRd_max, 0.30 * 0.385 * 0.75 * 17 / 2 * 1000, 1e-9), 'V_Rd,max bei 45°');
// κ1-Interpolation NA DE
pruefe(kappa1Vmin(600) === 0.0525 && kappa1Vmin(800) === 0.0375 && nahe(kappa1Vmin(700), 0.045, 1e-12), 'κ1 für v_min');
// große Längsbewehrung: ρ_l auf 2 % begrenzt
const rr = bemesseQuerkraft({ ...basis, asl: 100 });
pruefe(nahe(rr.vRd_c, 0.1 * (1 + Math.sqrt(200 / 450)) * Math.cbrt(100 * 0.02 * 30) * 0.135 * 1000, 1e-9), 'ρ_l ≤ 0,02');
// Kleine Querkraft: nur Mindestbewehrung
const rk = bemesseQuerkraft({ ...basis, vEd: 40 });
pruefe(!rk.isVRdcExceeded && rk.asw_final === rk.asw_min, 'nur Mindestbügel');
// Flaches θ bei hoher Querkraft → Hinweis aus (6.7aDE)
const rf = bemesseQuerkraft({ ...basis, theta: 18.5, vEd: 600 });
pruefe(rf.hinweise.some(x => x.feld === 'cotTheta'), 'cot θ-Grenze');
// … und es wird mit cot θ,max gerechnet (nicht mit dem gewählten flacheren Winkel):
//    V_Rd,cc = 0,5·0,48·30^(1/3)·0,30·0,385 = 0,0861 MN → cot θ,max = 1,2/(1 − 86,1/600) = 1,401
//    a_sw = 0,600/(0,385·434,8·1,401) = 25,58 cm²/m
pruefe(rf.cot_theta_eff === rf.cot_theta_max && rf.cot_theta > rf.cot_theta_max, 'cot θ auf cot θ,max begrenzt');
pruefe(nahe(rf.cot_theta_max, 1.401, 2e-3), `cot θ,max ${rf.cot_theta_max}`);
pruefe(nahe(rf.asw_req, 25.58, 3e-3), `a_sw begrenzt ${rf.asw_req}`);
pruefe(nahe(rf.vRd_max, 0.30 * 0.385 * 0.75 * 17 / (1 / rf.cot_theta_max + rf.cot_theta_max) * 1000, 1e-9), 'V_Rd,max mit cot θ,max');
// innerhalb der Grenze bleibt der gewählte Winkel maßgebend
pruefe(r.cot_theta_eff === r.cot_theta, 'cot θ unverändert, wenn zulässig');
// V_Rd,max überschritten
pruefe(bemesseQuerkraft({ ...basis, vEd: 900 }).isVRdMaxExceeded, 'V_Rd,max überschritten');

// 2b. Hebelarm nach NA DE, NCI zu 6.2.3(1): z = min(0,9·d; max(d − c_v,l − 3 cm; d − 2·c_v,l))
pruefe(zMaxNA(45, 3.5) === 38.5 && zMaxNA(45, 2) === 41 && zMaxNA(100, 4) === 93, 'z_max nach NA');
// c_v,l = 2 cm: z_max = 41 > 40,5 → 0,9·d maßgebend (bisheriger Wert a_sw = 11,91 cm²/m)
const r2 = bemesseQuerkraft({ ...basis, cvl: 2 });
pruefe(nahe(r2.z, 40.5, 1e-12) && r2.zMassgebend === '0,9·d' && nahe(r2.asw_req, 11.91, 2e-3), `0,9·d maßgebend ${r2.z} ${r2.asw_req}`);
// c_v,l = 2,5 cm: max(39,5; 40,0) = 40,0 < 40,5 → d − 2·c_v,l maßgebend
const r25 = bemesseQuerkraft({ ...basis, cvl: 2.5 });
pruefe(nahe(r25.z, 40, 1e-12) && r25.zMassgebend === 'd − 2·c_v,l', `d − 2·c_v,l maßgebend ${r25.z}`);
// c_v,l = 5 cm: max(37; 35) = 37 cm
pruefe(nahe(bemesseQuerkraft({ ...basis, cvl: 5 }).z, 37, 1e-12), 'c_v,l = 5 cm');
// ohne Angabe = Standard 3,5 cm
pruefe(bemesseQuerkraft({ ...basis, cvl: 3.5 }).asw_req === r.asw_req, 'Standard c_v,l = 3,5 cm');
// großer Querschnitt: d = 145 cm → z_max = 138,5 > 130,5 → 0,9·d
const rg = bemesseQuerkraft({ ...basis, h: 150 });
pruefe(nahe(rg.z, 130.5, 1e-12) && rg.zMassgebend === '0,9·d', 'großes d: 0,9·d');
pruefe(!r.hinweise.some(x => x.feld === 'z'), 'kein Warnhinweis mehr zu z (Grenze ist eingerechnet)');
pruefe(bemesseQuerkraft({ ...basis, cvl: 0 }).hinweise.some(x => x.stufe === 'fehler' && x.feld === 'cvl') && bemesseQuerkraft({ ...basis, cvl: 50 }).hinweise.some(x => x.feld === 'cvl'), 'c_v,l unzulässig');
// d = 5 cm, c_v,l = 4 cm: max(−2; −3) < 0 → Fehler statt negativem z
pruefe(bemesseQuerkraft({ ...basis, h: 10, cvl: 4 }).hinweise.some(x => x.stufe === 'fehler' && x.feld === 'cvl'), 'kein positiver Hebelarm');

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
    fyk: z(-5, 700), ftk: z(-5, 2000), gammaFRP: z(-1, 2), asl: z(-5, 80), vEd: z(-100, 3000), theta: z(-10, 100), cvl: i % 3 === 0 ? undefined : z(-1, 10) };
  const ru = bemesseQuerkraft(e);
  if (![ru.asw_final, ru.vRd_c, ru.vRd_max, ru.cot_theta_max, ru.z].every(Number.isFinite) || ru.z < 0) { pruefe(false, `Fuzz ${JSON.stringify(e)}`); break; }
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Querkraft');
