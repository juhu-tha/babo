// Rechenkern Materialoptimierung (Z3): THG-Vergleich Referenz/optimiertes Bauteil
import { dafstbVergleich, effizienzKlasseThg, DAFSTB_BAUTEILE, STAHL_GWP, ZEMENT_GWP, ABSCHLAG_56D, type DafstbBauteil, type DafstbZement } from '../src/calc/materialoptimierung';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Materialoptimierung ---');

// 1. Handrechnung Startwerte: Decke, Hohlkörper, CEM III/A, 56 d, grüner Stahl
//    Lehrwerte seit 29.10.2026 (T11-MO-3): Beton = round(320·GWP_Zement + 30); Stahl-Referenz ÖKOBAUDAT 0,64
//    Zement-GWP seit 29.10.2026 (T15-NH-3, src/data/zementGwp.ts); Lehrbeton-Rest seit 30.10.2026 einheitlich 45 kg/m³:
//    CEM I 320·0,665 + 45 = 257,8 → 258, CEM III/A 320·0,40 + 45 = 173 kg/m³
//    Referenz: 26·258 = 6708; 2860·0,64 = 1830,4 → 1830; Summe 8538 kg CO₂e (85,38 je m²)
//    optimiert: round(173·0,91) = round(157,43) = 157 kg/m³; 19,5·157 = 3061,5 → 3062; 2470·0,42 = 1037,4 → 1037; Summe 4099
//    Minderung (8538 − 4099)/8538 = 51,99 % → Klasse A+
const r = dafstbVergleich({ bauteil: 'decke', bauweise: 'hohlkoerper', zement: 'cem3_a', pruefalter: 56, stahlRoute: 'gruen_eaf' });
pruefe(r.optConcreteGwpPerM3 === 157 && r.refConcreteGwpTotal === 6708 && r.refSteelGwpTotal === 1830 && r.refTotalGwp === 8538, `Referenz ${JSON.stringify(r)}`);
pruefe(r.optConcreteGwpTotal === 3062 && r.optSteelGwpTotal === 1037 && r.optTotalGwp === 4099 && r.diffAbs === 4439, `optimiert ${r.optConcreteGwpTotal} ${r.optSteelGwpTotal}`);
pruefe(nahe(r.diffPct, 51.9911, 1e-3) && r.efficiencyClass === 'Klasse A+' && nahe(r.refSpecificGwp, 85.38, 1e-9) && nahe(r.optSpecificGwp, 40.99, 1e-9), `Minderung ${r.diffPct}`);
pruefe(ZEMENT_GWP.cem1 === 258 && ZEMENT_GWP.cem2_all === 237 && ZEMENT_GWP.cem2_bs === 215 && ZEMENT_GWP.cem3_a === 173 && ZEMENT_GWP.cem2_cm === 173, `Beton-GWP je Zementart ${JSON.stringify(ZEMENT_GWP)}`);
// 2. Referenzfall ohne Optimierung (CEM I, 28 d, Betonstahl DE, Referenzmengen) → 0 % → Referenz
const ref = dafstbVergleich({ bauteil: 'wand', bauweise: 'standard', zement: 'cem1', pruefalter: 28, stahlRoute: 'eaf_de' });
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

// Runde 5 (Z22): Lehrwerte sind als solche gekennzeichnet (Konstanten und Hinweis im Ergebnis)
{
  const r = dafstbVergleich({ bauteil: 'decke', bauweise: 'massiv', zement: 'cem3_a', pruefalter: 28, stahlRoute: 'gruen_eaf' });
  pruefe(r.hinweise.some(x => x.feld === 'gwp' && /Lehrwerte/.test(x.text)), 'Lehrwert-Hinweis');
  pruefe(STAHL_GWP.eaf_de === 0.64 && STAHL_GWP.standard_bof === 0.98 && STAHL_GWP.gruen_eaf === 0.42 && ABSCHLAG_56D === 0.91 && r.optSteelGwpTotal === Math.round(2520 * 0.42), 'Lehrwert-Konstanten');
}

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log(`OK: Materialoptimierung (${n} Kombinationen)`);
