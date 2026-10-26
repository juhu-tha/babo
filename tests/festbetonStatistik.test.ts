// Rechenkern Festbeton-Statistik (Z3): f_ck = f_cm − 1,645·σ, f_cd, Würfelanzeige, Konformitätskriterien DIN EN 206
import { festbetonStatistik, K_FRAKTIL_5, type FestbetonStatistikEingabe } from '../src/calc/festbetonStatistik';
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

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log('OK: Festbeton-Statistik');
