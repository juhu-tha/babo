// Rechenkern Biegelinie (Z24, Modul „Formänderungen“): Einfeldträger und Kragarm unter F und q
import { biegelinie, biegesteifigkeit, traegheitRechteck, werkstoffVergleich, BIEGE_WERKSTOFFE, BIEGE_PROFILE, type BiegelinieEingabe } from '../src/calc/biegelinie';
import { E_BAUSTAHL, HOLZ_EN338 } from '../src/data/kennwerte';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.max(1e-9, Math.abs(soll));
console.log('--- Test: Biegelinie ---');

// 1. Grundlastfälle (Gross/Hauger/Schröder/Wall, TM 2, Tabelle der Biegelinien; Schneider Bautabellen)
//    Handbeispiel: IPE 200 (I_y = 1 943 cm⁴) aus Stahl, E = 210 000 N/mm² → EI = 210 000 · 1 943 · 10⁻⁵ = 4 080,3 kNm²
//    Einfeldträger L = 5 m, q = 5 kN/m: w_max = 5·5·5⁴/(384·4 080,3) = 9,972 mm in Feldmitte; φ_A = q·L³/(24·EI) = 1,276 mrad
const EI = biegesteifigkeit(E_BAUSTAHL, 1943);
pruefe(nahe(EI, 4080.3, 1e-12), `EI ${EI}`);
const basis: BiegelinieEingabe = { lagerung: 'einfeldtraeger', L: 5, F: 0, a: 2.5, q: 5, E: E_BAUSTAHL, I: 1943 };
const q1 = biegelinie(basis);
pruefe(nahe(q1.wMax, (5 * 5 * 5 ** 4) / (384 * EI) * 1000, 1e-9) && nahe(q1.wMax, 9.972, 1e-3) && nahe(q1.xWMax, 2.5, 1e-9), `q: w_max ${q1.wMax} bei ${q1.xWMax}`);
pruefe(nahe(q1.phiA, (5 * 125) / (24 * EI) * 1000, 1e-9) && nahe(q1.phiB, -q1.phiA, 1e-9) && nahe(q1.wKenn, q1.wMax, 1e-12), `q: φ_A ${q1.phiA}`);
pruefe(nahe(q1.lDurchW, 5000 / q1.wMax, 1e-12) && q1.hinweise.length === 0, `q: L/w ${q1.lDurchW}, Hinweise ${q1.hinweise.length}`);
// Einzellast in Feldmitte F = 20 kN: w = F·L³/(48·EI) = 20·125/(48·4 080,3) = 12,76 mm
const f1 = biegelinie({ ...basis, q: 0, F: 20 });
pruefe(nahe(f1.wMax, (20 * 125) / (48 * EI) * 1000, 1e-9) && nahe(f1.xWMax, 2.5, 1e-9), `F Mitte ${f1.wMax}`);
// außermittige Einzellast a = 1,5 m (b = 3,5 m): x_m = √((L² − a²)/3), w_max = F·a·(L² − a²)^{3/2}/(9·√3·L·EI)
//    (größerer Abschnitt b liegt rechts → Maximum im längeren Feldteil); φ_A = F·a·b·(L + b)/(6·L·EI)
const f2 = biegelinie({ ...basis, q: 0, F: 20, a: 1.5 });
const xm = Math.sqrt((25 - 1.5 ** 2) / 3);
pruefe(nahe(f2.xWMax, 5 - xm, 1e-6) && nahe(f2.wMax, (20 * 1.5 * (25 - 2.25) ** 1.5) / (9 * Math.sqrt(3) * 5 * EI) * 1000, 1e-9), `F außermittig ${f2.wMax} bei ${f2.xWMax}`);
pruefe(nahe(f2.phiA, (20 * 1.5 * 3.5 * 8.5) / (6 * 5 * EI) * 1000, 1e-9) && nahe(-f2.phiB, (20 * 1.5 * 3.5 * 6.5) / (6 * 5 * EI) * 1000, 1e-9), 'F außermittig φ_A/φ_B');
// Kragarm: F am Ende → F·L³/(3·EI), φ = F·L²/(2·EI); q → q·L⁴/(8·EI), φ = q·L³/(6·EI)
const k1 = biegelinie({ lagerung: 'kragarm', L: 2, F: 10, a: 2, q: 0, E: E_BAUSTAHL, I: 1943 });
pruefe(nahe(k1.wMax, (10 * 8) / (3 * EI) * 1000, 1e-12) && nahe(k1.xWMax, 2, 1e-12) && nahe(k1.phiB, (10 * 4) / (2 * EI) * 1000, 1e-12) && k1.phiA === 0, `Kragarm F ${k1.wMax}`);
const k2 = biegelinie({ lagerung: 'kragarm', L: 2, F: 0, a: 2, q: 4, E: E_BAUSTAHL, I: 1943 });
pruefe(nahe(k2.wMax, (4 * 16) / (8 * EI) * 1000, 1e-12) && nahe(k2.phiB, (4 * 8) / (6 * EI) * 1000, 1e-12), `Kragarm q ${k2.wMax}`);
// Kragarm, Last innerhalb (a = 1 m von 2 m): Ende w = F·a²·(3L − a)/(6·EI)
const k3 = biegelinie({ lagerung: 'kragarm', L: 2, F: 10, a: 1, q: 0, E: E_BAUSTAHL, I: 1943 });
pruefe(nahe(k3.wKenn, (10 * 1 * 5) / (6 * EI) * 1000, 1e-12), `Kragarm F innen ${k3.wKenn}`);

