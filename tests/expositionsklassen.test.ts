// Rechenkern Expositionsklassen (Z3): maßgebende Hüllwerte und k-Wert-Ansatz nach DIN 1045-2
import { huellwerte, kWertAnsatz, type ExpositionsAnforderung } from '../src/calc/expositionsklassen';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Expositionsklassen ---');

// Auszug der Klassendaten aus src/modules/expositionsklassen/daten.ts (Stand 26.10.2026, unverändert übernommen;
// XF1 dort mit LP-Pflicht – siehe Befund im PR)
const D: ExpositionsAnforderung[] = [
  { code: 'XC1', maxWzEq: 0.75, minStrengthClass: 'C16/20', minCement: 240, minCoverDurMm: 10 },
  { code: 'XC4', maxWzEq: 0.60, minStrengthClass: 'C25/30', minCement: 280, minCoverDurMm: 25 },
  { code: 'XF1', maxWzEq: 0.60, minStrengthClass: 'C25/30', minCement: 280, minAirContent: { dmax32: 4.0, dmax16: 4.5, dmax8: 5.5 }, requiresAirEntrainment: true, minCoverDurMm: null },
  { code: 'XF4', maxWzEq: 0.50, minStrengthClass: 'C30/37', minCement: 320, minAirContent: { dmax32: 4.0, dmax16: 4.5, dmax8: 5.5 }, requiresAirEntrainment: true, minCoverDurMm: null },
  { code: 'XD3', maxWzEq: 0.45, minStrengthClass: 'C35/45', minCement: 320, minCoverDurMm: 40 },
  { code: 'XA3', maxWzEq: 0.45, minStrengthClass: 'C35/45', minCement: 320, minCoverDurMm: null },
];

// 1. Startwerte des Moduls: XC4 + XF1, Größtkorn 16 mm, Δc_dev = 15 mm
//    (w/z)_eq = min(0,60; 0,60) = 0,60; C25/30; z_min = 280; LP 4,5 %; c_min,dur = 25 → c_nom = 40 mm
const h = huellwerte(D, ['XC4', 'XF1'], 16, 15)!;
pruefe(h.gueltig && h.minWzEq === 0.6 && h.highestClass === 'C25/30' && h.maxCement === 280 && h.requiresLP && h.minAirVal === 4.5 && h.maxCoverDur === 25 && h.cNom === 40, `Startwerte ${JSON.stringify(h)}`);
//    XD3 + XF4 + XA3, Größtkorn 32: 0,45; C35/45; 320; LP 4,0; c_nom = 40 + 15 = 55; Sonderanforderungen XA2/3, XA3, XF4
const s = huellwerte(D, ['XD3', 'XF4', 'XA3'], 32, 15)!;
pruefe(s.minWzEq === 0.45 && s.highestClass === 'C35/45' && s.maxCement === 320 && s.minAirVal === 4.0 && s.cNom === 55 && s.specialReqs.length === 3, `Brücke ${JSON.stringify(s)}`);
//    nur XC1: c_min,dur = 10 → Hinweis Δc_dev = 10 mm; ohne Luftporen
const x1 = huellwerte(D, ['XC1'], 8, 10)!;
pruefe(x1.cNom === 20 && !x1.requiresLP && x1.minAirVal === null && x1.specialReqs.some(t => t.includes('XC1')), 'nur XC1');
pruefe(huellwerte(D, [], 16, 15) === null, 'keine Klasse → null');
pruefe(huellwerte(D, ['XC4', 'XS9'], 16, 15)!.hinweise.some(x => x.feld === 'klassen'), 'unbekannte Klasse → Warnung');
pruefe(!huellwerte(D, ['XC4'], 16, -1)!.gueltig, 'Δc_dev < 0 → Fehler');

// 2. k-Wert-Ansatz, Startwerte: z = 310, w = 165, f = 50, s = 0
//    f_max = 0,33·310 = 102,3 → f = 50; z_eq = 310 + 0,4·50 = 330; (w/z)_eq = 165/330 = 0,500; w/z = 0,532
const k = kWertAnsatz({ zement: 310, wasser: 165, flugasche: 50, silika: 0 });
pruefe(k.gueltig && nahe(k.maxF, 102.3, 1e-9) && k.effectiveF === 50 && nahe(k.beq, 330, 1e-9) && nahe(k.wzEq, 0.5, 1e-12) && nahe(k.rawWz, 0.532258, 1e-6) && k.hinweise.length === 0, `k-Wert ${JSON.stringify(k)}`);
//    Begrenzung: f = 150 > 102,3 → angerechnet 102,3; s = 50 > 0,11·310 = 34,1 → 34,1; z_eq = 310 + 40,92 + 34,1 = 385,02
const kb = kWertAnsatz({ zement: 310, wasser: 165, flugasche: 150, silika: 50 });
pruefe(nahe(kb.effectiveF, 102.3, 1e-9) && nahe(kb.effectiveS, 34.1, 1e-9) && nahe(kb.beq, 385.02, 1e-9) && kb.hinweise.length === 3, `Begrenzung ${JSON.stringify(kb)}`);
pruefe(kWertAnsatz({ zement: 0, wasser: 165, flugasche: 0, silika: 0 }).wzEq === 0 && !kWertAnsatz({ zement: -1, wasser: 1, flugasche: 0, silika: 0 }).gueltig, 'z = 0 / negativ');

// 3. Fuzz: Hüllwerte sind die strengsten Einzelwerte, mehr Klassen → nie milder; k-Wert-Monotonie
let zufall = 206;
const rnd = () => { zufall = (zufall * 1103515245 + 12345) % 2147483648; return zufall / 2147483648; };
for (let i = 0; i < 1000; i++) {
  const auswahl = D.filter(() => rnd() < 0.4).map(c => c.code);
  if (auswahl.length === 0) continue;
  const dm = ([32, 16, 8] as const)[i % 3];
  const a = huellwerte(D, auswahl, dm, 15)!;
  const mehr = huellwerte(D, [...auswahl, D[Math.floor(rnd() * D.length)].code], dm, 15)!;
  pruefe((mehr.minWzEq ?? 1) <= (a.minWzEq ?? 1) && mehr.maxCement >= a.maxCement && mehr.cNom >= a.cNom, `Fuzz ${i}: Monotonie`);
  pruefe(D.filter(c => auswahl.includes(c.code)).every(c => (c.maxWzEq ?? 9) >= (a.minWzEq ?? 0) && (c.minCement ?? 0) <= a.maxCement), `Fuzz ${i}: strengster Wert`);
  const z = 240 + rnd() * 200, w = 120 + rnd() * 80, f = rnd() * 150, sl = rnd() * 40;
  const k1 = kWertAnsatz({ zement: z, wasser: w, flugasche: f, silika: sl }), k2 = kWertAnsatz({ zement: z, wasser: w, flugasche: f + 10, silika: sl });
  pruefe(Number.isFinite(k1.wzEq) && k1.wzEq <= k1.rawWz && k2.wzEq <= k1.wzEq + 1e-15, `Fuzz ${i}: k-Wert`);
}

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log('OK: Expositionsklassen');
