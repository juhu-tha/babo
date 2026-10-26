// Rechenkerne der Beton-Demonstratoren (Umsetzungsplan Phase 4, AP 4.2, Runde 3):
//  - Lebensdauersimulator Karbonatisierung (src/calc/korrosion.ts, karbonatisierungsLebensdauer)
//  - Walz-Kurven / Abrams-Näherung (src/calc/mischung.ts)
//  - Praxisbeispiel massiges Bauteil (src/calc/hydratation.ts, praxisbeispielMassigesBauteil)
import { karbonatisierungsLebensdauer } from '../src/calc/korrosion';
import { walzFestigkeit, walzKurve, walzStuetzstellen, WALZ_KLASSEN, type WalzKlasse } from '../src/calc/mischung';
import { praxisbeispielMassigesBauteil, PRAXIS_ZEMENTE, type PraxisEingabe } from '../src/calc/hydratation';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
const gleich = (a: number, b: number) => a === b || Math.abs(a - b) <= 1e-12 * Math.max(1, Math.abs(b));
console.log('--- Test: Beton-Demonstratoren ---');

// ---------------------------------------------------------------------------------------------------
// 1. Karbonatisierung x_c = K·√t (Wurzel-t-Gesetz, z. B. Tuutti 1982; Wiedergabe in fib Bulletin 34)
// ---------------------------------------------------------------------------------------------------
// Handrechnung Startwerte: K = 2,5 mm/√a, t = 50 a, c = 30 mm → x_c = 17,68 mm; t_krit = (30/2,5)² = 144 a, Rest 94 a
const l1 = karbonatisierungsLebensdauer(2.5, 50, 30);
pruefe(l1.gueltig && nahe(l1.xc, 17.678, 1e-4) && !l1.depassiviert && l1.tKrit === 144 && l1.restJahre === 94, `Start ${JSON.stringify(l1)}`);
// Grenze x_c = c: K = 5, t = 36 a, c = 30 mm → depassiviert, t_krit = 36, Rest 0
const l2 = karbonatisierungsLebensdauer(5, 36, 30);
pruefe(l2.depassiviert && l2.tKrit === 36 && l2.restJahre === 0, 'x_c = c → depassiviert');
// überschritten: K = 6, t = 100, c = 20 → t_krit = round(11,11) = 11, Rest −89
const l3 = karbonatisierungsLebensdauer(6, 100, 20);
pruefe(l3.depassiviert && l3.tKrit === 11 && l3.restJahre === -89, `überschritten ${l3.tKrit}`);
// dichte Betone: K = 0,5, c = 60 → 14 400 a → Warnung (> 200 a)
pruefe(karbonatisierungsLebensdauer(0.5, 50, 60).hinweise.some(h => h.stufe === 'warnung'), 'über 200 a → Warnung');
pruefe(!karbonatisierungsLebensdauer(0, 50, 30).gueltig && !karbonatisierungsLebensdauer(2, 50, 0).gueltig && !karbonatisierungsLebensdauer(NaN, 50, 30).gueltig, 'K = 0 / c = 0 / NaN → Fehler');

