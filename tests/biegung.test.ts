// Rechenkern Biegebemessung gegen unabhängige Referenzen (Umsetzungsplan Phase 4, AP 4.3/4.5)
import { bemesseBiegung, MU_LIM_STAHL, spannungsblock, muLimit, xiLimit, type BiegungEingabe } from '../src/calc/biegung';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tolRel: number) => Math.abs(ist - soll) <= tolRel * Math.abs(soll);

console.log('--- Test: Biegebemessung ---');
const basis: BiegungEingabe = { b: 30, h: 50, d1: 5, d2: 5, med: 200, fck: 30, bewehrung: 'Stahl', fyk: 500, ftk: 3000, gammaFRP: 1.3 };

// 1. Handrechnung (Spannungsblock): b/h/d = 30/50/45 cm, C30/37, B500, M_Ed = 200 kNm
//    f_cd = 0,85·30/1,5 = 17,0 N/mm²; µ = 0,200/(0,30·0,45²·17 000) = 0,1937
//    ω = 1 − √(1 − 2µ) = 0,2173; A_s1 = ω·b·d·f_cd/f_yd = 11,47 cm²
const r = bemesseBiegung(basis);
pruefe(nahe(r.fcd, 17.0, 1e-6), `f_cd ${r.fcd}`);
pruefe(nahe(r.mu_Ed, 0.19366, 1e-3), `µ_Ed ${r.mu_Ed}`);
pruefe(nahe(r.omega, 0.21725, 1e-3), `ω ${r.omega}`);
pruefe(nahe(r.as1_req, 11.47, 5e-3), `A_s1 ${r.as1_req}`);
pruefe(r.as2_req === 0 && r.isPossible, 'ohne Druckbewehrung erwartet');

// 2. Unabhängige Referenz: Parabel-Rechteck-Diagramm (≤ C50/60, ε_cu2 = 3,5 ‰) mit
//    Völligkeitsbeiwert α_R = 17/21 und Höhenbeiwert k_a = 99/238 (geschlossene Integration).
//    ω = α_R·ξ, µ = α_R·ξ·(1 − k_a·ξ). Spannungsblock und Parabel-Rechteck müssen für
//    0,10 ≤ µ ≤ µ_lim auf 2 % übereinstimmen (bekannte Näherungsgüte des Blocks).
const aR = 17 / 21, ka = 99 / 238;
for (const xi of [0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45]) {
  const mu = aR * xi * (1 - ka * xi);
  const omegaPR = aR * xi;
  const med = mu * 0.30 * 0.45 * 0.45 * 17000;
  const rr = bemesseBiegung({ ...basis, med });
  pruefe(nahe(rr.omega, omegaPR, 0.02), `ξ=${xi}: ω Block ${rr.omega.toFixed(4)} vs. Parabel-Rechteck ${omegaPR.toFixed(4)}`);
}

// 3. Grenzwert µ_lim für ξ_lim = 0,45 (NA DE): 0,36·(1 − 0,18) = 0,2952
pruefe(nahe(MU_LIM_STAHL, 0.2952, 1e-4), `µ_lim ${MU_LIM_STAHL}`);

// 4. Druckbewehrung: Gleichgewicht ΔM = A_s2·σ_s2·(d − d2)
const rd = bemesseBiegung({ ...basis, med: 400 });
pruefe(rd.as2_req > 0 && rd.isPossible, 'Druckbewehrung erwartet');
const mlim = MU_LIM_STAHL * 0.30 * 0.45 ** 2 * 17000;
pruefe(nahe(rd.as2_req / 1e4 * rd.sigma_s2 * 1000 * (0.45 - 0.05), 400 - mlim, 1e-6), 'Momentengleichgewicht Druckbewehrung');
// Dehnung ε_s2 = 3,5‰·(x − d2)/x mit x = 0,45·45 = 20,25 cm → 2,64‰ > ε_yd = 2,17‰ → fließt
pruefe(nahe(rd.sigma_s2, 500 / 1.15, 1e-9), `σ_s2 ${rd.sigma_s2}`);
// Große d2: Druckbewehrung fließt nicht → σ_s2 < f_yd und Warnung
const rd2 = bemesseBiegung({ ...basis, med: 400, d2: 12 });
pruefe(rd2.sigma_s2 < 500 / 1.15 && rd2.hinweise.some(x => x.feld === 'd2'), 'σ_s2-Abminderung bei großem d2');

