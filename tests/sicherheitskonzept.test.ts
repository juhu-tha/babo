// Rechenkern Eurocode-Sicherheitskonzept, Gl. 6.10 mit Tausch der Leiteinwirkung (Umsetzung 29.10.2026, T4-SK-2)
import { kombination610 } from '../src/calc/sicherheitskonzept';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol = 1e-9) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Sicherheitskonzept Gl. 6.10 ---');

// 1. Startwerte des Moduls (Tranche 4, SK1): G_k 10, Q_k,1 5, Q_k,2 3 kN, ψ₀,₁ 0,7, ψ₀,₂ 0,6, γ_G 1,35, γ_Q 1,50
//    Q_k,1 Leit: 13,5 + 7,5 + 1,5·0,6·3 = 23,7 kN; Q_k,2 Leit: 13,5 + 4,5 + 1,5·0,7·5 = 23,25 kN → maßgebend Q_k,1
const basis = { gk: 10, qk1: 5, qk2: 3, psi01: 0.7, psi02: 0.6, gammaG: 1.35, gammaQ: 1.5 };
const a = kombination610(basis);
pruefe(a.gueltig && nahe(a.ed, 23.7) && nahe(a.edLeit2, 23.25) && nahe(a.edMax, 23.7) && a.massgebend === 1 && a.hinweise.length === 0, `SK1 ${a.ed} ${a.edLeit2}`);
const b = kombination610({ ...basis, getauscht: true });
pruefe(nahe(b.ed, 23.25) && nahe(b.leit, 4.5) && nahe(b.begleit, 5.25) && nahe(b.edMax, 23.7) && b.hinweise.some(h => h.stufe === 'warnung'), `SK1 getauscht ${b.ed}`);
// 2. Größere zweite Einwirkung: Q_k,1 2, Q_k,2 10 kN → Q_k,1 Leit 13,5 + 3 + 9 = 25,5; Q_k,2 Leit 13,5 + 15 + 2,1 = 30,6
const c = kombination610({ ...basis, qk1: 2, qk2: 10 });
pruefe(nahe(c.edLeit1, 25.5) && nahe(c.edLeit2, 30.6) && c.massgebend === 2 && nahe(c.edMax, 30.6) && c.hinweise.length === 1, `SK2 ${c.edLeit1} ${c.edLeit2}`);
// 3. Randfall gleiche Einwirkungen und ψ₀: beide Kombinationen gleich, maßgebend 1, kein Hinweis
const d = kombination610({ ...basis, qk1: 4, qk2: 4, psi01: 0.6, psi02: 0.6, getauscht: true });
pruefe(nahe(d.edLeit1, d.edLeit2) && d.massgebend === 1 && d.hinweise.length === 0, 'Randfall gleich');
// 4. Grenzen: negative Einwirkung, ψ₀ > 1, γ ≤ 0, NaN → Fehler ohne Ergebnis
for (const f of [{ qk1: -1 }, { psi02: 1.2 }, { gammaQ: 0 }, { gk: NaN }]) {
  const r = kombination610({ ...basis, ...f });
  pruefe(!r.gueltig && Number.isNaN(r.ed) && r.hinweise.some(h => h.stufe === 'fehler'), `Grenze ${JSON.stringify(f)}`);
}
// 5. Fuzz: 1 000 Zufallseingaben – endlich, Max ≥ beide, Kombination getauscht/ungetauscht konsistent
let s = 11;
const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
const psis = [0.5, 0.6, 0.7, 1.0];
for (let i = 0; i < 1000; i++) {
  const e = { gk: rnd() * 50, qk1: rnd() * 50, qk2: rnd() * 50, psi01: psis[i % 4], psi02: psis[(i >> 2) % 4], gammaG: i % 2 ? 1.35 : 1.0, gammaQ: 1.5, getauscht: i % 3 === 0 };
  const r = kombination610(e);
  pruefe(r.gueltig && [r.ed, r.edLeit1, r.edLeit2, r.edMax].every(Number.isFinite), `Fuzz ${i} nicht endlich`);
  pruefe(r.edMax >= r.edLeit1 - 1e-12 && r.edMax >= r.edLeit2 - 1e-12 && nahe(r.ed, r.staendig + r.leit + r.begleit, 1e-9), `Fuzz ${i} inkonsistent`);
}

if (fehler.length) { for (const f of fehler) console.log('FAIL', f); process.exit(1); }
console.log('Alle Prüfungen bestanden.');
