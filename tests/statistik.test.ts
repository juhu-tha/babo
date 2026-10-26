// Rechenkern Statistik (Z3): Stichprobenkennwerte, Ausreißerkriterien, k_n nach DIN EN 1990 Tab. D1, X_k und X_d
import { erf, normalCDF, normalPDF, stichprobe, grubbsKritisch, fraktilfaktorKn, ausreisserGrenzen, statistikAuswertung, type AusreisserMethode, type StatistikMaterial } from '../src/calc/statistik';

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

// 3. Tabellen: k_n (DIN EN 1990 Tab. D1) und G_krit (ASTM E178, einseitig 5 %)
pruefe(fraktilfaktorKn(3) === 3.37 && fraktilfaktorKn(10) === 1.92 && fraktilfaktorKn(30) === 1.73 && Number.isNaN(fraktilfaktorKn(2)), 'k_n Stützstellen');
//    n = 7: 2,18 + (2,00 − 2,18)·(1/6 − 1/7)/(1/6 − 1/8) = 2,0771; n = 50: 1,73 + (1,64 − 1,73)·(1/30 − 1/50)/(1/30) = 1,694
pruefe(nahe(fraktilfaktorKn(7), 2.07714, 1e-5) && nahe(fraktilfaktorKn(50), 1.694, 1e-12) && nahe(fraktilfaktorKn(1e9), 1.64, 1e-6), `k_n Zwischenwerte ${fraktilfaktorKn(7)} ${fraktilfaktorKn(50)}`);
pruefe(grubbsKritisch(3) === 1.153 && grubbsKritisch(2) === 1.153 && nahe(grubbsKritisch(11), 2.2305, 1e-12) && grubbsKritisch(80) === 2.956, `G_krit ${grubbsKritisch(11)}`);

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
//    Grubbs n = 11: G_krit = 2,2305 → 25,53 … 55,33
const gr = statistikAuswertung({ werte: serie, methode: 'grubbs', material: 'holz', ausreisserPruefen: true });
pruefe(nahe(gr.untereGrenze, 25.5252, 1e-4) && nahe(gr.obereGrenze, 55.3293, 1e-4) && gr.gKrit === 2.2305 && gr.ausreisser.length === 1 && nahe(gr.xd, gr.xk / 1.3, 1e-12), `Grubbs ${gr.untereGrenze} ${gr.obereGrenze}`);
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

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log(`OK: Statistik (${gepr} Fuzz-Fälle)`);
