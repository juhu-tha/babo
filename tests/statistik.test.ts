// Rechenkern Statistik (Z3): Stichprobenkennwerte, Ausreißerkriterien, k_n nach DIN EN 1990 Tab. D1, X_k und X_d
import { erf, normalCDF, normalPDF, stichprobe, grubbsKritisch, fraktilfaktorKn, ausreisserGrenzen, statistikAuswertung, type AusreisserMethode, type StatistikMaterial } from '../src/calc/statistik';
import { tCDF, tPDF, tQuantil, lnGamma, betaRegularisiert, einstichprobenTTest, zweistichprobenTTest, zweistichprobenTTestKennwerte, type TTestAlternative, type TTestVariante } from '../src/calc/statistik';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Statistik ---');

// 1. Handrechnung Begriffserklärer (Startwerte des Moduls): 25, 30, 38, 42, 48, 67
//    x̄ = 250/6 = 41,667; Median = (38 + 42)/2 = 40; Σ(xᵢ − x̄)² = 1109,33 → s = √(1109,33/5) = 14,895; V = 35,75 %
const p = stichprobe([25, 30, 38, 42, 48, 67]);
pruefe(p.n === 6 && nahe(p.mittelwert, 41.6667, 1e-4) && p.median === 40 && nahe(p.stdAbw, 14.8952, 1e-4) && nahe(p.vk, 35.748, 1e-3), `Begriffserklärer ${JSON.stringify(p)}`);
pruefe(stichprobe([7]).stdAbw === 0 && stichprobe([7]).median === 7 && stichprobe([3, 1, 2]).median === 2, 'n = 1 → s = 0; Median ungerade');
pruefe(Number.isNaN(stichprobe([]).mittelwert), 'leere Stichprobe → NaN');

// 2. Normalverteilung: erf(1) = 0,842701 (A&S, Fehler ≤ 1,5·10⁻⁷), Φ(μ) = 0,5, Φ(μ − 1,645σ) = 0,05, φ(μ) = 1/(σ√(2π))
pruefe(nahe(erf(1), 0.8427008, 2e-7) && nahe(erf(-0.5), -0.5204999, 2e-7) && nahe(erf(0), 0, 1e-8), `erf ${erf(1)} ${erf(-0.5)}`);
pruefe(nahe(normalCDF(38, 38, 4), 0.5, 1e-8) && nahe(normalCDF(38 - 1.645 * 4, 38, 4), 0.05, 1e-4), 'Φ(μ) und 5-%-Quantil');
pruefe(nahe(normalPDF(38, 38, 4), 1 / (4 * Math.sqrt(2 * Math.PI)), 1e-15) && normalPDF(1, 1, 0) === 1 && normalCDF(0, 1, 0) === 0, 'φ und Sonderfall σ = 0');

