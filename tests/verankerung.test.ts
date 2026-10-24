// Rechenkern Verankerungslänge (Umsetzungsplan Phase 4, AP 4.3)
import { bemesseVerankerung, type VerankerungEingabe } from '../src/calc/verankerung';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
console.log('--- Test: Verankerung ---');

const basis: VerankerungEingabe = { fck: 30, fyk: 500, phi: 16, verbund: 'gut', beanspruchung: 'zug', art: 'verankerung', form: 'gerade', alpha2: 1, alpha3: 1, alpha5: 1, alpha6: 1.5, asErf: 10, asVorh: 12 };

// 1. Handrechnung C30/37, B500, φ 16, guter Verbund:
//    f_ctk;0,05 = 2,0 (EC2 Tab. 3.1); f_ctd = 1,333; f_bd = 2,25·1,333 = 3,00 N/mm²
//    l_b,rqd = 16/4 · 434,8/3,00 = 579,7 mm; l_bd = 579,7·10/12 = 483,1 mm; l_b,min = max(174; 160; 100) = 174 mm
const r = bemesseVerankerung(basis);
pruefe(nahe(r.fbd, 3.0, 1e-9), `f_bd ${r.fbd}`);
pruefe(nahe(r.lbRqd, 579.71, 1e-4), `l_b,rqd ${r.lbRqd}`);
pruefe(nahe(r.lbd, 483.09, 1e-4), `l_bd ${r.lbd}`);
// Tabellenwerte der Verbundspannung f_bd (guter Verbund, φ ≤ 32) nach EC2-Hilfstabellen: C20 2,3 / C25 2,7 / C30 3,0 / C35 3,4 / C40 3,7 / C50 4,3
for (const [fck, fbd] of [[20, 2.3], [25, 2.7], [30, 3.0], [35, 3.4], [40, 3.7], [50, 4.3]]) {
  pruefe(nahe(bemesseVerankerung({ ...basis, fck }).fbd, fbd, 0.03), `f_bd C${fck}: ${bemesseVerankerung({ ...basis, fck }).fbd.toFixed(2)} vs ${fbd}`);
}
// 2. Faktoren
pruefe(nahe(bemesseVerankerung({ ...basis, verbund: 'maessig' }).fbd, 0.7 * r.fbd, 1e-12), 'η1 = 0,7');
pruefe(nahe(bemesseVerankerung({ ...basis, phi: 40 }).fbd, 0.92 * r.fbd, 1e-12), 'η2 für φ 40');
pruefe(bemesseVerankerung({ ...basis, form: 'haken' }).currentAlpha1 === 0.7, 'α1 Haken');
pruefe(bemesseVerankerung({ ...basis, alpha2: 0.7, alpha3: 0.7, alpha5: 0.7 }).alphaProduct === 0.7, 'α2·α3·α5 ≥ 0,7');
pruefe(bemesseVerankerung({ ...basis, beanspruchung: 'druck', form: 'haken', alpha2: 0.7 }).alphaProduct === 1, 'Druck: α = 1');
// Mindestlänge maßgebend bei kleinem A_s,erf
pruefe(nahe(bemesseVerankerung({ ...basis, asErf: 1 }).lbd, Math.max(0.3 * r.lbRqd, 160, 100), 1e-12), 'l_b,min');
// Übergreifung: l0 = α6·l_b,rqd·As-Verhältnis ≥ l0,min = max(0,3·α6·l_b,rqd; 15φ; 200)
const ru = bemesseVerankerung({ ...basis, art: 'uebergreifung' });
pruefe(nahe(ru.lbd, 1.5 * r.lbRqd * 10 / 12, 1e-12), `l0 ${ru.lbd}`);
// > C60: Begrenzung
pruefe(nahe(bemesseVerankerung({ ...basis, fck: 80 }).fbd, bemesseVerankerung({ ...basis, fck: 60 }).fbd, 1e-12), 'f_bd ≤ C60');

// 3. Unsinnige Eingaben (vorher stillschweigend auf A_s-Verhältnis 1 begrenzt)
for (const u of [{ asVorh: 0 }, { asErf: 15 }, { phi: 0 }, { fck: 0 }, { alpha2: 0 }, { asErf: -1 }, { phi: NaN }] as Partial<VerankerungEingabe>[]) {
  const rr = bemesseVerankerung({ ...basis, ...u });
  pruefe([rr.lbd, rr.lbRqd].every(Number.isFinite) && rr.hinweise.some(x => x.stufe === 'fehler'), JSON.stringify(u));
}
let seed = 5;
const z = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
for (let i = 0; i < 1000; i++) {
  const rr = bemesseVerankerung({ fck: z(-5, 100), fyk: z(-5, 700), phi: z(-2, 50), verbund: i % 2 ? 'gut' : 'maessig', beanspruchung: i % 3 ? 'zug' : 'druck',
    art: i % 5 ? 'verankerung' : 'uebergreifung', form: (['gerade', 'haken', 'winkel'] as const)[i % 3], alpha2: z(-0.2, 1.5), alpha3: z(-0.2, 1.5), alpha5: z(-0.2, 1.5), alpha6: z(-0.2, 2), asErf: z(-5, 30), asVorh: z(-5, 30) });
  if (![rr.lbd, rr.lbRqd, rr.fbd].every(Number.isFinite)) { pruefe(false, `Fuzz ${i}`); break; }
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Verankerung');
