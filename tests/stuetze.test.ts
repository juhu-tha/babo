// Rechenkern Stützenbemessung (Umsetzungsplan Phase 4, AP 4.3)
import { bemesseStuetze, betonDruckPR, interaktionskurve, muGrenze, type StuetzeEingabe } from '../src/calc/stuetze';
import { keinErgebnis, zahlenPassen } from './hilfen/keinErgebnis';

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
//    ν = −0,2/−0,5/−0,8. Seit der Umstellung auf das Parabel-Rechteck-Diagramm (Entscheidung S-2, 28.10.2026) weicht der Kern
//    höchstens 0,4 % ab (Sehnen-Interpolation, sichere Seite), Toleranz 1 %. Der Spannungsblock als Vergleich bleibt ≤ 5 %.
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
    if (ref > 0) pruefe(nahe(ist, ref, 0.01) && ist <= ref * 1.001, `ω=${omega}, ν=${nu}: Kern ${ist.toFixed(4)} vs. Referenz ${ref.toFixed(4)}`);
    const block = muGrenze(interaktionskurve(omega, 0.3, 0.3, 0.03, fcd, fyd, 'block'), nu);
    if (ref > 0) pruefe(nahe(block, ref, 0.05), `ω=${omega}, ν=${nu}: Block ${block.toFixed(3)} vs. Parabel-Rechteck ${ref.toFixed(3)}`);
  }
}
// Völligkeit und Schwerpunkt der Parabel-Rechteck-Druckzone bei ε_c = −3,5 ‰ (Lehrbuchwerte α_R = 0,810, k_a = 0,416)
const pr = betonDruckPR(3.5, 1, 2);
pruefe(nahe(pr.F, 17 / 21, 1e-12) && nahe(pr.a, 0.41597, 1e-4), `α_R ${pr.F}, k_a ${pr.a}`);
// voll überdrückt (Drehpunkt 3/7·h), ξ = 100 wie der letzte Kurvenpunkt: nahezu gleichmäßig 2 ‰ → F ≈ h, a ≈ h/2
const prVoll = betonDruckPR(200 / (100 - 3 / 7), 100, 1);
pruefe(nahe(prVoll.F, 1, 1e-4) && nahe(prVoll.a, 0.5, 1e-4), `voll überdrückt ${prVoll.F}, ${prVoll.a}`);

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
pruefe(muGrenze(interaktionskurve(rs.req_omega, b_m, h_m, 0.04, fcd, fyd), rs.nu_Ed) + 1e-9 >= rs.mu_Ed, 'ω_erf ausreichend');
pruefe(rs.req_omega === 0 || muGrenze(interaktionskurve(rs.req_omega - 0.01, b_m, h_m, 0.04, fcd, fyd), rs.nu_Ed) + 1e-9 < rs.mu_Ed, 'ω_erf minimal');
// A_s,min = 0,15·N/f_yd = 0,15·1 000 000/434,8 = 345 mm²
pruefe(nahe(rs.as_min, 3.45, 1e-3), `A_s,min ${rs.as_min}`);
// zu große Last → nicht aufnehmbar, kein NaN
const rz = bemesseStuetze({ ...basis, nEd: 20000 });
pruefe(!rz.isPossible && rz.hinweise.some(x => x.stufe === 'fehler'), 'nicht aufnehmbar');

// Handrechnung S-2 (eigenes Skript, Streifenintegration Parabel-Rechteck, Gleichgewicht per Bisektion):
//    40/40/5 cm, l0 = 4 m, N = 3000 kN, M = 0 → ν = −1,103, µ = 0,0551 → ω_exakt = 0,254 → Stufe 0,26 (Block: 0,24)
const rS2 = bemesseStuetze({ b: 40, h: 40, d1: 5, l0: 4, nEd: 3000, mEd: 0, fck: 30, fyk: 500 });
pruefe(rS2.req_omega === 0.26 && rS2.req_omega_block === 0.24, `S2 ω ${rS2.req_omega} / Block ${rS2.req_omega_block}`);
pruefe(rS2.as_tot_req > rS2.as_tot_req_block, 'Parabel-Rechteck liegt bei hoher Druckausnutzung über dem Block');

// 4. Unsinnige Eingaben
for (const u of [{ d1: 15 }, { b: 0 }, { l0: 0 }, { nEd: -100 }, { fck: 0 }, { mEd: NaN }] as Partial<StuetzeEingabe>[]) {
  const ru = bemesseStuetze({ ...basis, ...u });
  pruefe(keinErgebnis([ru.as_final, ru.mu_Ed, ru.nu_Ed]) && ru.hinweise.some(x => x.stufe === 'fehler'), JSON.stringify(u));
}
// 5. Fuzz (200 Fälle, Iteration ist rechenintensiv)
let seed = 3;
const z = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
for (let i = 0; i < 200; i++) {
  const ru = bemesseStuetze({ b: z(-5, 100), h: z(-5, 100), d1: z(-1, 12), l0: z(-1, 12), nEd: z(-500, 8000), mEd: z(-50, 1200), fck: z(-5, 90), fyk: z(-5, 600) });
  if (!zahlenPassen(ru, [ru.as_final, ru.mu_Ed, ru.nu_Ed, ru.lambda])) { pruefe(false, `Fuzz ${i}`); break; }
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Stütze');
