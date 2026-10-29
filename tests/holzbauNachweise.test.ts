// Rechenkern Holzbau, Ergänzung AP 4.2 (Runde 3): Bemessungswerte, Druck unter Winkel, k_def, Einfeldbalken, verformter Druckstab
import {
  bemessungswert, druckUnterWinkel, festigkeitswerte, KDEF, kdefFuer, rissfaktor, bemesseEinfeldbalken, verformterDruckstab, holzschraube,
  KLED_NAME, type EinfeldbalkenEingabe, type VerformterStabEingabe,
} from '../src/calc/holzbau';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
console.log('--- Test: Holzbau-Nachweise ---');

// 1. Bemessungswerte (2.14): C24, k_mod = 0,8, γ_M = 1,3 → f_m,d = 14,77 N/mm² (Rechenbeispiel content/bpholzprodukte: 14,8)
pruefe(nahe(bemessungswert(24, 0.8), 14.7692, 1e-4), 'f_m,d C24');
pruefe(KLED_NAME['sehr kurz'] === 'sfs' && KLED_NAME['ständig'] === 'stnd', 'KLED-Namen');

// 2. Druck unter Winkel (6.16), C24 NKL 1 mittel, k_c,90 = 1: f_c,0,d = 12,923; f_c,90,d = 1,5385
//    α = 45°: 12,923 / (8,4 · 0,5 + 0,5) = 2,7496 N/mm²; α = 0° → f_c,0,d; α = 90° → k_c,90 · f_c,90,d
const fc0d = bemessungswert(21, 0.8), fc90d = bemessungswert(2.5, 0.8);
pruefe(nahe(druckUnterWinkel(fc0d, fc90d, 1, 45), 2.7496, 1e-4), `f_c,45,d ${druckUnterWinkel(fc0d, fc90d, 1, 45)}`);
pruefe(nahe(druckUnterWinkel(fc0d, fc90d, 1, 0), fc0d, 1e-12) && nahe(druckUnterWinkel(fc0d, fc90d, 1.5, 90), 1.5 * fc90d, 1e-12), 'Grenzwinkel');
const fw = festigkeitswerte({ fm: 24, ft0: 14.5, ft90: 0.4, fc0: 21, fc90: 2.5, fv: 4, gammaM: 1.3, nkl: 1, kled: 'mtl', kc90: 1, winkel: 45 });
pruefe(fw.kmod === 0.8 && nahe(fw.fcad, 2.7496, 1e-4) && fw.kurve.length === 19 && fw.kurve[18].winkel === 90, 'festigkeitswerte');
pruefe(festigkeitswerte({ fm: 24, ft0: 14.5, ft90: 0.4, fc0: 21, fc90: 2.5, fv: 4, gammaM: 1.3, nkl: 3, kled: 'stnd', kc90: 1, winkel: 0 }).kmod === 0.5, 'k_mod NKL 3 ständig');
pruefe(festigkeitswerte({ fm: 24, ft0: 14.5, ft90: 0.4, fc0: 21, fc90: 0, fv: 4, gammaM: 1.3, nkl: 1, kled: 'mtl', kc90: 1, winkel: 30 }).hinweise.some(h => h.stufe === 'fehler'), 'f_c,90,k = 0 → Fehler');

// 3. k_def nach DIN EN 1995-1-1, Tab. 3.2 (bisher identisch im Modul Holz.tsx hinterlegt)
pruefe(KDEF.vollholz[1] === 0.6 && KDEF.bsh[2] === 0.8 && KDEF.fsh[3] === 2.0 && KDEF.osb[2] === 2.25 && KDEF.osb[3] === null, 'k_def Tab. 3.2');
pruefe(kdefFuer('Brettschichtholz (BSH)', 3) === 2.0 && kdefFuer('OSB', 3) === null && kdefFuer('Eiche (Vollholz)', 1) === 0.6, 'kdefFuer');
pruefe(nahe(rissfaktor(4.0, false), 0.5, 1e-12) && nahe(rissfaktor(3.5, true), 2.5 / 3.5, 1e-12) && rissfaktor(1, true) === 1, 'k_cr');

