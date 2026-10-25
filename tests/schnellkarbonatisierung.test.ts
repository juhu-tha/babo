// Rechenkern Schnellkarbonatisierung (AP 6.2 b): K_AC aus x = a + K·√t, Umrechnung, Prognose
import { schnellkarbonatisierung, wurzelZeitRegression, umrechnungsfaktor, tiefeNach, type KarbonatisierungEingabe } from '../src/calc/schnellkarbonatisierung';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Schnellkarbonatisierung ---');

const pkt = (xs: number[], ts = [0, 7, 28, 70]) => ts.map((t, i) => ({ tTage: t, xMm: xs[i] }));
const basis: KarbonatisierungEingabe = { punkte: pkt([0.5, 2.5, 4.8, 7.5]), mitAchsenabschnitt: true, cAcc: 3, cNat: 0.04, deckung: 25, nutzungsdauer: 50 };

// 1. Exakte Daten: x = 0,5 + 1,0·√t → Regression muss K = 1,0, a = 0,5, R² = 1 liefern
const exakt = wurzelZeitRegression([0, 7, 28, 70].map(t => ({ tTage: t, xMm: 0.5 + Math.sqrt(t) })), true);
pruefe(nahe(exakt.k, 1, 1e-12) && nahe(exakt.a, 0.5, 1e-12) && nahe(exakt.r2, 1, 1e-12), `exakte Gerade ${JSON.stringify(exakt)}`);
const ursprung = wurzelZeitRegression([7, 28, 70].map(t => ({ tTage: t, xMm: 1.2 * Math.sqrt(t) })), false);
pruefe(nahe(ursprung.k, 1.2, 1e-12) && ursprung.a === 0 && nahe(ursprung.r2, 1, 1e-12), 'durch den Ursprung exakt');

// 2. Handrechnung Standardfall (Tage 0/7/28/70, Tiefen 0,5/2,5/4,8/7,5 mm)
//    s = √t = 0 / 2,6458 / 5,2915 / 8,3666; s̄ = 4,0760; x̄ = 3,825
//    S_ss = Σ(s − s̄)² = 37,0000 (= Σt − 4·s̄² = 105 − 66,456); S_sx = Σ(s − s̄)(x − x̄) = 31,1012
//    K_AC = 31,1012/37,0000 = 0,8406 mm/√d; a = 3,825 − 0,8406 · 4,0760 = 0,3988 mm
const r = schnellkarbonatisierung(basis);
pruefe(r.gueltig && nahe(r.kAC, 0.84057, 1e-5) && nahe(r.reg.a, 0.39885, 1e-5) && nahe(r.reg.r2, 0.99882, 1e-5), `Regression ${JSON.stringify(r.reg)}`);
//    Faktor √(0,04/3) · √365 = 0,115470 · 19,10497 = 2,20605
pruefe(nahe(r.faktor, 2.20605, 1e-5) && nahe(umrechnungsfaktor(3, 0.04), Math.sqrt(365 * 0.04 / 3), 1e-12), `Faktor ${r.faktor}`);
//    K_nat = 0,84057 · 2,20605 = 1,8544 mm/√a; x(50 a) = 1,8544 · √50 = 13,11 mm; t_c = (25/1,8544)² = 181,8 a
pruefe(nahe(r.kNat, 1.85435, 1e-4) && nahe(r.xNutzung, 13.112, 1e-3) && nahe(r.tDeckung, 181.76, 0.01) && r.ausreichend, `Prognose ${r.kNat} ${r.xNutzung} ${r.tDeckung}`);
pruefe(r.hinweise.length === 0, `Standardfall ohne Hinweise (${r.hinweise.map(x => x.text).join(' | ')})`);
// Konsistenz: Tiefe nach t_c entspricht der Deckung
pruefe(nahe(tiefeNach(r.kNat, r.tDeckung), 25, 1e-9), 'x(t_c) = c');
// ohne Achsenabschnitt: K = Σ s·x / Σ s² = 94,7631/105 = 0,90251
const r0 = schnellkarbonatisierung({ ...basis, mitAchsenabschnitt: false });
pruefe(nahe(r0.kAC, 0.90251, 1e-5) && r0.reg.a === 0, `Ursprung ${r0.kAC}`);

