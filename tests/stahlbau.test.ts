// Rechenkern Stahlbau EC 3 (AP 3.13: Modul „Stahlbau nach Eurocode 3 – Grundlagen“)
import {
  bemesseDruckstab, bemesseZugstab, biegewiderstandY, biegeknicken, chi, klassifiziere, knicklinieNachTab62,
  profil, lambda1, ALPHA, STAHLGUETEN, EC3_NA_DE, WALZPROFILE, KNICKLINIEN, type DruckstabEingabe, type Stahlguete,
} from '../src/calc/stahlbau';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
console.log('--- Test: Stahlbau EC 3 ---');

// 1. Normwerte: Tab. 3.1 (t ≤ 40 mm), Tab. 6.1, NA DE
pruefe(STAHLGUETEN.S235.fy === 235 && STAHLGUETEN.S235.fu === 360, 'S235');
pruefe(STAHLGUETEN.S355.fy === 355 && STAHLGUETEN.S355.fu === 490, 'S355');
pruefe(STAHLGUETEN.S460.fy === 460 && STAHLGUETEN.S460.fu === 540, 'S460N');
pruefe(EC3_NA_DE.E === 210000 && EC3_NA_DE.gammaM0 === 1.0 && EC3_NA_DE.gammaM1 === 1.1 && EC3_NA_DE.gammaM2 === 1.25, 'γ_M nach NA DE');
pruefe(ALPHA.a0 === 0.13 && ALPHA.a === 0.21 && ALPHA.b === 0.34 && ALPHA.c === 0.49 && ALPHA.d === 0.76, 'α Tab. 6.1');
pruefe(nahe(lambda1(235), 93.9, 1e-3), `λ₁ = ${lambda1(235)}`);
// Profiltabelle in sich stimmig: i = √(I/A) auf ±1 %, W_el = I/(h/2) auf ±1 %
for (const p of WALZPROFILE) {
  pruefe(nahe(Math.sqrt(p.Iy / p.A), p.iy, 0.01) && nahe(Math.sqrt(p.Iz / p.A), p.iz, 0.01), `${p.name}: i passt nicht zu I/A`);
  pruefe(nahe(p.Iy / (p.h / 20), p.Wely, 0.01) && p.Wply > p.Wely, `${p.name}: W_el,y oder W_pl,y unstimmig`);
}

// 2. χ nach Gl. (6.49) – unabhängige Referenz 1: Ayrton-Perry-Gleichung (1 − χ)(1 − χ·λ̄²) = α·(λ̄ − 0,2)·χ,
//    kleinste positive Wurzel per Bisektion (nicht über die geschlossene Lösung gerechnet)
const ayrtonPerry = (lq: number, a: number) => {
  if (lq <= 0.2) return 1;
  const f = (x: number) => (1 - x) * (1 - x * lq * lq) - a * (lq - 0.2) * x;
  let lo = 0, hi = Math.min(1, 1 / (lq * lq));
  for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (f(m) > 0) lo = m; else hi = m; }
  return (lo + hi) / 2;
};
for (const k of KNICKLINIEN) for (const lq of [0.1, 0.3, 0.6, 0.84, 1.0, 1.5, 2.5]) {
  pruefe(nahe(chi(lq, ALPHA[k]).chi, ayrtonPerry(lq, ALPHA[k]), 1e-9), `χ(${k}, ${lq}) ≠ Ayrton-Perry`);
}
//    Referenz 2: Tabellenwerte χ(λ̄ = 1,0) der Knicklinien a0/a/b/c/d (vierstellig, wie in den Bautabellen)
const chiTab: Record<string, number> = { a0: 0.7253, a: 0.6656, b: 0.5970, c: 0.5399, d: 0.4671 };
for (const k of KNICKLINIEN) pruefe(Math.abs(chi(1.0, ALPHA[k]).chi - chiTab[k]) < 6e-5, `χ(${k}, 1,0) = ${chi(1.0, ALPHA[k]).chi}`);
pruefe(chi(0.2, 0.49).chi === 1 && chi(0.1, 0.76).chi === 1, 'χ = 1 für λ̄ ≤ 0,2');

