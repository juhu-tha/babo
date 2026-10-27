// Modulprüfung Tranche 1 (27.10.2026): unabhängige Nachrechnungen der Rechenkerne (Befundliste docs/pruefung/module-tranche-1.md).
// Die Sollwerte stammen aus einer eigenen Handrechnung (eigene Formelumsetzung nach Normgleichung, nicht aus den Kernen übernommen).
import { bemesseBiegung } from '../src/calc/biegung';
import { bemesseQuerkraft } from '../src/calc/querkraft';
import { bemesseStuetze } from '../src/calc/stuetze';
import { bemesseDurchstanzen } from '../src/calc/durchstanzen';
import { stoffraum, maxFaFaktor } from '../src/calc/mischung';
import { betonkennwerte } from '../src/calc/betonkennwerte';
import { bemesseWandVereinfacht } from '../src/calc/mauerwerk';
import { bemesseDruckstab, bemesseQuerdruck } from '../src/calc/holzbau';
import { glaser } from '../src/calc/glaser';
import { trittschall } from '../src/calc/schall';
import misch from '../content/mischungsberechnung/daten.json';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };

console.log('--- Test: Modulprüfung Tranche 1 (Nachrechnungen) ---');

// Biegung, Spannungsblock direkt aus dem Gleichgewicht in x: η·f_cd·b·λx·(d − λx/2) = M_Ed
// B2: b/h/d₁/d₂ = 25/50/5/5 cm, C25/30, M_Ed = 400 kNm → x = ξ_lim·d = 20,25 cm, σ_s2 = f_yd, A_s1 = 24,02 cm², A_s2 = 10,83 cm²
const bB = { b: 30, h: 60, d1: 5, d2: 5, med: 250, fck: 30, bewehrung: 'Stahl' as const, fyk: 500, ftk: 3000, gammaFRP: 1.3 };
const b1 = bemesseBiegung(bB);
pruefe('B1 A_s1', b1.as1_req, 11.4751); pruefe('B1 x', b1.x, 12.2283); pruefe('B1 A_s,min', b1.as_min, 2.1091);
const b2 = bemesseBiegung({ ...bB, b: 25, h: 50, med: 400, fck: 25 });
pruefe('B2 A_s1', b2.as1_req, 24.0227); pruefe('B2 A_s2', b2.as2_req, 10.8265); pruefe('B2 x', b2.x, 20.25);

// Querkraft: z nach NA DE (c_v,l = 3,5 cm): Q1 d = 55 cm → z = min(49,5; max(48,5; 48,0)) = 48,5 cm
const qB = { b: 30, h: 60, d1: 5, fck: 30, bewehrung: 'Stahl' as const, fyk: 500, ftk: 1000, gammaFRP: 1.3, asl: 12.57, vEd: 250, theta: 21.8 };
const q1 = bemesseQuerkraft(qB);
pruefe('Q1 z', q1.z, 48.5); pruefe('Q1 V_Rd,c', q1.vRd_c, 75.061); pruefe('Q1 cot θ,max', q1.cot_theta_max, 2.1202); pruefe('Q1 a_sw', q1.asw_req, 5.5917); pruefe('Q1 V_Rd,max', q1.vRd_max, 715.75);
// Q2: d = 950 mm → κ₁ = 0,0375 (v_min), V_Ed < V_Rd,cc → cot θ,max = 3,0
const q2 = bemesseQuerkraft({ ...qB, h: 100, b: 40, asl: 30, vEd: 300, theta: 45 });
pruefe('Q2 V_Rd,c', q2.vRd_c, 159.1995); pruefe('Q2 cot θ,max', q2.cot_theta_max, 3.0); pruefe('Q2 V_Rd,max', q2.vRd_max, 2180.25);

