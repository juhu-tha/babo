// Rechenkern Membranspannung / Kesselformel (AP 3.13, Modul „Membranen und ETFE-Folien“)
import { membranNachweis, membranKraft, radiusAusStich, MEMBRAN_LEHRWERTE, type MembranEingabe } from '../src/calc/membran';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.max(1, Math.abs(soll));
console.log('--- Test: Membran ---');

// 1. Handrechnung ETFE-Kissenlage, zylindrisch: L = 3,0 m, f = 0,30 m, p = 300 Pa, t = 200 µm, f_ref = 23 N/mm², γ = 2
//    r = 3,0²/(8·0,30) + 0,30/2 = 3,75 + 0,15 = 3,90 m
//    n = p·r = 300 · 3,90 = 1 170 N/m = 1,17 kN/m;  σ = 1,170 N/mm / 0,200 mm = 5,85 N/mm²
//    n_zul = 23 · 0,200 / 2 = 2,30 N/mm = 2 300 N/m;  η = 1 170/2 300 = 0,5087
const folie: MembranEingabe = { geometrie: 'zylinder', p: 300, spannweite: 3, stich: 0.3, werkstoff: 'folie', dickeUm: 200, festigkeitFolie: 23, gamma: 2 };
const a = membranNachweis(folie);
pruefe(nahe(a.r, 3.9, 1e-12), `r ${a.r}`);
pruefe(nahe(a.n, 1170, 1e-12) && nahe(a.nKN, 1.17, 1e-12), `n ${a.n}`);
pruefe(nahe(a.sigma, 5.85, 1e-12), `σ ${a.sigma}`);
pruefe(nahe(a.nZul, 2300, 1e-12) && nahe(a.eta, 1170 / 2300, 1e-12) && a.ok && a.hinweise.length === 0, `η ${a.eta}`);
// Kugel (gleichsinnig doppelt gekrümmt): halbe Membrankraft
const k = membranNachweis({ ...folie, geometrie: 'kugel' });
pruefe(nahe(k.n, 585, 1e-12) && nahe(k.sigma, 2.925, 1e-12), `Kugel n ${k.n}`);

// 2. Handrechnung Traglufthalle PVC/PES Typ II: r = 15 m, p = 300 Pa, f_t = 4 000 N/5 cm, γ = 5
//    n = 4 500 N/m = 4,5 kN/m; n_zul = 4 000/0,05/5 = 16 000 N/m; η = 0,28125
const g = membranNachweis({ geometrie: 'zylinder', p: 300, radius: 15, werkstoff: 'gewebe', festigkeitGewebe: MEMBRAN_LEHRWERTE.pvcPesTyp2, gamma: MEMBRAN_LEHRWERTE.gammaGewebe });
pruefe(nahe(g.n, 4500, 1e-12) && nahe(g.nZul, 16000, 1e-12) && nahe(g.eta, 0.28125, 1e-12) && Number.isNaN(g.sigma), `Halle η ${g.eta}`);

// 3. Unabhängige Referenzen
// 3a. Radius über Pythagoras: (r − f)² + (L/2)² = r² (Sehnensatz), für mehrere L/f
for (const [L, f] of [[3, 0.3], [5, 0.5], [8, 1.2], [10, 5]]) {
  const r = radiusAusStich(L, f);
  pruefe(nahe((r - f) ** 2 + (L / 2) ** 2, r * r, 1e-12), `Kreisbogen L=${L}, f=${f}`);
}
// 3b. Zylinder: Gleichgewicht am Halbzylinder (Länge 1 m) durch numerische Integration der Druckkomponenten
//     ∫₀^π p·r·sin θ dθ = 2·n  →  n = p·r
// 3c. Kugel: Gleichgewicht an der Halbkugel ∫₀^{π/2} p·cos φ · 2π r² sin φ dφ = n · 2π r  →  n = p·r/2
function nZylNum(p: number, r: number) { const N = 20000; let s = 0; for (let i = 0; i < N; i++) { const t = (i + 0.5) * Math.PI / N; s += p * r * Math.sin(t) * Math.PI / N; } return s / 2; }
function nKugNum(p: number, r: number) { const N = 20000; let s = 0; for (let i = 0; i < N; i++) { const t = (i + 0.5) * (Math.PI / 2) / N; s += p * Math.cos(t) * 2 * Math.PI * r * r * Math.sin(t) * (Math.PI / 2) / N; } return s / (2 * Math.PI * r); }
for (const [p, r] of [[250, 3.9], [600, 2.1], [400, 12]]) {
  pruefe(nahe(membranKraft('zylinder', p, r), nZylNum(p, r), 1e-6), `Zylinder numerisch p=${p}, r=${r}`);
  pruefe(nahe(membranKraft('kugel', p, r), nKugNum(p, r), 1e-6), `Kugel numerisch p=${p}, r=${r}`);
}

