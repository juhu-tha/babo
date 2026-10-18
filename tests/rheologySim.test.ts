import { simulate, DT } from '../src/utils/rheologySim';

const at = (arr: (number | null)[], t: number) => arr[Math.round(t / DT)] as number;
let fails = 0;
const chk = (name: string, got: number, exp: number, tol = 0.01) => {
  const ok = Math.abs(got - exp) <= tol * Math.max(1e-9, Math.abs(exp)) + 1e-9;
  if (!ok) fails++;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}: got ${got.toPrecision(6)} exp ${exp.toPrecision(6)}`);
};

// Realistische Parameter: E = 30 000 MPa, τ = η/E = 2 s
const E = 30000, eta = 60000, fy = 20, Et = 3000, s0 = 15, e0 = 0.001;
const P = { E, eta, fy, Et, sigma0: s0, eps0: e0 };

// Maxwell Kriechen: ε(5-) = σ/E + σ·4/η, nach Entlastung bleibend σ·4/η
let r = simulate('maxwell', 'kriechen', P);
chk('Maxwell creep ε(4.99)', at(r.eps, 4.99), s0 / E + s0 * (3.99 - 0.025) / eta, 0.01);
chk('Maxwell creep ε(10)', at(r.eps, 10), s0 * 4 / eta, 0.01);
chk('Maxwell creep W_diss = σ²·4/η', r.W_diss, s0 * s0 * 4 / eta, 0.02);

// Maxwell Relaxation
r = simulate('maxwell', 'relaxieren', P);
const sS = r.relax!.sigmaStart;
chk('Maxwell σ(t=6.0)/σ(1.05)', at(r.sigma, 6) / sS, Math.exp(-(6 - 1.05) / 2), 0.01);
chk('Maxwell σStart ≈ E·ε0', sS, E * e0, 0.03);

// Kelvin Kriechen
r = simulate('kelvin', 'kriechen', P);
chk('Kelvin ε(5)', at(r.eps, 5), (s0 / E) * (1 - Math.exp(-(5 - 1.025) / 2)), 0.01);

// Zener Kriechen: E1 = 0.4E, E2 = 0.6E
const E1 = 0.4 * E, E2 = 0.6 * E, tauE = eta * (E1 + E2) / (E1 * E2), tauS = eta / E2;
r = simulate('zener', 'kriechen', P);
chk('Zener ε(1.05) ≈ σ/(E1+E2)', at(r.eps, 1.05), s0 / E, 0.03);
chk('Zener ε(4.99)', at(r.eps, 4.99), s0 / E1 - (s0 / E1 - s0 / E) * Math.exp(-(4.99 - 1.025) / tauE), 0.01);
// Zener Relaxation
r = simulate('zener', 'relaxieren', P);
const zS = r.relax!.sigmaStart;
chk('Zener σ(6.9)', at(r.sigma, 6.9), E1 * e0 + (zS - E1 * e0) * Math.exp(-(6.9 - 1.05) / tauS), 0.01);

// Elasto-plastisch (Tangentenmodul) Kraftsteuerung Dreieck bis σ0 = 30 MPa > fy
r = simulate('elasto_plastic', 'dreieck', { ...P, sigma0: 30 });
chk('EP ε(3) = fy/E + (σ-fy)/Et', at(r.eps, 3), fy / E + (30 - fy) / Et, 0.01);
chk('EP bleibend ε(10) = (σ-fy)/H', at(r.eps, 10), (30 - fy) / (E * Et / (E - Et)), 0.01);
// Weggesteuert gleiche Tangente
r = simulate('elasto_plastic', 'dreieck', { ...P, eps0: fy / E + 10 / Et }, 'strain');
chk('EP strain-ctrl σ(3) = 30', at(r.sigma, 3), 30, 0.01);

// Prandtl Kraftsteuerung oberhalb fy → Versagen
r = simulate('prandtl', 'kriechen', { ...P, sigma0: 25 });
console.log('Prandtl σ0>fy failed =', r.failed, 'tFail =', r.tFail);
if (!r.failed) fails++;
// Prandtl Relaxation mit ε0 > εy → Restspannung −(Eε0 − fy)
r = simulate('prandtl', 'relaxieren', { ...P, eps0: 0.001 });
chk('Prandtl Eigenspannung', at(r.sigma, 10), -(E * 0.001 - fy), 0.01);
chk('Prandtl W_diss = fy·εp', r.W_diss, fy * (0.001 - fy / E), 0.01);
// Prandtl zyklisch weggesteuert: Hysterese = 4·fy·εp-Amplitude (2 Zyklen)
r = simulate('prandtl', 'sinus', { ...P, eps0: 0.002 }, 'strain');
const ey = fy / E;
// erster Halbzyklus: εp = ε0−εy; danach je Halbzyklus 2(ε0−εy). Gesamt: (ε0−εy) + 3·2(ε0−εy) + Rückkehr (ε0−εy)… numerisch prüfen:
console.log('Prandtl zyklisch W_diss =', (r.W_diss * 1000).toFixed(1), 'kJ/m³; W_stored =', (r.W_stored * 1000).toFixed(2));
chk('Prandtl zyklisch W_diss = fy·Σ|Δεp| = fy·0,01', r.W_diss, fy * 0.01, 0.01);

// St. Venant unterhalb fy: starr
r = simulate('st_venant', 'kriechen', { ...P, sigma0: 10 });
chk('St.Venant ε = 0', Math.abs(at(r.eps, 3)) + 1, 1, 1e-9);

// Bingham Kriechen
r = simulate('bingham', 'kriechen', { ...P, sigma0: 30, eta: 100 });
chk('Bingham ε(10) = (σ-τ0)·4/μp', at(r.eps, 10), (30 - fy) * 4 / 100, 0.02);

// Newton Relaxation: Spitze = η ε0 / T_RAMP
r = simulate('newton', 'relaxieren', { ...P, eta: 100, eps0: 0.01 });
chk('Newton Spike', r.spikePeak!, 100 * 0.01 / 0.05, 0.01);

// Hooke: keine Dissipation
r = simulate('hooke', 'sinus', P);
chk('Hooke W_diss ≈ 0', Math.abs(r.W_diss) + 1, 1, 1e-6);


// Ergänzung: Kelvin-Voigt relaxiert nicht – Startwert darf nicht auf der Spannungsspitze liegen
{
  const rk = simulate('kelvin', 'relaxieren', P);
  chk('Kelvin relax R ≈ 0 %', Math.abs(rk.relax!.R) + 1, 1, 0.01);
  chk('Kelvin relax σStart = E·ε0', rk.relax!.sigmaStart, E * e0, 0.01);
}

console.log(fails === 0 ? '\nALLE TESTS BESTANDEN' : `\n${fails} FEHLER`);
process.exit(fails ? 1 : 0);
