// Rechenkern Lehm-Schätzmodell (Lehrmodell, Umsetzung 29.10.2026, T5-LE-1)
import { lehmSchaetzmodell } from '../src/calc/lehm';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol = 1e-6) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Lehm-Schätzmodell ---');

// 1. Startwerte (Tranche 5, L1): Ton 15, Schluff 35, Sand 50 Teile, w = 12 %
//    ρ = 1700 + 5·50 − 2·15 = 1920; f = 1 + 0,45 − 0,24 = 1,21; s = 0,60 + 0,24 = 0,84 %; λ = 0,15 + 0,0004·1920 = 0,918; Kennzahl 12
const a = lehmSchaetzmodell({ ton: 15, schluff: 35, sand: 50, wasser: 12 });
pruefe(a.gueltig && nahe(a.rohdichte, 1920) && nahe(a.druckfestigkeit, 1.21) && nahe(a.schwinden, 0.84) && nahe(a.lambda, 0.918) && nahe(a.sorption, 12), `L1 ${JSON.stringify(a)}`);
pruefe(a.hinweise.length === 1 && a.hinweise[0].text.includes('Lehrmodell'), 'L1 nur der Lehrmodell-Hinweis');
// 2. Reglerrand (Tranche 5, L3): Ton 40, Schluff 10, Sand 20, w = 25 % → p_T = 57,14 %, p_S = 28,57 %
//    ρ = 1700 + 142,857 − 114,286 = 1728,571; f = 1 + 1,7143 − 0,5 = 2,2143; s = 2,2857 + 0,5 = 2,7857 % – ohne Ersatzwerte
const b = lehmSchaetzmodell({ ton: 40, schluff: 10, sand: 20, wasser: 25 });
pruefe(nahe(b.rohdichte, 1728.5714, 1e-3) && nahe(b.druckfestigkeit, 2.2142857, 1e-6) && nahe(b.schwinden, 2.7857143, 1e-6) && b.hinweise.length === 1, `L3 ${b.rohdichte} ${b.druckfestigkeit}`);
// 3. Andere Reglerecke Ton 5, Schluff 60, Sand 80, w = 5: p_T = 3,45 % (im Modellbereich), f = 1,0034
const c = lehmSchaetzmodell({ ton: 5, schluff: 60, sand: 80, wasser: 5 });
pruefe(c.gueltig && nahe(c.druckfestigkeit, 1 + 0.03 * (500 / 145) - 0.1, 1e-9) && c.hinweise.length === 1, `Ecke ${c.druckfestigkeit} ${c.hinweise.length}`);
// 4. Grenzen: außerhalb des Modellbereichs Warnung, unzulässige Eingaben Fehler
pruefe(lehmSchaetzmodell({ ton: 15, schluff: 35, sand: 50, wasser: 30 }).hinweise.some(h => h.feld === 'wasser'), 'Warnung w > 25 %');
pruefe(lehmSchaetzmodell({ ton: 80, schluff: 10, sand: 10, wasser: 12 }).hinweise.some(h => h.feld === 'ton'), 'Warnung Ton > 60 %');
for (const f of [{ ton: -1 }, { ton: 0, schluff: 0, sand: 0 }, { wasser: NaN }, { wasser: 100 }]) {
  const r = lehmSchaetzmodell({ ton: 15, schluff: 35, sand: 50, wasser: 12, ...f });
  pruefe(!r.gueltig && Number.isNaN(r.rohdichte), `Fehler ${JSON.stringify(f)}`);
}
// 5. Fuzz im Reglerbereich: endlich, Anteile summieren zu 100 %, Tendenzen (mehr Ton → fester und mehr Schwinden)
let s = 5;
const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
for (let i = 0; i < 1000; i++) {
  const e = { ton: 5 + Math.round(rnd() * 35), schluff: 10 + Math.round(rnd() * 50), sand: 20 + Math.round(rnd() * 60), wasser: 5 + Math.round(rnd() * 20) };
  const r = lehmSchaetzmodell(e);
  pruefe(r.gueltig && [r.rohdichte, r.druckfestigkeit, r.schwinden, r.lambda, r.sorption].every(Number.isFinite), `Fuzz ${i}`);
  pruefe(nahe(r.tonProzent + r.schluffProzent + r.sandProzent, 100, 1e-9) && r.druckfestigkeit > 0 && r.schwinden > 0, `Fuzz ${i} Plausibilität`);
  pruefe(r.hinweise.every(h => h.feld === 'modell'), `Fuzz ${i}: Warnung im Reglerbereich ${JSON.stringify(e)}`);
  const mehrTon = lehmSchaetzmodell({ ...e, ton: e.ton + 1 });
  pruefe(mehrTon.druckfestigkeit > r.druckfestigkeit && mehrTon.schwinden > r.schwinden, `Fuzz ${i} Tendenz Ton`);
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Lehm-Schätzmodell');
