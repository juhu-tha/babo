// Rechenkern Mechanische Kenngrößen (Z3): Querschnitt, Steifigkeiten, Hooke, Querdehnung, Euler, Kriechen/Schwinden
import { stabKenngroessen, type StabEingabe, type StabWerkstoff, type Werkstoffkategorie } from '../src/calc/mechanischeKenngroessen';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Mechanische Kenngrößen ---');

// Werkstoffe wie in src/modules/mechanischekenngroessen/daten.ts
const S235: StabWerkstoff = { kategorie: 'Metall', E: 210000, nu: 0.30, fy: 235, fu: 360, dichte: 7850 };
const C30: StabWerkstoff = { kategorie: 'Mineralisch', E: 33000, nu: 0.20, fy: 38, fu: 2.9, dichte: 2400 };
const C24: StabWerkstoff = { kategorie: 'Organisch', E: 11000, nu: 0.05, fy: 21, fu: 14.5, dichte: 420 };
const START: StabEingabe = { werkstoff: S235, lastArt: 'zug', kraftKn: 80, laengeM: 3, querschnitt: 'rund', durchmesserMm: 25, breiteMm: 30, hoeheMm: 30, kriechZahl: 0, schwindPromille: 0 };

// 1. Handrechnung Startwerte: S235, Zug 80 kN, L = 3 m, Ø 25 mm
//    A = π·25²/4 = 490,87 mm²; σ = 80 000/490,87 = 162,97 N/mm²; ε = σ/E = 0,7761 ‰; ΔL = 0,7761·10⁻³·3000 = 2,3282 mm
//    I = π·25⁴/64 = 19 174,8 mm⁴; EI = 4,0267 kNm²; F_K = π²·210 000·19 174,8/3000² = 4,4158 kN
//    Δd = −0,3·0,7761·10⁻³·25 = −0,00582 mm; U = ½·80 000 N·0,0023282 m = 93,13 J; c = EA/L = 34 361 N/mm; m = 11,56 kg
//    Auslastung 162,97/360 = 45,27 %, bezogen auf f_y 69,35 %; G = 210 000/2,6 = 80 769; K = 210 000/1,2 = 175 000
const r = stabKenngroessen(START);
pruefe(r.gueltig && r.hinweise.length === 0, `Startwerte ohne Hinweise (${r.hinweise.map(x => x.text).join(' | ')})`);
pruefe(nahe(r.A0_mm2, 490.874, 1e-3) && nahe(r.sigma, 162.975, 1e-3) && nahe(r.epsilonPromille, 0.77607, 1e-5) && nahe(r.deltaL_mm, 2.32821, 1e-5), `Hooke ${r.sigma} ${r.deltaL_mm}`);
pruefe(nahe(r.I_y_mm4, 19174.76, 0.01) && nahe(r.EI_kNm2, 4.02670, 1e-5) && nahe(r.F_K_kN, 4.41577, 1e-5) && nahe(r.biegedurchbiegung_mm, 11175.4, 0.1), `Biegung/Knicken ${r.EI_kNm2} ${r.F_K_kN}`);
pruefe(nahe(r.deltaD_mm, -0.0058205, 1e-7) && nahe(r.U_Joule, 93.128, 1e-3) && nahe(r.federsteifigkeit_kN_m, 34361.2, 0.1) && nahe(r.masse_kg, 11.5601, 1e-4), `Querdehnung/Energie ${r.deltaD_mm} ${r.U_Joule}`);
pruefe(nahe(r.auslastungFestigkeit, 45.2707, 1e-4) && nahe(r.auslastungFliess, 69.3509, 1e-4) && !r.isPlastisch && !r.isVersagt && r.knickAuslastung === 0, 'Auslastung Zug');
pruefe(nahe(r.G_MPa, 80769.23, 0.01) && nahe(r.K_MPa, 175000, 1e-6) && r.EA_MN === r.EA_kN / 1000, 'G, K, EA');

// 2. Handrechnung Rechteck 30 × 60 mm, C30/37, Druck 20 kN, φ = 2,2, ε_s = 0,45 ‰
//    A = 1800 mm²; I_y = 30·60³/12 = 540 000; I_z = 60·30³/12 = 135 000 = I_min; σ = −11,11 N/mm²
//    ΔL_el = −11,11/33 000·3000 = −1,0101 mm; ΔL_ges = −1,0101·3,2 − 0,45·3 = −4,5823 mm
//    F_K = π²·33 000·135 000/3000² = 4,8855 kN → Knickauslastung 20/4,8855 = 409,4 %
const d = stabKenngroessen({ ...START, werkstoff: C30, lastArt: 'druck', kraftKn: 20, querschnitt: 'rechteck', breiteMm: 30, hoeheMm: 60, kriechZahl: 2.2, schwindPromille: 0.45 });
pruefe(d.I_y_mm4 === 540000 && d.I_z_mm4 === 135000 && d.I_min_mm4 === 135000 && d.d0_mm === 30 && nahe(d.sigma, -11.1111, 1e-4), `Rechteck ${d.I_y_mm4} ${d.sigma}`);
pruefe(nahe(d.deltaL_mm, -1.010101, 1e-6) && nahe(d.deltaL_gesamt_mm, -4.582323, 1e-6) && nahe(d.effEModulKriechen, 33000 / 3.2, 1e-9) && nahe(d.deltaL_kriechen_mm, -2.222222, 1e-6), `Kriechen/Schwinden ${d.deltaL_gesamt_mm}`);
pruefe(nahe(d.F_K_kN, 4.88545, 1e-5) && nahe(d.knickAuslastung, 409.379, 1e-3) && d.isKnickGefaehrdet && d.hinweise.some(x => x.feld === 'laengeM'), `Euler ${d.F_K_kN} ${d.knickAuslastung}`);
pruefe(d.isSproede && d.zulSpannung === 38 && d.fliessGrenze === 38 && !d.isVersagt, 'Beton auf Druck');
// Beton auf Zug: spröde, Fließgrenze = f_u = f_ctm
const bz = stabKenngroessen({ ...START, werkstoff: C30, kraftKn: 10, querschnitt: 'rechteck', breiteMm: 30, hoeheMm: 60 });
pruefe(bz.isSproede && bz.fliessGrenze === 2.9 && bz.isVersagt && !bz.isPlastisch, 'Beton auf Zug versagt spröde');
// Stahl plastisch: σ zwischen f_y und f_u
const pl = stabKenngroessen({ ...START, kraftKn: 140 });
pruefe(pl.isPlastisch && !pl.isVersagt && pl.hinweise.some(x => x.feld === 'kraftKn'), `Stahl plastisch σ = ${pl.sigma}`);
// Holz auf Zug: Modul setzt f_y (Druckfestigkeit) als Fließgrenze an (Befund, Verhalten unverändert)
const hz = stabKenngroessen({ ...START, werkstoff: C24, kraftKn: 5 });
pruefe(!hz.isSproede && hz.fliessGrenze === 21 && hz.zulSpannung === 14.5 && hz.hinweise.some(x => x.feld === 'werkstoff'), 'Holz auf Zug: Fließgrenze = f_c,0,k (Befund)');

