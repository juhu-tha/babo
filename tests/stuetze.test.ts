// Rechenkern Stützenbemessung (Umsetzungsplan Phase 4, AP 4.3)
import { bemesseStuetze, interaktionskurve, muGrenze, type StuetzeEingabe } from '../src/calc/stuetze';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
console.log('--- Test: Stütze ---');

const fcd = 0.85 * 30 / 1.5, fyd = 500 / 1.15;

// 1. Endpunkte der Interaktionskurve (exakt): reiner Zug ν = ω; reiner Druck mit ε = 2 ‰ → σ_s = 400 N/mm²
const k = interaktionskurve(0.6, 0.3, 0.3, 0.03, fcd, fyd);
pruefe(k.points[0].y === 0.6, 'reiner Zug');
pruefe(nahe(k.nu_comp, -1 - 0.6 * 400 / fyd, 1e-12), `reiner Druck ${k.nu_comp}`);

// 2. Unabhängige Referenz: Dehnungsverträglichkeit mit Parabel-Rechteck-Diagramm (ε_c2 = 2 ‰, ε_cu2 = 3,5 ‰, n = 2),
//    numerische Integration über die Querschnittshöhe, ε_ud = 25 ‰. Daraus µ_Rd(ν) für ω = 0,2/0,6/1,0 bei
//    ν = −0,2/−0,5/−0,8. Ergebnis: Abweichung ≤ 4,5 % (größte bei ω = 0,2, ν = −0,8), Toleranz 5 %.
function muPR(omega: number, nu: number, d1h = 0.1): number {
  const sc = (e: number) => (e >= 0 ? 0 : e >= -2 ? -(1 - (1 + e / 2) ** 2) : -1); // σ_c/f_cd, Stauchung negativ [‰]
  const ss = (e: number) => Math.max(-1, Math.min(1, (e / 1000) * 200000 / fyd));  // σ_s/f_yd
  const dh = 1 - d1h;
  // Dehnungsebenen ε(y) = et + (eb − et)·y, y von oben in Einheiten von h; Pfad von Zug zu Druck:
  const ebenen: [number, number][] = [];
  const S = 3000;
  for (let i = 0; i <= S; i++) { const et = 25 - 28.5 * i / S; ebenen.push([et, et + (25 - et) / dh]); }          // A: ε_s1 = 25 ‰ fest
  for (let i = 1; i <= S; i++) { const es1 = 25 - 25 * i / S; ebenen.push([-3.5, -3.5 + (es1 + 3.5) / dh]); }       // B: ε_top = −3,5 ‰, ε_s1 → 0
  for (let i = 1; i <= S; i++) { const eh = (-3.5 + (0 + 3.5) / dh) * (1 - i / S); ebenen.push([-3.5, eh]); }        // B': Nulllinie wandert bis Unterkante
  for (let i = 1; i <= S; i++) { const et = -3.5 + 1.5 * i / S; const eb = -2 + (et + 2) * (-(4 / 7) / (3 / 7)); ebenen.push([et, eb]); } // C: Drehpunkt 3/7 h bei −2 ‰
  const nm = ebenen.map(([et, eb]) => {
    let N = 0, M = 0; const n = 400;
    for (let j = 0; j < n; j++) { const y = (j + 0.5) / n; const sgm = sc(et + (eb - et) * y) / n; N += sgm; M += -sgm * (0.5 - y); }
    const e2 = et + (eb - et) * d1h, e1 = et + (eb - et) * dh;
    N += (omega / 2) * (ss(e1) + ss(e2));
    M += (omega / 2) * (ss(e1) - ss(e2)) * (0.5 - d1h);
    return [N, M];
  });
  for (let i = 0; i < nm.length - 1; i++) {
    const [n1, m1] = nm[i], [n2, m2] = nm[i + 1];
    if ((nu - n1) * (nu - n2) <= 0 && n1 !== n2) return Math.abs(m1 + (m2 - m1) * (nu - n1) / (n2 - n1));
  }
  return -1;
}
for (const omega of [0.2, 0.6, 1.0]) {
  const kk = interaktionskurve(omega, 0.3, 0.3, 0.03, fcd, fyd);
  for (const nu of [-0.2, -0.5, -0.8]) {
    const ref = muPR(omega, nu);
    const ist = muGrenze(kk, nu);
    pruefe(ref > 0, `Referenz ω=${omega}, ν=${nu}`);
    if (process.env.ZEIGE) console.log(omega, nu, ist.toFixed(4), ref.toFixed(4));
    if (ref > 0) pruefe(nahe(ist, ref, 0.05), `ω=${omega}, ν=${nu}: Block ${ist.toFixed(3)} vs. Parabel-Rechteck ${ref.toFixed(3)}`);
  }
}