// 3. Tabellen: k_n (DIN EN 1990 Tab. D1) und G_krit (ISO 5725-2 Tab. 5, ein Ausreißer, α = 5 %, beidseitig = ASTM E178 einseitig 2,5 %)
pruefe(fraktilfaktorKn(3) === 3.37 && fraktilfaktorKn(10) === 1.92 && fraktilfaktorKn(30) === 1.73 && Number.isNaN(fraktilfaktorKn(2)), 'k_n Stützstellen');
//    n = 7: 2,18 + (2,00 − 2,18)·(1/6 − 1/7)/(1/6 − 1/8) = 2,0771; n = 50: 1,73 + (1,64 − 1,73)·(1/30 − 1/50)/(1/30) = 1,694
pruefe(nahe(fraktilfaktorKn(7), 2.07714, 1e-5) && nahe(fraktilfaktorKn(50), 1.694, 1e-12) && nahe(fraktilfaktorKn(1e9), 1.64, 1e-6), `k_n Zwischenwerte ${fraktilfaktorKn(7)} ${fraktilfaktorKn(50)}`);
//    Stützstellen n = 7: 2,020; n = 8: 2,126; n = 10: 2,290 (Harvey, Analytical Chemistry 2.1, App. 7; ISO 5725-2 Tab. 5)
//    n = 11 interpoliert: 2,290 + (2,412 − 2,290)/2 = 2,351
pruefe(grubbsKritisch(3) === 1.155 && grubbsKritisch(2) === 1.155 && grubbsKritisch(7) === 2.02 && grubbsKritisch(8) === 2.126 && grubbsKritisch(10) === 2.29 && nahe(grubbsKritisch(11), 2.351, 1e-12) && grubbsKritisch(80) === 3.128, `G_krit ${grubbsKritisch(11)}`);
//    Abgleich aller Stützstellen mit der exakten Formel G = (n − 1)/√n · √(t²/(n − 2 + t²)), t = t(1 − α/(2n); n − 2), α = 0,05
for (const nn of [3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25, 30, 40, 50]) {
  const t = tQuantil(1 - 0.05 / (2 * nn), nn - 2);
  const gFormel = (nn - 1) / Math.sqrt(nn) * Math.sqrt(t * t / (nn - 2 + t * t));
  pruefe(nahe(grubbsKritisch(nn), gFormel, 2e-3), `G_krit(${nn}) = ${grubbsKritisch(nn)} ≠ Formel ${gFormel}`);
  // T2-ST-1 (28.10.2026): 1-%-Grenze (Ausreißer nach ISO 5725-2, Tab. 5), gleiche Formel mit α = 0,01
  const t1 = tQuantil(1 - 0.01 / (2 * nn), nn - 2);
  const g1 = (nn - 1) / Math.sqrt(nn) * Math.sqrt(t1 * t1 / (nn - 2 + t1 * t1));
  pruefe(nahe(grubbsKritisch(nn, 0.01), g1, 1e-3) && grubbsKritisch(nn, 0.01) >= grubbsKritisch(nn), `G_krit,1%(${nn}) = ${grubbsKritisch(nn, 0.01)} ≠ Formel ${g1}`);
}
//    ISO 5725-2, Tab. 5 (1 %): n = 8: 2,274; n = 10: 2,482
pruefe(grubbsKritisch(8, 0.01) === 2.274 && grubbsKritisch(10, 0.01) === 2.482, 'G_krit 1 % Tabellenwerte');

// 4. Handrechnung Prüfserie mit Ausreißer (Beton): 10 Werte um 38 N/mm² + 60,0
//    x̄ = 40,427; s = 6,681 → 2σ-Grenzen 27,07 … 53,79 → 60,0 ist Ausreißer
//    bereinigt n = 10: x̄ = 38,47, s = 1,6654; k_n = 1,92 → X_k = 38,47 − 1,92·1,6654 = 35,272; X_d = 35,272/1,5 = 23,515
const serie = [38.2, 36.5, 40.1, 39.4, 37.8, 41.0, 35.9, 38.8, 39.9, 37.1, 60.0];
const a = statistikAuswertung({ werte: serie, methode: '2sigma', material: 'beton', ausreisserPruefen: true });
pruefe(a.gueltig && nahe(a.untereGrenze, 27.0652, 1e-4) && nahe(a.obereGrenze, 53.7893, 1e-4) && a.ausreisser.length === 1 && a.ausreisser[0] === 60, `2σ ${a.untereGrenze} ${a.obereGrenze} ${a.ausreisser}`);
pruefe(a.sauber.n === 10 && nahe(a.sauber.mittelwert, 38.47, 1e-9) && nahe(a.sauber.stdAbw, 1.66537, 1e-5) && a.kn === 1.92 && nahe(a.xk, 35.2725, 1e-4) && nahe(a.xd, 23.5150, 1e-4), `X_k/X_d ${a.xk} ${a.xd}`);
//    Boxplot: Q₁ = sortiert[⌊2,75⌋] = 37,1; Q₃ = sortiert[⌊8,25⌋] = 40,1 → 32,6 … 44,6
const bx = statistikAuswertung({ werte: serie, methode: 'boxplot', material: 'stahl', ausreisserPruefen: true });
pruefe(nahe(bx.untereGrenze, 32.6, 1e-9) && nahe(bx.obereGrenze, 44.6, 1e-9) && bx.ausreisser.length === 1 && bx.gammaM === 1.15, `Boxplot ${bx.untereGrenze} ${bx.obereGrenze}`);
//    Grubbs n = 11 (T2-ST-1): Entfernung ab 1 %: G_krit = 2,482 + (2,636 − 2,482)/2 = 2,559 → 40,4273 ∓ 2,559 · 6,6810 = 23,33 … 57,52;
//    5-%-Grenze G = 2,351 → 24,72 … 56,13 (Markierung). 60,0 hat G = 2,93 > 2,559 → Ausreißer
const gr = statistikAuswertung({ werte: serie, methode: 'grubbs', material: 'holz', ausreisserPruefen: true });
pruefe(nahe(gr.untereGrenze, 23.3305, 1e-4) && nahe(gr.obereGrenze, 57.5240, 1e-4) && nahe(gr.gKrit ?? NaN, 2.559, 1e-12) && nahe(gr.gKrit5 ?? NaN, 2.351, 1e-12)
  && nahe(gr.untereGrenze5 ?? NaN, 24.7202, 1e-4) && nahe(gr.obereGrenze5 ?? NaN, 56.1344, 1e-4) && gr.ausreisser.length === 1 && gr.auffaellig.length === 0 && nahe(gr.xd, gr.xk / 1.3, 1e-12), `Grubbs ${gr.untereGrenze} ${gr.obereGrenze}`);
