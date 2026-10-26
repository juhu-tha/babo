// Rechenkern Packungsdichte: Sieblinien (Fuller, modifizierte Andreasen-Kurve), Massen, Zweikornmischung (AP 4.2)
import {
  andreasenModifiziert, fuller, rmse, packungsdichteSchaetzung, sieblinienOptimierung, furnasIdeal, furnasMaximum,
  zweikornMischung, SIEBE, DURCHGANG, type SieblinienEingabe,
} from '../src/calc/packungsdichte';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
console.log('--- Test: Packungsdichte ---');

// 1. Fuller-Kurve P = (d/D)^0,5 (Handbeispiel D = 16 mm): d = 4 → 50 %, d = 1 → 25 %, d = 8 → 70,7 %
pruefe(nahe(fuller(4, 16), 50, 1e-12) && nahe(fuller(1, 16), 25, 1e-12) && nahe(fuller(8, 16), 70.71, 0.001), 'Fuller D = 16');
pruefe(nahe(fuller(2, 16, 0.4), 100 * Math.pow(0.125, 0.4), 1e-12), 'Potenzkurve mit n = 0,4');
// modifizierte Andreasen-Kurve: mit q = 0,5 und d_min = 0 identisch mit Fuller; Randwerte 0 % und 100 %
for (const d of SIEBE) pruefe(nahe(andreasenModifiziert(d, 0.5, 0, 16), fuller(d, 16), 1e-9), `A&A = Fuller bei d = ${d}`);
pruefe(andreasenModifiziert(0.001, 0.3, 0.001, 16) === 0 && andreasenModifiziert(16, 0.3, 0.001, 16) === 100 && andreasenModifiziert(20, 0.3, 0.001, 16) === 100, 'A&A Randwerte');
// Handrechnung q = 0,3, d_min = 0,001, D = 16, d = 1: (1 − 0,001^0,3)/(16^0,3 − 0,001^0,3) = 0,8741/2,1715 = 40,25 %
pruefe(nahe(andreasenModifiziert(1, 0.3, 0.001, 16), 40.25, 0.002), 'A&A q = 0,3 bei d = 1 mm');
// kleineres q → mehr Feinanteil
pruefe(andreasenModifiziert(0.125, 0.23, 0.001, 16) > andreasenModifiziert(0.125, 0.37, 0.001, 16), 'q kleiner → feiner');
pruefe(rmse([0, 0], [3, 4]) === Math.sqrt(12.5) && rmse([1, 2, 3], [1, 2, 3]) === 0, 'RMSE');
pruefe(packungsdichteSchaetzung(0, 'rund') === 0.75 && packungsdichteSchaetzung(30, 'gebrochen') === 0.58 && packungsdichteSchaetzung(-200, 'rund') === 0.85, 'Packungsdichte-Schätzung mit Grenzen');

// 2. Standardmischung des Moduls: 12 % Zement, 5 % Zusatzstoff, 33 % Sand, 20 % Kies 2/8 → Kies 8/16 = 30 %
const std: SieblinienEingabe = { zement: 12, zusatz: 5, sand: 33, kies1: 20, q: 0.3, kornform: 'rund', vFest: 750 };
const r = sieblinienOptimierung(std);
pruefe(r.gueltig && r.aKies2 === 30 && !r.gekappt && r.hinweise.length === 0, 'Standard: Kies 8/16 = 30 %');
// Massen: Zement 0,12·750·3,1 = 279 kg; Summe 750·(0,12·3,1 + 0,88·2,65) = 2028 kg
pruefe(nahe(r.mZement, 279, 1e-12) && nahe(r.mTotal, 2028, 1e-12) && nahe(r.mKies2, 596.25, 1e-12), 'Massen je m³');
// Massen proportional zum Feststoffvolumen (Regler V_fest)
pruefe(nahe(sieblinienOptimierung({ ...std, vFest: 600 }).mTotal, 2028 * 600 / 750, 1e-12), 'Massen ∝ V_fest');
// Mischsieblinie: bei 16 mm 100 %, bei 2 mm = Zement + Zusatz + Sand + 5 % von Kies 2/8 = 12 + 5 + 33 + 1 = 51 %
const s2 = r.sieblinie.find(p => p.d === 2)!;
pruefe(nahe(s2.gemisch, 51, 1e-12) && r.sieblinie[r.sieblinie.length - 1].gemisch === 100 && r.sieblinie.length === SIEBE.length, 'Mischsieblinie');
pruefe(r.sieblinie.every((p, i) => i === 0 || p.gemisch >= r.sieblinie[i - 1].gemisch), 'Mischsieblinie monoton');
pruefe(nahe(r.rmseAA, rmse(r.sieblinie.map(p => p.gemisch), r.sieblinie.map(p => p.andreasen)), 1e-12) && r.packungsdichte === packungsdichteSchaetzung(r.rmseAA, 'rund'), 'RMSE und Schätzung');
pruefe(Object.values(DURCHGANG).every(d => d.length === SIEBE.length && d[d.length - 1] === 100), 'Durchgangstabellen vollständig');

