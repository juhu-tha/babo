// Rechenkern Verankerungslänge (Umsetzungsplan Phase 4, AP 4.3)
import { bemesseVerankerung, type VerankerungEingabe } from '../src/calc/verankerung';
import { keinErgebnis, zahlenPassen } from './hilfen/keinErgebnis';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
console.log('--- Test: Verankerung ---');

const basis: VerankerungEingabe = { fck: 30, fyk: 500, phi: 16, verbund: 'gut', beanspruchung: 'zug', art: 'verankerung', form: 'gerade', alpha2: 1, alpha3: 1, alpha5: 1, asErf: 10, asVorh: 12 };

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
// α₆ nach NA DE Tab. 8.3DE (T2-S-1, vorläufig); Handrechnung im eigenen Skript, C30/37 Ø 16 bzw. C25/30 Ø 12:
//   Ü2 Ø16 > 33 %: α₆ = 2,0 → l0 = 2,0·579,71·10/12 = 966,18 mm; Ü3 mit s ≥ 8Ø, c₁ ≥ 4Ø: α₆ = 1,4 → 676,33 mm
//   Ü4 Ø16 ≤ 33 %: 1,4 → 676,33; Ü5 dto. Abstand groß: 1,0 → 483,09; Ü1 Ø12 > 33 %: 1,4 → 676,33; Ü6 Ø12 ≤ 33 %: 1,2 → 579,71
const ru = bemesseVerankerung({ ...basis, art: 'uebergreifung' });
pruefe(ru.a6 === 2.0 && nahe(ru.lbd, 966.18, 1e-5), `Ü2 l0 ${ru.lbd}`);
pruefe(nahe(bemesseVerankerung({ ...basis, art: 'uebergreifung', stossAbstandGross: true }).lbd, 676.33, 1e-5), 'Ü3');
pruefe(nahe(bemesseVerankerung({ ...basis, art: 'uebergreifung', stossanteil: 'bis33' }).lbd, 676.33, 1e-5), 'Ü4');
pruefe(nahe(bemesseVerankerung({ ...basis, art: 'uebergreifung', stossanteil: 'bis33', stossAbstandGross: true }).lbd, 483.09, 1e-5), 'Ü5');
const v12 = { ...basis, fck: 25, phi: 12, art: 'uebergreifung', asErf: 1, asVorh: 1 } as const;
pruefe(nahe(bemesseVerankerung(v12).lbd, 676.33, 1e-5), 'Ü1');
pruefe(nahe(bemesseVerankerung({ ...v12, stossanteil: 'bis33' }).lbd, 579.71, 1e-5), 'Ü6');
pruefe(bemesseVerankerung({ ...v12, beanspruchung: 'druck' }).a6 === 1.0, 'Druckstoß α₆ = 1,0');
pruefe(ru.hinweise.some(x => x.feld === 'alpha6'), 'Hinweis vorläufig α₆');
// Vereinfachte NA-Form (T2-S-2, vorläufig): l_bd = α₁·α₄·α₅·l_b,rqd·A_s,erf/A_s,vorh, α₅ = 2/3 bei direkter Lagerung
//   NA1 gerade, direkt, 10/12: 2/3·579,71·10/12 = 322,06 mm; NA2 2/12 → l_b,min = max(0,3·579,71; 6,7·16) = 173,91 mm
//   NA3 Haken, direkt, 1: 0,7·2/3·579,71 = 270,53 mm (l_b,min = 121,74); NA4 indirekt, 1: 579,71 mm
const na = { ...basis, verfahren: 'naVereinfacht', lagerung: 'direkt' } as const;
const rNa1 = bemesseVerankerung(na);
pruefe(nahe(rNa1.lbd, 322.06, 1e-5) && nahe(rNa1.a5, 2 / 3, 1e-12), `NA1 ${rNa1.lbd}`);
pruefe(nahe(bemesseVerankerung({ ...na, asErf: 2 }).lbd, 173.913, 1e-5), 'NA2 l_b,min');
const rNa3 = bemesseVerankerung({ ...na, form: 'haken', asErf: 12 });
pruefe(nahe(rNa3.lbd, 270.53, 1e-5) && nahe(rNa3.lbMin, 121.74, 1e-4), `NA3 ${rNa3.lbd} / ${rNa3.lbMin}`);
pruefe(nahe(bemesseVerankerung({ ...na, lagerung: 'sonst', asErf: 12 }).lbd, 579.71, 1e-5), 'NA4');
// α₂, α₃ werden in der NA-Form nicht angesetzt; der Hinweis „vorläufig“ erscheint
pruefe(nahe(bemesseVerankerung({ ...na, alpha2: 0.7, alpha3: 0.7 }).lbd, rNa1.lbd, 1e-12) && rNa1.hinweise.some(x => x.feld === 'verfahren'), 'NA ohne α₂/α₃');
// angeschweißte Querstäbe α₄ = 0,7 (EN-Form): 0,7·579,71·10/12 = 338,16 mm; im Übergreifungsstoß kein α₄ (8.10)
pruefe(nahe(bemesseVerankerung({ ...basis, querstab: true }).lbd, 0.7 * 579.71 * 10 / 12, 1e-5), 'α₄');
pruefe(bemesseVerankerung({ ...basis, art: 'uebergreifung', querstab: true }).lbd === ru.lbd, 'kein α₄ im Stoß');
// > C60: Begrenzung
pruefe(nahe(bemesseVerankerung({ ...basis, fck: 80 }).fbd, bemesseVerankerung({ ...basis, fck: 60 }).fbd, 1e-12), 'f_bd ≤ C60');

// 3. Unsinnige Eingaben (vorher stillschweigend auf A_s-Verhältnis 1 begrenzt)
for (const u of [{ asVorh: 0 }, { asErf: 15 }, { phi: 0 }, { fck: 0 }, { alpha2: 0 }, { asErf: -1 }, { phi: NaN }] as Partial<VerankerungEingabe>[]) {
  const rr = bemesseVerankerung({ ...basis, ...u });
  pruefe(keinErgebnis([rr.lbd, rr.lbRqd]) && rr.hinweise.some(x => x.stufe === 'fehler'), JSON.stringify(u));
}
let seed = 5;
const z = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
for (let i = 0; i < 1000; i++) {
  const rr = bemesseVerankerung({ fck: z(-5, 100), fyk: z(-5, 700), phi: z(-2, 50), verbund: i % 2 ? 'gut' : 'maessig', beanspruchung: i % 3 ? 'zug' : 'druck',
    art: i % 5 ? 'verankerung' : 'uebergreifung', form: (['gerade', 'haken', 'winkel'] as const)[i % 3], alpha2: z(-0.2, 1.5), alpha3: z(-0.2, 1.5), alpha5: z(-0.2, 1.5), stossanteil: i % 2 ? 'bis33' : 'ueber33', stossAbstandGross: i % 7 === 0, querstab: i % 4 === 0, verfahren: i % 3 ? 'en' : 'naVereinfacht', lagerung: i % 2 ? 'direkt' : 'sonst', asErf: z(-5, 30), asVorh: z(-5, 30) });
  if (!zahlenPassen(rr, [rr.lbd, rr.lbRqd, rr.fbd])) { pruefe(false, `Fuzz ${i}`); break; }
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Verankerung');