// Stütze 40/40, d₁ = 5 cm, C30/37, l₀ = 4 m, N_Ed = 2000 kN, M_Ed = 100 kNm: µ_Ed = 0,1103, ν_Ed = −0,735;
// eigene Dehnungsiteration (Spannungsblock) → ω_erf = 0,05 (bis 27.10. mit Zuschlag +0,002 auf µ_Rd: 0,04)
const s1 = bemesseStuetze({ b: 40, h: 40, d1: 5, l0: 4, nEd: 2000, mEd: 100, fck: 30, fyk: 500 });
pruefe('S1 µ_Ed', s1.mu_Ed, 0.11029); pruefe('S1 ν_Ed', s1.nu_Ed, -0.73529); pruefe('S1 ω_erf', s1.req_omega, 0.05, 1e-9); pruefe('S1 λ_lim', s1.lambda_lim, 25);
const s2 = bemesseStuetze({ b: 40, h: 40, d1: 5, l0: 4, nEd: 3000, mEd: 0, fck: 30, fyk: 500 });
pruefe('S2 ω_erf', s2.req_omega, 0.24, 1e-9); pruefe('S2 A_s,min', s2.as_min, 10.35);

// Durchstanzen Innenstütze rund c = 400 mm, d = 220 mm, ρ_l = 1 %, C30/37, β = 1,10
const d1 = bemesseDurchstanzen({ form: 'rund', vEd: 800, d: 220, c: 400, cx: 0, cy: 0, fck: 30, rhoL: 0.01, beta: 1.1 });
pruefe('D1 u1', d1.u1, 4021.2386); pruefe('D1 v_Ed', d1.vEd_stress, 0.9947); pruefe('D1 v_Rd,c', d1.vRdc, 0.7284); pruefe('D1 A_sw', d1.asw_req_ring, 650.35);
// D2: Rechteckstütze 250/250, d = 300 mm → u₀/d = 3,33 < 4 → C_Rd,c abgemindert; v_Ed > 1,4·v_Rd,c
const d2 = bemesseDurchstanzen({ form: 'rechteckig', vEd: 1500, d: 300, c: 0, cx: 250, cy: 250, fck: 30, rhoL: 0.01, beta: 1.1 });
pruefe('D2 v_Rd,c', d2.vRdc, 0.6322); if (!d2.isOverloaded) fehler.push('D2: v_Rd,max-Überschreitung erwartet');

// Stoffraum: z = 300, w = 176, f = 120, s = 20 kg/m³, CEM I, 1,5 % Luft, ρ_g = 2,65 → (w/z)_eq = 176/(300 + 0,4·99 + 20) = 0,4894
const fr = [{ anteil: 35, feuchte: 4, wa: 0.5 }, { anteil: 20, feuchte: 1, wa: 0.5 }, { anteil: 45, feuchte: 0.5, wa: 0.5 }];
const mB = { zement: 320, rhoZement: 3.1, wasser: 176, fa: 0, sf: 0, hues: 0, biochar: 0, zusatzmittel: 0, luft: 1.5, stahlfaser: 0, ppFaser: 0, rhoGestein: 2.65, fraktionen: fr, biocharFeuchte: 0, biocharWa: 0, k: { fa: 0.4, sf: 1.0, hues: 0, biochar: 0 }, maxFaFaktor: 0.33 };
const m1 = stoffraum(mB);
pruefe('M1 V_g', m1.volGestein, 705.7742); pruefe('M1 Zugabewasser', m1.zugabewasser, 151.2185);
const m2 = stoffraum({ ...mB, zement: 300, fa: 120, sf: 20, zementArt: 'CEM I', maxFaFaktor: maxFaFaktor('CEM I') });
pruefe('M2 (w/z)_eq', m2.wzEq, 0.4894, 1e-3); pruefe('M2 f_max Kombination', m2.maxFaKombination ?? NaN, 138);
// Höchstzementgehalt XM1–XM3: 360 kg/m³ (DIN 1045-2; öffentlich: Heidelberg Materials, Flyer „Beton bestellen nach Norm“, Fußnote 6)
for (const k of ['XM1', 'XM2', 'XM3'] as const) {
  const z = (misch.daten.EXPOSITIONSKLASSEN as Record<string, { maxZement?: number }>)[k]?.maxZement;
  if (z !== 360) fehler.push(`${k}: Höchstzementgehalt ${z} statt 360 kg/m³`);
}

