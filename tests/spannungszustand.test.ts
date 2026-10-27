// Rechenkern ebener Spannungszustand / Mohr'scher Spannungskreis (Z24, Modul „Festigkeitsberechnungen“)
import { hauptspannungen, transformiere, mohrKreis, vonMises, richtungGrad, kreisPunkte, type EbenerSpannungszustand } from '../src/calc/spannungszustand';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.max(1, Math.abs(soll));
console.log('--- Test: Spannungszustand ---');

// 1. Literaturbeispiel: Wandinger, TM2, Lösungen 2.5, Aufgabe 3 (Hochschule München, öffentlich):
//    σ_x = 200, σ_y = 40, τ_xy = 60 MPa → σ₁ = 220, σ₂ = 20, τ_max = 100 MPa, φ₁ = 18,43°,
//    σ_V,Tresca = 220 MPa, σ_V,Mises ≈ 210,7 MPa
const a = hauptspannungen({ sx: 200, sy: 40, txy: 60 });
pruefe(nahe(a.sigmaM, 120, 1e-12) && nahe(a.R, 100, 1e-12), `σ_M/R ${a.sigmaM}/${a.R}`);
pruefe(nahe(a.sigma1, 220, 1e-12) && nahe(a.sigma2, 20, 1e-12), `σ₁/σ₂ ${a.sigma1}/${a.sigma2}`);
pruefe(nahe(a.phi1Grad, 18.43, 1e-3), `φ₁ ${a.phi1Grad}`);
pruefe(nahe(a.tauMax, 100, 1e-12) && nahe(a.sigmaVTresca, 220, 1e-12) && nahe(a.sigmaVMises, 210.7, 1e-3), `τ/Vergleich ${a.tauMax}/${a.sigmaVMises}`);
// beide Hauptspannungen Zug → räumlich τ = σ₁/2 = 110 MPa, Hinweis
pruefe(nahe(a.tauMaxRaeumlich, 110, 1e-12) && a.hinweise.some(h => h.stufe === 'warnung' && /räumlich/.test(h.text)), 'τ räumlich');

// 2. Literaturbeispiel: Wandinger, TM2, Übungen 2.3, Aufgabe 6 a/b und 11
const b1 = hauptspannungen({ sx: 200, sy: 300, txy: 100 });
pruefe(nahe(b1.sigma1, 361.8, 1e-4) && nahe(b1.sigma2, 138.2, 1e-3) && nahe(b1.phi1Grad, 58.28, 1e-4), `6a ${b1.sigma1}/${b1.sigma2}/${b1.phi1Grad}`);
const b2 = hauptspannungen({ sx: 200, sy: 600, txy: -400 });
pruefe(nahe(b2.sigma1, 847.2, 1e-4) && nahe(b2.sigma2, -47.21, 1e-3) && nahe(b2.phi1Grad, -58.28, 1e-4), `6b ${b2.sigma1}/${b2.sigma2}/${b2.phi1Grad}`);
const b3 = hauptspannungen({ sx: 250, sy: 50, txy: 75 });
pruefe(nahe(b3.sigmaM, 150, 1e-12) && nahe(b3.tauMax, 125, 1e-12) && nahe(b3.sigma1, 275, 1e-12) && nahe(b3.sigma2, 25, 1e-12) && nahe(b3.phi1Grad, 18.43, 1e-3), 'Aufgabe 11');
// Aufgabe 12: σ_x = 400, σ_y = −200, τ_xy = 100 → σ_max = 416,2 MPa bei φ = 9,217°, τ_max = 316,2 MPa
const b4 = hauptspannungen({ sx: 400, sy: -200, txy: 100 });
pruefe(nahe(b4.sigma1, 416.2, 1e-4) && nahe(b4.phi1Grad, 9.217, 1e-3) && nahe(b4.tauMax, 316.2, 1e-4), `Aufgabe 12 ${b4.sigma1}/${b4.phi1Grad}`);
pruefe(nahe(transformiere({ sx: 400, sy: -200, txy: 100 }, 9.217).sXi, 416.2, 1e-4), 'Aufgabe 12 über Transformation');

