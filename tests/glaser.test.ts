// Rechenkern Glaser-Verfahren (Umsetzungsplan Phase 4, AP 4.9)
import { glaser, TAUPERIODE_DIN_4108_3, verdunstungDin4108_3, type GlaserSchicht } from '../src/calc/glaser';
import { psat } from '../src/calc/waermeschutz';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
console.log('--- Test: Glaser-Verfahren ---');

// 1. Regressionstest Literaturbeispiel ±2 %: DIN 4108-3, Anhang B, Beispiel 1 „Leichte Außenwand mit
//    hinterlüfteter Vorsatzschale“. Ergebnis nach DIN 4108-3 (2014/2018) laut öffentlicher Tabelle auf
//    https://www.ubakus.de/berechnung-des-feuchteschutzes/ : Tauwasser 0,269 kg/m², Verdunstung (90 d) 0,659 kg/m²,
//    Trocknungsdauer 36,7 d. Schichtaufbau (gleiches Beispiel, öffentlicher Auszug Anhang B:
//    https://www.umwelt-online.de/recht/bau/din/4108_34.htm): Spanplatte 19 mm (μ 50, λ 0,13), diffusionshemmende
//    Luftdichtheitsschicht s_d = 2,0 m, Mineralwolle 160 mm (μ 1, λ 0,040), Spanplatte 19 mm (μ 100, λ 0,13);
//    Luftschicht und Vorsatzschale werden nicht angesetzt. Klima nach DIN 4108-3 (Normklima des Kerns).
const bspWand: GlaserSchicht[] = [
  { name: 'Spanplatte innen', d: 0.019, lambda: 0.13, mu: 50 },
  { name: 'Luftdichtheitsschicht', d: 5e-5, lambda: 0.2, mu: 40000 },
  { name: 'Mineralwolle', d: 0.16, lambda: 0.04, mu: 1 },
  { name: 'Spanplatte außen', d: 0.019, lambda: 0.13, mu: 100 },
];
const b1 = glaser(bspWand);
pruefe(b1.gueltig && b1.tauwasser, 'Beispiel 1: Tauwasser erwartet');
pruefe(b1.zonen.length === 1 && b1.zonen[0].art === 'ebene' && b1.zonen[0].grenzeVon === 3, `Beispiel 1: eine Ebene zwischen Dämmung und äußerer Spanplatte (${JSON.stringify(b1.zonen.map(z => [z.art, z.grenzeVon]))})`);
pruefe(nahe(b1.mc, 0.269, 0.02), `Beispiel 1: M_c = ${b1.mc} (Soll 0,269 kg/m²)`);
pruefe(nahe(b1.mev, 0.659, 0.02), `Beispiel 1: M_ev = ${b1.mev} (Soll 0,659 kg/m²)`);
pruefe(nahe(b1.trocknungsTage, 36.7, 0.02), `Beispiel 1: Trocknung ${b1.trocknungsTage} d (Soll 36,7 d)`);
pruefe(nahe(b1.sdGes, 5.01, 1e-9), `Beispiel 1: Σs_d ${b1.sdGes}`);
pruefe(b1.kriterien.every(k => k.eingehalten), 'Beispiel 1: Kriterien rechnerisch eingehalten');

// Handrechnung zur Formel: g_c = δ0 · ((p_i − p_c)/s_d,i − (p_c − p_e)/s_d,e) mit p_c = p_sat an Grenze 3
const pc = psat(b1.grenzen.T[3]);
const mcHand = 7.2e-7 * 2160 * ((psat(20) * 0.5 - pc) / 3.11 - (pc - psat(-5) * 0.8) / 1.9);
pruefe(nahe(b1.mc, mcHand, 1e-9), `Beispiel 1: Handrechnung ${mcHand}`);
pruefe(nahe(b1.mev, 7.2e-7 * 2160 * (500 / 3.11 + 500 / 1.9), 1e-9), 'Beispiel 1: Verdunstung Handrechnung');
// Tangente: Dampfdruck an der Ebene = Sättigungsdampfdruck, überall p ≤ p_sat
pruefe(Math.abs(b1.grenzen.p[3] - b1.grenzen.psat[3]) < 1e-9, 'Beispiel 1: p = p_sat in der Ebene');
pruefe(b1.verlauf.p.every((p, i) => p <= b1.verlauf.psat[i] + 1e-6), 'Beispiel 1: p ≤ p_sat überall');

// 2. Dach: Sättigungsdampfdruck der Verdunstungsperiode 2 000 Pa (statt 1 700 Pa)
const b1Dach = glaser(bspWand, TAUPERIODE_DIN_4108_3, verdunstungDin4108_3('dach'));
pruefe(nahe(b1Dach.mev, 7.2e-7 * 2160 * (800 / 3.11 + 800 / 1.9), 1e-9) && nahe(b1Dach.mc, b1.mc, 1e-12), 'Dach: Verdunstung mit 2 000 Pa');