// Betonkennwerte C30/37, RH 50 %, h₀ = 171,4 mm, t₀ = 28 d, t = 50 a: φ = 2,40 (Anhang B mit α₁, α₂, α₃), k = 1,96 (Gl. 3.14)
const k1 = betonkennwerte({ fck: 30, zementklasse: 'N', gestein: 'quarzit', rh: 50, ac: 0.12, u: 1.4, h: 300, ts: 7, t0: 28, t: 18250, temperatur: 20, sigmaC: 8, laenge: 10 });
pruefe('K1 φ', k1.phiFinal, 2.4035); pruefe('K1 E_cm', k1.Ecm, 32836.6); pruefe('K1 k', k1.kPlastizitaet, 1.9615);

// Mauerwerk, vereinfachtes Verfahren: W2 t = 240 mm, a = 160 mm (a/t = 2/3 → ρ₂ = 1,0), l_f = 6 m, f_k = 5,0 → Φ₂ = 0,4222, n_Rd = 287,1 kN/m
const w2 = bemesseWandVereinfacht({ lage: 'zwischen', h: 2.75, t: 240, a: 160, lf: 6.0, fk: 5.0, nEd: 300 });
pruefe('W2 Φ1', w2.phi1, 0.6); pruefe('W2 Φ2', w2.phi2, 0.42222); pruefe('W2 n_Rd', w2.nRd, 287.126);
const w4 = bemesseWandVereinfacht({ lage: 'dach', h: 2.5, t: 300, a: 300, lf: 5, fk: 3.8, nEd: 100 });
pruefe('W4 n_Rd', w4.nRd, 215.118);

// Holz: H2 GL24h 160/160, l = 4 m, NKL 2, lang → λ_rel = 1,378, k_c = 0,475 (β_c = 0,1), F_c,Rd = 157,2 kN
const h2 = bemesseDruckstab({ b: 160, h: 160, laenge: 4, eulerFall: 2, nEd: 150, fc0k: 24, E005: 9600, brettschichtholz: true, nkl: 2, kled: 'lg' });
pruefe('H2 k_c', h2.k_cz, 0.475); pruefe('H2 F_c,Rd', h2.F_c_R_d_kN, 157.151);
// Querdruck Einzelauflager C24, l = 150 mm + 2·30 mm, k_c,90 = 1,5
const h4 = bemesseQuerdruck({ F: 60, b: 120, l: 150, fall: 'pfosten_riegel', ueberstand: true, fc90k: 2.5, art: 'nadelvollholz', nkl: 1, kled: 'mtl' });
pruefe('H4 σ_c,90,d', h4.sigma_c90d, 2.38095); pruefe('H4 Grenze', h4.stressLimit, 2.30769);

// Glaser: KS 17,5 cm (µ 25) + Dämmung 14 cm (µ 1) + Außenschicht s_d = 100 m → Tauwasserebene vor der Außenschicht (s_d = 4,515 m)
const g = glaser([{ d: 0.175, lambda: 0.99, mu: 25 }, { d: 0.14, lambda: 0.035, mu: 1 }, { d: 0.002, lambda: 0.2, mu: 50000 }]);
pruefe('G1 s_d Ebene', g.zonen[0]?.sdVon ?? NaN, 4.515); pruefe('G1 M_c', g.mc, 0.2596, 1e-2); pruefe('G1 M_ev', g.mev, 0.18, 1e-2);

// Trittschall: Rohdecke 20 cm Beton (480 kg/m²), Estrich 5 cm (100 kg/m²), s' = 20 MN/m³, m'_f,m = 300 kg/m² → L'_n,w = 43,6 dB
const t = trittschall({ dDecke: 0.2, rhoDecke: 2400, mZusatz: 0, dEstrich: 0.05, rhoEstrich: 2000, sStrich: 20, mFlanke: 300, zulLnw: 50 });
pruefe('R3 L_n,eq,0,w', t.lnEq0w, 70.1566); pruefe('R3 ΔL_w', t.deltaLw, 28.3254); pruefe("R3 L'_n,w", t.lnwStrich, 43.5538);

if (fehler.length) { console.log('FAIL', fehler.join('\n')); process.exit(1); }
console.log('ok – alle Nachrechnungen stimmen');
