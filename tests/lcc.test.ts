// Rechenkern Lebenszykluskosten, Barwertmethode (Umsetzungsplan Phase 4, AP 4.2)
import {
  abzinsungsfaktor, rentenbarwertfaktor, annuitaetenfaktor, barwertfaktorPreissteigerung,
  lccOption, lccVergleich, pruefeLcc, BNB_211, type LccOption, type LccParameter,
} from '../src/calc/lcc';
import { ersatzzyklen } from '../src/calc/lca';
import inhalt from '../content/lcc/LCC.json';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
console.log('--- Test: LCC ---');

// 1. Vervielfältiger (Rentenbarwertfaktor) nach BewG Anlage 21 (Fassung JStG 2024, Wiedergabe buzer.de),
//    Formel (qⁿ − 1)/(qⁿ · (q − 1)), Tabellenwerte auf vier Nachkommastellen.
const bewg: [number, number, number][] = [
  [0.015, 10, 9.2222], [0.015, 20, 17.1686], [0.015, 30, 24.0158], [0.015, 50, 34.9997],
  [0.02, 10, 8.9826], [0.02, 20, 16.3514], [0.02, 30, 22.3965], [0.02, 50, 31.4236],
  [0.03, 10, 8.5302], [0.03, 20, 14.8775], [0.03, 30, 19.6004], [0.03, 50, 25.7298],
  [0.05, 10, 7.7217], [0.05, 20, 12.4622], [0.05, 30, 15.3725], [0.05, 50, 18.2559],
];
for (const [r, n, soll] of bewg) {
  pruefe(Math.abs(rentenbarwertfaktor(r, n) - soll) < 6e-5, `RBF(${r}, ${n}) = ${rentenbarwertfaktor(r, n)} vs ${soll}`);
  pruefe(nahe(annuitaetenfaktor(r, n), 1 / soll, 1e-4), `Annuitätenfaktor(${r}, ${n})`);
  // ohne Preissteigerung ist der Barwertfaktor gleich dem Rentenbarwertfaktor
  pruefe(nahe(barwertfaktorPreissteigerung(r, 0, n), soll, 1e-5), `BWF(${r}, 0, ${n}) = RBF`);
}
// Lehrbuchwert: Annuitätenfaktor 3 %, 20 a = 0,0672
pruefe(Math.abs(annuitaetenfaktor(0.03, 20) - 0.0672) < 5e-5, 'Annuitätenfaktor 3 %/20 a = 0,0672');
pruefe(Math.abs(abzinsungsfaktor(0.03, 20) - 0.5537) < 5e-5, 'Abzinsungsfaktor 1,03^−20 = 0,5537');

// 2. Barwertfaktor mit Preissteigerung = Summe der Einzeljahre; Sonderfall p = r → N
for (const [r, p, n] of [[0.015, 0.02, 50], [0.015, 0.05, 50], [0.02, 0.03, 30], [0.06, 0.0, 10], [0.03, 0.03, 40]] as const) {
  let summe = 0;
  for (let t = 1; t <= n; t++) summe += Math.pow(1 + p, t) / Math.pow(1 + r, t);
  pruefe(nahe(barwertfaktorPreissteigerung(r, p, n), summe, 1e-10), `BWF(${r}, ${p}, ${n}) = Σ`);
}
pruefe(barwertfaktorPreissteigerung(0.03, 0.03, 40) === 40 && rentenbarwertfaktor(0, 25) === 25, 'q = 1 bzw. r = 0 → N');
// BNB 2.1.1: Energie (r = 1,5 %, p = 5 %, 50 a) – Barwertfaktor > N, da p > r
pruefe(barwertfaktorPreissteigerung(BNB_211.r, BNB_211.pEnergie, BNB_211.N) > 50, 'BNB Energie: BWF > 50');