// 3. Unabhängiger Referenzwert (veröffentlichtes Rechenbeispiel, sdcverifier.com „Eurocode 3. Example 6.7“):
//    CHS 244,5 × 10, S355, A = 7370 mm², I = 50,73 · 10⁶ mm⁴, L_cr = 4 m, Knicklinie a, γ_M1 = 1,0
//    → N_cr = 6571 kN, λ̄ = 0,63, χ = 0,88, N_b,Rd = 2297 kN
const chs = biegeknicken(73.70, Math.sqrt(50.73e6 / 7370) / 10, 355, 4, 'a', 1.0);
pruefe(nahe(chs.Ncr, 6571, 1e-3) && Math.abs(chs.lambdaQuer - 0.63) < 0.005 && Math.abs(chs.chi - 0.88) < 0.005, `CHS λ̄/χ ${chs.lambdaQuer} ${chs.chi}`);
pruefe(nahe(chs.NbRd, 2297, 1e-3), `CHS N_b,Rd ${chs.NbRd}`);

// 4. Handrechnung HEB 200, S235, L_cr = 4,0 m (beide Achsen), N_Ed = 800 kN
//    λ₁ = 93,91; z-z: λ = 400/5,07 = 78,90 → λ̄_z = 0,8401; Knicklinie c (h/b = 1,0 ≤ 1,2, t_f ≤ 100)
//    Φ = 0,5·[1 + 0,49·0,6401 + 0,7058] = 1,0097; χ = 1/(1,0097 + √(1,0195 − 0,7058)) = 0,6370
//    N_b,Rd,z = 0,6370 · 7810 · 235/1,1 = 1 062,9 kN; y-y (Linie b): λ̄_y = 0,4987, χ_y = 0,8848 → 1 476,2 kN
const basis: DruckstabEingabe = { profil: 'HEB 200', guete: 'S235', LcrY: 4, LcrZ: 4, nEd: 800 };
const r = bemesseDruckstab(basis);
pruefe(r.vorschlagY === 'b' && r.vorschlagZ === 'c', 'Tab. 6.2 HEB 200');
pruefe(nahe(r.z.lambdaQuer, 0.8401, 1e-4) && nahe(r.z.phi, 1.0097, 1e-4) && nahe(r.z.chi, 0.6370, 1e-4), `z: ${r.z.lambdaQuer} ${r.z.phi} ${r.z.chi}`);
pruefe(nahe(r.z.NbRd, 1062.9, 1e-4) && nahe(r.y.NbRd, 1476.2, 1e-4), `N_b,Rd ${r.z.NbRd} / ${r.y.NbRd}`);
pruefe(r.massgebend === 'z' && nahe(r.ausnutzung, 800 / 1062.86, 1e-4) && nahe(r.NcRd, 1835.35, 1e-6), 'Ausnutzung / N_c,Rd');
pruefe(nahe(r.z.lambdaQuer, Math.sqrt((7810 * 235) / (r.z.Ncr * 1000)), 1e-12), 'λ̄ = √(A·f_y/N_cr)');
pruefe(r.hinweise.length === 0 && r.klasse?.klasse === 1, 'HEB 200 Klasse 1, keine Hinweise');
// S460 → Knicklinien a/a (Tab. 6.2), größere Tragfähigkeit
const r460 = bemesseDruckstab({ ...basis, guete: 'S460' });
pruefe(r460.vorschlagY === 'a' && r460.vorschlagZ === 'a' && r460.NbRd > r.NbRd, 'S460 Tab. 6.2');
// Manuelle Knicklinie → Hinweis; kurze Knicklänge → Knicknachweis vernachlässigbar
pruefe(bemesseDruckstab({ ...basis, knicklinieZ: 'b' }).hinweise.some(h => h.feld === 'knicklinie'), 'Hinweis abweichende Knicklinie');
pruefe(bemesseDruckstab({ ...basis, LcrY: 0.5, LcrZ: 0.5 }).vernachlaessigbar, 'λ̄ ≤ 0,2');

// 5. Tab. 6.2 und Querschnittsklassen (Tab. 5.2)
pruefe(knicklinieNachTab62(profil('IPE 300')!, 'S235', 'y') === 'a' && knicklinieNachTab62(profil('IPE 300')!, 'S235', 'z') === 'b', 'IPE h/b > 1,2');
pruefe(knicklinieNachTab62(profil('IPE 300')!, 'S460', 'z') === 'a0', 'IPE S460');
//    IPE 300: Steg c = 300 − 2·10,7 − 2·15 = 248,6 mm, c/t = 35,0 → S235: Klasse 2 (≤ 38), S355: 42ε = 34,2 → Klasse 4
const k235 = klassifiziere(profil('IPE 300')!, 235, 'druck'), k355 = klassifiziere(profil('IPE 300')!, 355, 'druck');
pruefe(nahe(k235.steg.ct, 35.01, 1e-3) && k235.klasse === 2 && k355.klasse === 4, `IPE 300 Klassen ${k235.klasse}/${k355.klasse}`);
pruefe(bemesseDruckstab({ ...basis, profil: 'IPE 300', guete: 'S355' }).hinweise.some(h => h.feld === 'klasse'), 'Hinweis Klasse 4');
//    Flansch HEB 200: c = (200 − 9 − 36)/2 = 77,5 mm, c/t = 5,17 → Klasse 1
pruefe(nahe(klassifiziere(profil('HEB 200')!, 235, 'druck').flansch.ct, 5.1667, 1e-4), 'Flansch c/t');