// ---------------------------------------------------------------------------------------------------
// 2. Walz-Kurven: f = A / 5^(w/z) (Abrams-Form, Abrams 1918; A = 100/120/140 N/mm² Lehrwerte im Modul)
// ---------------------------------------------------------------------------------------------------
// Handrechnung: 42,5, w/z = 0,50 → 120/√5 = 53,67 N/mm²; 52,5, w/z = 0,35 → 140/5^0,35 = 79,68 N/mm²; 32,5, w/z = 0,80 → 100/5^0,8 = 27,59
pruefe(nahe(walzFestigkeit(0.5, 42.5), 53.666, 1e-4), `42,5/0,50 ${walzFestigkeit(0.5, 42.5)}`);
pruefe(nahe(walzFestigkeit(0.35, 52.5), 79.68, 1e-3) && nahe(walzFestigkeit(0.8, 32.5), 27.59, 1e-3), 'Kurvenenden');
// Stützstellen: 0,35 … 0,80 in 0,05 – 10 Werte (die frühere Gleitkommaschleife endete bei 0,75)
const st = walzStuetzstellen();
pruefe(st.length === 10 && st[0] === 0.35 && st[9] === 0.8 && st[3] === 0.5, `Stützstellen ${st}`);
const wk = walzKurve(0.5, 42.5);
pruefe(wk.gueltig && wk.kurven.length === 3 && wk.kurven.every(k => k.werte.length === 10) && wk.hinweise.length === 0, 'Kurven');
pruefe(wk.kurven.every(k => k.werte.every((v, i) => i === 0 || v < k.werte[i - 1])), 'monoton fallend in w/z');
pruefe(walzKurve(0.9, 42.5).hinweise.some(h => h.stufe === 'warnung') && !walzKurve(0, 42.5).gueltig && !walzKurve(0.5, 50 as WalzKlasse).gueltig, 'Grenzen w/z und Klasse');
// Referenz (wörtlich aus WalzKurvenSection.tsx, Stand origin/main 0e747ac6)
const calcStrength = (wz: number, klasse: number) => { let A = 100; if (klasse === 42.5) A = 120; if (klasse === 52.5) A = 140; return A / Math.pow(5, wz); };

