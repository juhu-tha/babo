// Rechenkern Holzphysik: Gleichgewichtsfeuchte, Feuchteangleich, Quellen und Schwinden (Umsetzungsplan Phase 4, AP 4.2)
import { FASERSAETTIGUNG, gleichgewichtsfeuchte, sorptionHailwoodHorrobin, feuchteNachLagerung, zeitkonstanteFeuchte, schwinden, schwindmass } from '../src/calc/holzphysik';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
console.log('--- Test: Holzphysik ---');

// 1. Gleichgewichtsfeuchte (Runde 5: Hailwood-Horrobin mit Koeffizienten nach Simpson, Wood Handbook FPL-GTR-113, Kap. 3, Gl. 3-3)
//    20 °C, h = 0,65: W = 349 + 25,8 + 5,4 = 380,2; K = 0,81863; K₁ = 5,9612; K₂ = 2,6068; K·h = 0,53211
//    u = 1800/380,2 · [0,53211/0,46789 + (3,1720 + 2·4,3996)/(1 + 3,1720 + 4,3996)] = 4,7344 · (1,13726 + 1,39667) = 12,00 %
//    Literatur: Wood Handbook-Tabelle 21,1 °C / 65 % ≈ 12,0 %; ATIBT („close to 12 %“ bei 20 °C / 65 %).
const g65 = gleichgewichtsfeuchte(65, 20);
pruefe(Math.abs(g65.u - 11.996) < 0.001 && !g65.begrenzt && g65.hinweise.length === 0, `u_gl(65 %, 20 °C) = ${g65.u}`);
pruefe(Math.abs(g65.u - 12) < 0.05, 'Sorptionsmodell trifft den Literaturwert 12 % (Ziel Runde 5)');
pruefe(nahe(sorptionHailwoodHorrobin(0.65, 20), g65.u, 1e-12), 'Kernfunktion = Auswertung');
// Weitere Tabellenpunkte (Wood Handbook, 70 °F ≈ 21,1 °C): 40 % → 7,7 %, 80 % → 16,0 % (gerundet ±0,3)
pruefe(Math.abs(gleichgewichtsfeuchte(40, 21.1).u - 7.7) < 0.3 && Math.abs(gleichgewichtsfeuchte(80, 21.1).u - 16.0) < 0.3, 'Tabellenpunkte 40/80 %');
// Temperatureinfluss: wärmer → geringere Ausgleichsfeuchte (30 °C/65 % → 11,6 %)
pruefe(gleichgewichtsfeuchte(65, 30).u < g65.u && Math.abs(gleichgewichtsfeuchte(65, 30).u - 11.605) < 0.01, 'Temperatureinfluss');
// Randfall: φ = 100 % → 28,8 % (unter Fasersättigung, keine Begrenzung); φ = 0 → u = 0
const g100 = gleichgewichtsfeuchte(100, 20);
pruefe(Math.abs(g100.u - 28.84) < 0.01 && !g100.begrenzt, `φ = 100 % → ${g100.u}`);
pruefe(gleichgewichtsfeuchte(0, 20).u === 0, 'φ = 0 → u = 0');
// Monotonie in φ
for (let p = 0; p < 100; p += 5) pruefe(gleichgewichtsfeuchte(p + 5, 20).u > gleichgewichtsfeuchte(p, 20).u, `monoton bei φ = ${p} %`);
// Grenze: φ außerhalb 0 … 100 % und θ außerhalb −20 … 120 °C sind unzulässig; außerhalb 0 … 100 °C Warnung
pruefe(gleichgewichtsfeuchte(101, 20).hinweise.some(h => h.stufe === 'fehler'), 'φ > 100 % → Fehler');
pruefe(gleichgewichtsfeuchte(65, 150).hinweise.some(h => h.stufe === 'fehler'), 'θ = 150 °C → Fehler');
pruefe(gleichgewichtsfeuchte(65, -10).hinweise.some(h => h.stufe === 'warnung' && h.feld === 'theta'), 'θ = −10 °C → Warnung');
pruefe(gleichgewichtsfeuchte(NaN, 20).hinweise.some(h => h.stufe === 'fehler'), 'NaN → Fehler');
void FASERSAETTIGUNG;

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