// 4. Einfeldbalken (Runde 5: k_mod aus NKL/KLED, w_fin und w_net,fin mit k_def) – Rechenbeispiel content/bpholzprodukte/BpHolzprodukte.json
//    KVH C24 10/20, l = 4,5 m, e = 0,625 m, Ausbaulast g_k = 1,0 kN/m², Nutzlast q_k = 1,5 kN/m², NKL 1, KLED mittel:
//    g_k = 0,084 + 0,625 = 0,709 kN/m (Masse 0,1 · 0,2 · 420 = 8,4 kg/m), q_k = 0,9375 kN/m
//    q_d = 1,35 · 0,7094 + 1,5 · 0,9375 = 2,361 kN/m; M_Ed = 2,361 · 4,5²/8 = 5,977 kNm; σ_m,d = 8,965 N/mm²; f_m,d = 0,8 · 24/1,3 = 14,77 → η = 0,607
const balken: EinfeldbalkenEingabe = { l: 4.5, abstand: 0.625, gk: 1.0, qk: 1.5, b: 100, h: 200, fmk: 24, fvk: 4.0, E0mean: 11000, rhoMean: 420, brettschichtholz: false, nkl: 1, kled: 'mtl', gammaM: 1.3 };
const r = bemesseEinfeldbalken(balken);
pruefe(nahe(r.q_k, 0.9375, 1e-12) && nahe(r.g_k, 0.0824 + 0.625, 1e-3) && Math.abs(r.q_d - 2.361) < 0.001 && r.kmod === 0.8, `Lasten ${r.q_k} ${r.g_k} ${r.q_d}`);
pruefe(Math.abs(r.M_Ed - 5.977) < 0.001 && Math.abs(r.sigma_md - 8.965) < 0.001 && Math.abs(r.eta_m - 60.70) < 0.01, `Biegung ${r.M_Ed} ${r.sigma_md} ${r.eta_m}`);
pruefe(nahe(r.masse, 8.4, 1e-12), `Masse ${r.masse}`);
// Schub: V = 2,3612 · 4,5/2 = 5,3128 kN; τ = 1,5 · 5312,8/(0,5 · 100 · 200) = 0,797 N/mm²; f_v,d = 2,462 → 32,4 %
pruefe(Math.abs(r.tau_d - 0.7969) < 0.0005 && Math.abs(r.eta_v - 32.37) < 0.02, `Schub ${r.tau_d} ${r.eta_v}`);
// Durchbiegung (EC5 2.2.3): I = 6,667·10⁷ mm⁴; w_inst,G = 5·0,7074·4500⁴/(384·11 000·I) = 5,15 mm; w_inst,Q = 6,83 mm
//   w_inst = 11,98 ≤ 15,0 (l/300) → 79,8 %; w_fin = 5,15·1,6 + 6,83·(1 + 0,3·0,6) = 16,30 ≤ 22,5 (l/200) → 72,4 %;
//   w_net,fin = (5,15 + 0,3·6,83)·1,6 = 11,52 ≤ 15,0 → 76,8 %
pruefe(Math.abs(r.w_inst_G - 5.151) < 0.002 && Math.abs(r.w_inst_Q - 6.826) < 0.002 && Math.abs(r.w_inst - 11.976) < 0.002, `w_inst ${r.w_inst_G} ${r.w_inst_Q}`);
pruefe(r.kdef === 0.6 && r.psi2 === 0.3 && Math.abs(r.w_fin - 16.295) < 0.002 && Math.abs(r.w_net_fin - 11.517) < 0.002, `w_fin ${r.w_fin} ${r.w_net_fin}`);
pruefe(r.w_grenz === 15 && r.w_grenz_fin === 22.5 && Math.abs(r.eta_w - 79.84) < 0.01 && r.ok, `Grenzen ${r.eta_w}`);
pruefe(nahe(r.w_fin, r.w_inst_G * (1 + r.kdef) + r.w_inst_Q * (1 + r.psi2 * r.kdef), 1e-12), 'w_fin nach 2.2.3');
// k_mod je NKL/KLED statt fest 0,8: NKL 3 ständig → 0,5; k_def NKL 3 = 2,0 → w_fin maßgebend
const r3 = bemesseEinfeldbalken({ ...balken, nkl: 3, kled: 'stnd' });
pruefe(r3.kmod === 0.5 && r3.kdef === 2.0 && r3.eta_w_net > r3.eta_w_inst && !r3.ok && r3.hinweise.some(h => h.feld === 'nkl'), `NKL 3 ${r3.kmod} ${r3.kdef}`);
pruefe(bemesseEinfeldbalken({ ...balken, kled: 'krt' }).kmod === 0.9, 'k_mod kurz = 0,9');
// BSH: k_def BSH NKL 2 = 0,8
pruefe(bemesseEinfeldbalken({ ...balken, brettschichtholz: true, nkl: 2 }).kdef === 0.8, 'k_def BSH NKL 2');
pruefe(bemesseEinfeldbalken({ ...balken, h: 0 }).hinweise.some(h => h.stufe === 'fehler'), 'h = 0 → Fehler');
pruefe(bemesseEinfeldbalken({ ...balken, gk: -1 }).hinweise.some(h => h.stufe === 'fehler'), 'g_k < 0 → Fehler');
pruefe(!bemesseEinfeldbalken({ ...balken, l: 8 }).ok, 'l = 8 m nicht nachgewiesen');