// 3. Kappung über 100 % (Reihenfolge Zement → Zusatz → Sand → Kies 2/8)
const k = sieblinienOptimierung({ ...std, zement: 30, zusatz: 30, sand: 60, kies1: 60 });
pruefe(k.gekappt && k.aSand === 40 && k.aKies1 === 0 && k.aKies2 === 0 && k.hinweise.some(h => h.feld === 'anteile'), 'Kappung mit Hinweis');
pruefe(sieblinienOptimierung({ ...std, q: 0.6, vFest: 900 }).hinweise.length === 2, 'Hinweise q und V_fest außerhalb üblich');
for (const bad of [{ ...std, zement: -1 }, { ...std, q: 0 }, { ...std, vFest: 0 }, { ...std, sand: NaN }, { ...std, dMax: 0.0005 }]) {
  pruefe(!sieblinienOptimierung(bad).gueltig, `unzulässig ${JSON.stringify(bad)}`);
}

// 4. Zweikornmischung – Furnas-Grenzfall unendlichen Größenverhältnisses
//    arXiv:2501.16005 (Random packing fraction of binary hyperspheres…), Gl. (14)–(17): η_max = f·(2 − f) = 1 − (1 − f)²,
//    mit f ≈ 0,635 (dichteste Zufallspackung) η_max ≈ 0,87 bei Grobkornanteil c_L = 1/(2 − f) ≈ 0,733 (Feinkorn 0,267).
const fm = furnasMaximum(0.635, 0.635);
pruefe(nahe(fm.gamma, 0.87, 0.02) && nahe(fm.gamma, 1 - 0.365 ** 2, 1e-12) && nahe(1 - fm.y1, 1 / (2 - 0.635), 1e-12), `Furnas-Maximum ${JSON.stringify(fm)}`);
pruefe(nahe(furnasIdeal(fm.y1, 0.635, 0.635), fm.gamma, 1e-12) && furnasIdeal(0, 0.62, 0.6) === 0.6 && nahe(furnasIdeal(1, 0.62, 0.6), 0.62, 1e-12), 'Furnas: Endpunkte und Schnittpunkt');
const zk = zweikornMischung({ d1: 0.5, d2: 8, phi1: 0.6, phi2: 0.62 });
const maxKurve = Math.max(...zk.punkte.map(p => p.ideal)) / 100;
pruefe(zk.gueltig && zk.punkte.length === 51 && nahe(maxKurve, zk.maximum.gamma, 0.02) && maxKurve <= zk.maximum.gamma + 1e-12, 'Kurvenmaximum ≈ γ_max');
pruefe(nahe(zk.punkte[0].linear, 62, 1e-12) && nahe(zk.punkte[50].linear, 60, 1e-12) && nahe(zk.verhaeltnis, 0.0625, 1e-12), 'linear: Endpunkte φ2, φ1');
// d1/d2 → 0: „real“ = ideal − 0,05·y1·y2; d1 = d2: Wechselwirkung 1 → ideal − 1,5·(ideal − linear)
const z0 = zweikornMischung({ d1: 1e-9, d2: 8, phi1: 0.6, phi2: 0.62 });
pruefe(nahe(z0.punkte[25].real, z0.punkte[25].ideal - 0.05 * 0.5 * 0.5 * 100, 1e-6), 'kleines d1/d2: Wandeffektterm');
const z1 = zweikornMischung({ d1: 8, d2: 8, phi1: 0.6, phi2: 0.62 });
pruefe(z1.interaktion === 1 && nahe(z1.punkte[25].real, z1.punkte[25].ideal - 1.5 * (z1.punkte[25].ideal - z1.punkte[25].linear), 1e-9) && z1.hinweise.some(h => h.feld === 'd1'), 'd1 = d2: volle Wechselwirkung, Hinweis');
for (const bad of [{ d1: 0, d2: 8, phi1: 0.6, phi2: 0.6 }, { d1: 1, d2: 8, phi1: 1, phi2: 0.6 }, { d1: 1, d2: NaN, phi1: 0.6, phi2: 0.6 }]) {
  pruefe(!zweikornMischung(bad).gueltig, `Zweikorn unzulässig ${JSON.stringify(bad)}`);
}

// 5. Fuzz: 1 000 Zufallseingaben ohne NaN/∞ bei gültigem Ergebnis
let seed = 10452;
const z = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
for (let i = 0; i < 1000; i++) {
  const s = sieblinienOptimierung({ zement: z(-5, 120), zusatz: z(-5, 60), sand: z(-5, 90), kies1: z(-5, 90), q: z(-0.1, 1), kornform: i % 2 ? 'rund' : 'gebrochen', vFest: z(-10, 1100) });
  const w = zweikornMischung({ d1: z(-0.5, 40), d2: z(-0.5, 40), phi1: z(-0.1, 1.1), phi2: z(-0.1, 1.1) });
  const zahlen = [
    ...(s.gueltig ? [s.mTotal, s.rmseAA, s.rmseFuller, s.packungsdichte, s.aKies2, ...s.sieblinie.flatMap(p => [p.gemisch, p.andreasen, p.fuller])] : []),
    ...(w.gueltig ? [w.maximum.gamma, ...w.punkte.flatMap(p => [p.ideal, p.real, p.linear])] : []),
  ];
  const anteileOk = !s.gueltig || [s.aZement, s.aZusatz, s.aSand, s.aKies1, s.aKies2].every(a => a >= -1e-9) && Math.abs(s.aZement + s.aZusatz + s.aSand + s.aKies1 + s.aKies2 - 100) < 1e-9;
  if (!zahlen.every(Number.isFinite) || !anteileOk) { pruefe(false, `Fuzz ${i}`); break; }
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Packungsdichte');