// 2. Unabhängige Referenz: Arbeitssatz w(x₀) = ∫ M·M̄/EI dx (Simpson) für kombinierte Lasten
function simpson(f: (x: number) => number, a: number, b: number, n = 4000) {
  const h = (b - a) / n; let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return (s * h) / 3;
}
for (const [L, F, a, q, x0] of [[6, 15, 2, 3, 3], [4, 8, 3.2, 0, 1.1], [7.5, 0, 0, 2.5, 5]]) {
  const r = biegelinie({ lagerung: 'einfeldtraeger', L, F, a, q, E: 11000, I: 25000 }, 600);
  const EIh = biegesteifigkeit(11000, 25000);
  const A = (F * (L - a)) / L + (q * L) / 2;
  const M = (x: number) => A * x - (q * x * x) / 2 - (x > a ? F * (x - a) : 0);
  const Mq = (x: number) => (x <= x0 ? (x * (L - x0)) / L : (x0 * (L - x)) / L);
  const soll = (simpson(x => M(x) * Mq(x), 0, x0) + simpson(x => M(x) * Mq(x), x0, L)) / EIh * 1000;
  const ist = r.verlauf.reduce((best, p) => (Math.abs(p.x - x0) < Math.abs(best.x - x0) ? p : best)).w;
  const xi = r.verlauf.reduce((best, p) => (Math.abs(p.x - x0) < Math.abs(best.x - x0) ? p : best)).x;
  pruefe(Math.abs(xi - x0) < 1e-9 && nahe(ist, soll, 1e-6), `Arbeitssatz Einfeld L=${L}: ${ist} ≠ ${soll}`);
}
for (const [L, F, a, q] of [[3, 12, 1.8, 2], [1.5, 0, 0, 6]]) {
  const r = biegelinie({ lagerung: 'kragarm', L, F, a, q, E: 33000, I: 120000 });
  const EIh = biegesteifigkeit(33000, 120000);
  const M = (x: number) => (x < a ? F * (a - x) : 0) + (q * (L - x) ** 2) / 2;
  const soll = simpson(x => M(x) * (L - x), 0, L) / EIh * 1000;
  pruefe(nahe(r.wKenn, soll, 1e-6), `Arbeitssatz Kragarm L=${L}: ${r.wKenn} ≠ ${soll}`);
}