// 3. Unabhängige Prüfungen: Invarianten, Hauptrichtung schubfrei, τ_max unter φ₁ − 45°, Kreisgleichung
const zustaende: EbenerSpannungszustand[] = [{ sx: 50, sy: -20, txy: 30 }, { sx: -80, sy: -10, txy: -45 }, { sx: 0, sy: 0, txy: 70 }, { sx: 120, sy: 30, txy: 0 }];
for (const z of zustaende) {
  const r = hauptspannungen(z);
  const h = transformiere(z, r.phi1Grad);
  pruefe(nahe(h.sXi, r.sigma1, 1e-9) && Math.abs(h.tXiEta) <= 1e-9 * Math.max(1, r.R) && nahe(h.sEta, r.sigma2, 1e-9), `Hauptrichtung ${JSON.stringify(z)}`);
  const t = transformiere(z, r.phiTauGrad);
  pruefe(nahe(Math.abs(t.tXiEta), r.R, 1e-9) && nahe(t.sXi, r.sigmaM, 1e-9), `τ_max-Schnitt ${JSON.stringify(z)}`);
  pruefe(nahe(vonMises(z), r.sigmaVMises, 1e-9), `Mises aus σ_x,σ_y,τ ${JSON.stringify(z)}`);
  for (const th of [-73, -30, 0, 12.5, 45, 89]) {
    const s = transformiere(z, th);
    const { sigmaM, R } = mohrKreis(z);
    pruefe(nahe(s.sXi + s.sEta, z.sx + z.sy, 1e-9), `Spur θ=${th}`);
    pruefe(nahe((s.sXi - sigmaM) ** 2 + s.tXiEta ** 2, R * R, 1e-9), `Bildpunkt auf dem Kreis θ=${th}`);
  }
}
// Handrechnung (Aufgabenblatt Mechanik t_festigkeit): σ_x = 50, σ_y = −20, τ = 30 → σ_M = 15, R = 46,10, σ₁ = 61,10, σ₂ = −31,10
const c = hauptspannungen({ sx: 50, sy: -20, txy: 30 });
pruefe(nahe(c.R, Math.sqrt(2125), 1e-12) && nahe(c.sigma1, 15 + Math.sqrt(2125), 1e-12) && nahe(c.sigma2, 15 - Math.sqrt(2125), 1e-12), 'Handrechnung 50/−20/30');
// reiner Schub: φ₁ = 45°, σ₁ = τ, σ₂ = −τ
const d = hauptspannungen({ sx: 0, sy: 0, txy: 70 });
pruefe(nahe(d.phi1Grad, 45, 1e-12) && nahe(d.sigma1, 70, 1e-12) && nahe(d.sigma2, -70, 1e-12), 'reiner Schub');
pruefe(richtungGrad(135) === -45 && richtungGrad(-90) === 90 && richtungGrad(90) === 90, 'Richtungsintervall');
pruefe(kreisPunkte({ sx: 200, sy: 40, txy: 60 }, 36).every(p => nahe(Math.hypot(p.sigma - 120, p.tau), 100, 1e-12)), 'Kreispunkte');

// 4. Randfälle und Grenzen
const iso = hauptspannungen({ sx: 100, sy: 100, txy: 0 });
pruefe(iso.R === 0 && iso.phi1Grad === 0 && iso.hinweise.some(h => /isotrop/.test(h.text)), 'isotroper Zustand');
pruefe(hauptspannungen({ sx: NaN, sy: 0, txy: 0 }).hinweise.some(h => h.stufe === 'fehler') && Number.isNaN(hauptspannungen({ sx: NaN, sy: 0, txy: 0 }).sigma1), 'NaN → Fehler');
pruefe(hauptspannungen({ sx: 10, sy: 0, txy: 0 }, 0).hinweise.some(h => h.stufe === 'fehler' && h.feld === 'fy'), 'f_y = 0 → Fehler');
pruefe(hauptspannungen({ sx: 1500, sy: 0, txy: 0 }).hinweise.some(h => h.stufe === 'warnung' && h.feld === 'sx'), 'σ > 1000 → Warnung');
const e = hauptspannungen({ sx: 200, sy: -150, txy: 80 }, 235);
pruefe(nahe(e.eta, e.sigmaVMises / 235, 1e-12) && e.eta > 1 && e.hinweise.some(h => h.feld === 'fy'), 'Ausnutzung > 1');

// 5. Fuzz: 1000 Zufallseingaben → entweder Fehler oder endliche Ergebnisse
let zufall = 4711;
const rnd = () => { zufall = (zufall * 1103515245 + 12345) % 2147483648; return zufall / 2147483648; };
let gueltig = 0;
for (let i = 0; i < 1000; i++) {
  const z = { sx: rnd() * 2400 - 1200, sy: rnd() * 2400 - 1200, txy: rnd() < 0.1 ? 0 : rnd() * 1200 - 600 };
  const fy = rnd() < 0.5 ? undefined : rnd() * 500 - 20;
  const r = hauptspannungen(z, fy);
  if (r.hinweise.some(h => h.stufe === 'fehler')) continue;
  gueltig++;
  const werte = [r.sigmaM, r.R, r.sigma1, r.sigma2, r.phi1Grad, r.phi2Grad, r.phiTauGrad, r.tauMaxRaeumlich, r.sigmaVMises, r.sigmaVTresca, ...(fy !== undefined ? [r.eta] : [])];
  pruefe(werte.every(Number.isFinite) && r.sigma1 >= r.sigma2 && r.phi1Grad > -90 && r.phi1Grad <= 90, `Fuzz ${i}: ${JSON.stringify(z)}`);
}
pruefe(gueltig > 500, `Fuzz: nur ${gueltig} gültige Fälle`);

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log(`OK: Spannungszustand (${gueltig} gültige Fuzz-Fälle)`);
