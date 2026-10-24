// Spannbeton: Plausibilität und Robustheit der Rechenfunktionen (Umsetzungsplan Phase 4, AP 4.8)
import { creep, frictionSlip, pruefeSpannbeton, relaxation, shrinkage, timeDependentLoss, type SpannbetonEingabe } from '../src/calc/spannbeton';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: Spannbeton ---');

const basis: SpannbetonEingabe = { p0: 3200, b: 400, h: 1000, ep: 350, mG1: 780, mPerm: 1100, mChar: 1400, concreteAge: 7, spanLength: 25, frictionCoeff: 0.2, wobbleCoeff: 0.005, totalCurvature: 0.15, anchorSlip: 4, nTendons: 4 };
pruefe(!pruefeSpannbeton(basis).some(x => x.stufe === 'fehler'), 'Standardfall ohne Fehler');
for (const u of [{ ep: 500 }, { ep: -600 }, { p0: 0 }, { h: 0 }, { concreteAge: 0 }, { frictionCoeff: -0.1 }, { nTendons: 0 }, { p0: NaN }] as Partial<SpannbetonEingabe>[]) {
  pruefe(pruefeSpannbeton({ ...basis, ...u }).some(x => x.stufe === 'fehler'), JSON.stringify(u));
}
pruefe(pruefeSpannbeton({ ...basis, mPerm: 1500 }).some(x => x.feld === 'mPerm'), 'M_perm > M_char');

// Fuzz über den zulässigen Bereich: keine NaN/∞ in den EC2-Funktionen
let seed = 29;
const z = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
for (let i = 0; i < 1000; i++) {
  const fck = z(25, 90), t0 = z(1, 90), h0 = z(50, 1000), rh = z(40, 100);
  const cem = (['S', 'N', 'R'] as const)[i % 3];
  const phi = creep(fck, t0, cem, h0, rh);
  const eps = shrinkage(fck, cem, h0, rh).eps_cs;
  const r = relaxation(z(100, 1500), 1860, ((i % 3) + 1) as 1 | 2 | 3).delta_sigma_pr;
  const f = frictionSlip(z(500, 8000), z(500, 6000), 195000, z(0, 0.3), z(0, 0.5), z(0, 0.01), z(5, 60), z(0, 10), z(0, 30));
  const t = timeDependentLoss(195000, z(25000, 45000), z(500, 6000), z(1e5, 2e6), z(1e9, 1e11), z(0, 500), phi, eps, r, z(0, 20));
  const werte = [phi, eps, r, f.sigma_x_final, f.l_set, t.delta_sigma_p_csr];
  if (!werte.every(Number.isFinite)) { pruefe(false, `Fuzz ${i}: ${werte.join(', ')}`); break; }
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Spannbeton');
