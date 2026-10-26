// Rechenkern Bauglas: Weibull, VSG-Schubverbund, thermische Spannung (Umsetzungsplan Phase 4, AP 4.2)
import {
  bruchwahrscheinlichkeit, weibull, sigma0Lehrmodell, schubmodulPvb, steinerAnteil, schubverbundGamma,
  effektiveDickeW, vsgEffektiveDicke, thermischeSpannung, VSG_MODUL, PVB_G_LEHR, type Lastdauer,
} from '../src/calc/glas';
import inhalt from '../content/glas/Glas.json';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
console.log('--- Test: Glas ---');

// 1. Effektive Dicke, öffentliches Rechenbeispiel: balconette.co.uk, „Structural assessment of laminated toughened glass“
//    (Annex 01.03.2023), Fall A: 5 mm + 1,52 mm PVB + 5 mm, ω = Γ = 0,3 → h_ef,w = ∛630,25 = 8,57 mm
//    (Quelle rundet h_m = 3,25 mm statt 3,26 mm; Abweichung < 0,2 %).
pruefe(nahe(effektiveDickeW(5, 5, 1.52, 0.3), 8.57, 0.01), `h_ef,w Fall A = ${effektiveDickeW(5, 5, 1.52, 0.3)} vs 8,57 mm (± 1 %)`);
// Grenzfälle des Verfahrens: Γ = 0 → ∛(h₁³ + h₂³) (lose Scheiben), Γ = 1 und h_v → 0 → h₁ + h₂ (monolithisch)
pruefe(nahe(effektiveDickeW(8, 8, 1.52, 0), Math.cbrt(2) * 8, 1e-12), 'Γ = 0 → ∛2 · h');
pruefe(nahe(effektiveDickeW(8, 8, 1e-9, 1), 16, 1e-6), 'Γ = 1, h_v → 0 → 16 mm');
pruefe(nahe(effektiveDickeW(6, 10, 1e-9, 1), 16, 1e-6), 'unsymmetrisch Γ = 1 → h₁ + h₂ (Steiner korrekt)');
// Steiner-Anteil symmetrisch: I_s = 2 · h · (h_s/2)² wie bisher im Modul
const st = steinerAnteil(8, 8, 1.52);
pruefe(nahe(st.hs, 9.52, 1e-12) && nahe(st.Is, 8 * (9.52 / 2) ** 2 * 2, 1e-12), 'h_s, I_s symmetrisch');

// 2. Γ: Grenzwerte und Handrechnung
pruefe(nahe(schubverbundGamma(8, 8, 1.52, 1e9, 1000), 1, 1e-6), 'G → ∞ → Γ → 1');
pruefe(schubverbundGamma(8, 8, 1.52, 1e-9, 1000) < 1e-6, 'G → 0 → Γ → 0');
// Handrechnung 8 + 1,52 + 8, G = 10 MPa, a = 1000 mm: 9,6 · 70000 · 362,52 · 1,52 / (10 · 90,63 · 10⁶) = 0,4086 → Γ = 0,710
pruefe(nahe(schubverbundGamma(8, 8, 1.52, 10, 1000), 1 / (1 + 9.6 * 70000 * 362.5216 * 1.52 / (10 * 9.52 ** 2 * 1e6)), 1e-9), 'Γ Formel');
pruefe(Math.abs(schubverbundGamma(8, 8, 1.52, 10, 1000) - 0.710) < 0.001, 'Γ(G = 10 MPa) = 0,710');
pruefe(schubverbundGamma(8, 8, 1.52, 1, 2000) > schubverbundGamma(8, 8, 1.52, 1, 1000), 'größere Stützweite → mehr Verbund');

// 3. Referenz: bisherige Komponentenrechnung (src/modules/Glas.tsx vor AP 4.2), wörtlich übernommen
function altG(t: number, dur: Lastdauer) {
  const vals = PVB_G_LEHR[dur] as Record<number, number>;
  if (t <= 0) return vals[0];
  if (t >= 60) return vals[60];
  const keys = [0, 20, 40, 60];
  for (let i = 0; i < keys.length - 1; i++) if (t >= keys[i] && t <= keys[i + 1]) return vals[keys[i]] + (t - keys[i]) / (keys[i + 1] - keys[i]) * (vals[keys[i + 1]] - vals[keys[i]]);
  return 0.1;
}
function altVsg(t: number, dur: Lastdauer) {
  const G = altG(t, dur), h1 = 8, h2 = 8, d = 1.52, E = 70000, a = 1000, hm = (h1 + h2) / 2 + d;
  const Is = h1 * Math.pow(hm / 2, 2) + h2 * Math.pow(hm / 2, 2);
  const Gamma = 1 / (1 + 9.6 * E * Is * d / (G * Math.pow(hm, 2) * Math.pow(a, 2)));
  return { G, Gamma, hef: Math.cbrt(Math.pow(h1, 3) + Math.pow(h2, 3) + 12 * Gamma * Is) };
}
for (const dur of ['short', 'medium', 'long'] as const) {
  for (let T = -20; T <= 60; T += 5) {
    const n = vsgEffektiveDicke({ T, dauer: dur, ...VSG_MODUL }), o = altVsg(T, dur);
    pruefe(nahe(n.G, o.G, 1e-12) && nahe(n.Gamma, o.Gamma, 1e-12) && nahe(n.hef_w, o.hef, 1e-12), `VSG ${dur} ${T} °C`);
  }
  pruefe(schubmodulPvb(20, dur) === PVB_G_LEHR[dur][20] && schubmodulPvb(40, dur) === PVB_G_LEHR[dur][40], `Stützstellen ${dur}`);
}
pruefe(nahe(schubmodulPvb(10, 'short'), 205, 1e-12), 'G(10 °C, kurz) = 205 MPa');
pruefe(vsgEffektiveDicke({ T: -10, dauer: 'short', ...VSG_MODUL }).hinweise.some(h => h.stufe === 'warnung'), 'T < 0 °C → Warnung');
pruefe(!vsgEffektiveDicke({ T: 20, dauer: 'short', ...VSG_MODUL, hv: 0 }).gueltig, 'h_v = 0 → Fehler');

