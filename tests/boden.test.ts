// Rechenkern Bodenmechanik (Umsetzungsplan Phase 4, AP 4.3/4.8)
import { erddruckRankine, konsolidierung, konsolidierungsgrad, mohrCoulomb, zustandsgrenzen } from '../src/calc/boden';
import { aLinie, fliessgrenze, fliessgrenzeEinpunkt, ausrollgrenze, bodengruppePlastizitaet, atterberg, EINPUNKT_EXPONENT } from '../src/calc/boden';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
console.log('--- Test: Boden ---');

// 1. Zustandsgrenzen: w = 25, w_L = 45, w_P = 20 → I_P = 25, I_c = 0,8 (steif); oberhalb A-Linie (14,6) → TM
const z = zustandsgrenzen(25, 45, 20);
pruefe(z.iP === 25 && z.iC === 0.8 && z.zustand === 'steif' && z.klasse.startsWith('TM'), JSON.stringify(z));
pruefe(zustandsgrenzen(20, 25, 20).klasse.startsWith('UL/TL'), 'Zwischenbereich I_P = 5');
pruefe(zustandsgrenzen(30, 60, 45).klasse.startsWith('UA'), 'unterhalb A-Linie, w_L > 50');
pruefe(zustandsgrenzen(50, 45, 20).zustand === 'flüssig', 'I_c < 0');
pruefe(zustandsgrenzen(25, 20, 30).hinweise.some(x => x.stufe === 'fehler'), 'w_P > w_L → Fehler (vorher I_c = 0 still)');

// 2. Mohr-Coulomb: σ₁,f = σ₃·tan²(45° + φ/2) + 2c·tan(45° + φ/2); φ = 30°, c = 10, σ₃ = 50 → 150 + 34,64 = 184,64 kN/m²
const m = mohrCoulomb(10, 30, 150, 50);
pruefe(nahe(m.sigma1_f, 184.64, 1e-4) && !m.isFailing, `σ1,f ${m.sigma1_f}`);
// Konsistenz: genau im Grenzzustand ist die Ausnutzung 1
pruefe(nahe(mohrCoulomb(10, 30, m.sigma1_f, 50).ausnutzung, 1, 1e-9), 'Grenzkreis berührt die Bruchgerade');
pruefe(mohrCoulomb(10, 30, 40, 50).hinweise.some(x => x.stufe === 'fehler'), 'σ1 < σ3 → Fehler');

// 3. Rankine φ = 30°: K_a = 1/3, K_p = 3, K_0 = 0,5; γ = 20, h = 5 → E_a = 0,5·20·25/3 = 83,33 kN/m
const e = erddruckRankine(30, 20, 5);
pruefe(nahe(e.k_a, 1 / 3, 1e-12) && nahe(e.k_p, 3, 1e-12) && nahe(e.k_0, 0.5, 1e-12) && nahe(e.E_a, 83.333, 1e-4), 'Rankine');

// 4. Konsolidierung: Terzaghi-Tabellenwerte U(T_v): 0,197 → 50 %; 0,848 → 90 %; 0,0491 → 25 %
pruefe(nahe(konsolidierungsgrad(0.197), 0.5, 0.005) && nahe(konsolidierungsgrad(0.848), 0.9, 0.003) && nahe(konsolidierungsgrad(0.0491), 0.25, 0.005), 'U(T_v)');
// h = 4 m zweiseitig, Δσ = 50, E_s = 5 MN/m², c_v = 2 m²/a → s = 40 mm; t_50 = 0,197·4/2 = 0,394 a
const k = konsolidierung(4, 50, 5, 2, 'zweiseitig');
pruefe(nahe(k.s_end, 40, 1e-12) && nahe(k.t_50, 0.394, 1e-9) && k.kurve.length === 51, 'Setzung');
// vorher Endlosschleife möglich bei c_v = 0 oder h = 0 → jetzt Fehler und leere Kurve
for (const [h, cv] of [[0, 2], [4, 0], [4, -1]]) { const r = konsolidierung(h, 50, 5, cv, 'einseitig'); pruefe(r.kurve.length === 0 && r.hinweise.some(x => x.stufe === 'fehler'), `h=${h}, cv=${cv}`); }