// 6. Zugstab: Flachstahl 120 × 10, S235, ein Loch d₀ = 22 mm: N_pl,Rd = 282,0 kN; N_u,Rd = 0,9·980·360/1,25 = 254,0 kN
const z = bemesseZugstab({ A: 12, Anet: 9.8, guete: 'S235', nEd: 200 });
pruefe(nahe(z.NplRd, 282, 1e-9) && nahe(z.NuRd, 254.016, 1e-9) && z.nettoMassgebend && nahe(z.ausnutzung, 200 / 254.016, 1e-9), 'Zugstab');
// 7. Biegung IPE 300, S235: Klasse 1 → M_pl,Rd = 628,4 · 235/1000 = 147,7 kNm; M_el,Rd = 130,9 kNm
const m = biegewiderstandY(profil('IPE 300')!, 'S235');
pruefe(m.klasse.klasse === 1 && nahe(m.McRd, 147.674, 1e-6) && nahe(m.MelRd, 130.9185, 1e-6), 'Biegung IPE 300');

// 8. Unsinnige Eingaben
for (const u of [{ LcrY: 0 }, { LcrZ: -1 }, { nEd: -5 }, { nEd: NaN }, { profil: 'HEB 999' }, { guete: 'S999' as Stahlguete }, { knicklinieY: 'x' as 'a' }] as Partial<DruckstabEingabe>[]) {
  const ru = bemesseDruckstab({ ...basis, ...u });
  pruefe([ru.NbRd, ru.ausnutzung, ru.y.chi, ru.z.lambdaQuer].every(Number.isFinite) && ru.hinweise.some(x => x.stufe === 'fehler'), JSON.stringify(u));
}
for (const u of [{ A: 0 }, { Anet: 20 }, { nEd: -1 }, { A: NaN }]) {
  const ru = bemesseZugstab({ A: 12, Anet: 9.8, guete: 'S235', nEd: 100, ...u });
  pruefe([ru.NtRd, ru.ausnutzung].every(Number.isFinite) && ru.hinweise.some(x => x.stufe === 'fehler'), `Zug ${JSON.stringify(u)}`);
}

// 9. Fuzz (1000 Zufallseingaben, auch unzulässige): Ergebnisse endlich, χ ∈ [0, 1], N_b,Rd ≤ A·f_y/γ_M1
let seed = 31;
const zf = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
const namen = WALZPROFILE.map(p => p.name);
const gueten: Stahlguete[] = ['S235', 'S355', 'S460'];
for (let i = 0; i < 1000; i++) {
  const e: DruckstabEingabe = {
    profil: namen[i % namen.length], guete: gueten[i % 3],
    LcrY: zf(-2, 25), LcrZ: zf(-2, 25), nEd: zf(-200, 5000),
    knicklinieY: i % 4 === 0 ? KNICKLINIEN[i % 5] : undefined, knicklinieZ: i % 6 === 0 ? KNICKLINIEN[(i + 2) % 5] : undefined,
  };
  const ru = bemesseDruckstab(e);
  const ok = [ru.NbRd, ru.ausnutzung, ru.NcRd, ru.y.chi, ru.z.chi, ru.y.lambdaQuer, ru.z.lambdaQuer, ru.y.Ncr, ru.z.Ncr].every(Number.isFinite)
    && ru.y.chi >= 0 && ru.y.chi <= 1 && ru.z.chi >= 0 && ru.z.chi <= 1
    && (!ru.p || ru.NbRd <= (ru.p.A * 100 * ru.fy) / 1.1 / 1000 + 1e-9);
  if (!ok) { pruefe(false, `Fuzz ${i}: ${JSON.stringify(e)}`); break; }
  const rz = bemesseZugstab({ A: zf(-5, 300), Anet: zf(-5, 300), guete: gueten[i % 3], nEd: zf(-100, 5000) });
  if (![rz.NplRd, rz.NuRd, rz.NtRd, rz.ausnutzung].every(Number.isFinite)) { pruefe(false, `Fuzz Zug ${i}`); break; }
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Stahlbau EC 3');
