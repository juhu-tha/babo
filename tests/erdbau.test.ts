// Rechenkern Erdbau (Z3): vereinfachte Bodengruppe nach DIN 18196 und Frostschutzdicke nach RStO-Schema
import { bodengruppe, frostschutz, KIES_GRENZE_18196, KORNGRENZEN_14688, type BodenEingabe, type RstoKlasse } from '../src/calc/erdbau';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: Erdbau ---');

// 1. Bodengruppen (Startwerte: 10 % Feinkorn, Kies 60/Sand 40 → GU/GT, F2)
const B: BodenEingabe = { feinanteil: 10, kiesanteil: 60, sandanteil: 40, organik: 'keine', plastizitaet: 'nicht' };
const start = bodengruppe(B);
pruefe(start.gueltig && start.gruppe === 'GU / GT' && start.frost === 'F2', `Startwerte ${start.gruppe}`);
// Runde 5, DIN 18196 (öffentliche Wiedergabe FORUM VERLAG „Bodengruppen nach DIN 18196“): Kies, wenn der Massenanteil ≤ 2 mm
// höchstens 60 % beträgt (Kieskorn ≥ 40 % der Gesamtmasse); feinkörnig ab 40 % Feinkorn (≥ 40 %, bisher > 40 %).
// Beispiel: Feinkorn 10 %, Kies 45 % des Grobkorns → 0,45 · 90 = 40,5 % ≥ 40 → GU/GT; Kies 44 % → 39,6 % → SU/ST
const F: [number, number, string, string][] = [
  [5, 60, 'GW / GI / GE', 'F1'], [5, 40, 'SW / SI / SE', 'F1'], [5.1, 40, 'SU / ST', 'F2'], [15, 60, 'GU / GT', 'F2'],
  [15.1, 60, 'GU* / GT*', 'F3'], [39.9, 40, 'SU* / ST*', 'F3'], [40, 40, 'UL / UM', 'F3'], [40.1, 60, 'UL / UM', 'F3'],
  [0, 50, 'GW / GI / GE', 'F1'], [0, 40, 'GW / GI / GE', 'F1'], [0, 39.9, 'SW / SI / SE', 'F1'], [10, 45, 'GU / GT', 'F2'], [10, 44, 'SU / ST', 'F2'],
];
pruefe(KIES_GRENZE_18196 === 40 && KORNGRENZEN_14688.schluff === 0.063 && KORNGRENZEN_14688.sand === 2 && KORNGRENZEN_14688.kies === 63, 'Korngrenzen DIN EN ISO 14688-1');
for (const [fein, kies, gruppe, frost] of F) {
  const r = bodengruppe({ ...B, feinanteil: fein, kiesanteil: kies, sandanteil: 100 - kies });
  pruefe(r.gruppe === gruppe && r.frost === frost, `Feinkorn ${fein} %, Kies ${kies}: ${r.gruppe} ≠ ${gruppe}`);
}
// Tranche 5: TA ist nach ZTV E-StB 17, Tab. 1 gering bis mittel frostempfindlich (F2), nicht F3
pruefe(bodengruppe({ ...B, feinanteil: 60, plastizitaet: 'ausgeprägt' }).frost === 'F2', 'TA → F2 (ZTV E-StB 17)');
pruefe(bodengruppe({ ...B, feinanteil: 60, plastizitaet: 'ausgeprägt' }).gruppe === 'TA' && bodengruppe({ ...B, organik: 'stark' }).gruppe === 'HN / HZ / F', 'TA und organisch');
pruefe(bodengruppe({ ...B, feinanteil: 60 }).hinweise.some(x => x.feld === 'plastizitaet'), 'feinkörnig ohne Plastizität → Hinweis');
pruefe(bodengruppe({ ...B, kiesanteil: 0, sandanteil: 0, feinanteil: 2 }).gruppe === 'SW / SI / SE', 'ohne Grobkornangabe → Sand');
pruefe(!bodengruppe({ ...B, feinanteil: 120 }).gueltig && !bodengruppe({ ...B, feinanteil: NaN }).gueltig, 'Feinkorn > 100 / NaN → Fehler');