// ---------------------------------------------------------------------------------------------------
// 3. Praxisbeispiel massiges Bauteil (Lehrmodell)
// ---------------------------------------------------------------------------------------------------
/** Referenz: wörtliche Kopie aus src/modules/Praxisbeispiele.tsx (useMemo „results“, Stand origin/main 0e747ac6) */
function praxisReferenz(thickness: number, cementType: string, cementContent: number, tFresh: number, tAmbient: number, restraint: number) {
  const heatFactors: Record<string, number> = { 'CEM I 42.5 R': 12, 'CEM II/A-LL 32.5 R': 10, 'CEM III/B 32.5 N': 7 };
  const heatFactor = heatFactors[cementType];
  const deltaT_ad = (cementContent / 100) * heatFactor;
  const thicknessFactor = 1 - Math.exp(-thickness);
  const T_max = tFresh + deltaT_ad * thicknessFactor;
  const t_p = 1 + thickness;
  const tempCurve: number[] = [], stressCurve: number[] = [], strengthCurve: number[] = [], labels: number[] = [];
  let maxStress = 0, crackRisk = false;
  for (let t = 0; t <= 28; t += 0.5) {
    labels.push(t);
    let T;
    if (t === 0) T = tFresh;
    else {
      const heating = (T_max - tFresh) * (t / t_p) * Math.exp(1 - t / t_p);
      const cooling = (T_max - tAmbient) * Math.exp(-(t - t_p) / (thickness * 2));
      T = t <= t_p ? tFresh + heating : tAmbient + cooling;
    }
    tempCurve.push(T);
    const f_ctm = 2.5;
    const s = cementType.includes('CEM I') ? 0.2 : (cementType.includes('CEM III') ? 0.38 : 0.25);
    const f_ct = t > 0 ? f_ctm * Math.exp(s * (1 - Math.sqrt(28 / t))) : 0;
    strengthCurve.push(f_ct);
    const E_c = t > 0 ? 30000 * Math.pow(Math.exp(s * (1 - Math.sqrt(28 / t))), 0.3) : 0;
    let sigma = 0;
    if (t > t_p) sigma = 10e-6 * (T_max - T) * E_c * restraint;
    stressCurve.push(sigma);
    if (sigma > maxStress) maxStress = sigma;
    if (sigma > f_ct && t > 0) crackRisk = true;
  }
  const d_cm = thickness * 100 - 5;
  const hc_eff = Math.min(2.5 * (thickness * 100 - d_cm), (thickness * 100) / 2);
  const Act = 100 * hc_eff;
  const As_min = (1.0 * 0.8 * 2.5 * Act) / 240;
  return { T_max, maxStress, crackRisk, As_min, labels, tempCurve, stressCurve, strengthCurve };
}
const basis: PraxisEingabe = { dicke: 1.5, zement: 'CEM I 42.5 R', zementgehalt: 350, tFrisch: 20, tUmgebung: 15, behinderung: 0.5 };
// Handrechnung Startwerte: ΔT_ad = 3,5·12 = 42 K, (1 − e^−1,5) = 0,77687 → T_max = 20 + 32,63 = 52,63 °C, Spitze bei t_p = 2,5 d;
// A_s,min = 1,0·0,8·2,5·(100·12,5)/240 = 10,42 cm²/m je Seite (h_c,ef = min(2,5·5; 75) = 12,5 cm)
const p1 = praxisbeispielMassigesBauteil(basis);
pruefe(p1.gueltig && nahe(p1.T_max, 52.6285, 1e-5) && nahe(p1.As_min, 10.4167, 1e-4), `Start T_max ${p1.T_max}, A_s ${p1.As_min}`);
pruefe(p1.zeit.length === 57 && p1.zeit[56] === 28 && nahe(p1.temperatur[5], p1.T_max, 1e-12), 'Zeitachse 0 … 28 d, T(2,5 d) = T_max');
// 28 d: f_ct = 2,5 (β_cc = 1); Zwang σ = 10⁻⁵·(T_max − T₂₈)·30 000·0,5
const T28 = 15 + (p1.T_max - 15) * Math.exp(-(28 - 2.5) / 3);
pruefe(nahe(p1.zugfestigkeit[56], 2.5, 1e-12) && nahe(p1.spannung[56], 1e-5 * (p1.T_max - T28) * 30000 * 0.5, 1e-12), '28-d-Werte');
// Grenzen: R = 0 → kein Zwang; R > 1 / unbekannte Zementart → Fehler; Umgebung wärmer → Warnung
const p0 = praxisbeispielMassigesBauteil({ ...basis, behinderung: 0 });
pruefe(p0.maxStress === 0 && !p0.crackRisk, 'R = 0 → kein Zwang');
pruefe(!praxisbeispielMassigesBauteil({ ...basis, behinderung: 1.2 }).gueltig && !praxisbeispielMassigesBauteil({ ...basis, zement: 'CEM X' }).gueltig && !praxisbeispielMassigesBauteil({ ...basis, dicke: 0 }).gueltig, 'Fehlerfälle');
pruefe(praxisbeispielMassigesBauteil({ ...basis, zementgehalt: 0, tUmgebung: 35 }).hinweise.some(h => h.stufe === 'warnung'), 'warme Umgebung → Warnung');
// Korrektur Zementbeiwert s (DIN EN 1992-1-1, 3.1.2(6): R → 0,20, N → 0,25, S → 0,38; Einordnung 32,5 R = N, 32,5 N = S):
// Das Modul prüfte cementType.includes('CEM I') – das trifft auch auf „CEM II…“ und „CEM III…“ zu, alle Zemente erhielten s = 0,20.
pruefe('CEM II/A-LL 32.5 R'.includes('CEM I') && 'CEM III/B 32.5 N'.includes('CEM I'), 'Ursache: includes trifft CEM II/III');
pruefe(PRAXIS_ZEMENTE['CEM I 42.5 R'].s === 0.2 && PRAXIS_ZEMENTE['CEM II/A-LL 32.5 R'].s === 0.25 && PRAXIS_ZEMENTE['CEM III/B 32.5 N'].s === 0.38, 's je Zement');
// CEM III/B nach 7 d: β_cc = exp(0,38·(1 − √4)) = e^−0,38 = 0,6839 → f_ct = 1,710 N/mm² (vorher mit s = 0,2: 2,047)
const p3 = praxisbeispielMassigesBauteil({ ...basis, zement: 'CEM III/B 32.5 N' });
pruefe(nahe(p3.zugfestigkeit[14], 2.5 * Math.exp(-0.38), 1e-12) && nahe(p3.zugfestigkeit[14], 1.710, 1e-3), `CEM III f_ct(7 d) ${p3.zugfestigkeit[14]}`);

