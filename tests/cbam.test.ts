// Rechenkern CBAM: Anpassung an die kostenlose Zuteilung (Art. 31 VO (EU) 2023/956), Jahrespfad 2026–2034
import { cbamKosten, cbamJahrespfad, CBAM_FAKTOR, CBAM_BENCHMARK, CBAM_JAHRE } from '../src/calc/cbam';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
console.log('--- Test: CBAM ---');

// 1. CBAM-Faktoren nach Art. 10a Abs. 1a RL 2003/87/EG (zu zahlender Anteil 2,5/5/10/22,5/48,5/61/73,5/86/100 %)
pruefe(CBAM_FAKTOR[2026] === 0.975 && CBAM_FAKTOR[2027] === 0.95 && CBAM_FAKTOR[2028] === 0.9 && CBAM_FAKTOR[2029] === 0.775 && CBAM_FAKTOR[2030] === 0.515
  && CBAM_FAKTOR[2031] === 0.39 && CBAM_FAKTOR[2032] === 0.265 && CBAM_FAKTOR[2033] === 0.14 && CBAM_FAKTOR[2034] === 0 && CBAM_JAHRE.length === 9, 'CBAM-Faktoren');
pruefe(CBAM_BENCHMARK.zementGrau === 0.666 && CBAM_BENCHMARK.zementWeiss === 0.859, 'Benchmarks DVO (EU) 2025/2620 Anhang 5.3 Spalte B');

// 2. Endzustand 2034 (Quizfrage qn_lca_regulatorik_5): 1000 t · 0,8 t/t · (80 − 20) €/t = 48 000 €
const e34 = cbamKosten({ jahr: 2034, mengeT: 1000, emissionen: 0.8, benchmark: 0.666, preisCbam: 80, preisHerkunft: 20 });
pruefe(e34.gueltig && nahe(e34.kosten, 48000, 1e-6) && nahe(e34.zertifikate, 800, 1e-9) && nahe(e34.anteilEndzustand, 1, 1e-12), `2034 ${e34.kosten}`);

// 3. Beispiel cbamguide.com (Importeure Zement): Türkei, grauer Portlandzement, Standardwert 1,44 + 10 % Aufschlag 2026 = 1,584 t/t,
//    2026: 1,584 − 0,666 · 0,975 = 0,93465 Zertifikate/t; Preis Q3 2026 82,32 €/t → 76,94 €/t
const e26 = cbamKosten({ jahr: 2026, mengeT: 1, emissionen: 1.584, benchmark: CBAM_BENCHMARK.zementGrau, preisCbam: 82.32 });
pruefe(nahe(e26.sefa, 0.64935, 1e-9) && nahe(e26.pflichtigJeT, 0.93465, 1e-9) && nahe(e26.kostenJeT, 76.94, 0.005), `2026 ${e26.pflichtigJeT} ${e26.kostenJeT}`);

// 4. 2030, 1000 t · 0,8 t/t, 80 €/t, ohne Herkunftspreis: 0,8 − 0,515 · 0,666 = 0,45701 t/t → 457,01 Zertifikate → 36 560,80 €
const e30 = cbamKosten({ jahr: 2030, mengeT: 1000, emissionen: 0.8, benchmark: 0.666, preisCbam: 80 });
pruefe(nahe(e30.zertifikate, 457.01, 1e-6) && nahe(e30.kosten, 36560.8, 1e-6) && nahe(e30.anteilEndzustand, 36560.8 / 64000, 1e-12), `2030 ${e30.kosten}`);

// 5. Randfälle: Emissionen unter der Anpassung → 0; Herkunftspreis deckt alles → 0; CSCF < 1 senkt die Anpassung
const klein = cbamKosten({ jahr: 2026, mengeT: 100, emissionen: 0.5, benchmark: 0.666, preisCbam: 80 });
pruefe(klein.zertifikate === 0 && klein.kosten === 0 && klein.hinweise.some(x => x.feld === 'emissionen'), 'e < SEFA → keine Zertifikate');
const hoch = cbamKosten({ jahr: 2028, mengeT: 1000, emissionen: 0.8, benchmark: 0.666, preisCbam: 80, preisHerkunft: 90 });
pruefe(hoch.kosten === 0 && hoch.hinweise.some(x => x.feld === 'preisHerkunft'), 'Herkunftspreis > CBAM-Preis → Kosten 0');
// CSCF = 0,9: SEFA = 0,975 · 0,9 · 0,666 = 0,58442 → 0,8 − 0,58442 = 0,21559 t/t (statt 0,15065 mit CSCF = 1)
const mitCscf = cbamKosten({ jahr: 2026, mengeT: 1, emissionen: 0.8, benchmark: 0.666, preisCbam: 80, cscf: 0.9 });
pruefe(nahe(mitCscf.sefa, 0.5844150, 1e-7) && nahe(mitCscf.pflichtigJeT, 0.215585, 1e-6), 'CSCF');
pruefe(!cbamKosten({ jahr: 2025 as never, mengeT: 1, emissionen: 0.8, benchmark: 0.666, preisCbam: 80 }).gueltig && !cbamKosten({ jahr: 2026, mengeT: -1, emissionen: 0.8, benchmark: 0.666, preisCbam: 80 }).gueltig, 'Jahr 2025 / Menge < 0 → Fehler');

// 6. Jahrespfad: Kosten steigen monoton bis zum Endzustand
const pfad = cbamJahrespfad({ mengeT: 1000, emissionen: 0.8, benchmark: 0.666, preisCbam: 80, preisHerkunft: 0 });
pruefe(pfad.length === 9 && pfad.every((p, i) => i === 0 || p.kosten >= pfad[i - 1].kosten) && nahe(pfad[8].kosten, 64000, 1e-6) && nahe(pfad[4].kosten, 36560.8, 1e-6), 'Jahrespfad monoton');

// 7. Fuzz: 1000 Zufallseingaben ohne NaN/∞, Kosten ≥ 0 und ≤ Kosten ohne kostenlose Zuteilung
let z = 4711;
const rnd = () => { z = (z * 1103515245 + 12345) % 2147483648; return z / 2147483648; };
for (let i = 0; i < 1000; i++) {
  const jahr = CBAM_JAHRE[Math.floor(rnd() * 9)];
  const e = { jahr, mengeT: rnd() * 1e5, emissionen: rnd() * 3, benchmark: rnd(), preisCbam: rnd() * 200, preisHerkunft: rnd() * 100, cscf: 0.5 + rnd() * 0.5 };
  const r = cbamKosten(e);
  const ohne = e.mengeT * e.emissionen * e.preisCbam;
  pruefe(r.gueltig && [r.kosten, r.zertifikate, r.kostenJeT, r.anteilEndzustand].every(Number.isFinite) && r.kosten >= 0 && r.kosten <= ohne + 1e-6, `Fuzz ${i}`);
}

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log('OK: CBAM');