// 3. Referenz: bisherige Komponentenrechnung (src/modules/LCC.tsx vor AP 4.2), wörtlich übernommen.
const SZ = inhalt.daten.SCENARIOS as { id: string; optionA: LccOption; optionB: LccOption }[];
function alt(opt: LccOption, isB: boolean, P: { r: number; e: number; i: number; N: number; co2: boolean; co2P: number; co2E: number; sub: boolean; subP: number }) {
  const { r, e, i, N } = P;
  const capex = P.sub && isB ? opt.capex * (1 - P.subP / 100) : opt.capex;
  let o = 0, m = 0, rp = 0, c = 0;
  const ic = P.co2 ? (opt.embodiedCO2 / 1000) * P.co2P : 0;
  for (let yr = 1; yr <= N; yr++) {
    o += opt.opex0 * Math.pow(1 + e, yr) / Math.pow(1 + r, yr);
    const pr = P.co2P * Math.pow(1 + P.co2E / 100, yr);
    if (P.co2) c += (opt.operatingCO2 / 1000) * pr / Math.pow(1 + r, yr);
    if (yr % opt.maintenanceInterval === 0 && yr < N) m += opt.maintenanceCost * Math.pow(1 + i, yr) / Math.pow(1 + r, yr);
    if (yr % opt.lifespan === 0 && yr < N) {
      rp += opt.replacementCost * Math.pow(1 + i, yr) / Math.pow(1 + r, yr);
      if (P.co2) c += (opt.embodiedCO2 / 1000) * pr / Math.pow(1 + r, yr);
    }
  }
  return capex + ic + o + m + rp + c + opt.eolCost * Math.pow(1 + i, N) / Math.pow(1 + r, N);
}
const stdP: LccParameter = { r: 0.02, e: 0.03, i: 0.015, N: 50, co2Bepreisung: true, co2Preis: 75, co2Steigerung: 0.05, foerderungB: 15 };
pruefe(SZ.length === 3, 'drei Szenarien');
for (const sz of SZ) {
  for (const [r, e, i, N, co2, sub] of [[2, 3, 1.5, 50, true, true], [0.5, 8, 0, 10, false, false], [6, 0, 5, 80, true, false], [3.5, 3.5, 2, 33, false, true]] as const) {
    const P: LccParameter = { r: r / 100, e: e / 100, i: i / 100, N, co2Bepreisung: co2, co2Preis: 120, co2Steigerung: 0.03, foerderungB: sub ? 20 : 0 };
    const v = lccVergleich(sz.optionA, sz.optionB, P);
    const PA = { r: r / 100, e: e / 100, i: i / 100, N, co2, co2P: 120, co2E: 3, sub, subP: 20 };
    pruefe(v.gueltig && nahe(v.resultA.totalLCCDiscounted, alt(sz.optionA, false, PA), 1e-12), `${sz.id} A (${r}/${e}/${i}/${N})`);
    pruefe(nahe(v.resultB.totalLCCDiscounted, alt(sz.optionB, true, PA), 1e-12), `${sz.id} B (${r}/${e}/${i}/${N})`);
    pruefe(nahe(v.saving, v.resultA.totalLCCDiscounted - v.resultB.totalLCCDiscounted, 1e-12), `${sz.id} Ersparnis`);
  }
}

// 4. Handrechnung: Betriebskosten = opex0 · BWF(r, e, N); Ersatzanzahl wie lca.ersatzzyklen (kein Ersatz im Jahr N)
const dm = SZ[0];
const r4 = lccOption(dm.optionA, stdP, 0);
pruefe(nahe(r4.cumulativeOpExDiscounted, dm.optionA.opex0 * barwertfaktorPreissteigerung(0.02, 0.03, 50), 1e-10), 'OpEx = opex0 · BWF');
pruefe(r4.yearlyBreakdown.filter(j => j.replNominal > 0).length === ersatzzyklen(dm.optionA.lifespan, 50), 'Ersatzanzahl = ersatzzyklen');
pruefe(r4.yearlyBreakdown.length === 50 && nahe(r4.yearlyBreakdown[49].cumulativeDiscounted + r4.eolDiscounted, r4.totalLCCDiscounted, 1e-12), 'kumulierter Barwert + EOL = LCC');
// Ersatz genau im Jahr N entfällt (N = 60, Nutzungsdauer 30 → 1 Ersatz im Jahr 30)
const r60 = lccOption(dm.optionA, { ...stdP, N: 60 }, 0);
pruefe(r60.yearlyBreakdown.filter(j => j.replNominal > 0).map(j => j.year).join() === '30', 'kein Ersatz im Jahr N');
// Förderung mindert nur die Investition
pruefe(nahe(lccOption(dm.optionB, stdP, 15).capex, dm.optionB.capex * 0.85, 1e-12), 'Förderung 15 %');