// 5. Atterberg-Grenzen (Z24)
//    A-Linie I_P = 0,73·(w_L − 20) (DIN 18196, Casagrande): w_L = 50 → 21,9; w_L = 20 → 0
pruefe(nahe(aLinie(50), 21.9, 1e-12) && aLinie(20) === 0, 'A-Linie');
//    Mehrpunktverfahren (Handrechnung, Kontrolle numpy.polyfit): N = 17/22/28/34, w = 44,1/42,6/41,2/40,0 %
//    Ausgleichsgerade w = 60,8256 − 13,5823·lg N, R² = 0,99981 → w_L = w(25) = 41,838 %
const fv = [{ schlaege: 17, w: 44.1 }, { schlaege: 22, w: 42.6 }, { schlaege: 28, w: 41.2 }, { schlaege: 34, w: 40.0 }];
const fl = fliessgrenze(fv);
pruefe(fl.verfahren === 'mehrpunkt' && nahe(fl.a, 60.82558, 1e-6) && nahe(fl.b, -13.58231, 1e-6) && nahe(fl.wL, 41.83832, 1e-6) && nahe(fl.r2, 0.999814, 1e-5) && fl.hinweise.length === 0, `Mehrpunkt ${JSON.stringify(fl)}`);
//    Einpunktverfahren (ASTM D4318, Verfahren B): w_N = 41,5 % bei N = 22 → 41,5·(22/25)^0,121 = 40,863 %; bei N = 25 gilt w_L = w_N
pruefe(EINPUNKT_EXPONENT === 0.121 && nahe(fliessgrenzeEinpunkt(41.5, 22), 40.86302, 1e-6) && nahe(fliessgrenzeEinpunkt(41.5, 25), 41.5, 1e-12), 'Einpunkt');
const e1 = fliessgrenze([{ schlaege: 22, w: 41.5 }]);
pruefe(e1.verfahren === 'einpunkt' && nahe(e1.wL, 40.86302, 1e-6) && e1.hinweise.some(x => x.feld === 'verfahren') && nahe(e1.a + e1.b * Math.log10(25), e1.wL, 1e-9), 'Einpunkt über fliessgrenze()');
//    Ausrollgrenze: 21,8 und 22,6 % → w_P = 22,2 %
const ar = ausrollgrenze([21.8, 22.6]);
pruefe(nahe(ar.wP, 22.2, 1e-12) && ar.hinweise.length === 0, 'Ausrollgrenze');
pruefe(ausrollgrenze([20, 23.5]).hinweise.some(x => x.feld === 'wP') && ausrollgrenze([22]).hinweise.length === 1 && ausrollgrenze([]).hinweise[0].stufe === 'fehler', 'Ausrollgrenze Streuung/ein Wert/leer');
//    Gesamtauswertung mit w = 30 %: I_P = 19,64 %, I_C = (41,84 − 30)/19,64 = 0,603 → weich; A-Linie 15,94 < 19,64 → TM
const at = atterberg({ w: 30, versuche: fv, ausroll: [21.8, 22.6], organisch: false });
pruefe(at.gueltig && nahe(at.iP, 19.63832, 1e-5) && nahe(at.iC, 0.602817, 1e-5) && at.zustand === 'weich' && at.gruppe?.kuerzel === 'TM' && nahe(at.gruppe.aLinie, 15.94198, 1e-5), `Atterberg ${JSON.stringify(at.gruppe)} ${at.iC}`);
//    Konsistenz mit dem bestehenden Kern zustandsgrenzen(): gleiche I_C, gleiche Zustandsform, Gruppe als Präfix der Klasse
const zg = zustandsgrenzen(30, at.wL, at.wP);
pruefe(nahe(zg.iC, at.iC, 1e-12) && zg.zustand === at.zustand && zg.klasse.startsWith(at.gruppe!.kuerzel), 'Konsistenz mit zustandsgrenzen()');

//    Bodengruppen DIN 18196 an Grenzen: w_L < 35 / 35 … 50 / > 50; A-Linie; Zwischenbereich 4 ≤ I_P < 7; organisch OU/OT
const G: [number, number, boolean, string][] = [
  [30, 15, false, 'TL'], [25, 7, false, 'TL'], [34.9, 11, false, 'TL'], [34.9, 10, false, 'UL'], [35, 15, false, 'TM'], [50, 25, false, 'TM'], [50.1, 30, false, 'TA'],
  [28, 6, false, 'UL/TL'], [30, 6, false, 'UL'], [25, 4, false, 'UL/TL'], [30, 3.9, false, 'UL'], [45, 10, false, 'UM'], [60, 20, false, 'UA'],
  [45, 10, true, 'OU'], [60, 20, true, 'OU'], [60, 35, true, 'OT'], [40, 20, true, 'TM'], [30, 2, true, 'UL'],
];
for (const [wL, iP, org, soll] of G) pruefe(bodengruppePlastizitaet(wL, iP, org).kuerzel === soll, `Gruppe w_L = ${wL}, I_P = ${iP}, organisch ${org}: ${bodengruppePlastizitaet(wL, iP, org).kuerzel} statt ${soll}`);
//    genau auf der A-Linie gilt „oberhalb“ (Ton), wie in zustandsgrenzen()
pruefe(bodengruppePlastizitaet(40, aLinie(40), false).kuerzel === 'TM', 'auf der A-Linie → Ton');