//    Straggler (zwischen 5 % und 1 %): n = 8, 31,0 mit G = 2,233 (2,127 < G < 2,274) → markiert, nicht entfernt
const stg = statistikAuswertung({ werte: [38.2, 41.5, 39.9, 40.3, 42.1, 37.6, 40.8, 31.0], methode: 'grubbs', material: 'beton', ausreisserPruefen: true });
pruefe(stg.ausreisser.length === 0 && stg.auffaellig.length === 1 && stg.auffaellig[0] === 31.0 && stg.sauber.n === 8 && stg.hinweise.some(h => h.text.includes('5-%- und der 1-%-Grenze')), 'Straggler nur markiert');
//    andere Methoden: keine Markierung
pruefe(a.auffaellig.length === 0 && bx.auffaellig.length === 0, 'auffällig nur bei Grubbs');
//    ohne Prüfung (Serie läuft noch): Grenzen 0, keine Ausreißer, X_k aus allen Werten
const ohne = statistikAuswertung({ werte: serie, methode: '2sigma', material: 'beton', ausreisserPruefen: false });
pruefe(ohne.untereGrenze === 0 && ohne.obereGrenze === 0 && ohne.ausreisser.length === 0 && ohne.sauber.n === 11, 'ohne Ausreißerprüfung');

// 5. Randfälle
const leer = statistikAuswertung({ werte: [], methode: '2sigma', material: 'beton', ausreisserPruefen: true });
pruefe(!leer.gueltig && leer.sauber.mittelwert === 0 && Number.isNaN(leer.xk), 'keine Werte → Fehler');
pruefe(!statistikAuswertung({ werte: [1, NaN, 3], methode: '2sigma', material: 'beton', ausreisserPruefen: true }).gueltig, 'NaN-Wert → Fehler');
const zwei = statistikAuswertung({ werte: [30, 32], methode: 'grubbs', material: 'beton', ausreisserPruefen: true });
pruefe(zwei.gueltig && Number.isNaN(zwei.kn) && zwei.hinweise.some(x => x.feld === 'werte'), 'n = 2 → k_n NaN, Warnung');
const gleich = statistikAuswertung({ werte: [35, 35, 35, 35, 35], methode: '2sigma', material: 'beton', ausreisserPruefen: true });
pruefe(gleich.ausreisser.length === 0 && gleich.xk === 35 && gleich.roh.stdAbw === 0, 'identische Werte → X_k = x̄');

