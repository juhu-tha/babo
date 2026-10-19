import * as K from '../src/utils/schadensKern';
let fails = 0;
const near = (name: string, a: number, b: number, tol = 0.01) => {
  const ok = Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  if (!ok) fails++;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}: ${a.toFixed(4)} (soll ${b})`);
};
// Bohrkern-Beispiel der Seite: 265 kN, D=100 → 33,7
near('coreStrength', K.coreStrength(265, 100), 33.74);
// Haftzug-Beispiel: 3,2 kN, d=50 → 1,63
near('pullOff', K.pullOff(3.2, 50), 1.63, 0.005);
// Karbonatisierung: 15 mm / 40 a → 2,37
near('carbonationK', K.carbonationK(15, 40), 2.372, 0.002);
near('t bis c=30 mm', K.timeToDepassivation(30, K.carbonationK(15, 40)), 160, 0.001);
// E_dyn: ρ=2400, v=4500, ν=0,2 → 43 740 N/mm²
near('eDyn', K.eDynUltrasound(2400, 4500, 0.2), 43740, 0.001);
// Wenner: a=0,05 m, U=0,1 V, I=50 µA → 628 Ω·m
near('wenner', K.wennerResistivity(0.05, 0.1, 50e-6), 628.3, 0.001);
// Korrosion 10 µA/cm² ≈ 0,116 mm/a
near('corrRate', K.corrosionRate_um_a(10), 116);
// Spalt: halbe Breite → 1/8
near('slit ratio', K.slitFlow(0.1e-3, 1, 1e5, 1e-3, 0.2) / K.slitFlow(0.2e-3, 1, 1e5, 1e-3, 0.2), 0.125, 1e-9);
// Fuge: Betonfertigteil 3 m, α=10e-6, ΔT=60 K → 1,8 mm; ZGV 25 % → 7,2 mm
near('deltaL', K.deltaL(10e-6, 3000, 60), 1.8);
near('jointWidth', K.jointWidth(1.8, 0.25), 7.2);
// Holz: 20 % Höhenverlust → W 0,64, I 0,512
near('bendingRatio', K.bendingRatio(1, 1, 1, 0.8), 0.64);
near('stiffnessRatio', K.stiffnessRatio(1, 1, 1, 0.8), 0.512);
// Darr: 102,38 g / 100 g → 2,38
near('darr', K.darrMoisture(102.38, 100), 2.38);
// Chlorid: V=1,5 ml, c=0,1, m=5 g, z=0,136 → Beton 0,106 %, Zement 0,782 %
const cl = K.chlorideByCement(1.5e-3, 0.1, 5, 0.136);
near('Cl Beton', cl.clConcrete, 0.1064, 0.002); near('Cl Zement', cl.clCement, 0.782, 0.002);
// EN 13791: 8 Kerne
const r = K.fckIs13791([28, 30, 31, 27, 29, 33, 26, 30]);
near('kn(8)', r.kn, 2.0); near('fckIs', r.fckIs, Math.min(29.25 - 2 * r.s, 26 + 4));
near('fck-Äquivalent 24,8', K.fckEquivalent(24.8), 29.18);
// Rissbreite: σs=250, fct=2,9, ρ=0,02, φ=16, c=30, Ecm=33000, kt=0,4
const w = K.crackWidthEC2({ sigmaS: 250, fctEff: 2.9, rhoPEff: 0.02, phi: 16, c: 30, Ecm: 33000 });
near('srMax', w.srMax, 3.4 * 30 + 0.425 * 0.8 * 0.5 * 16 / 0.02);
near('wk', w.wk, w.srMax * Math.max((250 - 0.4 * 2.9 / 0.02 * (1 + 200000 / 33000 * 0.02)) / 200000, 0.6 * 250 / 200000));
// DIN 1076 Plan
const p = K.din1076Plan(2020, 7).map(x => x.art).join('');
if (p !== 'HBBEBBH') { fails++; console.log('FAIL din1076Plan', p); } else console.log('OK   din1076Plan', p);
if (K.riebwClass(3.0) !== 'nicht ausreichender Bauwerkszustand' || K.riebwClass(2.2) !== 'befriedigender Bauwerkszustand') { fails++; console.log('FAIL riebw'); } else console.log('OK   riebwClass');
console.log(fails ? `${fails} FEHLER` : 'ALLE TESTS BESTANDEN');
process.exit(fails ? 1 : 0);
