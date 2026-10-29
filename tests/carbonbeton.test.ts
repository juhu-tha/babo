// Rechenkern Carbonbeton mit Dehnungskontrolle ε_c ≤ 3,5 ‰ (Umsetzung 29.10.2026, T9-CB-1)
// Sollwerte aus eigener Nachrechnung (Tranche 9, CB1–CB3)
import { carbonbetonBiegung } from '../src/calc/carbonbeton';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
console.log('--- Test: Carbonbeton ---');

// 1. Standardfall (CB1–CB3): h 40, c 10, a_tex 100 mm²/m, f_tk 2500, E 200 GPa, C50/60
//    Textilbruch angenommen: y = 6,79, x = 8,48, ε_c = 3,79 ‰ > 3,5 ‰ → Beton maßgebend
//    Gleichgewicht: x = 8,20 mm, σ_tex = 1 860 N/mm², z = 26,72 mm, m_Rd = 4,97 kNm/m (vorher 5,12)
const a = carbonbetonBiegung({ h: 40, c: 10, aTex: 100, fTk: 2500, eTexGPa: 200, fCk: 50 });
pruefe(a.gueltig && a.versagen === 'beton', `CB Versagen ${a.versagen}`);
pruefe(nahe(a.x, 8.204) && nahe(a.sigmaTex, 1859.8) && nahe(a.mRd, 4.969) && nahe(a.mRdOhneDehnungskontrolle, 5.117), `CB x ${a.x} σ ${a.sigmaTex} m ${a.mRd} ohne ${a.mRdOhneDehnungskontrolle}`);
pruefe(Math.abs(a.epsC - 0.0035) < 1e-12 && a.sigmaTex < a.fTd, 'CB Dehnung 3,5 ‰, σ < f_td');
// Gleichgewicht F_t = F_c
pruefe(nahe(100 * a.sigmaTex, 1000 * 0.8 * a.x * a.fCd, 1e-9), 'CB Gleichgewicht');
// 2. Textil maßgebend: weniger Textil (a_tex 60 mm²/m) → y = 4,07, x = 5,09, ε_c = 9,62 ‰ · 5,09/24,91 = 1,97 ‰ ≤ 3,5 ‰
const b = carbonbetonBiegung({ h: 40, c: 10, aTex: 60, fTk: 2500, eTexGPa: 200, fCk: 50 });
pruefe(b.versagen === 'textil' && nahe(b.sigmaTex, 2500 / 1.3) && nahe(b.mRd, b.mRdOhneDehnungskontrolle, 1e-12) && b.epsC < 0.0035, `Textil ${b.versagen} ${b.epsC}`);
pruefe(nahe(b.mRd, 60 * (2500 / 1.3) * (30 - 0.5 * (60 * 2500 / 1.3) / (1000 * 0.85 * 50 / 1.5)) / 1e6, 1e-9), 'Textil m_Rd');
// 3. Grenzfall: genau ε_c = 3,5 ‰ trennt die Fälle stetig (m_Rd springt nicht)
let lo = 60, hi = 100;
for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (carbonbetonBiegung({ h: 40, c: 10, aTex: m, fTk: 2500, eTexGPa: 200, fCk: 50 }).versagen === 'textil') lo = m; else hi = m; }
const l = carbonbetonBiegung({ h: 40, c: 10, aTex: lo, fTk: 2500, eTexGPa: 200, fCk: 50 }), r = carbonbetonBiegung({ h: 40, c: 10, aTex: hi, fTk: 2500, eTexGPa: 200, fCk: 50 });
pruefe(nahe(l.mRd, r.mRd, 1e-6), `Stetigkeit am Übergang ${l.mRd} ${r.mRd}`);
// 4. Grenzen: c ≥ h, negative Werte, NaN → Fehler; f_ck > 50 → Hinweis
pruefe(!carbonbetonBiegung({ h: 20, c: 25, aTex: 100, fTk: 2500, eTexGPa: 200, fCk: 50 }).gueltig, 'c ≥ h');
pruefe(!carbonbetonBiegung({ h: 40, c: 10, aTex: -1, fTk: 2500, eTexGPa: 200, fCk: 50 }).gueltig, 'a_tex < 0');
pruefe(!carbonbetonBiegung({ h: 40, c: 10, aTex: 100, fTk: NaN, eTexGPa: 200, fCk: 50 }).gueltig, 'NaN');
pruefe(carbonbetonBiegung({ h: 40, c: 10, aTex: 100, fTk: 2500, eTexGPa: 200, fCk: 80 }).hinweise.some(h => h.feld === 'fCk'), 'Hinweis f_ck > 50');
// 5. Fuzz im Reglerbereich: endlich, ε_c ≤ 3,5 ‰, σ_tex ≤ f_td, 0 < x < d, m_Rd ≤ Wert ohne Kontrolle
let s = 9;
const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
for (let i = 0; i < 1000; i++) {
  const hh = 20 + Math.round(rnd() * 26) * 5, cc = 5 + Math.round(rnd() * 25);
  const e = { h: hh, c: cc, aTex: 50 + Math.round(rnd() * 25) * 10, fTk: 1500 + Math.round(rnd() * 25) * 100, eTexGPa: 150 + Math.round(rnd() * 15) * 10, fCk: 30 + Math.round(rnd() * 14) * 5 };
  const r2 = carbonbetonBiegung(e);
  if (cc >= hh) { pruefe(!r2.gueltig, `Fuzz ${i} c ≥ h`); continue; }
  pruefe(r2.gueltig && [r2.mRd, r2.x, r2.sigmaTex, r2.epsC].every(Number.isFinite), `Fuzz ${i} nicht endlich ${JSON.stringify(e)}`);
  pruefe(r2.epsC <= 0.0035 + 1e-12 && r2.sigmaTex <= r2.fTd + 1e-9 && r2.x > 0 && r2.x < r2.d && (r2.versagen === 'beton' || Math.abs(r2.mRd - r2.mRdOhneDehnungskontrolle) < 1e-9), `Fuzz ${i} Plausibilität ${JSON.stringify(e)}`);
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Carbonbeton');