// 4. Fehler und Warnungen
pruefe(membranNachweis({ ...folie, p: 0 }).hinweise.some(h => h.stufe === 'fehler' && h.feld === 'p'), 'p = 0 → Fehler');
pruefe(membranNachweis({ ...folie, stich: 2 }).hinweise.some(h => h.stufe === 'fehler' && h.feld === 'stich'), 'f > L/2 → Fehler');
pruefe(membranNachweis({ ...folie, gamma: 0.8 }).hinweise.some(h => h.stufe === 'fehler'), 'γ < 1 → Fehler');
pruefe(membranNachweis({ ...folie, dickeUm: NaN }).hinweise.some(h => h.stufe === 'fehler') && Number.isNaN(membranNachweis({ ...folie, dickeUm: NaN }).n), 'NaN → Fehler');
pruefe(membranNachweis({ ...folie, stich: 0.1 }).hinweise.some(h => h.stufe === 'warnung' && h.feld === 'stich'), 'flach → Warnung');
pruefe(membranNachweis({ ...folie, p: 2000 }).hinweise.some(h => h.stufe === 'warnung' && h.feld === 'p'), 'p groß → Warnung');
pruefe(!membranNachweis({ ...folie, p: 800, stich: 0.15 }).ok, 'flaches Kissen bei 800 Pa überschreitet n_zul');

// 5. Fuzz: 1000 Zufallseingaben → entweder Fehler oder endliche Ergebnisse
let zufall = 12345;
const rnd = () => { zufall = (zufall * 1103515245 + 12345) % 2147483648; return zufall / 2147483648; };
const wahl = <T,>(a: readonly T[]) => a[Math.floor(rnd() * a.length)];
let gueltig = 0;
for (let i = 0; i < 1000; i++) {
  const e: MembranEingabe = {
    geometrie: wahl(['zylinder', 'kugel'] as const),
    p: rnd() * 3000 - 200,
    radius: rnd() < 0.3 ? rnd() * 50 - 5 : undefined,
    spannweite: rnd() * 20 - 1,
    stich: rnd() * 6 - 0.5,
    werkstoff: wahl(['gewebe', 'folie'] as const),
    festigkeitGewebe: rnd() * 15000 - 500,
    dickeUm: rnd() * 500 - 20,
    festigkeitFolie: rnd() * 80 - 5,
    gamma: rnd() * 8,
  };
  const r = membranNachweis(e);
  if (r.hinweise.some(h => h.stufe === 'fehler')) continue;
  gueltig++;
  const werte = [r.r, r.n, r.nKN, r.nZul, r.eta, ...(e.werkstoff === 'folie' ? [r.sigma] : [])];
  pruefe(werte.every(Number.isFinite) && r.n > 0 && r.nZul > 0, `Fuzz ${i}: ${JSON.stringify(e)}`);
}
pruefe(gueltig > 100, `Fuzz: nur ${gueltig} gültige Fälle`);

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log(`OK: Membran (${gueltig} gültige Fuzz-Fälle)`);