// 6. Fuzz-Test: Zufallsserien → endliche Kennwerte, X_d < X_k < x̄_bereinigt, Monotonie von k_n
let zufall = 2024;
const rnd = () => { zufall = (zufall * 1103515245 + 12345) % 2147483648; return zufall / 2147483648; };
const METH: AusreisserMethode[] = ['2sigma', 'grubbs', 'boxplot'];
const MAT: StatistikMaterial[] = ['beton', 'stahl', 'holz'];
let gepr = 0;
for (let i = 0; i < 1000; i++) {
  const n = 5 + Math.floor(rnd() * 40);
  const mu = 20 + rnd() * 500, sd = mu * (0.02 + rnd() * 0.15);
  const werte = Array.from({ length: n }, () => mu + sd * (rnd() + rnd() + rnd() + rnd() - 2) * 1.7);
  if (rnd() < 0.5) werte[Math.floor(rnd() * n)] = mu + (rnd() < 0.5 ? -1 : 1) * sd * 5;
  const r = statistikAuswertung({ werte, methode: METH[i % 3], material: MAT[Math.floor(rnd() * 3)], ausreisserPruefen: true });
  pruefe(r.bereinigt.length + r.ausreisser.length === n, `Fuzz ${i}: Aufteilung`);
  if (r.sauber.n < 3) continue;
  gepr++;
  pruefe(r.gueltig && [r.xk, r.xd, r.kn, r.sauber.stdAbw].every(Number.isFinite), `Fuzz ${i}: endlich`);
  pruefe(r.xk <= r.sauber.mittelwert && (r.xk <= 0 || r.xd < r.xk), `Fuzz ${i}: X_d < X_k ≤ x̄`);
  pruefe(r.untereGrenze <= r.obereGrenze && r.ausreisser.every(v => v < r.untereGrenze || v > r.obereGrenze), `Fuzz ${i}: Grenzen`);
  pruefe(r.sauber.stdAbw <= r.roh.stdAbw + 1e-9, `Fuzz ${i}: Bereinigung verringert s`);
}
for (let n = 3; n < 200; n++) pruefe(fraktilfaktorKn(n + 1) <= fraktilfaktorKn(n) && fraktilfaktorKn(n) >= 1.64, `k_n monoton fallend bei n = ${n}`);
for (let n = 3; n < 50; n++) pruefe(grubbsKritisch(n + 1) >= grubbsKritisch(n), `G_krit monoton steigend bei n = ${n}`);
for (let x = -5; x < 5; x += 0.1) pruefe(normalCDF(x + 0.1, 0, 1) >= normalCDF(x, 0, 1) && erf(x + 0.1) >= erf(x), `Φ/erf monoton bei ${x}`);
pruefe(gepr > 900, `Fuzz: nur ${gepr} geprüfte Fälle`);
// ausreisserGrenzen direkt: 2σ symmetrisch um x̄
const g2 = ausreisserGrenzen(stichprobe(serie), '2sigma');
pruefe(nahe((g2.unten + g2.oben) / 2, stichprobe(serie).mittelwert, 1e-12), '2σ symmetrisch');

// Runde 5 (Z22): Interpolation von k_n in 1/n belegt – Tab. D1 folgt k_n = t_(n−1; 0,95)·√(1 + 1/n) (DIN EN 1990, D7.2, V_X unbekannt).
// Student-Quantile t_0,95 (öffentliche t-Tabellen): ν = 2: 2,920; 5: 2,015; 6: 1,943; 7: 1,895; 9: 1,833; 14: 1,761; 29: 1,699; 49: 1,677
const T95: [number, number][] = [[3, 2.920], [6, 2.015], [7, 1.943], [8, 1.895], [10, 1.833], [15, 1.761], [30, 1.699], [50, 1.677]];
for (const [n, t] of T95) {
  const exakt = t * Math.sqrt(1 + 1 / n);
  pruefe(Math.abs(fraktilfaktorKn(n) - exakt) < 0.011, // Tabellenwerte auf 2 Stellen gerundet
    `k_n(${n}) = ${fraktilfaktorKn(n)} ≈ t·√(1+1/n) = ${exakt}`);
}
// Interpolation in n wäre bei n = 7 schlechter (2,090 statt exakt 2,077)
pruefe(Math.abs(fraktilfaktorKn(7) - 1.943 * Math.sqrt(8 / 7)) < Math.abs((2.18 + 2.00) / 2 - 1.943 * Math.sqrt(8 / 7)), '1/n genauer als n');