// 3. Randfall ohne Tauwasser: WDVS auf Hochlochziegel → gerader Dampfdruckverlauf p_i → p_e
const wdvs = glaser([{ d: 0.015, lambda: 0.35, mu: 10 }, { d: 0.24, lambda: 0.42, mu: 5 }, { d: 0.16, lambda: 0.035, mu: 50 }, { d: 0.02, lambda: 1.0, mu: 25 }]);
pruefe(wdvs.gueltig && !wdvs.tauwasser && wdvs.mc === 0 && wdvs.zonen.length === 0 && wdvs.kriterien.length === 0, 'WDVS: kein Tauwasser');
const gerade = wdvs.verlauf.sd.every((x, i) => Math.abs(wdvs.verlauf.p[i] - (wdvs.pi - (wdvs.pi - wdvs.pe) * x / wdvs.sdGes)) < 1e-6);
pruefe(gerade, 'WDVS: Dampfdruckverlauf ist die Gerade');

// 4. Tauwasserbereich: diffusionsoffene Dämmung (μ = 1) bei feuchter Raumluft (65 %); die Hülle folgt der
//    gekrümmten p_sat-Kurve innerhalb der Dämmung bis zur Grenze zur äußeren Schicht (Bereich statt Ebene)
const bereich = glaser([{ d: 0.02, lambda: 0.5, mu: 1 }, { d: 0.20, lambda: 0.04, mu: 1 }, { d: 0.01, lambda: 0.5, mu: 50 }], { ...TAUPERIODE_DIN_4108_3, phiI: 65 });
pruefe(bereich.tauwasser && bereich.zonen.some(z => z.art === 'bereich' && z.sdBis > z.sdVon), `Bereich erwartet: ${JSON.stringify(bereich.zonen.map(z => [z.art, z.sdVon, z.sdBis]))}`);
pruefe(bereich.verlauf.p.every((p, i) => p <= bereich.verlauf.psat[i] + 1e-6), 'Bereich: p ≤ p_sat');
// Massenbilanz in Bereich: zuströmend − abströmend
{
  const z = bereich.zonen[0];
  const ein = (bereich.pi - z.pSatVon) / z.sdVon;
  const aus = (z.pSatBis - bereich.pe) / (bereich.sdGes - z.sdBis);
  pruefe(bereich.zonen.length === 1 && nahe(z.gc, 7.2e-7 * (ein - aus), 1e-9), 'Bereich: Bilanz');
}
// Nicht kapillar wasseraufnahmefähige Schicht an der Zone → Grenze 0,5 kg/m²
const nk = glaser(bspWand.map((s, i) => (i === 2 ? { ...s, nichtKapillar: true } : s)));
pruefe(nk.zonen[0].mcGrenze === 0.5 && nk.kriterien.length === 3, 'nicht kapillar: 0,5 kg/m²');

// 5. Grenzen und unzulässige Eingaben
const inv = [
  glaser([]),
  glaser([{ d: 0.1, lambda: 0.04, mu: 0 }]),
  glaser([{ d: 0.1, lambda: 0, mu: 1 }]),
  glaser(bspWand, { ...TAUPERIODE_DIN_4108_3, thetaE: 25 }),
  glaser(bspWand, { ...TAUPERIODE_DIN_4108_3, phiI: 120 }),
  glaser(bspWand, { ...TAUPERIODE_DIN_4108_3, stunden: 0 }),
  glaser(bspWand, TAUPERIODE_DIN_4108_3, { pI: 1200, pE: NaN, pSatTauwasser: 1700, stunden: 2160 }),
];
inv.forEach((r, i) => pruefe(!r.gueltig && r.hinweise.some(h => h.stufe === 'fehler'), `unzulässig ${i}`));
// Oberflächentauwasser (sehr feuchte Raumluft, schlechte Dämmung) → Warnung, Ergebnis trotzdem endlich
const ob = glaser([{ d: 0.05, lambda: 1.0, mu: 10 }], { ...TAUPERIODE_DIN_4108_3, phiI: 95 });
pruefe(ob.gueltig && ob.oberflaechenTauwasser && ob.hinweise.some(h => h.feld === 'oberflaeche'), 'Oberflächentauwasser');
// Feinere Teilung ändert das Ergebnis der Ebene nicht (Ebene liegt an einer Schichtgrenze)
pruefe(nahe(glaser(bspWand, undefined, undefined, { teilpunkte: 200 }).mc, b1.mc, 1e-9), 'Teilpunkte');

// 6. Fuzz: 1 000 Zufallsaufbauten ohne NaN/∞ bei gültigem Ergebnis
let seed = 4108;
const z = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
for (let i = 0; i < 1000; i++) {
  const s = Array.from({ length: 1 + (i % 6) }, () => ({ d: z(-0.01, 0.4), lambda: z(-0.05, 2), mu: z(0, i % 7 === 0 ? 100000 : 200) }));
  const r = glaser(s, { ...TAUPERIODE_DIN_4108_3, thetaE: z(-20, 15), phiI: z(1, 100), phiE: z(1, 100) });
  if (!r.gueltig) continue;
  const zahlen = [r.U, r.mc, r.mev, r.gc, r.gev, ...r.verlauf.p, ...r.verlauf.psat, ...r.zonen.map(x => x.mc)];
  const tage = r.trocknungsTage;
  if (!zahlen.every(Number.isFinite) || r.mc < 0 || r.mev < 0 || Number.isNaN(tage) || r.verlauf.p.some((p, k) => p > r.verlauf.psat[k] + 1e-6)) {
    pruefe(false, `Fuzz ${i} ${JSON.stringify(s)}`); break;
  }
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Glaser-Verfahren');
