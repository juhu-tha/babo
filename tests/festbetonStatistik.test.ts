// Rechenkern Festbeton-Statistik (Z3): f_ck = f_cm − 1,645·σ, f_cd, Würfelanzeige, Konformitätskriterien DIN EN 206
import { festbetonStatistik, K_FRAKTIL_5, konformitaetDruck, pruefwerteAusText, type FestbetonStatistikEingabe } from '../src/calc/festbetonStatistik';
import { normalCDF } from '../src/calc/statistik';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Festbeton-Statistik ---');

// 1. Handrechnung Startwerte des Moduls: f_cm = 45, σ = 4,0, Zylinder, α_cc = 0,85, γ_c = 1,5, stetige Herstellung
//    f_ck = 45 − 1,645·4 = 38,42; f_cd = 0,85·38,42/1,5 = 21,771
//    Kriterien: f_cm ≥ 38,42 + 1,48·4 = 44,34; f_ci ≥ 38,42 − 4 = 34,42
const S: FestbetonStatistikEingabe = { fcm: 45, sigma: 4, format: 'zylinder', alphaCc: 0.85, gammaC: 1.5, pruefArt: 'stetig' };
const r = festbetonStatistik(S);
pruefe(r.gueltig && r.hinweise.length === 0, `Standardfall ohne Hinweise (${r.hinweise.map(x => x.text).join(' | ')})`);
pruefe(nahe(r.fckCyl, 38.42, 1e-12) && nahe(r.fcd, 21.7713, 1e-4) && r.faktor === 1, `f_ck/f_cd ${r.fckCyl} ${r.fcd}`);
pruefe(nahe(r.mindestMittelwert, 44.34, 1e-12) && nahe(r.mindestEinzelwert, 34.42, 1e-12), `Konformität stetig ${r.mindestMittelwert} ${r.mindestEinzelwert}`);
//    Herstellungsbeginn: f_cm ≥ 38,42 + 4 = 42,42
const e = festbetonStatistik({ ...S, pruefArt: 'erst' });
pruefe(nahe(e.mindestMittelwert, 42.42, 1e-12) && nahe(e.mindestEinzelwert, 34.42, 1e-12), 'Konformität Herstellungsbeginn');
//    Würfel: Anzeige ×1,25 → f_cm 56,25; σ 5,0; f_ck 48,025; f_cd bleibt Zylinderwert; Kriterium 48,025 + 1,48·5 = 55,425
const w = festbetonStatistik({ ...S, format: 'wuerfel' });
pruefe(nahe(w.anzeigeFcm, 56.25, 1e-12) && nahe(w.anzeigeSigma, 5, 1e-12) && nahe(w.anzeigeFck, 48.025, 1e-12) && w.fcd === r.fcd && nahe(w.mindestMittelwert, 55.425, 1e-12), 'Würfelanzeige');
// 5-%-Quantil: Φ(f_ck) = 0,05
pruefe(nahe(normalCDF(r.fckCyl, 45, 4), 0.05, 1e-4), 'f_ck ist das 5-%-Quantil');

// 2. Randfälle
pruefe(!festbetonStatistik({ ...S, sigma: -1 }).gueltig && !festbetonStatistik({ ...S, gammaC: 0 }).gueltig && !festbetonStatistik({ ...S, fcm: NaN }).gueltig, 'σ < 0 / γ_c = 0 / NaN → Fehler');
pruefe(festbetonStatistik({ ...S, fcm: 20, sigma: 15 }).hinweise.some(x => x.feld === 'sigma'), 'f_ck ≤ 0 → Warnung');
pruefe(festbetonStatistik({ ...S, sigma: 2 }).hinweise.some(x => x.feld === 'sigma'), 'σ < 3 bei stetiger Herstellung → Warnung');
pruefe(festbetonStatistik({ ...S, alphaCc: 1.2 }).hinweise.some(x => x.feld === 'alphaCc'), 'α_cc > 1 → Warnung');
pruefe(festbetonStatistik({ ...S, sigma: 0 }).fckCyl === 45, 'σ = 0 → f_ck = f_cm');

// 3. Fuzz-Test: endliche Werte, Monotonie in f_cm (steigend) und σ (fallend), stetiges Kriterium immer ≤ f_cm
let zufall = 99;
const rnd = () => { zufall = (zufall * 1103515245 + 12345) % 2147483648; return zufall / 2147483648; };
for (let i = 0; i < 1000; i++) {
  const x: FestbetonStatistikEingabe = { fcm: 20 + rnd() * 80, sigma: 1 + rnd() * 9, format: rnd() < 0.5 ? 'zylinder' : 'wuerfel', alphaCc: 0.85 + rnd() * 0.15, gammaC: 1.3 + rnd() * 0.4, pruefArt: rnd() < 0.5 ? 'erst' : 'stetig' };
  const a = festbetonStatistik(x);
  pruefe(a.gueltig && [a.fckCyl, a.fcd, a.anzeigeFck, a.mindestMittelwert, a.mindestEinzelwert].every(Number.isFinite), `Fuzz ${i}: endlich`);
  const b = festbetonStatistik({ ...x, fcm: x.fcm + 1 }), c = festbetonStatistik({ ...x, sigma: x.sigma + 0.5 });
  pruefe(b.fckCyl > a.fckCyl && b.fcd > a.fcd && c.fckCyl < a.fckCyl, `Fuzz ${i}: Monotonie`);
  pruefe(nahe(a.fckCyl, x.fcm - K_FRAKTIL_5 * x.sigma, 1e-12) && a.mindestEinzelwert < a.anzeigeFck, `Fuzz ${i}: Definition`);
  if (x.pruefArt === 'stetig') pruefe(a.mindestMittelwert <= a.anzeigeFcm, `Fuzz ${i}: stetiges Kriterium ≤ f_cm`);
}