// ── Z24: t-Verteilung und t-Test ───────────────────────────────────────────────────────────────
// 7. Quantile t_(p; ν) gegen öffentliche Tabellenwerte (NIST/SEMATECH e-Handbook 1.3.6.7.2, 3 Nachkommastellen)
const T_TAB: [number, number, number][] = [
  [1, 0.975, 12.706], [2, 0.975, 4.303], [5, 0.975, 2.571], [9, 0.975, 2.262], [10, 0.975, 2.228], [20, 0.975, 2.086],
  [30, 0.975, 2.042], [120, 0.975, 1.980], [5, 0.95, 2.015], [10, 0.95, 1.812], [10, 0.995, 3.169], [3, 0.99, 4.541],
];
for (const [nu, pp, soll] of T_TAB) pruefe(nahe(tQuantil(pp, nu), soll, 6e-4), `t_(${pp}; ${nu}) = ${tQuantil(pp, nu)} statt ${soll}`);
// geschlossene Formen: ν = 1 (Cauchy) F(t) = ½ + arctan(t)/π; ν = 2: F(t) = ½ + t/(2√(2 + t²)); ν → ∞ → Normalverteilung
for (const x of [-3, -1, -0.2, 0, 0.5, 1, 2.5, 10]) {
  pruefe(nahe(tCDF(x, 1), 0.5 + Math.atan(x) / Math.PI, 1e-12), `F(${x}; 1)`);
  pruefe(nahe(tCDF(x, 2), 0.5 + x / (2 * Math.sqrt(2 + x * x)), 1e-12), `F(${x}; 2)`);
  pruefe(nahe(tCDF(x, 1e7), normalCDF(x, 0, 1), 1e-6), `F(${x}; ∞) ≈ Φ(${x})`);
}
pruefe(nahe(tPDF(0, 1), 1 / Math.PI, 1e-12) && nahe(lnGamma(5), Math.log(24), 1e-12) && nahe(lnGamma(0.5), Math.log(Math.sqrt(Math.PI)), 1e-12), 'f(0; 1) = 1/π, Γ(5) = 24, Γ(½) = √π');
pruefe(nahe(betaRegularisiert(0.3, 1, 1), 0.3, 1e-12) && nahe(betaRegularisiert(0.4, 2, 3), 1 - 0.6 ** 4 - 4 * 0.4 * 0.6 ** 3, 1e-12), 'I_x(a, b) geschlossen');
pruefe(Number.isNaN(tQuantil(0, 5)) && Number.isNaN(tCDF(1, 0)) && tQuantil(0.5, 7) === 0 && nahe(tQuantil(0.025, 10), -2.228, 6e-4), 'Quantil-Randfälle und Symmetrie');

// 8. Literaturbeispiel NIST/SEMATECH e-Handbook 1.3.5.3 (AUTO83B, Kraftstoffverbrauch US- gegen japanische Fahrzeuge):
//    n₁ = 249, x̄₁ = 20,14458, s₁ = 6,41470; n₂ = 79, x̄₂ = 30,48101, s₂ = 6,10771
//    gleiche Varianzen: T = −12,62059, ν = 326, t_(0,975; 326) = 1,9673, einseitig t_(0,95; 326) = 1,6495 (NIST);
//    Welch (nicht im NIST-Beispiel, nachgerechnet mit scipy.stats 1.18): T = −12,94627, ν = 136,8750
const k1 = { n: 249, mittelwert: 20.14458, stdAbw: 6.41470 }, k2 = { n: 79, mittelwert: 30.48101, stdAbw: 6.10771 };
const nistS = zweistichprobenTTestKennwerte(k1, k2, 0.05, 'student');
pruefe(nistS.gueltig && nahe(nistS.t, -12.62059, 5e-5) && nistS.nu === 326 && nahe(nistS.tKrit, 1.9673, 5e-5) && nistS.verworfen && nistS.p < 1e-20, `NIST Student ${nistS.t} ${nistS.tKrit}`);
pruefe(nahe(zweistichprobenTTestKennwerte(k1, k2, 0.05, 'student', 'kleiner').tKrit, 1.6495, 5e-5), 'NIST einseitig 1,6495');
const nistW = zweistichprobenTTestKennwerte(k1, k2, 0.05, 'welch');
pruefe(nahe(nistW.t, -12.94627, 5e-5) && nahe(nistW.nu, 136.8750, 5e-4) && nistW.verworfen, `NIST Welch ${nistW.t} ${nistW.nu}`);