// 5. Verformter Sparren (Runde 5: EC5 5.4.4/6.2.4 Theorie II. Ordnung mit E_d = E_0,mean/γ_M und 6.3.2 Ersatzstab mit E_0,05)
//    Rechenbeispiel content/bauwerkserfassung/Bauwerkserfassung.json (C24 100/140, l = 4,0 m, k_mod = 0,9):
//    Beispiel 1 (q_d = 2,0 kN/m, ohne Normalkraft): M_d = 4,0 kNm, σ_m,d = 12,2 N/mm², f_m,d = 16,6 → η = 0,74
const sp: VerformterStabEingabe = { b: 100, h: 140, l: 4000, nd: 0, qd: 2.0, e0: 0, fmk: 24, fc0k: 21, E0mean: 11000, E005: 7400, kmod: 0.9, gammaM: 1.3 };
const s1 = verformterDruckstab(sp);
pruefe(s1.gueltig && Math.abs(s1.sigma_m_d_primary - 12.24) < 0.01 && Math.abs(s1.f_md - 16.6) < 0.05 && Math.abs(s1.limitRatio - 73.7) < 0.1 && Math.abs(s1.etaErsatzstab - 73.7) < 0.1, `Beispiel 1 ${s1.sigma_m_d_primary} ${s1.limitRatio}`);
pruefe(s1.magFactor === 1, 'N = 0 → kein Vergrößerungsfaktor');
//    Beispiel 2 (N_d = 20 kN, e₀ = 45 mm), Ersatzstab (6.21)–(6.23): λ_y = 4000/(140/√12) = 98,97;
//    λ_rel,y = 98,97/π · √(21/7400) = 1,678; k = 0,5·(1 + 0,2·1,378 + 1,678²) = 2,046; k_c,y = 1/(k + √(k² − λ²)) = 0,3109
//    η = 1,4286/(0,3109 · 14,538) + (4,0 + 0,9)·10⁶/326 667/16,615 = 0,316 + 0,903 = 1,219 (> 1, Beispiel im Modul)
const s2 = verformterDruckstab({ ...sp, nd: 20, e0: 45 });
pruefe(Math.abs(s2.sigma_c_d - 1.43) < 0.005 && Math.abs(s2.sigma_m_d_eccentric - 2.76) < 0.01 && Math.abs(s2.f_c0d - 14.54) < 0.01, 'Beispiel 2 Spannungen');
pruefe(Math.abs(s2.lambda_y - 98.97) < 0.01 && Math.abs(s2.lambda_rel_y - 1.6783) < 1e-4 && Math.abs(s2.k_cy - 0.3109) < 1e-4 && Math.abs(s2.etaErsatzstab - 121.89) < 0.02, `Ersatzstab ${s2.lambda_rel_y} ${s2.k_cy} ${s2.etaErsatzstab}`);
//    Theorie II. Ordnung: E_d = 11 000/1,3 = 8 461,5; N_cr,d = π² · 8 461,5 · 2,2867·10⁷/4000² = 119,35 kN;
//    Faktor 1/(1 − 20/119,35) = 1,2013; σ_m = (4,0 + 0,9)·10⁶ · 1,2013/326 667 = 18,02; η = (1,4286/14,538)² + 18,02/16,615 = 1,094
pruefe(Math.abs(s2.N_crit_kN - 119.35) < 0.01 && Math.abs(s2.magFactor - 1.2013) < 1e-4 && Math.abs(s2.limitRatio - 109.42) < 0.02, `Theorie II ${s2.N_crit_kN} ${s2.magFactor} ${s2.limitRatio}`);
//    idealisiert: nur Ersatzimperfektion e = 0,0025 · 4000 = 10 mm → (4,0 + 0,2)·10⁶ · 1,2013/326 667/16,615 + 0,00966 = 0,939
pruefe(s2.e_imp === 10 && Math.abs(s2.limitRatioIdeal - 93.92) < 0.02 && s2.limitRatio > s2.limitRatioIdeal && nahe(s2.unsafeRatioDelta, s2.limitRatio - s2.limitRatioIdeal, 1e-12), 'verformt ungünstiger als ideal');
//    Voreinstellung des Moduls (100/160, N = 15 kN, e₀ = 45 mm) liegt plausibel unter 100 %
const s0 = verformterDruckstab({ ...sp, h: 160, nd: 15, e0: 45 });
pruefe(s0.limitRatio < 100 && s0.etaErsatzstab < 100 && Math.abs(s0.limitRatio - 72.42) < 0.02 && Math.abs(s0.etaErsatzstab - 82.34) < 0.02, `Voreinstellung ${s0.limitRatio} ${s0.etaErsatzstab}`);
//    gemessene Vorverformung kleiner als l/400 → Ersatzimperfektion und Hinweis
const sk = verformterDruckstab({ ...sp, nd: 10, e0: 5 });
pruefe(sk.e_ansatz === 10 && sk.hinweise.some(h => h.feld === 'e0'), 'e₀ < l/400 → Ersatzimperfektion');
// Grenze: N_d ≥ N_cr,d → Fehler
const s3 = verformterDruckstab({ ...sp, nd: 120 });
pruefe(!s3.gueltig && s3.hinweise.some(h => h.stufe === 'fehler') && Math.abs(s3.N_crit_kN - 119.35) < 0.01, 'N_d ≥ N_cr,d');
pruefe(verformterDruckstab({ ...sp, l: 0 }).hinweise.some(h => h.stufe === 'fehler'), 'l = 0 → Fehler');
pruefe(verformterDruckstab({ ...sp, E005: 0 }).hinweise.some(h => h.stufe === 'fehler'), 'E_0,05 = 0 → Fehler');