// ---------------------------------------------------------------------------------------------------
// 4. Fuzz: 1 000 Zufallseingaben → endlich, identisch zur Modulrechnung
// ---------------------------------------------------------------------------------------------------
let zufall = 2610;
const rnd = () => { zufall = (zufall * 1103515245 + 12345) % 2147483648; return zufall / 2147483648; };
const ZEMENTE = Object.keys(PRAXIS_ZEMENTE);
let n = 0;
for (let i = 0; i < 1000; i++) {
  // Karbonatisierung (Schieberbereiche K 0,5 … 6, t 1 … 100, c 10 … 60)
  const K = 0.5 + rnd() * 5.5, t = 1 + Math.floor(rnd() * 100), c = 10 + 5 * Math.floor(rnd() * 11);
  const l = karbonatisierungsLebensdauer(K, t, c);
  const xRef = K * Math.sqrt(t), tRef = Math.round(Math.pow(c / K, 2));
  pruefe(l.gueltig && gleich(l.xc, xRef) && l.depassiviert === (xRef >= c) && l.tKrit === tRef && l.restJahre === tRef - t, `Fuzz ${i}: Karbonatisierung`);

  // Walz
  const wz = 0.35 + rnd() * 0.45, kl = WALZ_KLASSEN[Math.floor(rnd() * 3)];
  const w = walzKurve(wz, kl);
  pruefe(w.gueltig && Number.isFinite(w.festigkeit) && gleich(w.festigkeit, calcStrength(wz, kl)), `Fuzz ${i}: Walz`);

  // Praxisbeispiel (Schieberbereiche)
  const e: PraxisEingabe = {
    dicke: Math.round((0.5 + rnd() * 2.5) * 10) / 10, zement: ZEMENTE[Math.floor(rnd() * 3)], zementgehalt: 250 + 10 * Math.floor(rnd() * 21),
    tFrisch: 5 + Math.floor(rnd() * 26), tUmgebung: -5 + Math.floor(rnd() * 41), behinderung: Math.round(rnd() * 10) / 10,
  };
  const p = praxisbeispielMassigesBauteil(e);
  const r = praxisReferenz(e.dicke, e.zement, e.zementgehalt, e.tFrisch, e.tUmgebung, e.behinderung);
  // Temperatur, T_max und A_s,min hängen nicht von s ab → immer identisch; Festigkeit/Zwang nur bei CEM I identisch
  // (Korrektur des Zementbeiwerts s, siehe Abschnitt 3)
  const tempGleich = p.zeit.length === r.labels.length && p.zeit.every((x, j) => x === r.labels[j]) && p.temperatur.every((x, j) => gleich(x, r.tempCurve[j]));
  const sGleich = e.zement !== 'CEM I 42.5 R' || (p.spannung.every((x, j) => gleich(x, r.stressCurve[j])) && p.zugfestigkeit.every((x, j) => gleich(x, r.strengthCurve[j]))
    && gleich(p.maxStress, r.maxStress) && p.crackRisk === r.crackRisk);
  pruefe(p.gueltig && gleich(p.T_max, r.T_max) && gleich(p.As_min, r.As_min) && tempGleich && sGleich, `Fuzz ${i}: Praxis ${JSON.stringify(e)}`);
  // ohne die Korrektur (s = 0,2 für alle) ergäbe der Kern genau die Modulwerte
  if (e.zement !== 'CEM I 42.5 R') {
    const alt = praxisReferenz(e.dicke, 'CEM I 42.5 R', e.zementgehalt, e.tFrisch, e.tUmgebung, e.behinderung);
    pruefe(r.strengthCurve.every((x, j) => gleich(x, alt.strengthCurve[j])), `Fuzz ${i}: Modul nutzte s = 0,2 für ${e.zement}`);
  }
  pruefe([p.T_max, p.maxStress, p.As_min, ...p.temperatur, ...p.spannung, ...p.zugfestigkeit].every(Number.isFinite), `Fuzz ${i}: Praxis endlich`);
  n++;
}

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log(`OK: Beton-Demonstratoren (${n} Fuzz-Fälle, identisch zur Modulrechnung bis auf die Korrekturen)`);