// 9. Handbeispiel Betonserien (Würfeldruckfestigkeit in N/mm²), Kontrolle mit scipy.stats 1.18:
//    A: bereinigte Serie aus Fall 4 (x̄ = 38,47, s = 1,66537, n = 10); B: 36,1 34,8 37,5 35,2 36,9 33,7 35,8 36,4 (x̄ = 35,8, s = 1,21420, n = 8)
//    Einstichprobe A gegen μ₀ = 38: t = 0,47/(1,66537/√10) = 0,89246; ν = 9; p = 0,39538; KI 37,2787 … 39,6613 → H₀ bleibt
const serieA = [38.2, 36.5, 40.1, 39.4, 37.8, 41.0, 35.9, 38.8, 39.9, 37.1];
const serieB = [36.1, 34.8, 37.5, 35.2, 36.9, 33.7, 35.8, 36.4];
const e1 = einstichprobenTTest(serieA, 38, 0.05);
pruefe(e1.gueltig && nahe(e1.t, 0.892459, 1e-5) && e1.nu === 9 && nahe(e1.p, 0.395382, 1e-5) && nahe(e1.tKrit, 2.262157, 1e-5) && !e1.verworfen, `Einstichprobe ${e1.t} ${e1.p}`);
pruefe(nahe(e1.kiUnten, 37.278669, 1e-5) && nahe(e1.kiOben, 39.661331, 1e-5) && e1.kiUnten < 38 && 38 < e1.kiOben, `KI ${e1.kiUnten} ${e1.kiOben}`);
//    einseitig (H₁: μ > 38): p = 0,19769; das einseitige KI reicht bis +∞
const e1g = einstichprobenTTest(serieA, 38, 0.05, 'groesser');
pruefe(nahe(e1g.p, 0.197691, 1e-5) && e1g.kiOben === Infinity && nahe(e1g.tKrit, 1.833113, 1e-5), `einseitig ${e1g.p}`);
//    Zweistichproben A gegen B: Student t = 3,79061, ν = 16, p = 0,0016042, KI 1,1768 … 4,1632; Welch t = 3,92974, ν = 15,9052, p = 0,0012087, KI 1,2290 … 4,1110
const s2 = zweistichprobenTTest(serieA, serieB, 0.05, 'student');
pruefe(nahe(s2.t, 3.790614, 1e-5) && s2.nu === 16 && nahe(s2.p, 0.0016042, 1e-6) && nahe(s2.kiUnten, 1.176799, 1e-5) && nahe(s2.kiOben, 4.163201, 1e-5) && s2.verworfen, `Student ${s2.t} ${s2.p}`);
const w2 = zweistichprobenTTest(serieA, serieB, 0.05, 'welch');
pruefe(nahe(w2.t, 3.929743, 1e-5) && nahe(w2.nu, 15.905225, 1e-5) && nahe(w2.p, 0.0012087, 1e-6) && nahe(w2.kiUnten, 1.228967, 1e-5) && nahe(w2.kiOben, 4.111033, 1e-5), `Welch ${w2.t} ${w2.nu} ${w2.p}`);
//    Konsistenz: Entscheidung über p und über t_krit stimmt überein; KI enthält 0 genau dann, wenn H₀ bleibt
pruefe((Math.abs(s2.t) > s2.tKrit) === s2.verworfen && (s2.kiUnten > 0) === s2.verworfen, 'p-Wert, t_krit und KI konsistent');