// 3. Handrechnung Bemessungsmoment: b = h = 30 cm, l0 = 3 m, N = 1000 kN, M = 50 kNm
//    e_i = 3/400 = 7,5 mm → M_0 + N·e_i = 57,5 kNm; N·e_0 = 1000·0,02 = 20 kNm → M_Ed = 57,5 kNm
//    λ = 3,0/(0,3/√12) = 34,6; n = 1,0/(0,09·17) = 0,654 ≥ 0,41 → λ_lim = 25 → Theorie II. Ordnung
const basis: StuetzeEingabe = { b: 30, h: 30, d1: 4, l0: 3, nEd: 1000, mEd: 50, fck: 30, fyk: 500 };
const r = bemesseStuetze(basis);
pruefe(nahe(r.mEd_1, 57.5, 1e-9), `M_Ed ${r.mEd_1}`);
pruefe(nahe(r.lambda, 34.64, 1e-3) && r.lambda_lim === 25 && r.isTheorie2Ordnung, 'Schlankheit');
pruefe(r.hinweise.some(x => x.feld === 'theorie2'), 'Hinweis Theorie II. Ordnung');
// Mindestausmitte maßgebend bei M = 0
pruefe(nahe(bemesseStuetze({ ...basis, mEd: 0, l0: 1 }).mEd_1, 20, 1e-9), 'N·e0 maßgebend');
// Erforderliches ω liegt auf der Kurve: µ(ν, ω_erf) ≥ µ_Ed > µ(ν, ω_erf − 0,01)
const rs = bemesseStuetze({ ...basis, l0: 2 });
const b_m = 0.3, h_m = 0.3;
pruefe(muGrenze(interaktionskurve(rs.req_omega, b_m, h_m, 0.04, fcd, fyd), rs.nu_Ed) + 0.002 >= rs.mu_Ed, 'ω_erf ausreichend');
pruefe(rs.req_omega === 0 || muGrenze(interaktionskurve(rs.req_omega - 0.01, b_m, h_m, 0.04, fcd, fyd), rs.nu_Ed) + 0.002 < rs.mu_Ed, 'ω_erf minimal');
// A_s,min = 0,15·N/f_yd = 0,15·1 000 000/434,8 = 345 mm²
pruefe(nahe(rs.as_min, 3.45, 1e-3), `A_s,min ${rs.as_min}`);
// zu große Last → nicht aufnehmbar, kein NaN
const rz = bemesseStuetze({ ...basis, nEd: 20000 });
pruefe(!rz.isPossible && rz.hinweise.some(x => x.stufe === 'fehler'), 'nicht aufnehmbar');

// 4. Unsinnige Eingaben
for (const u of [{ d1: 15 }, { b: 0 }, { l0: 0 }, { nEd: -100 }, { fck: 0 }, { mEd: NaN }] as Partial<StuetzeEingabe>[]) {
  const ru = bemesseStuetze({ ...basis, ...u });
  pruefe([ru.as_final, ru.mu_Ed, ru.nu_Ed].every(Number.isFinite) && ru.hinweise.some(x => x.stufe === 'fehler'), JSON.stringify(u));
}
// 5. Fuzz (200 Fälle, Iteration ist rechenintensiv)
let seed = 3;
const z = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
for (let i = 0; i < 200; i++) {
  const ru = bemesseStuetze({ b: z(-5, 100), h: z(-5, 100), d1: z(-1, 12), l0: z(-1, 12), nEd: z(-500, 8000), mEd: z(-50, 1200), fck: z(-5, 90), fyk: z(-5, 600) });
  if (![ru.as_final, ru.mu_Ed, ru.nu_Ed, ru.lambda].every(Number.isFinite)) { pruefe(false, `Fuzz ${i}`); break; }
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Stütze');