// 4. Schnellevaluator Konformität (Modul Festbeton, Reiter 4), Kriterien DIN EN 206, 8.2.1.3
//    Startwerte C25/30 (f_ck,cube = 30), Herstellungsbeginn, 34,5; 33,2; 35,8:
//    f_cm = 34,5 ≥ 30 + 4 = 34 (erfüllt), f_ci,min = 33,2 ≥ 26, n = 3 → konform
const kw = pruefwerteAusText('34,5; 33,2; 35,8');
pruefe(JSON.stringify(kw) === '[34.5,33.2,35.8]' && JSON.stringify(pruefwerteAusText('30,1 31,2;; -4 x')) === '[30.1,31.2]', 'Parser Würfelwerte');
const k1 = konformitaetDruck({ werte: kw, fckCube: 30, pruefArt: 'erst' });
pruefe(nahe(k1.mittelwert, 34.5, 1e-12) && k1.minimum === 33.2 && k1.sollMittelwert === 34 && k1.sollEinzelwert === 26 && k1.bestanden && k1.hinweise.length === 0, `Konformität erst ${JSON.stringify(k1)}`);
pruefe(!konformitaetDruck({ werte: [34.5, 33.2], fckCube: 30, pruefArt: 'erst' }).bestanden, 'n = 2 < 3 → nicht konform');
pruefe(!konformitaetDruck({ werte: [36, 36, 25.9], fckCube: 30, pruefArt: 'erst' }).einzelOk, 'Einzelwert < f_ck − 4');
//    stetig, 15 Werte mit s < 3 → σ = 3 angesetzt: Soll = 30 + 1,48 · 3 = 34,44
const st15 = Array.from({ length: 15 }, (_, i) => 34 + (i % 3) * 0.5);
const k2 = konformitaetDruck({ werte: st15, fckCube: 30, pruefArt: 'stetig' });
pruefe(k2.sigmaAngesetzt === 3 && nahe(k2.sollMittelwert, 34.44, 1e-12) && k2.anzahlOk && k2.mittelOk && k2.hinweise.some(h => h.feld === 'werte'), `Konformität stetig ${JSON.stringify(k2)}`);
//    Referenz: bisherige Komponentenrechnung (src/modules/Festbeton.tsx vor AP 4.2)
function altKonf(w: number[], fck: number, modus: 'erst' | 'stetig') {
  const m = w.length > 0 ? w.reduce((a, b) => a + b, 0) / w.length : 0;
  const mi = w.length > 0 ? Math.min(...w) : 0;
  const v = w.length > 1 ? w.reduce((acc, x) => acc + Math.pow(x - m, 2), 0) / (w.length - 1) : 0;
  const sd = Math.max(Math.sqrt(v), 3.0);
  const soll = modus === 'erst' ? fck + 4.0 : fck + 1.48 * sd;
  return { m, mi, soll, ok: m >= soll && mi >= fck - 4 && (modus === 'erst' ? w.length >= 3 : w.length >= 15) };
}
for (let i = 0; i < 1000; i++) {
  const w = Array.from({ length: Math.floor(rnd() * 20) }, () => 20 + rnd() * 40);
  const fck = [20, 25, 30, 37, 45, 55][Math.floor(rnd() * 6)];
  const modus = rnd() < 0.5 ? 'erst' : 'stetig';
  const n = konformitaetDruck({ werte: w, fckCube: fck, pruefArt: modus }), o = altKonf(w, fck, modus);
  pruefe(n.gueltig && nahe(n.mittelwert, o.m, 1e-9) && n.minimum === o.mi && nahe(n.sollMittelwert, o.soll, 1e-9) && n.bestanden === o.ok && [n.s, n.sigmaAngesetzt].every(Number.isFinite), `Konformität alt/neu ${i}`);
}
pruefe(konformitaetDruck({ werte: [], fckCube: 30, pruefArt: 'erst' }).mittelwert === 0 && !konformitaetDruck({ werte: [NaN], fckCube: 30, pruefArt: 'erst' }).gueltig, 'leere Liste / NaN');

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log('OK: Festbeton-Statistik');
