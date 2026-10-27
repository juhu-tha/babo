// Rechenkern Stoffraumrechnung (Umsetzungsplan Phase 4, AP 4.3)
import { stoffraum, maxFaFaktor, kombinationsGrenze, K_WERT_DIN1045_2, ZEMENT_DATA, type MischungEingabe } from '../src/calc/mischung';
import { BENCHMARK_EXAMPLES } from '../src/data/mischungBeispiele';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
console.log('--- Test: Mischung ---');

const basis: MischungEingabe = {
  zement: 320, rhoZement: 3.1, wasser: 160, fa: 0, sf: 0, hues: 0, biochar: 0, zusatzmittel: 0, luft: 2.0, stahlfaser: 0, ppFaser: 0, rhoGestein: 2.65,
  fraktionen: [{ anteil: 40, feuchte: 3, wa: 0.5 }, { anteil: 20, feuchte: 1, wa: 0.5 }, { anteil: 20, feuchte: 0.5, wa: 0.5 }, { anteil: 20, feuchte: 0.5, wa: 0.5 }],
  biocharFeuchte: 0, biocharWa: 30, k: { fa: 0.4, sf: 1.0, hues: 0.4, biochar: 0 }, maxFaFaktor: 0.33,
};

// 1. Handrechnung Stoffraum (1 m³ = 1000 dm³): Zement 320/3,1 = 103,2; Wasser 160; Luft 20 → Gestein 716,8 dm³
//    Masse Gestein = 716,8·2,65 = 1899,5 kg; 0/4: 759,8 kg trocken, Oberflächenwasser (3,0 − 0,5) % = 19,0 kg
//    4/8: 379,9 kg, (1,0 − 0,5) % = 1,9 kg → Zugabewasser = 160 − 20,9 = 139,1 kg; w/z = 0,50
const r = stoffraum(basis);
pruefe(nahe(r.volGestein, 1000 - 320 / 3.1 - 160 - 20, 1e-12) && nahe(r.volGestein, 716.77, 1e-4), `V_g ${r.volGestein}`);
pruefe(nahe(r.masseGestein, 1899.5, 1e-4), `m_g ${r.masseGestein}`);
pruefe(nahe(r.zugabewasser, 160 - r.masseGestein * (0.4 * 0.025 + 0.2 * 0.005), 1e-12) && nahe(r.zugabewasser, 139.1, 1e-3), `w_zug ${r.zugabewasser}`);
pruefe(r.wz === 0.5 && r.wzEq === 0.5, 'w/z');
// Frischbetonrohdichte = (320 + 160 + 1899,5)/1000 = 2,380 kg/dm³
pruefe(nahe(r.rohdichte, 2.3795, 1e-3), `ρ ${r.rohdichte}`);

// 2. Äquivalenter w/z-Wert (DIN 1045-2): z = 280, f = 120 (CEM I, max f = 0,33·280 = 92,4) → (w/z)_eq = 160/(280 + 0,4·92,4) = 0,5042
const rf = stoffraum({ ...basis, zement: 280, fa: 120 });
pruefe(nahe(rf.anrechenbarFa, 92.4, 1e-12) && nahe(rf.wzEq, 160 / (280 + 0.4 * 92.4), 1e-12), `(w/z)eq ${rf.wzEq}`);
// Silikastaub s ≤ 0,11·z, k = 1,0
const rs = stoffraum({ ...basis, sf: 50 });
pruefe(nahe(rs.anrechenbarSf, 35.2, 1e-12) && nahe(rs.wzEq, 160 / (320 + 35.2), 1e-12), 'Silikastaub');
// Trockene Gesteinskörnung (Feuchte < Wasseraufnahme) erhöht das Zugabewasser
pruefe(stoffraum({ ...basis, fraktionen: basis.fraktionen.map(f => ({ ...f, feuchte: 0 })) }).zugabewasser > 160, 'trockene Körnung saugt');

// 2b. Geprüfte Beispiele des Moduls („Geprüfte Beispiele“): Stoffraum, Massen und Zugabewasser auf 1 % bzw. 2 kg
for (const b of BENCHMARK_EXAMPLES) {
  const rb = stoffraum({
    zement: b.zement, rhoZement: ZEMENT_DATA[b.zementArt].rho, wasser: b.wasser, fa: b.fa, sf: b.sf, hues: b.hues, biochar: b.biochar ?? 0,
    zusatzmittel: b.zusatzmittel, luft: b.luft, stahlfaser: b.stahlfaser ?? 0, ppFaser: b.ppFaser ?? 0, rhoGestein: b.rhoGestein ?? 2.65,
    fraktionen: [[b.f04, b.feuchte04, b.wa04], [b.f48, b.feuchte48, b.wa48], [b.f816, b.feuchte816, b.wa816], [b.f1632, b.feuchte1632, b.wa1632]].map(([anteil, feuchte, wa]) => ({ anteil, feuchte, wa })),
    biocharFeuchte: 0, biocharWa: 30, k: { fa: 0.4, sf: 1.0, hues: 0.4, biochar: 0 }, maxFaFaktor: maxFaFaktor(b.zementArt),
  });
  const naheAbs = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
  pruefe(naheAbs(rb.volGestein, b.stoffraum.gesteinVol, 2), `${b.id}: V_Gestein ${rb.volGestein.toFixed(1)} vs ${b.stoffraum.gesteinVol}`);
  pruefe(nahe(rb.masseGestein, b.massenTrocken.gesteinGesamt, 0.01), `${b.id}: m_Gestein ${rb.masseGestein.toFixed(1)} vs ${b.massenTrocken.gesteinGesamt}`);
  pruefe(naheAbs(rb.zugabewasser, b.feuchteRechnung.zugabewasser, 2), `${b.id}: Zugabewasser ${rb.zugabewasser.toFixed(1)} vs ${b.feuchteRechnung.zugabewasser}`);
  pruefe(naheAbs(rb.wasserAusGestein, b.feuchteRechnung.wasserAusGestein, 1), `${b.id}: Oberflächenwasser ${rb.wasserAusGestein.toFixed(1)} vs ${b.feuchteRechnung.wasserAusGestein}`);
  rb.fraktionen.forEach((f, i) => { const soll = [b.feuchteRechnung.m04Feucht, b.feuchteRechnung.m48Feucht, b.feuchteRechnung.m816Feucht, b.feuchteRechnung.m1632Feucht][i]; if (soll !== undefined) pruefe(naheAbs(f.feucht, soll, 2), `${b.id}: m_feucht[${i}] ${f.feucht.toFixed(1)} vs ${soll}`); });
  pruefe(naheAbs(rb.rohdichte, b.frischbetonDichte, 0.02), `${b.id}: ρ ${rb.rohdichte.toFixed(3)} vs ${b.frischbetonDichte}`);
}