// 6. Holzschrauben DIN EN 1995-1-1, 8.7.2 (Herausziehen) und 8.2.2 (Abscheren): C24 ρ_k = 350, d = 8, l_ef = 80, α = 90°, n = 4
//    f_ax,k = 0,52 · 8^−0,5 · 80^−0,1 · 350^0,8 = 0,52 · 0,35355 · 0,64534 · 108,39 = 12,86 N/mm² (8.39); k_d = 1 (8.40)
//    n_ef = 4^0,9 = 3,482 (8.41); F_ax,Rk = 3,482 · 12,86 · 8 · 80 / 1 = 28,66 kN; F_ax,Rd = 0,8 · 28,66/1,3 = 17,64 kN
const hs = holzschraube({ rhok: 350, d: 8, lef: 80, alpha: 90, n: 4, nkl: 1, kled: 'mtl' });
pruefe(Math.abs(hs.f_ax_k - 12.865) < 0.002 && hs.k_d === 1 && Math.abs(hs.n_ef - 3.4822) < 1e-4 && Math.abs(hs.F_ax_Rd_total_kN - 17.64) < 0.01, `Schraube axial ${hs.f_ax_k} ${hs.F_ax_Rd_total_kN}`);
//    Abscheren (T10-HV-3, 29.10.2026) mit d_ef = 1,1 · 0,65 · 8 = 5,72 mm ≤ 6 mm → Nagelregeln: f_h,k = 0,082 · 350 · 5,72^−0,3 = 17,01;
//    M_y,Rk = 0,3 · 400 · 5,72^2,6 = 11 179 Nmm; Johansen 1,15·√(2·M·f_h·d_ef) = 1 696 N; Seileffekt min(8 233/4; 1 696) = 1 696 N
//    → F_v,Rk = 3 392 N je Schraube; F_v,Rd = 0,8 · 4 · 3,392/1,3 = 8,35 kN
pruefe(Math.abs(hs.f_h_k - 17.008) < 0.001 && Math.abs(hs.johansen - 1696.1) < 1 && Math.abs(hs.rope_effect - 1696.1) < 1 && Math.abs(hs.F_v_Rd_total_kN - 8.35) < 0.01, `Schraube Abscheren ${hs.johansen} ${hs.F_v_Rd_total_kN}`);
//    Winkel 0° zur Faser: Faktor 1/1,2; unter 30° Hinweis; Seileffekt höchstens 100 % des Johansen-Anteils
const h0 = holzschraube({ rhok: 350, d: 8, lef: 80, alpha: 0, n: 1, nkl: 1, kled: 'mtl' });
pruefe(nahe(h0.factor_alpha, 1 / 1.2, 1e-12) && h0.hinweise.some(h => h.feld === 'alpha'), 'α = 0° → 1/1,2 und Hinweis');
const hl = holzschraube({ rhok: 350, d: 8, lef: 400, alpha: 90, n: 1, nkl: 1, kled: 'mtl' });
pruefe(hl.rope_effect <= hl.johansen + 1e-9, 'Seileffekt ≤ Johansen-Anteil');
pruefe(holzschraube({ rhok: 350, d: 14, lef: 80, alpha: 90, n: 2, nkl: 1, kled: 'mtl' }).hinweise.some(h => h.feld === 'd'), 'd > 12 mm → Hinweis');
pruefe(holzschraube({ rhok: 350, d: 8, lef: 80, alpha: 90, n: 1.5, nkl: 1, kled: 'mtl' }).hinweise.some(h => h.stufe === 'fehler'), 'n nicht ganzzahlig → Fehler');