// 2. Frostschutz (Startwerte): Zone II, BK3, F3, ungünstig → 60 + 5 + 5 = 70 cm; gebunden 15; FSS 55
const f0 = frostschutz({ frostzone: 2, bauklasse: 'BK3', bodengruppe: 'F3', wasser: 'unguenstig' });
pruefe(f0.gueltig && f0.gesamtDicke === 70 && f0.dickeAsphalt === 15 && f0.dickeFSS === 55, `Startwerte ${JSON.stringify(f0)}`);
//    Bk100, F3, Zone III, ungünstig: 65 + 15 + 5 = 85; gebunden 30; FSS 55
const f1 = frostschutz({ frostzone: 3, bauklasse: 'Bk100', bodengruppe: 'F3', wasser: 'unguenstig' });
pruefe(f1.gesamtDicke === 85 && f1.dickeAsphalt === 30 && f1.dickeFSS === 55, 'Bk100');
//    BK0,3, F2, Zone I, günstig: 40 cm; Bk32, F2, Zone I, günstig: 55 − 30 = 25 cm FSS
pruefe(frostschutz({ frostzone: 1, bauklasse: 'BK03', bodengruppe: 'F2', wasser: 'guenstig' }).gesamtDicke === 40 && frostschutz({ frostzone: 1, bauklasse: 'Bk32', bodengruppe: 'F2', wasser: 'guenstig' }).dickeFSS === 25, 'Mindestwerte');
pruefe(!frostschutz({ frostzone: 4, bauklasse: 'BK3', bodengruppe: 'F3', wasser: 'guenstig' }).gueltig, 'Zone IV → Fehler');

// 3. Vollständige Durchmusterung: Monotonie (F3 ≥ F2, Zone III > II > I, ungünstig = günstig + 5), FSS ≥ 15 cm
const KL: RstoKlasse[] = ['Bk100', 'Bk32', 'Bk10', 'BK3', 'BK1', 'BK03'];
for (const bk of KL) for (const z of [1, 2, 3]) for (const w of ['guenstig', 'unguenstig'] as const) {
  const f2 = frostschutz({ frostzone: z, bauklasse: bk, bodengruppe: 'F2', wasser: w }), f3 = frostschutz({ frostzone: z, bauklasse: bk, bodengruppe: 'F3', wasser: w });
  pruefe(f3.gesamtDicke >= f2.gesamtDicke && f3.dickeFSS >= 15 && f2.dickeFSS >= 15, `F3 ≥ F2 (${bk}, ${z}, ${w})`);
  if (z < 3) pruefe(frostschutz({ frostzone: z + 1, bauklasse: bk, bodengruppe: 'F3', wasser: w }).gesamtDicke > f3.gesamtDicke, `Zone (${bk}, ${z})`);
  if (w === 'guenstig') pruefe(frostschutz({ frostzone: z, bauklasse: bk, bodengruppe: 'F3', wasser: 'unguenstig' }).gesamtDicke === f3.gesamtDicke + 5, `Wasser (${bk}, ${z})`);
}
// 4. Fuzz Bodengruppe: mehr Feinkorn → Frostklasse nie günstiger (ohne ausgeprägte Plastizität; TA ist nach ZTV E-StB 17
//    mit F2 günstiger eingestuft als SU*/ST* mit F3 – das ist normgemäß, Tranche 5)
let zufall = 18196;
const rnd = () => { zufall = (zufall * 1103515245 + 12345) % 2147483648; return zufall / 2147483648; };
const rang = { F1: 1, F2: 2, F3: 3 } as const;
for (let i = 0; i < 1000; i++) {
  const e: BodenEingabe = { feinanteil: rnd() * 90, kiesanteil: rnd() * 100, sandanteil: rnd() * 100, organik: 'keine', plastizitaet: rnd() < 0.5 ? 'nicht' : 'ausgeprägt' };
  const a = bodengruppe(e), b = bodengruppe({ ...e, feinanteil: e.feinanteil + 5 });
  pruefe(a.gueltig && (e.plastizitaet === 'ausgeprägt' || rang[b.frost] >= rang[a.frost]), `Fuzz ${i}: Frostmonotonie`);
}

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log('OK: Erdbau');