// 4. Weibull: P_f(σ₀, A₀) = 1 − 1/e = 63,2 %; Flächeneffekt; σ = 0 → 0
pruefe(nahe(bruchwahrscheinlichkeit(60, 60, 7, 1), 1 - Math.exp(-1), 1e-12), 'P_f(σ₀) = 63,2 %');
pruefe(bruchwahrscheinlichkeit(0, 60, 7, 1) === 0, 'σ = 0 → P_f = 0');
pruefe(nahe(-Math.log(1 - bruchwahrscheinlichkeit(45, 67.5, 7, 4)), 4 * -Math.log(1 - bruchwahrscheinlichkeit(45, 67.5, 7, 1)), 1e-10), 'A × 4 → ln-Term × 4');
// gleiche P_f bei σ₂ = σ₁ · (A₁/A₂)^(1/m) (Größeneffekt)
pruefe(nahe(bruchwahrscheinlichkeit(45 * Math.pow(1 / 10, 1 / 7), 67.5, 7, 10), bruchwahrscheinlichkeit(45, 67.5, 7, 1), 1e-10), 'Größeneffekt');
const w = weibull({ sigma: 45, sigma0: sigma0Lehrmodell(45), m: 7, A: 1 });
pruefe(w.gueltig && w.kurve.length === 61 && w.kurve[0].y === 0 && w.kurve.every((p, i) => i === 0 || p.y >= w.kurve[i - 1].y), 'Kurve monoton 0 … 120 MPa');
pruefe(sigma0Lehrmodell(45) === 67.5 && sigma0Lehrmodell(120) === 180, 'σ₀ = 1,5 · f_g,k');
pruefe(!weibull({ sigma: 45, sigma0: 0, m: 7, A: 1 }).gueltig && !weibull({ sigma: 45, sigma0: 60, m: 7, A: 0 }).gueltig, 'σ₀ = 0, A = 0 → Fehler');
pruefe(weibull({ sigma: 45, sigma0: 60, m: 40, A: 1 }).hinweise.some(h => h.feld === 'm'), 'm = 40 → Warnung');

// 5. Thermischer Glasbruch, Rechenbeispiel content/glas/Glas.json: E = 70 000, α = 9·10⁻⁶, ΔT = 40 K → ≈ 25 N/mm²; 60 K → ≈ 38 N/mm²
const sch = inhalt.daten['Glas.schritte'] as { formel: string }[];
pruefe(sch.length === 4 && /25/.test(sch[2].formel) && /38/.test(sch[3].formel), 'Beispieltext vorhanden');
pruefe(nahe(thermischeSpannung(40), 25.2, 1e-9) && Math.abs(thermischeSpannung(40) - 25) / 25 < 0.01, 'σ_T(40 K) ≈ 25 N/mm² (± 1 %)');
pruefe(Math.abs(thermischeSpannung(60) - 38) / 38 < 0.01, 'σ_T(60 K) ≈ 38 N/mm² (± 1 %)');

// 6. Fuzz: 1 000 Zufallseingaben → endliche Ergebnisse oder sauberer Fehler
let z = 376;
const rnd = () => { z = (z * 1103515245 + 12345) % 2147483648; return z / 2147483648; };
let gueltige = 0;
const dauern: Lastdauer[] = ['short', 'medium', 'long'];
for (let k = 0; k < 1000; k++) {
  const wb = weibull({ sigma: rnd() * 150 - 5, sigma0: rnd() * 200 - 5, m: rnd() * 30, A: rnd() * 20 - 0.5 });
  if (wb.gueltig) { gueltige++; pruefe(wb.pf >= 0 && wb.pf <= 1 && wb.kurve.every(p => Number.isFinite(p.y)), `Fuzz ${k}: Weibull`); }
  else pruefe(wb.hinweise.some(h => h.stufe === 'fehler'), `Fuzz ${k}: Weibull ohne Fehler`);
  const v = vsgEffektiveDicke({ T: rnd() * 100 - 30, dauer: dauern[Math.floor(rnd() * 3)], h1: rnd() * 20 - 1, h2: rnd() * 20, hv: rnd() * 3 - 0.2, a: rnd() * 4000 });
  if (v.gueltig) pruefe([v.G, v.Gamma, v.hef_w].every(Number.isFinite) && v.Gamma > 0 && v.Gamma <= 1, `Fuzz ${k}: VSG`);
  else pruefe(v.hinweise.some(h => h.stufe === 'fehler'), `Fuzz ${k}: VSG ohne Fehler`);
}
pruefe(gueltige > 700, `Fuzz: nur ${gueltige} gültige Fälle`);

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log(`OK: Glas (${gueltige} gültige Weibull-Fuzz-Fälle)`);
