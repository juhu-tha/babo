// Rechenkern Biokohlebeton (AP 6.2 a): CO₂-Bilanz von Pflanzenkohle im Beton
import { biokohleBilanz, co2JeKgPK, CO2_JE_C, F_PERM_IPCC, type BiokohleEingabe } from '../src/calc/biokohlebeton';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Biokohlebeton ---');

const basis: BiokohleEingabe = { mPK: 10, cGehalt: 80, fPerm: 0.8, ePK: 0.3, zRef: 320, deltaZ: 10, gwpZ: 0.8, w: 160, wAufnahme: 100 };

// 1. Handrechnung Standardfall
//    C_brutto = 10 · 0,80 · 44/12 = 29,333 kg CO₂/m³; C_PK = 29,333 · 0,80 = 23,467
//    E_PK = 10 · 0,3 = 3,0; Netto-Senke = 20,467; E_Z = 10 · 0,8 = 8,0
//    GWP_ref = 320 · 0,8 = 256,0; GWP_neu = 310 · 0,8 + 3,0 − 23,467 = 227,533; ΔGWP = 28,467 (11,12 %)
//    Dosierung 10/310 = 3,23 M.-% z; Vornässwasser 10 kg; w/z 0,500 → 0,516
const h = biokohleBilanz(basis);
pruefe(h.gueltig && h.hinweise.length === 0, `Standardfall ohne Hinweise (${h.hinweise.map(x => x.text).join(' | ')})`);
pruefe(nahe(h.co2Brutto, 29.3333, 1e-4) && nahe(h.co2Speicher, 23.4667, 1e-4) && nahe(h.ePK, 3, 1e-12) && nahe(h.nettoPK, 20.4667, 1e-4), `Speicher ${h.co2Brutto} ${h.co2Speicher} ${h.nettoPK}`);
pruefe(nahe(h.eZement, 8, 1e-12) && nahe(h.gwpRef, 256, 1e-12) && nahe(h.gwpNeu, 227.5333, 1e-4) && nahe(h.minderung, 28.4667, 1e-4) && nahe(h.minderungProzent, 11.1198, 1e-4), `Bilanz ${h.gwpNeu} ${h.minderung}`);
pruefe(nahe(h.dosierungZ, 3.2258, 1e-4) && nahe(h.wVornass, 10, 1e-12) && nahe(h.wzRef, 0.5, 1e-12) && nahe(h.wzNeu, 0.51613, 1e-5) && h.zNeu === 310, 'Dosierung/Wasser');

// 2. Bilanzidentität: ΔGWP = E_Z + (C_PK − E_PK); Stöchiometrie 44/12
pruefe(nahe(h.minderung, h.eZement + h.nettoPK, 1e-9), 'ΔGWP = E_Z + Netto-Senke');
pruefe(nahe(CO2_JE_C, 3.6667, 1e-4) && nahe(co2JeKgPK(100), 44 / 12, 1e-12) && nahe(co2JeKgPK(80, 0.8), 2.3467, 1e-4), 'CO₂ je kg C');
// reiner Kohlenstoff ohne Abschläge: 1 kg C → 3,667 kg CO₂ (unabhängige Referenz über molare Massen 12,011 und 44,009)
pruefe(nahe(co2JeKgPK(100), 44.009 / 12.011, 0.003), 'molare Massen');
pruefe(F_PERM_IPCC.map(f => f.wert).join('/') === '0.65/0.8/0.89', 'IPCC-Permanenzfaktoren');

// 3. Grenzfälle
const ohnePK = biokohleBilanz({ ...basis, mPK: 0 });
pruefe(ohnePK.gueltig && nahe(ohnePK.minderung, 8, 1e-12) && ohnePK.co2Speicher === 0, 'ohne Pflanzenkohle nur Zementeinsparung');
const reineZugabe = biokohleBilanz({ ...basis, deltaZ: 0 });
pruefe(nahe(reineZugabe.minderung, reineZugabe.nettoPK, 1e-12) && reineZugabe.eZement === 0, 'reine Zugabe: Minderung = Netto-Senke');
pruefe(biokohleBilanz({ ...basis, fPerm: 0 }).co2Speicher === 0, 'F_perm = 0 → kein Speicher');

// 4. Plausibilität: Fehler
pruefe(!biokohleBilanz({ ...basis, mPK: -1 }).gueltig, 'm_PK < 0');
pruefe(!biokohleBilanz({ ...basis, cGehalt: 120 }).gueltig, 'C > 100 %');
pruefe(!biokohleBilanz({ ...basis, fPerm: 1.2 }).gueltig, 'F_perm > 1');
pruefe(!biokohleBilanz({ ...basis, deltaZ: 320 }).gueltig, 'Δz ≥ z_ref');
pruefe(!biokohleBilanz({ ...basis, zRef: 0 }).gueltig, 'z_ref = 0');
pruefe(!biokohleBilanz({ ...basis, w: NaN }).gueltig, 'NaN');
pruefe(biokohleBilanz({ ...basis, deltaZ: -5 }).hinweise.some(x => x.feld === 'deltaZ' && x.stufe === 'fehler'), 'Δz < 0');

// 5. Plausibilität: Warnungen
const warn = (e: Partial<BiokohleEingabe>, feld: string) => biokohleBilanz({ ...basis, ...e }).hinweise.some(x => x.stufe === 'warnung' && x.feld === feld);
pruefe(warn({ cGehalt: 40 }, 'cGehalt'), 'C < 50 %');
pruefe(warn({ mPK: 30 }, 'mPK'), 'Dosierung > 5 %');
pruefe(warn({ ePK: 3 }, 'ePK'), 'Netto keine Senke');
pruefe(warn({ fPerm: 0.95 }, 'fPerm'), 'F_perm > 0,9');
pruefe(warn({ deltaZ: 60 }, 'deltaZ'), 'w/z > 0,60 bzw. z < 280');
pruefe(warn({ gwpZ: 1.2 }, 'gwpZ'), 'GWP Zement außerhalb');

// 6. Fuzz-Test: endlich oder sauberer Fehler; Bilanzidentität hält
let zufall = 4711;
const rnd = () => { zufall = (zufall * 1103515245 + 12345) % 2147483648; return zufall / 2147483648; };
let gueltige = 0;
for (let i = 0; i < 1000; i++) {
  const zRef = 150 + rnd() * 350;
  const r = biokohleBilanz({ mPK: rnd() * 60 - 5, cGehalt: rnd() * 110, fPerm: rnd() * 1.1, ePK: rnd() * 1.5, zRef, deltaZ: rnd() * zRef * 1.05, gwpZ: rnd(), w: 120 + rnd() * 80, wAufnahme: rnd() * 350 });
  if (!r.gueltig) { pruefe(r.hinweise.some(x => x.stufe === 'fehler'), `Fuzz ${i}: ungültig ohne Fehler`); continue; }
  gueltige++;
  pruefe([r.co2Speicher, r.gwpNeu, r.minderung, r.dosierungZ, r.wzNeu].every(Number.isFinite), `Fuzz ${i}: nicht endlich`);
  pruefe(nahe(r.minderung, r.eZement + r.nettoPK, 1e-9) && r.co2Speicher <= r.co2Brutto + 1e-12, `Fuzz ${i}: Bilanz`);
}
pruefe(gueltige > 300, `Fuzz: nur ${gueltige} gültige Fälle`);

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log(`OK: Biokohlebeton (${gueltige} gültige Fuzz-Fälle)`);