// 5. Absicherung gegen unsinnige Eingaben (AP 4.5): kein NaN/∞, stattdessen Fehlerhinweis
const unsinn: Partial<BiegungEingabe>[] = [
  { d1: 50 }, { d1: 60 }, { d2: 45 }, { d2: 50 }, { b: 0 }, { h: 0 }, { fck: 0 }, { fyk: 0 }, { med: -5 }, { med: NaN },
  { med: 400, d2: 25 },
];
for (const u of unsinn) {
  const ru = bemesseBiegung({ ...basis, ...u });
  const werte = [ru.as_final, ru.as1_req, ru.as2_req, ru.x, ru.mu_Ed, ru.omega];
  pruefe(werte.every(Number.isFinite), `${JSON.stringify(u)}: nicht endliche Ausgabe`);
  pruefe(ru.hinweise.some(x => x.stufe === 'fehler'), `${JSON.stringify(u)}: kein Fehlerhinweis`);
}
// Warnung oberhalb C50/60
pruefe(bemesseBiegung({ ...basis, fck: 70 }).hinweise.some(x => x.feld === 'fck' && x.stufe === 'warnung'), 'Warnung > C50/60');
// Hochfester Beton (Runde 5, Z55), DIN EN 1992-1-1, 3.1.7(3) Gl. (3.20)/(3.22) und Tab. 3.1:
//   C70/85: λ = 0,8 − 20/400 = 0,75; η = 1 − 20/200 = 0,90; ε_cu3 = 2,7 ‰; ξ_lim = 0,35 (NA DE, F-Freigabe)
//   µ_lim = 0,90·0,75·0,35·(1 − 0,75·0,35/2) = 0,2049; C90/105 und darüber: λ = 0,70, η = 0,80
const sb70 = spannungsblock(70), sb110 = spannungsblock(110);
pruefe(sb70.lambda === 0.75 && Math.abs(sb70.eta - 0.9) < 1e-12 && Math.abs(sb110.lambda - 0.7) < 1e-12 && Math.abs(sb110.eta - 0.8) < 1e-12 && spannungsblock(30).lambda === 0.8, 'λ/η hochfest');
pruefe(Math.abs(muLimit(70) - 0.9 * 0.75 * 0.35 * (1 - 0.75 * 0.35 / 2)) < 1e-12 && muLimit(30) === MU_LIM_STAHL && xiLimit(55) === 0.35 && xiLimit(50) === 0.45, 'µ_lim hochfest');
//   Gleichgewicht C70/85 (f_cd = 0,85·70/1,5 = 39,67): F_c = η·f_cd·b·λ·x = A_s1·f_yd und M = F_c·(d − λ·x/2)
const h70 = bemesseBiegung({ ...basis, fck: 70, med: 300 });
// Entscheidung Prof. Huber 27.10. (vorläufig, F-Freigabe): f_cd = 0,85·70/1,5·(1,1 − 70/500) = 39,667·0,96 = 38,08 N/mm²
pruefe(Math.abs(h70.fcd - 0.85 * 70 / 1.5 * 0.96) < 1e-9 && h70.hinweise.some(x => /1,1 − f_ck\/500/.test(x.text)), `f_cd C70/85 hochfest ${h70.fcd}`);
pruefe(Math.abs(bemesseBiegung({ ...basis, fck: 50 }).fcd - 0.85 * 50 / 1.5) < 1e-12 && !bemesseBiegung({ ...basis, fck: 50 }).hinweise.some(x => /1,1 − f_ck/.test(x.text)), 'C50/60: keine Hochfest-Abminderung');
const fc70 = 0.9 * h70.fcd * 300 * 0.75 * h70.x * 10;
pruefe(h70.epsCu3 === 2.7 && h70.as2_req === 0 && Math.abs(fc70 - h70.as1_req * 100 * h70.fyd) / fc70 < 1e-9 && Math.abs(fc70 * (450 - 0.75 * h70.x * 10 / 2) / 1e6 - 300) < 1e-6, `Gleichgewicht C70/85 ${JSON.stringify({ x: h70.x, as: h70.as1_req })}`);
//   Druckbewehrung C70/85 mit ε_cu3 = 2,7 ‰: ε_s2 = 2,7·(x − d₂)/x
const d70 = bemesseBiegung({ ...basis, fck: 70, med: 600 });
pruefe(d70.as2_req > 0 && Math.abs(d70.x - 0.35 * 45) < 1e-9 && Math.abs(d70.sigma_s2 - Math.min(d70.fyd, 200000 * 2.7e-3 * (d70.x - 5) / d70.x)) < 1e-9, `Druckbewehrung C70/85 ${d70.sigma_s2}`);

