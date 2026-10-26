// Rechenkern Holzbau, Ergänzung AP 4.2 (Runde 3): Bemessungswerte, Druck unter Winkel, k_def, Einfeldbalken, verformter Druckstab
import {
  bemessungswert, druckUnterWinkel, festigkeitswerte, KDEF, kdefFuer, rissfaktor, bemesseEinfeldbalken, verformterDruckstab,
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

// 4. Einfeldbalken – Rechenbeispiel content/bpholzprodukte/BpHolzprodukte.json (KVH C24 10/20, l = 4,5 m, e = 0,625 m, q_k = 2,5 kN/m²):
//    q_k = 1,56 kN/m, g_k ≈ 0,08 kN/m, q_d = 2,45 kN/m, M_Ed = 6,2 kNm, σ_m,d = 9,3 N/mm², f_m,d = 14,8 → η = 0,63
const balken: EinfeldbalkenEingabe = { l: 4.5, abstand: 0.625, qk: 2.5, b: 100, h: 200, fmk: 24, fvk: 4.0, E0mean: 11000, rhoMean: 420, brettschichtholz: false, kmod: 0.8, gammaM: 1.3 };
const r = bemesseEinfeldbalken(balken);
pruefe(nahe(r.q_k, 1.5625, 1e-12) && Math.abs(r.g_k - 0.08) < 0.005 && Math.abs(r.q_d - 2.45) < 0.01, `Lasten ${r.q_k} ${r.g_k} ${r.q_d}`);
pruefe(Math.abs(r.M_Ed - 6.2) < 0.05 && Math.abs(r.sigma_md - 9.3) < 0.05 && Math.abs(r.eta_m / 100 - 0.63) < 0.005, `Biegung ${r.M_Ed} ${r.sigma_md} ${r.eta_m}`);
// Handrechnung Masse 0,1 · 0,2 · 420 = 8,4 kg/m (bisher angezeigt: g_k · 100 = 8,24 kg/m)
pruefe(nahe(r.masse, 8.4, 1e-12), `Masse ${r.masse}`);
// Schub: V = 2,455 · 4,5/2 = 5,524 kN; τ = 1,5 · 5524/(0,5 · 100 · 200) = 0,829 N/mm²; f_v,d = 2,462 → 33,7 %
pruefe(Math.abs(r.tau_d - 0.829) < 0.002 && Math.abs(r.eta_v - 33.7) < 0.1, `Schub ${r.tau_d} ${r.eta_v}`);
// Durchbiegung: w = 5 · 1,645 · 4500⁴/(384 · 11 000 · 6,667·10⁷) = 11,98 mm; l/300 = 15 mm
pruefe(Math.abs(r.w_inst - 11.98) < 0.02 && r.w_grenz === 15 && r.ok, `w_inst ${r.w_inst}`);
pruefe(bemesseEinfeldbalken({ ...balken, h: 0 }).hinweise.some(h => h.stufe === 'fehler'), 'h = 0 → Fehler');
pruefe(!bemesseEinfeldbalken({ ...balken, l: 8 }).ok, 'l = 8 m nicht nachgewiesen');

// 5. Verformter Sparren – Rechenbeispiele content/bauwerkserfassung/Bauwerkserfassung.json (C24 100/140, l = 4,0 m, k_mod = 0,9):
//    Beispiel 1 (q_d = 2,0 kN/m, ohne Normalkraft): M_d = 4,0 kNm, σ_m,d = 12,2 N/mm², f_m,d = 16,6 → η = 0,74
const sp: VerformterStabEingabe = { b: 100, h: 140, l: 4000, nd: 0, qd: 2.0, e0: 0, fmk: 24, fc0k: 21, E0mean: 11000, kmod: 0.9, gammaM: 1.3 };
const s1 = verformterDruckstab(sp);
pruefe(s1.gueltig && Math.abs(s1.sigma_m_d_primary - 12.24) < 0.01 && Math.abs(s1.f_md - 16.6) < 0.05 && Math.abs(s1.limitRatio - 73.7) < 0.1, `Beispiel 1 ${s1.sigma_m_d_primary} ${s1.limitRatio}`);
pruefe(s1.magFactor === 1, 'N = 0 → kein Vergrößerungsfaktor (bisher NaN)');
//    Beispiel 2 (N_d = 20 kN, e₀ = 45 mm): σ_c,0,d = 1,43, Δσ_m,d = 2,8 N/mm², f_c,0,d = 14,5
const s2 = verformterDruckstab({ ...sp, nd: 20, e0: 45 });
pruefe(Math.abs(s2.sigma_c_d - 1.43) < 0.005 && Math.abs(s2.sigma_m_d_eccentric - 2.76) < 0.01 && Math.abs(s2.f_c0d - 14.54) < 0.01, 'Beispiel 2 Spannungen');
//    Handrechnung Theorie II. Ordnung: I = 100 · 140³/12 = 2,2867·10⁷ mm⁴; N_cr = π² · 11 000 · I/4000² = 155,16 kN;
//    Faktor 1/(1 − 20/155,16) = 1,148; σ_m = (4,0 + 0,9)·10⁶ · 1,148/326 667 = 17,22 → η = 0,098 + 1,036 = 1,135
pruefe(Math.abs(s2.N_crit_kN - 155.16) < 0.05 && Math.abs(s2.magFactor - 1.148) < 0.001 && Math.abs(s2.limitRatio - 113.5) < 0.2, `Theorie II ${s2.N_crit_kN} ${s2.magFactor} ${s2.limitRatio}`);
pruefe(s2.limitRatio > s2.limitRatioIdeal && nahe(s2.unsafeRatioDelta, s2.limitRatio - s2.limitRatioIdeal, 1e-12), 'verformt ungünstiger als ideal');
// Grenze: N_d ≥ N_cr → Fehler statt bisherigem Ersatzwert 1,5
const s3 = verformterDruckstab({ ...sp, nd: 200 });
pruefe(!s3.gueltig && s3.hinweise.some(h => h.stufe === 'fehler') && Math.abs(s3.N_crit_kN - 155.16) < 0.05, 'N_d ≥ N_cr');
pruefe(verformterDruckstab({ ...sp, l: 0 }).hinweise.some(h => h.stufe === 'fehler'), 'l = 0 → Fehler');

// 6. Fuzz
let seed = 29;
const z = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
for (let i = 0; i < 1000; i++) {
  const a = festigkeitswerte({ fm: z(-5, 50), ft0: z(-5, 30), ft90: z(-1, 1), fc0: z(-5, 40), fc90: z(-1, 4), fv: z(-1, 5), gammaM: z(-0.5, 2), nkl: ((i % 3) + 1) as 1 | 2 | 3, kled: 'krt', kc90: z(0.5, 2), winkel: z(-20, 120) });
  const b = bemesseEinfeldbalken({ l: z(-1, 12), abstand: z(-0.2, 1.5), qk: z(-1, 10), b: z(-10, 300), h: z(-10, 600), fmk: z(-5, 40), fvk: z(-1, 5), E0mean: z(-100, 15000), rhoMean: z(-10, 700), brettschichtholz: i % 2 === 0, kmod: z(-0.1, 1.1), gammaM: z(-0.1, 1.5) });
  const c = verformterDruckstab({ b: z(-10, 300), h: z(-10, 400), l: z(-100, 8000), nd: z(-10, 300), qd: z(-1, 10), e0: z(-5, 100), fmk: z(-5, 40), fc0k: z(-5, 30), E0mean: z(-100, 15000), kmod: z(-0.1, 1.1), gammaM: z(-0.1, 1.5) });
  const werte = [a.fcad, a.fmd, ...a.kurve.map(k => k.fcad), b.eta_m, b.eta_v, b.eta_w, b.w_inst, c.limitRatio, c.limitRatioIdeal, c.magFactor, c.N_crit_kN];
  if (!werte.every(Number.isFinite)) { pruefe(false, `Fuzz ${i}: ${JSON.stringify(werte)}`); break; }
}

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log('OK: Holzbau-Nachweise');