// 2c. k-Wert-Ansatz DIN 1045-2 (Runde 5, Z55; öffentliche Quellen: UniBw München „Flugasche“, umwelt-online DIN 1045-2 5.2.5):
//     k_f = 0,4, k_s = 1,0, f/z ≤ 0,33 (ohne P/V/D), s/z ≤ 0,11; gemeinsam f/z ≤ 3·(0,22 − s/z) (CEM I) bzw. 3·(0,15 − s/z)
pruefe(K_WERT_DIN1045_2.kF === 0.4 && K_WERT_DIN1045_2.kS === 1.0 && K_WERT_DIN1045_2.maxSfFaktor === 0.11, 'k-Werte');
pruefe(maxFaFaktor('CEM I') === 0.33 && maxFaFaktor('CEM III/A') === 0.33 && maxFaFaktor('CEM II/B') === 0.25 && maxFaFaktor('CEM IV') === 0, 'f/z-Grenzen je Zementart');
pruefe(kombinationsGrenze('CEM I') === 0.22 && kombinationsGrenze('CEM III/A') === 0.15 && kombinationsGrenze('CEM II/B') === null, 'Kombinationsgrenzen');
//     Handbeispiel CEM I, z = 320, s = 25 (s/z = 0,078): f ≤ 3·(0,22 − 0,078125)·320 = 136,2 kg/m³ → f = 100 zulässig, f = 140 nicht;
//     anrechenbar f ≤ 0,33·320 = 105,6 → (w/z)_eq = 160/(320 + 0,4·100 + 1,0·25) = 0,4156
const kb = stoffraum({ ...basis, fa: 100, sf: 25, zementArt: 'CEM I' });
pruefe(nahe(kb.maxFaKombination ?? NaN, 136.2, 1e-9) && !kb.hinweise.some(x => x.feld === 'fa') && nahe(kb.wzEq, 160 / 385, 1e-12), `Kombination zulässig ${kb.maxFaKombination}`);
const kb2 = stoffraum({ ...basis, fa: 140, sf: 25, zementArt: 'CEM I' });
pruefe(kb2.hinweise.some(x => x.feld === 'fa' && x.text.includes('Alkalitätsreserve')) && nahe(kb2.anrechenbarFa, 105.6, 1e-12), 'Kombination verletzt → Warnung');
//     CEM III/A: f ≤ 3·(0,15 − 0,078125)·320 = 69,0 → f = 80 verletzt; CEM II/B: Kombination nicht zulässig
pruefe(stoffraum({ ...basis, fa: 80, sf: 25, zementArt: 'CEM III/A' }).hinweise.some(x => x.feld === 'fa') && stoffraum({ ...basis, fa: 60, sf: 25, zementArt: 'CEM II/B' }).hinweise.some(x => x.feld === 'sf' && x.text.includes('nicht zulässig')), 'CEM III/A Grenze, CEM II/B unzulässig');
pruefe(stoffraum({ ...basis, sf: 50 }).hinweise.some(x => x.feld === 'sf' && x.text.includes('0,11')), 'Silikastaub-Überschuss → Hinweis');

// 3. Unsinnige Eingaben
for (const u of [{ zement: 0 }, { wasser: 0 }, { rhoZement: 0 }, { luft: -1 }, { zement: 3000 }, { wasser: NaN }] as Partial<MischungEingabe>[]) {
  const ru = stoffraum({ ...basis, ...u });
  pruefe(ru.hinweise.some(x => x.stufe === 'fehler') && ru.masseGestein === 0, JSON.stringify(u));
}
pruefe(stoffraum({ ...basis, fraktionen: basis.fraktionen.map((f, i) => ({ ...f, anteil: i ? f.anteil : 30 })) }).hinweise.some(x => x.feld === 'fraktionen'), 'Summe ≠ 100 %');
let seed = 23;
const z = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
for (let i = 0; i < 1000; i++) {
  const ru = stoffraum({ ...basis, zement: z(-50, 900), wasser: z(-20, 400), fa: z(-10, 300), sf: z(-5, 80), luft: z(-1, 15), rhoGestein: z(-0.5, 3.2), rhoZement: z(-0.5, 3.2) });
  if (!ru.fehlerhaft && ![ru.wz, ru.wzEq, ru.masseGestein, ru.zugabewasser, ru.rohdichte].every(Number.isFinite)) { pruefe(false, `Fuzz ${i}`); break; }
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Mischung');
