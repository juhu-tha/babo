// Rechenkern Holzphysik: Gleichgewichtsfeuchte, Feuchteangleich, Quellen und Schwinden (Umsetzungsplan Phase 4, AP 4.2)
import { FASERSAETTIGUNG, gleichgewichtsfeuchte, feuchteNachLagerung, zeitkonstanteFeuchte, schwinden, schwindmass } from '../src/calc/holzphysik';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
console.log('--- Test: Holzphysik ---');

// 1. Gleichgewichtsfeuchte (Lehrmodell, 1:1 aus Holz.tsx): φ = 65 %, θ = 20 °C
//    u = 18·0,65³ − 10·0,65² + 20·0,65 = 4,9433 − 4,2250 + 13,0 = 13,718 %
//    Literatur: bei 20 °C / 65 % r. F. und Fasersättigung 30 % „close to 12 %“ (ATIBT, Tropical Timber Technical
//    Guide, Kap. 5 „Timber humidity“, atibt.org). Das Lehrmodell liegt um rund 1,7 Prozentpunkte darüber (Prüfpunkt im PR).
const g65 = gleichgewichtsfeuchte(65, 20);
pruefe(nahe(g65.u, 13.71825, 1e-9) && !g65.begrenzt && g65.hinweise.length === 0, `u_gl(65 %, 20 °C) = ${g65.u}`);
pruefe(Math.abs(g65.u - 12) < 2, 'Lehrmodell innerhalb 2 %-Punkte um den Literaturwert 12 %');
// Temperatureinfluss: 30 °C → Faktor 0,9
pruefe(nahe(gleichgewichtsfeuchte(65, 30).u, 13.71825 * 0.9, 1e-9), 'Temperaturkorrektur −1 %/K');
// Randfall: φ = 100 %, θ = 0 °C → 28 · 1,2 = 33,6 % → begrenzt auf Fasersättigung
const g100 = gleichgewichtsfeuchte(100, 0);
pruefe(g100.u === FASERSAETTIGUNG && g100.begrenzt && g100.hinweise.some(h => h.stufe === 'warnung'), 'Begrenzung auf 30 %');
pruefe(gleichgewichtsfeuchte(0, 20).u === 0, 'φ = 0 → u = 0');
// Grenze: φ außerhalb 0 … 100 % ist unzulässig
pruefe(gleichgewichtsfeuchte(101, 20).hinweise.some(h => h.stufe === 'fehler'), 'φ > 100 % → Fehler');
pruefe(gleichgewichtsfeuchte(NaN, 20).hinweise.some(h => h.stufe === 'fehler'), 'NaN → Fehler');

// 2. Feuchteangleich: τ(20 mm) = 15 d; nach t = τ ist (u0 − u_gl) auf 1/e abgeklungen
pruefe(zeitkonstanteFeuchte(20) === 15 && zeitkonstanteFeuchte(40) === 60, 'τ ∝ d²');
const f = feuchteNachLagerung(30, 12, 15, 20);
pruefe(nahe(f.u, 12 + 18 / Math.E, 1e-12), `u(τ) = ${f.u}`);
pruefe(feuchteNachLagerung(30, 12, 0, 20).u === 30, 't = 0 → Einbaufeuchte');
pruefe(nahe(feuchteNachLagerung(30, 12, 1e5, 20).u, 12, 1e-9), 't → ∞ → Gleichgewicht');
pruefe(feuchteNachLagerung(30, 12, 10, 0).hinweise.some(h => h.stufe === 'fehler'), 'Dicke 0 → Fehler');

// 3. Schwinden Fichte (q_t = 0,33, q_r = 0,16, q_l = 0,01 %/%), 120 × 24 × 350 mm, 30 % → 12 %:
//    Δu = 18 %; ε_T = 18 · 0,33 = 5,94 % → Breite 120 · 0,9406 = 112,872 mm; ε_R = 2,88 % → Dicke 23,309 mm
//    Volumen: 1 − 0,9406 · 0,9712 · 0,9982 = 8,813 %
const s = schwinden({ uStart: 30, uEnde: 12, qt: 0.33, qr: 0.16, ql: 0.01, breite: 120, dicke: 24, laenge: 350 });
pruefe(s.deltaU === 18 && nahe(s.neueBreite, 112.872, 1e-9) && nahe(s.neueDicke, 23.3088, 1e-9) && nahe(s.neueLaenge, 349.37, 1e-9), 'Schwinden Fichte');
pruefe(nahe(s.mikroT, 59400, 1e-9) && nahe(s.mikroR, 28800, 1e-9) && nahe(s.mikroL, 1800, 1e-9), 'µm/m');
pruefe(nahe(s.epsV, 1 - 0.9406 * 0.9712 * 0.9982, 1e-12), `ε_V ${s.epsV}`);
pruefe(nahe(schwindmass(18, 0.33), 5.94, 1e-12), 'Schwindmaß Δu · q');
// Randfall: Einbaufeuchte über Fasersättigung → nur ab 30 % wirksam, Warnung
const s40 = schwinden({ uStart: 40, uEnde: 12, qt: 0.33, qr: 0.16, ql: 0.01, breite: 120, dicke: 24, laenge: 350 });
pruefe(s40.deltaU === 18 && s40.hinweise.some(h => h.stufe === 'warnung'), 'über Fasersättigung');
// Quellen (u steigt): negatives Δu, Maße wachsen, µm/m als Betrag
const sq = schwinden({ uStart: 8, uEnde: 14, qt: 0.33, qr: 0.16, ql: 0.01, breite: 100, dicke: 100, laenge: 1000 });
pruefe(sq.deltaU === -6 && sq.neueBreite > 100 && sq.mikroT > 0, 'Quellen');
pruefe(schwinden({ uStart: 30, uEnde: 12, qt: 0.33, qr: 0.16, ql: 0.01, breite: 0, dicke: 24, laenge: 350 }).hinweise.some(h => h.stufe === 'fehler'), 'Breite 0 → Fehler');

// 4. Fuzz: 1 000 Zufallseingaben ohne NaN/∞
let seed = 23;
const z = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
for (let i = 0; i < 1000; i++) {
  const g = gleichgewichtsfeuchte(z(-20, 120), z(-40, 200));
  const l = feuchteNachLagerung(z(-5, 60), g.u, z(-10, 1000), z(-10, 500));
  const r = schwinden({ uStart: z(-5, 60), uEnde: l.u, qt: z(-0.1, 0.6), qr: z(-0.1, 0.4), ql: z(-0.01, 0.05), breite: z(-10, 500), dicke: z(-10, 300), laenge: z(-10, 5000) });
  const werte = [g.u, l.u, l.tau, r.deltaU, r.epsT, r.epsV, r.neueBreite, r.neueDicke, r.neueLaenge, r.mikroT];
  if (!werte.every(Number.isFinite)) { pruefe(false, `Fuzz ${i}: ${JSON.stringify(werte)}`); break; }
}

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log('OK: Holzphysik');