// 5. Randfälle
const nullOpt: LccOption = { capex: 1000, opex0: 0, maintenanceInterval: 1, maintenanceCost: 0, lifespan: 100, replacementCost: 0, eolCost: 0, embodiedCO2: 0, operatingCO2: 0 };
pruefe(lccOption(nullOpt, { ...stdP, N: 1 }, 0).totalLCCDiscounted === 1000, 'nur Investition');
const eol = lccOption({ ...nullOpt, capex: 0, eolCost: -1000 }, { ...stdP, r: 0.03, i: 0, N: 20 }, 0);
pruefe(nahe(eol.eolDiscounted, -1000 * abzinsungsfaktor(0.03, 20), 1e-12), 'Restwerterlös abgezinst (negativ)');
pruefe(lccOption(nullOpt, stdP, 100).capex === 0, 'Förderung 100 % → Investition 0');

// 6. Plausibilität
const v0 = (p: Partial<LccParameter>, a: Partial<LccOption> = {}) => lccVergleich({ ...dm.optionA, ...a }, dm.optionB, { ...stdP, ...p });
pruefe(!v0({ N: 0 }).gueltig && !v0({ N: 12.5 }).gueltig, 'N < 1 oder nicht ganzzahlig → Fehler');
pruefe(!v0({ r: -1 }).gueltig && !v0({ r: NaN }).gueltig, 'r ≤ −100 % / NaN → Fehler');
pruefe(!v0({ foerderungB: 120 }).gueltig && !v0({ co2Preis: -5 }).gueltig, 'Förderung > 100 %, CO₂-Preis < 0 → Fehler');
pruefe(!v0({}, { lifespan: 0 }).gueltig && !v0({}, { maintenanceInterval: 2.5 }).gueltig, 'Intervalle → Fehler');
pruefe(v0({ r: 0.08 }).hinweise.some(h => h.feld === 'r' && h.stufe === 'warnung'), 'r = 8 % → Warnung');
pruefe(v0({}).hinweise.some(h => /Restwert/.test(h.text)), 'Nutzungsdauer 30 a bei N = 50 → Restwert-Hinweis');
pruefe(!pruefeLcc({ ...nullOpt, lifespan: 25 }, { ...nullOpt, lifespan: 50 }, stdP).length, 'passende Nutzungsdauern → keine Hinweise');
pruefe(Number.isNaN(lccVergleich({ ...nullOpt, capex: 0 }, nullOpt, stdP).percentSaving), 'LCC_A = 0 → keine Prozentangabe');

// 7. Fuzz: 1 000 Zufallseingaben → endliche Ergebnisse oder sauberer Fehler
let z = 1026;
const rnd = () => { z = (z * 1103515245 + 12345) % 2147483648; return z / 2147483648; };
let gueltige = 0;
for (let k = 0; k < 1000; k++) {
  const opt = (): LccOption => ({
    capex: rnd() * 1e5, opex0: rnd() * 5e3, maintenanceInterval: 1 + Math.floor(rnd() * 40) - (rnd() < 0.03 ? 1 : 0),
    maintenanceCost: rnd() * 1e4, lifespan: 1 + Math.floor(rnd() * 90), replacementCost: rnd() * 5e4,
    eolCost: (rnd() - 0.5) * 1e4, embodiedCO2: rnd() * 3e4, operatingCO2: rnd() * 3e3,
  });
  const P: LccParameter = {
    r: rnd() * 0.1 - 0.01, e: rnd() * 0.1, i: rnd() * 0.06, N: Math.floor(rnd() * 101) - (rnd() < 0.03 ? 5 : 0),
    co2Bepreisung: rnd() < 0.5, co2Preis: rnd() * 250, co2Steigerung: rnd() * 0.1, foerderungB: rnd() * 110,
  };
  const v = lccVergleich(opt(), opt(), P);
  if (!v.gueltig) { pruefe(v.hinweise.some(h => h.stufe === 'fehler'), `Fuzz ${k}: ungültig ohne Fehler`); continue; }
  gueltige++;
  pruefe([v.resultA.totalLCCDiscounted, v.resultB.totalLCCDiscounted, v.saving].every(Number.isFinite), `Fuzz ${k}: nicht endlich`);
  pruefe(v.resultA.yearlyBreakdown.every(j => Number.isFinite(j.cumulativeDiscounted)), `Fuzz ${k}: Jahreswerte nicht endlich`);
}
pruefe(gueltige > 700, `Fuzz: nur ${gueltige} gültige Fälle`);

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log(`OK: LCC (${gueltige} gültige Fuzz-Fälle)`);