// 6. A_s,max = 0,04·A_c (NA DE 9.2.1.1): großes Moment im kleinen Querschnitt → Warnung
pruefe(bemesseBiegung({ ...basis, b: 20, h: 30, med: 250 }).hinweise.some(x => x.text.includes('A_s,max')), 'Warnung A_s,max');

// 7. Nichtmetallisch, linear-elastisch: Gleichgewicht A_f·σ_f = 0,8·x·b·f_cd mit σ_f aus ε_cu3·(d−x)/x
const rf = bemesseBiegung({ ...basis, bewehrung: 'GFK', ftk: 1000, gammaFRP: 1.3, med: 150 });
const sf = Math.min(50000 * 3.5e-3 * (45 - rf.x) / rf.x, 1000 / 1.3);
pruefe(nahe(rf.as1_req * 100 * sf, 0.8 * rf.x * 10 * 300 * 17, 1e-6), 'Gleichgewicht GFK');
pruefe(sf < 1000 / 1.3 && !rf.hinweise.some(x => x.text.includes('sprödes')), 'GFK: Betonversagen maßgebend, kein Sprödbruch-Hinweis');
// Hohe Dehnung bei kleinem Moment → Bewehrung erreicht f_fd → Hinweis auf sprödes Versagen
pruefe(bemesseBiegung({ ...basis, bewehrung: 'GFK', ftk: 1000, gammaFRP: 1.3, med: 30 }).hinweise.some(x => x.text.includes('sprödes')), 'Sprödbruch-Hinweis');

// 8. Fuzz (AP 4.8): 1 000 Zufallseingaben ohne NaN/∞ in den Ausgaben
let seed = 42;
const zufall = (a: number, b: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (b - a) * (seed / 2147483648); };
const arten = ['Stahl', 'Carbon', 'GFK', 'Basalt'] as const;
for (let i = 0; i < 1000; i++) {
  const ein: BiegungEingabe = { b: zufall(-5, 120), h: zufall(-5, 150), d1: zufall(-2, 40), d2: zufall(-2, 40), med: zufall(-50, 3000),
    fck: zufall(-5, 100), bewehrung: arten[i % 4], fyk: zufall(-10, 700), ftk: zufall(-10, 3000), gammaFRP: zufall(-0.5, 2) };
  const rz = bemesseBiegung(ein);
  const ok = [rz.as_final, rz.as1_req, rz.as2_req, rz.x, rz.mu_Ed, rz.omega, rz.as_min].every(Number.isFinite);
  if (!ok) { pruefe(false, `Fuzz ${i}: ${JSON.stringify(ein)}`); break; }
}

if (fehler.length) {
  for (const f of fehler) console.error(`FAIL: ${f}`);
  process.exit(1);
}
console.log('OK: Biegebemessung');
