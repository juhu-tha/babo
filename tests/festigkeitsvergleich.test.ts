// Rechenkern Festigkeitsvergleich (Z3): Grenzhöhe/Reißlänge unter Eigengewicht und Würfelstapel
import { grenzhoehen, wuerfelstapel, type Festigkeitswerkstoff } from '../src/calc/festigkeitsvergleich';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Festigkeitsvergleich ---');

// Werkstoffe wie im Modul
const C20: Festigkeitswerkstoff = { rho: 2400, fc: 20, ft: 2.2, E: 30000 };
const S235: Festigkeitswerkstoff = { rho: 7850, fc: 235, ft: 360, E: 210000 };

// 1. Handrechnung: Beton C20/25 H = 20·10⁶/(2400·9,81) = 849,47 m; L = 2,2·10⁶/(2400·9,81) = 93,44 m; S235 L = 360·10⁶/(7850·9,81) = 4674,8 m
const b = grenzhoehen(C20), s = grenzhoehen(S235);
pruefe(nahe(b.H_max, 849.473, 1e-3) && nahe(b.L_max, 93.442, 1e-3) && nahe(s.L_max, 4674.81, 1e-2), `Grenzhöhen ${b.H_max} ${b.L_max} ${s.L_max}`);
// 2. Würfelstapel C20/25, a = 10 cm: N = ⌊20·10⁶/(2400·9,81·0,1)⌋ = ⌊8494,7⌋ = 8494; H = 849,4 m; σ = 8494·2354,4 Pa = 19,998 N/mm²
//    δ_unten = 19,998/30 000·100 mm = 0,06666 mm; δ_ges = 2400·9,81·0,01/30 000·10⁶·8494·8495/2·1000 = 283,14 mm (exakt N²/2: 283,11 mm)
const w = wuerfelstapel(C20, 10);
pruefe(w.gueltig && w.N_max === 8494 && nahe(w.H_total, 849.4, 1e-9) && nahe(w.sigma_bottom, 19.99827, 1e-5), `Würfel ${w.N_max} ${w.sigma_bottom}`);
pruefe(nahe(w.delta_bottom, 0.0666609, 1e-7) && nahe(w.delta_total, 283.1422, 1e-4) && nahe(w.delta_total_exakt, 283.1422 * 8494 / 8495, 1e-4), `Stauchung ${w.delta_bottom} ${w.delta_total}`);
// 3. Randfälle
pruefe(!wuerfelstapel(C20, 0).gueltig && !wuerfelstapel({ ...C20, E: 0 }).gueltig, 'a = 0 / E = 0 → Fehler');
const riesig = wuerfelstapel({ rho: 2400, fc: 0.01, ft: 0, E: 30000 }, 100);
pruefe(riesig.N_max === 0 && riesig.H_total === 0 && riesig.delta_total === 0, 'N = 0 bei sehr geringer Festigkeit');
// 4. Fuzz: Monotonie (größere Würfel → weniger Würfel, gleiche Höhe ±a), endliche Werte
let zufall = 42;
const rnd = () => { zufall = (zufall * 1103515245 + 12345) % 2147483648; return zufall / 2147483648; };
for (let i = 0; i < 1000; i++) {
  const m: Festigkeitswerkstoff = { rho: 300 + rnd() * 8000, fc: 1 + rnd() * 800, ft: rnd() * 3000, E: 1000 + rnd() * 250000 };
  const a = 1 + rnd() * 50, r1 = wuerfelstapel(m, a), r2 = wuerfelstapel(m, a * 2), g = grenzhoehen(m);
  pruefe(r1.gueltig && [r1.H_total, r1.delta_total, r1.sigma_bottom].every(Number.isFinite), `Fuzz ${i}: endlich`);
  pruefe(r2.N_max <= r1.N_max && r1.H_total <= g.H_max + 1e-6 && r1.H_total > g.H_max - a / 100 - 1e-6 && r1.sigma_bottom <= m.fc + 1e-9, `Fuzz ${i}: Konsistenz`);
  pruefe(r1.delta_total_exakt <= r1.delta_total && r1.delta_bottom <= r1.delta_total + 1e-12, `Fuzz ${i}: Stauchungen`);
  pruefe(grenzhoehen({ ...m, rho: m.rho * 1.1 }).H_max < g.H_max, `Fuzz ${i}: Dichtemonotonie`);
}

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log('OK: Festigkeitsvergleich');