// 7. Fuzz
let seed = 29;
const z = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
const KL: ('stnd' | 'lg' | 'mtl' | 'krt' | 'sfs')[] = ['stnd', 'lg', 'mtl', 'krt', 'sfs'];
for (let i = 0; i < 1000; i++) {
  const nkl = ((i % 3) + 1) as 1 | 2 | 3, kled = KL[i % 5];
  const a = festigkeitswerte({ fm: z(-5, 50), ft0: z(-5, 30), ft90: z(-1, 1), fc0: z(-5, 40), fc90: z(-1, 4), fv: z(-1, 5), gammaM: z(-0.5, 2), nkl, kled: 'krt', kc90: z(0.5, 2), winkel: z(-20, 120) });
  const b = bemesseEinfeldbalken({ l: z(-1, 12), abstand: z(-0.2, 1.5), gk: z(-1, 3), qk: z(-1, 10), b: z(-10, 300), h: z(-10, 600), fmk: z(-5, 40), fvk: z(-1, 5), E0mean: z(-100, 15000), rhoMean: z(-10, 700), brettschichtholz: i % 2 === 0, nkl, kled, gammaM: z(-0.1, 1.5) });
  const c = verformterDruckstab({ b: z(-10, 300), h: z(-10, 400), l: z(-100, 8000), nd: z(-10, 300), qd: z(-1, 10), e0: z(-5, 100), fmk: z(-5, 40), fc0k: z(-5, 30), E0mean: z(-100, 15000), E005: z(-100, 12000), kmod: z(-0.1, 1.1), gammaM: z(-0.1, 1.5) });
  const d = holzschraube({ rhok: z(-10, 700), d: z(-1, 16), lef: z(-10, 300), alpha: z(-10, 100), n: Math.round(z(-1, 10)), nkl, kled });
  const werte = [a.fcad, a.fmd, ...a.kurve.map(k => k.fcad), b.eta_m, b.eta_v, b.eta_w, b.w_inst, b.w_fin, b.w_net_fin, c.limitRatio, c.limitRatioIdeal, c.magFactor, c.N_crit_kN, c.etaErsatzstab, c.k_cy, d.F_ax_Rd_total_kN, d.F_v_Rd_total_kN];
  if (!werte.every(Number.isFinite)) { pruefe(false, `Fuzz ${i}: ${JSON.stringify(werte)}`); break; }
}

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log('OK: Holzbau-Nachweise');
