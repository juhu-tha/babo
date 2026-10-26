// Rechenkern Materialoptimierung (Z3): THG-Vergleich Referenz/optimiertes Bauteil
import { dafstbVergleich, effizienzKlasseThg, DAFSTB_BAUTEILE, type DafstbBauteil, type DafstbZement } from '../src/calc/materialoptimierung';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Materialoptimierung ---');

// 1. Handrechnung Startwerte: Decke, Hohlkörper, CEM III/A, 56 d, grüner Stahl
//    Referenz: 26·310 = 8060; 2860·0,98 = 2802,8 → 2803; Summe 10 863 kg CO₂e (108,63 je m²)
//    optimiert: round(135·0,91) = 123 kg/m³; 19,5·123 = 2398,5 → 2399; 2470·0,42 = 1037,4 → 1037; Summe 3436
//    Minderung (10 863 − 3436)/10 863 = 68,37 % → Klasse A+
const r = dafstbVergleich({ bauteil: 'decke', bauweise: 'hohlkoerper', zement: 'cem3_a', pruefalter: 56, stahlRoute: 'gruen_eaf' });
pruefe(r.optConcreteGwpPerM3 === 123 && r.refConcreteGwpTotal === 8060 && r.refSteelGwpTotal === 2803 && r.refTotalGwp === 10863, `Referenz ${JSON.stringify(r)}`);
pruefe(r.optConcreteGwpTotal === 2399 && r.optSteelGwpTotal === 1037 && r.optTotalGwp === 3436 && r.diffAbs === 7427, `optimiert ${r.optConcreteGwpTotal} ${r.optSteelGwpTotal}`);
pruefe(nahe(r.diffPct, 68.370, 1e-3) && r.efficiencyClass === 'Klasse A+' && nahe(r.refSpecificGwp, 108.63, 1e-9) && nahe(r.optSpecificGwp, 34.36, 1e-9), `Minderung ${r.diffPct}`);
// 2. Referenzfall ohne Optimierung (CEM I, 28 d, BOF, Referenzmengen) → 0 % → Referenz
const ref = dafstbVergleich({ bauteil: 'wand', bauweise: 'standard', zement: 'cem1', pruefalter: 28, stahlRoute: 'standard_bof' });
pruefe(ref.diffAbs === 0 && ref.diffPct === 0 && ref.efficiencyClass === 'Referenz' && ref.hinweise.some(x => x.feld === 'bauweise'), 'Referenzfall');
pruefe(dafstbVergleich({ bauteil: 'decke', bauweise: 'massiv', zement: 'cem1', pruefalter: 56, stahlRoute: 'standard_bof' }).hinweise.some(x => x.feld === 'pruefalter'), 'CEM I mit 56 d → Hinweis');
// 3. Klassengrenzen
pruefe(effizienzKlasseThg(50) === 'Klasse A+' && effizienzKlasseThg(49.9) === 'Klasse A' && effizienzKlasseThg(40) === 'Klasse A' && effizienzKlasseThg(25) === 'Klasse B' && effizienzKlasseThg(10) === 'Klasse C' && effizienzKlasseThg(9.99) === 'Referenz', 'Klassengrenzen');
// 4. Mengenkonsistenz der Daten (Bewehrungsgrade wie in den Modulkommentaren)
pruefe(nahe(DAFSTB_BAUTEILE.decke.referenz.stahlKg / DAFSTB_BAUTEILE.decke.referenz.betonM3, 110, 1e-9) && nahe(DAFSTB_BAUTEILE.stuetze.referenz.betonM3, 4 * 3.5 * 0.45 * 0.45, 1e-9) && nahe(DAFSTB_BAUTEILE.stuetze.varianten.hochfest_c50_schlank.betonM3, 14 * 0.3 * 0.3, 1e-9), 'Mengen');
// 5. Durchmusterung aller Kombinationen: Minderung ≥ 0, besserer Zement/Stahl/Prüfalter nie schlechter
const Z: DafstbZement[] = ['cem1', 'cem2_all', 'cem2_bs', 'cem3_a', 'cem2_cm'];
let n = 0;
for (const bt of Object.keys(DAFSTB_BAUTEILE) as DafstbBauteil[]) for (const bw of [...Object.keys(DAFSTB_BAUTEILE[bt].varianten), 'referenz']) for (let zi = 0; zi < Z.length; zi++) for (const pa of [28, 56] as const) {
  const bof = dafstbVergleich({ bauteil: bt, bauweise: bw, zement: Z[zi], pruefalter: pa, stahlRoute: 'standard_bof' });
  const eaf = dafstbVergleich({ bauteil: bt, bauweise: bw, zement: Z[zi], pruefalter: pa, stahlRoute: 'gruen_eaf' });
  pruefe(bof.diffPct >= 0 && eaf.optTotalGwp <= bof.optTotalGwp && Number.isFinite(eaf.optSpecificGwp), `${bt}/${bw}/${Z[zi]}/${pa}: Stahlroute`);
  if (zi > 0) pruefe(bof.optTotalGwp <= dafstbVergleich({ bauteil: bt, bauweise: bw, zement: Z[zi - 1], pruefalter: pa, stahlRoute: 'standard_bof' }).optTotalGwp, `${bt}/${bw}: Zementreihe`);
  if (pa === 56) pruefe(bof.optTotalGwp <= dafstbVergleich({ bauteil: bt, bauweise: bw, zement: Z[zi], pruefalter: 28, stahlRoute: 'standard_bof' }).optTotalGwp, `${bt}/${bw}: Prüfalter`);
  n++;
}

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log(`OK: Materialoptimierung (${n} Kombinationen)`);
