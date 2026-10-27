// Zentraler Bemessungswert f_cd (src/data/kennwerte.ts), Entscheidung Prof. Huber 27.10.:
// f_cd = α_cc·f_ck/γ_c mit α_cc = 0,85 (DIN EN 1992-1-1/NA, NDP zu 3.1.6(1)P), γ_c = 1,5 bzw. 1,3 (außergewöhnlich, Tab. 2.1DE);
// ab C55/67 zusätzlich · (1,1 − f_ck/500), d. h. γ_c' = 1/(1,1 − f_ck/500) wie DIN 1045-1:2008, 5.3.3(9) – vorläufig, F-Freigabe.
import { fcdBeton, hochfestFaktor, fcdHochfestHinweis, FCD_HOCHFEST_AKTIV, ALPHA_CC, GAMMA_C } from '../src/data/kennwerte';
import { bemesseBiegung } from '../src/calc/biegung';
import { bemesseQuerkraft, type QuerkraftEingabe } from '../src/calc/querkraft';
import { bemesseStuetze, type StuetzeEingabe } from '../src/calc/stuetze';
import { bemesseDurchstanzen, type DurchstanzEingabe } from '../src/calc/durchstanzen';
import { betonSdParameter } from '../src/calc/werkstoffmodelle';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol = 1e-9) => Math.abs(ist - soll) <= tol * Math.max(1, Math.abs(soll));
console.log('--- Test: f_cd zentral ---');

// 1. Handrechnungen
pruefe(ALPHA_CC === 0.85 && GAMMA_C.staendig === 1.5 && GAMMA_C.aussergewoehnlich === 1.3 && typeof FCD_HOCHFEST_AKTIV === 'boolean', 'Konstanten');
const HF = (fck: number) => (FCD_HOCHFEST_AKTIV ? hochfestFaktor(fck) : 1);
pruefe(nahe(fcdBeton(30), 17.0), 'C30/37: 0,85·30/1,5 = 17,0');
pruefe(nahe(fcdBeton(30, { gammaC: GAMMA_C.aussergewoehnlich }), 0.85 * 30 / 1.3), 'C30/37 außergewöhnlich: 0,85·30/1,3 = 19,62');
pruefe(nahe(fcdBeton(50), 0.85 * 50 / 1.5) && hochfestFaktor(50) === 1 && fcdHochfestHinweis(50) === null, 'C50/60: keine Abminderung');
//    C55/67: 1,1 − 55/500 = 0,99 → f_cd = 31,167·0,99 = 30,855
pruefe(nahe(hochfestFaktor(55), 0.99) && nahe(fcdBeton(55, { hochfest: true }), 0.85 * 55 / 1.5 * 0.99) && nahe(fcdBeton(55), 0.85 * 55 / 1.5 * HF(55)), 'C55/67: Faktor 0,99');
//    C70/85: 0,96 → 38,08; C100/115: 0,90 → 51,0
pruefe(nahe(fcdBeton(70, { hochfest: true }), 38.08, 1e-12) && nahe(fcdBeton(100, { hochfest: true }), 0.85 * 100 / 1.5 * 0.9) && nahe(fcdBeton(70), 0.85 * 70 / 1.5 * HF(70)), 'C70/85 und C100/115');
pruefe(nahe(fcdBeton(70, { hochfest: false }), 0.85 * 70 / 1.5), 'Abminderung abschaltbar');
pruefe(FCD_HOCHFEST_AKTIV ? /vorläufig, F-Freigabe/.test(fcdHochfestHinweis(70) ?? '') : fcdHochfestHinweis(70) === null, 'Hinweis vorläufig bzw. aus');

// 2. Kerne
const qb: QuerkraftEingabe = { b: 30, h: 50, d1: 5, fck: 70, bewehrung: 'Stahl', fyk: 500, ftk: 3000, gammaFRP: 1.3, asl: 6, vEd: 250, theta: 40 };
const q = bemesseQuerkraft(qb);
//    V_Rd,max NA DE: ν1 = 0,75·(1,1 − 70/500) = 0,72 mit f_cd ohne Zusatzabminderung (keine Doppelabminderung)
const th = 40 * Math.PI / 180;
pruefe(nahe(q.fcd, 0.85 * 70 / 1.5 * HF(70), 1e-12) && nahe(q.vRd_max, 0.30 * 0.405 * 0.72 * (0.85 * 70 / 1.5) / (Math.tan(th) + 1 / Math.tan(th)) * 1000, 1e-9), `Querkraft C70: V_Rd,max ${q.vRd_max}`);
pruefe(!FCD_HOCHFEST_AKTIV || q.hinweise.some(h => /ν₁ = 0,75·ν₂/.test(h.text)), 'Querkraft: Hinweis');
const sb: StuetzeEingabe = { b: 30, h: 30, d1: 4, l0: 3, nEd: 2000, mEd: 50, fck: 70, fyk: 500 };
const s70 = bemesseStuetze(sb);
pruefe(nahe(Math.abs(s70.nu_Ed), 2 / (0.3 * 0.3 * 0.85 * 70 / 1.5 * HF(70))) && (!FCD_HOCHFEST_AKTIV || s70.hinweise.some(h => /1,1 − f_ck\/500/.test(h.text))), `Stütze C70: ν_Ed ${s70.nu_Ed}`);
//    Durchstanzen: f_cd nur in ρ_l ≤ 0,5·f_cd/f_yd (NA DE 6.4.4(1)); C12/15: 0,5·6,8/434,78 = 0,00782
const db: DurchstanzEingabe = { form: 'rund', vEd: 500, d: 200, c: 400, cx: 400, cy: 400, fck: 12, rhoL: 0.01, beta: 1.1 };
pruefe(nahe(bemesseDurchstanzen(db).rhoL_eff, 0.5 * fcdBeton(12) / (500 / 1.15)), 'Durchstanzen ρ_l,eff mit zentralem f_cd');
pruefe(nahe(betonSdParameter(70).fcd, 0.85 * 70 / 1.5 * HF(70), 1e-12) && nahe(betonSdParameter(30).fcd, 17), 'Werkstoffmodelle');
pruefe(nahe(bemesseBiegung({ b: 30, h: 50, d1: 5, d2: 5, fck: 30, fyk: 500, med: 150, bewehrung: 'Stahl', ftk: 1000, gammaFRP: 1.3 } as Parameters<typeof bemesseBiegung>[0]).fcd, 17), 'Biegung C30 unverändert');

// 3. Fuzz: 1 000 Zufallswerte → endlich, monoton nicht größer als ohne Abminderung, Faktor in [0,9; 1]
let z = 2710;
const rnd = () => { z = (z * 1103515245 + 12345) % 2147483648; return z / 2147483648; };
for (let k = 0; k < 1000; k++) {
  const fck = rnd() * 110;
  const f = fcdBeton(fck), f0 = fcdBeton(fck, { hochfest: false });
  pruefe(Number.isFinite(f) && f <= f0 + 1e-12 && hochfestFaktor(fck) <= 1 && hochfestFaktor(fck) >= 0.878, `Fuzz ${fck}`);
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: f_cd zentral');