//    Randfälle und Fehler
pruefe(!atterberg({ w: 30, versuche: fv, ausroll: [45], organisch: false }).gueltig, 'w_P ≥ w_L → Fehler');
pruefe(!atterberg({ w: 30, versuche: [], ausroll: [22], organisch: false }).gueltig && !atterberg({ w: NaN, versuche: fv, ausroll: [22], organisch: false }).gueltig, 'keine Versuche / w NaN → Fehler');
pruefe(fliessgrenze([{ schlaege: 25, w: 40 }, { schlaege: 25, w: 41 }]).hinweise.some(x => x.stufe === 'fehler'), 'gleiche Schlagzahlen → Fehler');
pruefe(fliessgrenze([{ schlaege: 30, w: 40 }, { schlaege: 38, w: 38 }]).hinweise.some(x => x.text.includes('extrapoliert')), 'N = 25 außerhalb → Warnung');
pruefe(fliessgrenze([{ schlaege: 10, w: 50 }, { schlaege: 20, w: 48 }, { schlaege: 30, w: 46 }, { schlaege: 45, w: 44 }]).hinweise.filter(x => x.text.includes('15–40')).length === 2, 'Schlagzahl außerhalb 15–40 → Warnung');
pruefe(fliessgrenze([{ schlaege: 15, w: 40 }, { schlaege: 35, w: 42 }]).hinweise.some(x => x.text.includes('nimmt mit der Schlagzahl nicht ab')), 'steigende Fließkurve → Warnung');
pruefe(atterberg({ w: 30, versuche: fv, ausroll: [21.8, 22.6], organisch: true }).hinweise.some(x => x.feld === 'organisch'), 'organisch → Hinweis Glühverlust');

//    Fuzz: 1 000 zufällige Versuchsreihen – endlich, w_L zwischen den Messwerten bei Interpolation, I_C-Definition, Gruppe gesetzt
let zb = 18196;
const rb = () => { zb = (zb * 1103515245 + 12345) % 2147483648; return zb / 2147483648; };
let bGepr = 0;
for (let i = 0; i < 1000; i++) {
  const wL0 = 20 + rb() * 80, neig = 5 + rb() * 25;
  const n = 1 + Math.floor(rb() * 6);
  const vs = Array.from({ length: n }, (_, j) => { const N = Math.round(15 + (25 * (j + rb())) / n); return { schlaege: N, w: wL0 - neig * Math.log10(N / 25) + (rb() - 0.5) }; });
  const wP0 = wL0 * (0.3 + rb() * 0.5);
  const wNat = wP0 + rb() * (wL0 - wP0) * 1.3;
  const r = atterberg({ w: wNat, versuche: vs, ausroll: [wP0 - 0.4, wP0 + 0.4], organisch: rb() < 0.2 });
  if (!r.gueltig) { pruefe(r.hinweise.some(x => x.stufe === 'fehler'), `Fuzz ${i}: ungültig ohne Fehler`); continue; }
  bGepr++;
  pruefe([r.wL, r.wP, r.iP, r.iC].every(Number.isFinite) && r.iP > 0 && !!r.gruppe && r.zustand !== '–', `Fuzz ${i}: endlich`);
  pruefe(Math.abs(r.iC - (r.wL - wNat) / r.iP) < 1e-9 && Math.abs(r.iP - (r.wL - r.wP)) < 1e-9, `Fuzz ${i}: I_P, I_C`);
  pruefe(r.gruppe!.oberhalbALinie === (r.iP >= aLinie(r.wL)), `Fuzz ${i}: A-Linie`);
  if (n >= 2) pruefe(Math.abs(r.wL - wL0) < 1.5, `Fuzz ${i}: w_L = ${r.wL} weit weg von ${wL0}`);
}
pruefe(bGepr > 800, `Fuzz Atterberg: nur ${bGepr} gültige Fälle`);

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Boden');
