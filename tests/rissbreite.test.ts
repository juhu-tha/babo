// Rechenkern Rissbreite (Umsetzungsplan Phase 4, AP 4.3)
import { bemesseRiss, xZustandII, type RissEingabe } from '../src/calc/rissbreite';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
console.log('--- Test: Rissbreite ---');

const basis: RissEingabe = { h: 200, b: 1000, cNom: 35, phi: 16, abstand: 20, sigmaS: 250, fctEff: 2.9, ecm: 33000, beanspruchung: 'biegung', zwangNach28d: false, kt: 0.4, wkReq: 0.3 };

// 1. Handrechnung Platte h = 200 mm, φ 16/20 cm (a_s = 1005 mm²/m), c_nom = 35 mm, σ_s = 250 N/mm², C30/37, k_t = 0,4
//    d = 157 mm; α_e = 6,06; ρ = 0,00640; x = α_e·ρ·d·(−1 + √(1 + 2/(α_e·ρ))) = 38,07 mm
//    h_c,ef = min(2,5·43; (200 − 38,07)/3; 100) = 53,98 mm → ρ_p,eff = 1005/53 977 = 0,01862
//    s_r,max = min(16/(3,6·0,01862); 250·16/(3,6·2,9)) = min(238,6; 383,1) = 238,6 mm
//    ε_sm − ε_cm = (250 − 0,4·2,9/0,01862·(1 + 6,06·0,01862))/200 000 = 0,903 ‰ ≥ 0,6·250/200 000 = 0,75 ‰
//    w_k = 238,6·0,000903 = 0,216 mm ≤ 0,3 mm
const r = bemesseRiss(basis);
pruefe(nahe(r.x, 38.07, 1e-3), `x ${r.x}`);
pruefe(nahe(r.hcEf, 53.98, 1e-3), `h_c,ef ${r.hcEf}`);
pruefe(nahe(r.srMax, 238.6, 1e-3), `s_r,max ${r.srMax}`);
pruefe(nahe(r.wkCalc, 0.2156, 2e-3) && r.isOk, `w_k ${r.wkCalc}`);
// Mindestbewehrung (7.1): 0,4·0,8·2,9·(1000·200/2)/250 = 371,2 mm²/m
pruefe(nahe(r.asMinReq, 371.2, 1e-9), `A_s,min ${r.asMinReq}`);

// 2. Identitäten
// Zustand II: Gleichgewicht b·x²/2 = α_e·A_s·(d − x)
const xx = xZustandII(6, 0.008, 300);
pruefe(nahe(xx * xx / 2, 6 * 0.008 * 300 * (300 - xx), 1e-9), 'Zustand II');
// Kleine Spannung → Mindestwert 0,6·σ_s/E_s maßgebend
const rk = bemesseRiss({ ...basis, sigmaS: 120 });
pruefe(nahe(rk.epsSmEpsCm, 0.6 * 120 / 200000, 1e-12), 'ε-Mindestwert');
// Zwang nach 28 d: f_ct,eff ≥ 3,0
pruefe(bemesseRiss({ ...basis, zwangNach28d: true }).effectiveFct === 3.0, 'f_ct,eff ≥ 3,0');
// Zentrischer Zug: h_c,ef = min(2,5·(h − d); h/2), k_c = 1,0, A_ct = b·h
const rz = bemesseRiss({ ...basis, beanspruchung: 'zug' });
pruefe(rz.hcEf === 100 && nahe(rz.asMinReq, 1.0 * 0.8 * 2.9 * 200000 / 250, 1e-12), 'zentrischer Zug');
// Größere Stahlspannung → größere Rissbreite (Monotonie)
pruefe(bemesseRiss({ ...basis, sigmaS: 300 }).wkCalc > r.wkCalc, 'Monotonie σ_s');

// 3. Unsinnige Eingaben
for (const u of [{ abstand: 0 }, { phi: 0 }, { cNom: 120 }, { sigmaS: 0 }, { ecm: 0 }, { h: 0 }, { wkReq: 0 }, { h: NaN }] as Partial<RissEingabe>[]) {
  const ru = bemesseRiss({ ...basis, ...u });
  pruefe([ru.wkCalc, ru.srMax, ru.asMinReq].every(Number.isFinite) && ru.hinweise.some(x => x.stufe === 'fehler'), JSON.stringify(u));
}
let seed = 13;
const z = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
for (let i = 0; i < 1000; i++) {
  const ru = bemesseRiss({ h: z(-10, 1200), b: z(-10, 2000), cNom: z(-5, 80), phi: z(-2, 40), abstand: z(-2, 40), sigmaS: z(-50, 600), fctEff: z(-1, 6), ecm: z(-1000, 45000),
    beanspruchung: i % 2 ? 'biegung' : 'zug', zwangNach28d: i % 3 === 0, kt: z(0, 1), wkReq: z(-0.1, 0.5) });
  if (![ru.wkCalc, ru.srMax, ru.asMinReq, ru.x].every(Number.isFinite)) { pruefe(false, `Fuzz ${i}`); break; }
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Rissbreite');