// 10. Randfälle und Grenzen
pruefe(!einstichprobenTTest([35], 30, 0.05).gueltig && !einstichprobenTTest([35, 35, 35], 30, 0.05).gueltig, 'n = 1 bzw. s = 0 → Fehler');
pruefe(!einstichprobenTTest([35, NaN, 36], 30, 0.05).gueltig && !zweistichprobenTTest([1, 2], [3, Infinity], 0.05).gueltig, 'nicht endliche Werte → Fehler');
pruefe(!einstichprobenTTest(serieA, 38, 0).gueltig && !einstichprobenTTest(serieA, 38, 0.5).gueltig && einstichprobenTTest(serieA, 38, 0.2).hinweise.some(x => x.feld === 'alpha'), 'α außerhalb (0; 0,5) → Fehler, α > 10 % → Warnung');
pruefe(einstichprobenTTest([30, 31, 33], 30, 0.05).hinweise.some(x => x.feld === 'werte'), 'n < 5 → Warnung');
//    Welch mit s₂ = 0: ν = n₁ − 1, t wie Einstichprobentest gegen x̄₂
const w0 = zweistichprobenTTest(serieA, [36, 36, 36], 0.05, 'welch');
pruefe(w0.gueltig && nahe(w0.nu, 9, 1e-12) && nahe(w0.t, einstichprobenTTest(serieA, 36, 0.05).t, 1e-12), `Welch s₂ = 0: ν = ${w0.nu}`);
//    stark verschiedene Varianzen beim Student-Test → Warnung
pruefe(zweistichprobenTTest([30, 31, 29, 30, 30], [20, 40, 25, 35, 30], 0.05, 'student').hinweise.some(x => x.feld === 'variante'), 'Varianzverhältnis > 4 → Warnung');

// 11. Fuzz: 1 000 Zufallsfälle – endliche Ergebnisse, p ∈ [0; 1], Konsistenz p ↔ t_krit ↔ KI, ν_Welch zwischen min(n)−1 und n₁+n₂−2
let tGepr = 0;
const ALT: TTestAlternative[] = ['zweiseitig', 'groesser', 'kleiner'];
const VAR: TTestVariante[] = ['student', 'welch'];
for (let i = 0; i < 1000; i++) {
  const n1 = 2 + Math.floor(rnd() * 40), n2 = 2 + Math.floor(rnd() * 40);
  const mu = 5 + rnd() * 100, sd = mu * (0.01 + rnd() * 0.3);
  const a1 = Array.from({ length: n1 }, () => mu + sd * (rnd() + rnd() + rnd() - 1.5) * 2);
  const a2 = Array.from({ length: n2 }, () => mu * (0.9 + rnd() * 0.2) + sd * (0.3 + rnd() * 2) * (rnd() + rnd() + rnd() - 1.5) * 2);
  const alpha = [0.01, 0.05, 0.1][i % 3];
  const alt = ALT[Math.floor(rnd() * 3)], variante = VAR[i % 2];
  const r = zweistichprobenTTest(a1, a2, alpha, variante, alt);
  const e = einstichprobenTTest(a1, mu, alpha, alt);
  for (const [name, x] of [['zwei', r], ['ein', e]] as const) {
    if (!x.gueltig) continue;
    tGepr++;
    pruefe([x.t, x.nu, x.p, x.tKrit, x.standardfehler].every(Number.isFinite) && x.p >= 0 && x.p <= 1, `Fuzz ${i} ${name}: endlich`);
    const jenseits = alt === 'zweiseitig' ? Math.abs(x.t) > x.tKrit : alt === 'groesser' ? x.t > x.tKrit : x.t < -x.tKrit;
    if (Math.abs(Math.abs(x.t) - x.tKrit) > 1e-6) pruefe(jenseits === x.verworfen, `Fuzz ${i} ${name}: p und t_krit widersprechen sich`);
  }
  if (r.gueltig && variante === 'welch') pruefe(r.nu >= Math.min(n1, n2) - 1 - 1e-9 && r.nu <= n1 + n2 - 2 + 1e-9, `Fuzz ${i}: ν_Welch = ${r.nu}`);
}
pruefe(tGepr > 1900, `Fuzz t-Test: nur ${tGepr} gültige Fälle`);
for (let nu = 1; nu < 60; nu++) pruefe(tQuantil(0.975, nu + 1) < tQuantil(0.975, nu) && tQuantil(0.975, nu) > 1.959964, `t_(0,975; ν) fällt monoton gegen z = 1,96 (ν = ${nu})`);

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log(`OK: Statistik (${gepr} Fuzz-Fälle, t-Test ${tGepr})`);