// 3. Physik: Vervierfachung der Konzentration verdoppelt K (K ∝ √c)
pruefe(nahe(umrechnungsfaktor(3, 0.16) / umrechnungsfaktor(3, 0.04), 2, 1e-12), 'K ∝ √c');
// anfälliger Beton (CEM III-Richtwerte): Deckung 25 mm nach 50 Jahren nicht ausreichend
const r3 = schnellkarbonatisierung({ ...basis, punkte: pkt([1.0, 4.5, 8.5, 13.4]), mitAchsenabschnitt: false });
pruefe(r3.gueltig && !r3.ausreichend && nahe(r3.xNutzung, 25.11, 0.01) && r3.tDeckung < 50, `anfälliger Beton ${r3.xNutzung}`);

// 4. Plausibilität: Fehler
pruefe(!schnellkarbonatisierung({ ...basis, punkte: pkt([1], [7]) }).gueltig, 'ein Messpunkt');
pruefe(!schnellkarbonatisierung({ ...basis, punkte: pkt([1, 2], [7, 7]) }).gueltig, 'gleicher Zeitpunkt');
pruefe(!schnellkarbonatisierung({ ...basis, punkte: pkt([5, 4, 3, 2]) }).gueltig, 'abnehmende Tiefe → K ≤ 0');
pruefe(!schnellkarbonatisierung({ ...basis, punkte: pkt([-1, 2, 3, 4]) }).gueltig, 'negative Tiefe');
pruefe(!schnellkarbonatisierung({ ...basis, cNat: 3 }).gueltig, 'c_nat ≥ c_acc');
pruefe(!schnellkarbonatisierung({ ...basis, deckung: 0 }).gueltig && !schnellkarbonatisierung({ ...basis, nutzungsdauer: -1 }).gueltig, 'c, t_N ≤ 0');

// 5. Plausibilität: Warnungen
const w = (e: Partial<KarbonatisierungEingabe>) => schnellkarbonatisierung({ ...basis, ...e }).hinweise.filter(x => x.stufe === 'warnung').map(x => x.text).join(' ');
pruefe(/70 Tage/.test(w({ punkte: pkt([0.5, 2.5, 4.8], [0, 7, 28]) })), 'letzte Messung < 70 d');
pruefe(/R²/.test(w({ punkte: pkt([0.5, 6, 3, 7.5]) })), 'R² < 0,90');
pruefe(/3,0 ± 0,5/.test(w({ cAcc: 1 })), 'Prüfkonzentration abweichend');
pruefe(/Unvollständige/.test(w({ punkte: [...pkt([0.5, 2.5, 4.8, 7.5]), { tTage: NaN, xMm: 3 }] })), 'unvollständiger Punkt');

// 6. Fuzz-Test: zufällige Messreihen → endliche Ergebnisse oder sauberer Fehler
let zufall = 2026;
const rnd = () => { zufall = (zufall * 1103515245 + 12345) % 2147483648; return zufall / 2147483648; };
let gueltige = 0;
for (let i = 0; i < 1000; i++) {
  const k = rnd() * 3, a = rnd() * 2;
  const ts = [0, 7, 28, 70].filter(() => rnd() < 0.85);
  const punkte = ts.map(t => ({ tTage: t, xMm: Math.max(0, a + k * Math.sqrt(t) + (rnd() - 0.5) * 2) }));
  const tN = 10 + rnd() * 90;
  const e = schnellkarbonatisierung({ punkte, mitAchsenabschnitt: rnd() < 0.5, cAcc: 1 + rnd() * 4, cNat: 0.03 + rnd() * 0.05, deckung: 5 + rnd() * 50, nutzungsdauer: tN });
  if (!e.gueltig) { pruefe(e.hinweise.some(x => x.stufe === 'fehler'), `Fuzz ${i}: ungültig ohne Fehler`); continue; }
  gueltige++;
  pruefe(e.kAC > 0 && [e.kNat, e.xNutzung, e.tDeckung].every(Number.isFinite), `Fuzz ${i}: nicht endlich`);
  pruefe(e.ausreichend === (e.tDeckung >= tN - 1e-9), `Fuzz ${i}: ausreichend ↔ t_c ≥ t_N`);
}
pruefe(gueltige > 500, `Fuzz: nur ${gueltige} gültige Fälle`);

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log(`OK: Schnellkarbonatisierung (${gueltige} gültige Fuzz-Fälle)`);