// 3. Querschnitt und Werkstoffvergleich
pruefe(nahe(traegheitRechteck(100, 200), 6666.67, 1e-6), `I Rechteck ${traegheitRechteck(100, 200)}`);
pruefe(BIEGE_PROFILE.some(p => p.name === 'IPE 200' && p.Iy === 1943), 'IPE 200 aus WALZPROFILE');
pruefe(BIEGE_WERKSTOFFE.stahl.E === E_BAUSTAHL && BIEGE_WERKSTOFFE.holzC24.E === HOLZ_EN338.C24.E0mean && BIEGE_WERKSTOFFE.betonC30.E === 33000, 'E-Moduln aus kennwerte.ts');
const v = werkstoffVergleich({ lagerung: 'einfeldtraeger', L: 4, F: 0, a: 2, q: 2, I: traegheitRechteck(100, 200) });
const st = v.find(x => x.id === 'stahl')!, ho = v.find(x => x.id === 'holzC24')!;
pruefe(nahe(ho.wMax / st.wMax, E_BAUSTAHL / HOLZ_EN338.C24.E0mean, 1e-9), `Vergleich w ∝ 1/E ${ho.wMax / st.wMax}`);

// 4. Fehler und Warnungen
pruefe(biegelinie({ ...basis, L: 0 }).hinweise.some(h => h.stufe === 'fehler' && h.feld === 'L'), 'L = 0 → Fehler');
pruefe(biegelinie({ ...basis, a: 6 }).hinweise.some(h => h.stufe === 'fehler' && h.feld === 'a'), 'a > L → Fehler');
pruefe(biegelinie({ ...basis, I: 0 }).hinweise.some(h => h.stufe === 'fehler' && h.feld === 'I'), 'I = 0 → Fehler');
pruefe(biegelinie({ ...basis, E: NaN }).hinweise.some(h => h.stufe === 'fehler') && Number.isNaN(biegelinie({ ...basis, E: NaN }).wMax), 'NaN → Fehler');
pruefe(biegelinie({ ...basis, q: 0 }).hinweise.some(h => h.stufe === 'warnung' && h.feld === 'F') && biegelinie({ ...basis, q: 0 }).wMax === 0, 'ohne Last → Warnung, w = 0');
pruefe(biegelinie({ ...basis, q: 20 }).hinweise.some(h => h.stufe === 'warnung' && /L\/300/.test(h.text)), 'L/300 überschritten → Warnung');
pruefe(biegelinie({ ...basis, E: 500 }).hinweise.some(h => h.stufe === 'warnung' && h.feld === 'E'), 'E klein → Warnung');
pruefe(biegelinie({ ...basis, I: 1, q: 50 }).hinweise.some(h => /0,1 rad/.test(h.text)), 'große Neigung → Warnung');

// 5. Fuzz: 1000 Zufallseingaben → entweder Fehler oder endliche Ergebnisse
let zufall = 2024;
const rnd = () => { zufall = (zufall * 1103515245 + 12345) % 2147483648; return zufall / 2147483648; };
let gueltig = 0;
for (let i = 0; i < 1000; i++) {
  const L = rnd() * 32 - 1;
  const e: BiegelinieEingabe = {
    lagerung: rnd() < 0.5 ? 'einfeldtraeger' : 'kragarm', L, F: rnd() * 200 - 50, a: rnd() * (L + 2) - 1, q: rnd() < 0.2 ? 0 : rnd() * 60 - 10,
    E: rnd() * 260000 - 5000, I: rnd() * 60000 - 500,
  };
  const r = biegelinie(e, 50);
  if (r.hinweise.some(h => h.stufe === 'fehler')) continue;
  gueltig++;
  const werte = [r.EI, r.wMax, r.xWMax, r.wKenn, r.phiA, r.phiB, ...r.verlauf.flatMap(p => [p.x, p.w, p.phi])];
  pruefe(werte.every(Number.isFinite) && (r.lDurchW > 0) && r.verlauf.every(p => Math.abs(p.w) <= Math.abs(r.wMax) * (1 + 1e-9)), `Fuzz ${i}: ${JSON.stringify(e)}`);
}
pruefe(gueltig > 300, `Fuzz: nur ${gueltig} gültige Fälle`);

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log(`OK: Biegelinie (${gueltig} gültige Fuzz-Fälle)`);
