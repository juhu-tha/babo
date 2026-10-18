// Referenzwerte: unabhängig nachgerechnet nach DIN EN 1992-1-1 (Anhang B, 3.1.2, 3.3.2, 5.10)
import { fckT, creep, shrinkage, relaxation, frictionSlip, elasticLoss, timeDependentLoss } from '../src/utils/ec2Spannbeton';

let fails = 0;
const chk = (name: string, got: number, exp: number, tol = 0.01) => {
  const ok = Math.abs(got - exp) <= tol * Math.max(1e-9, Math.abs(exp)) + 1e-9;
  if (!ok) fails++;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}: got ${got.toPrecision(6)} exp ${exp.toPrecision(6)}`);
};

// Festigkeitsentwicklung Gl. (3.1)/(3.2)
chk('fck(7 d, R) C45/55', fckT(45, 7, 'R'), 35.39, 0.002);
chk('fck(3 d, N) C45/55', fckT(45, 3, 'N'), 23.71, 0.002);

// Kriechzahl Anhang B (inkl. Zementkorrektur t0 und α1..α3)
chk('φ(∞,7) C45/55 R RH70 h0=278', creep(45, 7, 'R', 278, 70), 1.634, 0.003);
chk('φ(∞,28) C45/55 N RH50 h0=150', creep(45, 28, 'N', 150, 50), 1.768, 0.003);
chk('φ(∞,3) C45/55 S RH80 h0=600', creep(45, 3, 'S', 600, 80), 2.210, 0.003);

// Schwinden: α_ds2 zementabhängig, k_h interpoliert
chk('ε_cs C45/55 R RH70 h0=278 [‰]', shrinkage(45, 'R', 278, 70).eps_cs, 0.4158, 0.003);
chk('ε_cs C45/55 N RH50 h0=150 [‰]', shrinkage(45, 'N', 150, 50).eps_cs, 0.4601, 0.003);
chk('ε_cs C45/55 S RH80 h0=600 [‰]', shrinkage(45, 'S', 600, 80).eps_cs, 0.2118, 0.003);

// Relaxation Klasse 2, Gl. (3.29), 500 000 h
chk('Δσ_pr(1360/1860, 500 000 h)', relaxation(1360, 1860, 2).delta_sigma_pr, 60.93, 0.003);
chk('Δσ_pr = 0 für μ ≤ 0,5', relaxation(900, 1860, 2).delta_sigma_pr + 1, 1, 1e-9);

// Reibung + Keilschlupf: l_set = √(w·Ep/p)
const fs0 = frictionSlip(5000, 3600, 195000, 0.2, 0.15, 0.005, 25, 4, 0);
chk('l_set [m]', fs0.l_set, 16.20, 0.005);
chk('σ am Anker nach Schlupf', fs0.sigma_x_final, 1292.6, 0.002);
chk('σ Feldmitte', frictionSlip(5000, 3600, 195000, 0.2, 0.15, 0.005, 25, 4, 12.5).sigma_x_final, 1329.2, 0.002);

// Elastische Verkürzung, j = (n−1)/(2n)
chk('Δσ_el n=4', elasticLoss(195000, 33000, 10, 4), (3 / 8) * (195000 / 33000) * 10, 1e-9);
chk('Δσ_el n=1 → 0', elasticLoss(195000, 33000, 10, 1) + 1, 1, 1e-9);

// Gl. (5.46) Handrechnung
{
  const Ep = 195000, Ecm = 36000, Ap = 2000, Ac = 400000, Ic = 1.6e10, zp = 150, phi = 1.6, eps = 0.4, dpr = 50, sc = 8;
  const ae = Ep / Ecm;
  const exp = (eps * 1e-3 * Ep + 0.8 * dpr + ae * phi * sc) / (1 + ae * (Ap / Ac) * (1 + Ac / Ic * zp * zp) * (1 + 0.8 * phi));
  chk('Gl. 5.46', timeDependentLoss(Ep, Ecm, Ap, Ac, Ic, zp, phi, eps, dpr, sc).delta_sigma_p_csr, exp, 1e-9);
}

console.log(fails === 0 ? '\nALLE TESTS BESTANDEN' : `\n${fails} FEHLER`);
process.exit(fails ? 1 : 0);