// 3. Randfälle
pruefe(!stabKenngroessen({ ...START, durchmesserMm: 0 }).gueltig && !stabKenngroessen({ ...START, laengeM: 0 }).gueltig, 'Ø = 0 / L = 0 → Fehler');
pruefe(!stabKenngroessen({ ...START, werkstoff: { ...S235, nu: 0.5 } }).gueltig && !stabKenngroessen({ ...START, kraftKn: NaN }).gueltig, 'ν = 0,5 / NaN → Fehler');
const null0 = stabKenngroessen({ ...START, kraftKn: 0 });
pruefe(null0.sigma === 0 && null0.deltaL_mm === 0 && null0.U_Joule === 0 && null0.gueltig, 'F = 0 → keine Verformung');
const quad = stabKenngroessen({ ...START, querschnitt: 'rechteck', breiteMm: 40, hoeheMm: 40 });
pruefe(quad.I_y_mm4 === quad.I_z_mm4 && quad.I_min_mm4 === 40 ** 4 / 12, 'Quadrat: I_y = I_z');

// 4. Fuzz-Test: endliche Werte, Konsistenz und Monotonie
let zufall = 777;
const rnd = () => { zufall = (zufall * 1103515245 + 12345) % 2147483648; return zufall / 2147483648; };
const KAT: Werkstoffkategorie[] = ['Metall', 'Mineralisch', 'Organisch', 'Verbund', 'Glas'];
for (let i = 0; i < 1000; i++) {
  const fu = 2 + rnd() * 800;
  const w: StabWerkstoff = { kategorie: KAT[Math.floor(rnd() * 5)], E: 1000 + rnd() * 250000, nu: rnd() * 0.45, fy: 10 + rnd() * 800, fu, dichte: 300 + rnd() * 8000 };
  const e: StabEingabe = { werkstoff: w, lastArt: rnd() < 0.5 ? 'zug' : 'druck', kraftKn: rnd() * 500, laengeM: 0.2 + rnd() * 10, querschnitt: rnd() < 0.5 ? 'rund' : 'rechteck',
    durchmesserMm: 5 + rnd() * 200, breiteMm: 5 + rnd() * 300, hoeheMm: 5 + rnd() * 300, kriechZahl: rnd() * 3, schwindPromille: rnd() };
  const a = stabKenngroessen(e);
  const werte = [a.sigma, a.epsilon, a.deltaL_mm, a.F_K_kN, a.EI_kNm2, a.U_Joule, a.G_MPa, a.K_MPa, a.deltaL_gesamt_mm, a.masse_kg, a.biegedurchbiegung_mm];
  pruefe(a.gueltig && werte.every(Number.isFinite), `Fuzz ${i}: endlich ${JSON.stringify(werte)}`);
  pruefe(nahe(a.deltaL_mm, a.epsilon * e.laengeM * 1000, 1e-9 * Math.max(1, Math.abs(a.deltaL_mm))) && a.I_min_mm4 <= a.I_y_mm4 + 1e-6 && Math.sign(a.sigma) * Math.sign(a.epsilonQ) <= 0, `Fuzz ${i}: Konsistenz`);
  pruefe(nahe(a.U_Joule, 0.5 * e.kraftKn * Math.abs(a.deltaL_mm), 1e-9 * Math.max(1, a.U_Joule)), `Fuzz ${i}: U = ½·F·ΔL`);
  const laenger = stabKenngroessen({ ...e, laengeM: e.laengeM * 1.2 });
  pruefe(laenger.F_K_kN < a.F_K_kN && Math.abs(laenger.deltaL_mm) >= Math.abs(a.deltaL_mm) && laenger.federsteifigkeit_kN_m < a.federsteifigkeit_kN_m, `Fuzz ${i}: Längenmonotonie`);
  const mehr = stabKenngroessen({ ...e, kraftKn: e.kraftKn + 10 });
  pruefe(mehr.absSigma > a.absSigma && mehr.auslastungFestigkeit > a.auslastungFestigkeit, `Fuzz ${i}: Kraftmonotonie`);
}

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log('OK: Mechanische Kenngrößen');
